"use client";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { Product } from "@/types";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState(0);
  const listItems = products.map((product: Product) => (
    <li className="flex justify-between mb-2 w-full border" key={product.id}>
      <div className="flex justify-between w-80">
        <span className="capitalize">{product.name}</span>
        <span className="font-bold">{product.quantity}</span>
      </div>
      <button className="border-left" onClick={() => deleteProduct(product.id)}>
        X
      </button>
    </li>
  ));

  useEffect(() => {
    const q = query(collection(db, "products"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsArray: Product[] = [];
      querySnapshot.forEach((doc) => {
        productsArray.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsArray);
    });
    return unsubscribe;
  }, []);

  async function addProduct(e: Event) {
    e.preventDefault();

    if (!newName || !newQuantity) return;

    await addDoc(collection(db, "products"), {
      name: newName,
      quantity: newQuantity,
    });

    setNewName("");
    setNewQuantity(0);
  }

  async function deleteProduct(id: string) {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (error: Error) {
      console.error("Deletion Failed:", error);
    }
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-amber-400">
        <div className="z-10 w-full max-w-5xl items-center justify-between lg:flex text-xl">
          <form className="w-full flex justify-between my-2">
            <input
              className="flex-1 border-2 border-black-400 focus:border-black-700"
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className="flex-1 border-2 border-black-400 focus:border-black-700"
              type="number"
              placeholder="Quantity"
              value={newQuantity}
              onChange={(e) => setNewQuantity(parseInt(e.target.value))}
            />
            <button
              type="submit"
              className="w-20 bg-amber-700 hover:bg-stone-500"
              onClick={addProduct}
            >
              Add
            </button>
          </form>
          <ul className="w-full">{listItems}</ul>
        </div>
      </main>
    </>
  );
}

function Header() {
  return (
    <header className="flex items-center p-2 bg-amber-500 border-b-2 border-stone-500">
      <img src="/icon.png" width={32} height={32} />
      <h1 className="font-bold text-black ml-2">Pantry Tracker</h1>
    </header>
  );
}
