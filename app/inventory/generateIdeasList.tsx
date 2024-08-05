import { Groq } from "groq-sdk";
import { Idea, Product } from "@/types";

let groq: Groq;

try {
  groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });
} catch (error) {
  console.error(error);
}

export default async function generatIdeasList(
  productsList: Product[],
): Promise<Idea[] | null> {
  let queryPrompt = "Here are my pantry items:\n";
  productsList.forEach((product) => {
    queryPrompt += `- ${product.quantity} ${product.name}\n`;
  });
  console.log(queryPrompt);

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an assistant that generates creative recipe ideas based on pantry items. Provide a stringified JavaScript array with three objects, each containing an 'ideaName' and 'description' field. Ensure the ideas are feasible using the given pantry items. The response should only contain the JavaScript array as plain text, which I can directly pass to JSON.parse without any further modification, the response must exactly begin with [ and end with ] (avoid escape character, newlines, and unnecessary quotes around nested objects)",
      },
      {
        role: "user",
        content: queryPrompt,
      },
    ],
    model: "llama-3.1-8b-instant",
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
    stream: true,
    stop: null,
  });

  let fullResponse = "";

  for await (const chunk of chatCompletion) {
    fullResponse += chunk.choices[0]?.delta?.content || "";
  }

  fullResponse = fullResponse.replaceAll("\\", "").replaceAll("\n", "");
  console.log({ fullResponse });

  try {
    const ideasArray = JSON.parse(fullResponse);
    console.log({ ideasArray });
    return ideasArray;
  } catch (error) {
    console.error("Error parsing response:", error);
    return null;
  }
}
