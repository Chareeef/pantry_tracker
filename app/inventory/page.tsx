"use client";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import {
  Product,
  AddItemFormProps,
  ProductsListProps,
  Idea,
  IdeasListProps,
} from "@/types";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import { Andada_Pro } from "next/font/google";
import generateIdeasList from "./generateIdeasList";

const andadaPro = Andada_Pro({
  subsets: ["latin"],
  weight: "600",
  style: "italic",
  variable: "--andada-pro",
});

function AddItemForm({
  newName,
  setNewName,
  newQuantity,
  setNewQuantity,
  email,
}: AddItemFormProps) {
  async function addProduct(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!newName || !newQuantity) return;

    try {
      await addDoc(collection(db, "users", email, "products"), {
        name: newName,
        quantity: newQuantity,
      });
    } catch (error) {
      console.error("Add Product Failed:", error);
    }

    setNewName("");
    setNewQuantity(0);
  }

  return (
    <form className="flex flex-col md:flex-row items-center justify-around w-4/5 bg-lime-600 p-2">
      <input
        className="md:w-2/5 border-2 border-gray-600 focus:border-black-700 p-2"
        type="text"
        placeholder="Name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <input
        className="md:w-2/5 sm:border-2 md:border-x md:border-y-2 border-gray-600 focus:border-black-700 my-2 p-2"
        type="number"
        placeholder="Quantity"
        value={newQuantity > 0 ? newQuantity : ""}
        onChange={(e) => setNewQuantity(parseInt(e.target.value))}
      />
      <button
        type="submit"
        className="md:w-1/5 border-2 border-gray-600 p-2 bg-lime-300 hover:bg-lime-500"
        onClick={addProduct}
      >
        Add
      </button>
    </form>
  );
}

function ProductsList({ products, email }: ProductsListProps) {
  async function incrementProduct(product: Product) {
    try {
      await setDoc(doc(db, "users", email, "products", product.id), {
        name: product.name,
        quantity: product.quantity + 1,
      });
    } catch (error) {
      console.error("Incrementation Failed:", error);
    }
  }

  async function decrementProduct(product: Product) {
    if (product.quantity === 0) {
      return;
    }

    try {
      await setDoc(doc(db, "users", email, "products", product.id), {
        name: product.name,
        quantity: product.quantity - 1,
      });
    } catch (error) {
      console.error("Incrementation Failed:", error);
    }
  }

  async function deleteProduct(id: string) {
    try {
      await deleteDoc(doc(db, "users", email, "products", id));
    } catch (error) {
      console.error("Deletion Failed:", error);
    }
  }

  return (
    <ul className="w-full bg-lime-600 border-4 border-green-800 p-4">
      {products.length === 0 ? (
        <div className="flex justify-center items-center font-bold p-30">
          No Products Yet
        </div>
      ) : (
        <>
          <div className="flex justify-between w-4/5 bg-lime-500">
            <div className="w-1/2 pl-1 border-t-2 border-l-2 border-r border-b border-white-500 font-bold capitalize">
              Name
            </div>
            <div className="w-1/2 pl-1 border-t-2 border-x-2 border-b border-white-500 font-bold">
              Quantity
            </div>
          </div>
          {products.map((product: Product, idx) => (
            <li
              className="flex justify-between w-full bg-lime-500"
              key={product.id}
            >
              <div className="flex w-4/5">
                <div
                  className={`w-1/2 pl-1 border-t-2 border-l-2 border-r border-b${idx === products.length - 1 && `-2`} border-white-500 capitalize`}
                >
                  {product.name}
                </div>
                <div
                  className={`w-1/2 pl-1 border-t-2 border-l-2 border-r border-b${idx === products.length - 1 && "-2"} border-white-500`}
                >
                  {product.quantity}
                </div>
              </div>
              <div
                className={`flex w-1/5 border-t-2 border-l-2 border-r border-b${idx === products.length - 1 && "-2"} border-white-500`}
              >
                <button
                  className="flex-1 bg-lime-400 hover:bg-lime-500"
                  onClick={() => incrementProduct(product)}
                >
                  +
                </button>

                <button
                  className="flex-1 bg-orange-400 hover:bg-orange-500 border-x-2 border-white-500"
                  onClick={() => decrementProduct(product)}
                >
                  -
                </button>

                <button
                  className="flex-1 bg-red-400 hover:bg-red-500"
                  onClick={() => deleteProduct(product.id)}
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </>
      )}
    </ul>
  );
}

function IdeasList({ isOpen, onClose, products }: IdeasListProps) {
  const [ideasArray, setIdeasArray] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleClickIdeas() {
    setError("");
    setLoading("Loading...");
    const ideas: Idea[] | null = await generateIdeasList(products);
    if (!ideas) {
      setIdeasArray([]);
      setError("Oops... Try again please.");
    } else {
      setIdeasArray(ideas);
      setError("");
    }
    setLoading("");
  }

  return (
    <div
      className={`fixed inset-0 p-4 transition-colors ${isOpen ? "visible bg-black/20" : "invisible"}`}
    >
      <div className="flex justify-center items-center overflow-y-auto h-full w-full">
        <div
          className={`bg-white p-4 flex flex-col justify-between overflow-y-auto max-h-full w-2/3 rounded-xl shadow text-center transition-all ${isOpen ? "scale-125 opacity-100" : "scale-100 opacity-0"}`}
        >
          <h2 className="text-xxl text-black mb-4">
            Your Pantry has amazing items!
          </h2>
          {ideasArray.length > 0 && (
            <ul className="list-none flex flex-col md:flex-row">
              {ideasArray.map((idea, idx) => (
                <li
                  key={idx}
                  className="flex flex-col justify-evenly shadow border-2 border-gray-400 rounded-lg p-2 m-2"
                >
                  <h2 className="font-bold text-lime-700 text-xl">
                    {idea.ideaName}
                  </h2>
                  <p className="text-gray-800 text-lg">{idea.description}</p>
                </li>
              ))}
            </ul>
          )}

          {loading && <p className="text-gray-600 my-4 font-bold">{loading}</p>}
          {error && <p className="text-rose-600 my-4 font-bold">{error}</p>}

          <div className="flex justify-around gap-4 flex-col md:flex-row">
            <button
              className="bg-green-600 p-3 m rounded"
              onClick={handleClickIdeas}
            >
              Generate ideas
            </button>
            <button className="bg-rose-600 p-3 rounded" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, isLoading, error } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [newName, setNewName] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isLoading) return; // Do nothing while loading
    if (!user || typeof user.email !== "string") {
      return redirect("/");
    } else {
      const q = query(collection(db, "users", user.email, "products"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const productsArray: Product[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<Product, "id">;
          productsArray.push({ id: doc.id, ...data });
        });
        setProducts(productsArray);
      });

      return () => unsubscribe();
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <div className="text-gray-500 text-xxl">Loading...</div>;
  }

  if (error) {
    return <div className="text-red text-xxl">{error.message}</div>;
  }

  if (!user || typeof user.email !== "string") {
    return null;
  }

  return (
    <>
      <h1 className={`${andadaPro.variable} text-3xl font-bold`}>
        Manage Your Pantry
      </h1>
      <AddItemForm
        newName={newName}
        setNewName={setNewName}
        newQuantity={newQuantity}
        setNewQuantity={setNewQuantity}
        email={user.email}
      />
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-600 p-3 rounded"
      >
        Generate Ideas ?
      </button>
      <IdeasList
        products={products}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <ProductsList products={products} email={user.email} />
    </>
  );
}
