import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="flex flex-col justify-center items-center p-2 bg-lime-500 border-t-2 border-lime-500 text-white text-sm">
      <h3 className="font-bold">Youssef Charif Hamidi</h3>
      <p className="mt-1">© 2024</p>
      <div className="flex space-x-4 mt-2">
        <a
          href="https://github.com/Chareeef"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub size={20} />
        </a>
        <a
          href="https://linkedin.com/in/youssef-charif-hamidi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin size={20} />
        </a>
        <a
          href="https://x.com/YoussefCharifH2"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center"
          style={{ width: "20px", height: "20px" }}
        >
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>𝕏</span>
        </a>
      </div>
    </footer>
  );
}