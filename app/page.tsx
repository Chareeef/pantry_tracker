"use client";
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import { Product, AddItemFormProps, ProductsListProps } from "@/types";

function Header() {
  return (
    <header className="flex items-center p-2 bg-lime-500 border-b-2 border-lime-500">
      <img src="/icon.png" width={32} height={32} />
      <h1 className="font-bold text-black ml-2">Pantry Tracker</h1>
    </header>
  );
}

function AddItemForm({
  newName,
  setNewName,
  newQuantity,
  setNewQuantity,
}: AddItemFormProps) {
  async function addProduct(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!newName || !newQuantity) return;

    await addDoc(collection(db, "products"), {
      name: newName,
      quantity: newQuantity,
    });

    setNewName("");
    setNewQuantity(0);
  }

  return (
    <form className="w-full flex justify-between my-2">
      <input
        className="flex-1 border-2 border-black-400 focus:border-black-700 p-2"
        type="text"
        placeholder="Name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <input
        className="flex-1 border-2 border-black-400 focus:border-black-700 p-2"
        type="number"
        placeholder="Quantity"
        value={newQuantity > 0 ? newQuantity : ""}
        onChange={(e) => setNewQuantity(parseInt(e.target.value))}
      />
      <button
        type="submit"
        className="w-20 bg-lime-300 hover:bg-lime-500"
        onClick={addProduct}
      >
        Add
      </button>
    </form>
  );
}

function ProductsList({ products }: ProductsListProps) {
  async function incrementProduct(product: Product) {
    try {
      await setDoc(doc(db, "products", product.id), {
        name: product.name,
        quantity: product.quantity + 1,
      });
    } catch (error) {
      console.error("Incrementation Failed:", error);
    }
  }

  async function decrementProduct(product: Product) {
    try {
      if (product.quantity <= 1) {
        deleteProduct(product.id);
        return;
      }

      await setDoc(doc(db, "products", product.id), {
        name: product.name,
        quantity: product.quantity - 1,
      });
    } catch (error) {
      console.error("Incrementation Failed:", error);
    }
  }

  async function deleteProduct(id: string) {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (error) {
      console.error("Deletion Failed:", error);
    }
  }

  return (
    <>
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
    </>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newName, setNewName] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(0);

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

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24 text-xl bg-lime-400">
        <div className="z-10 w-full max-w-5xl items-center justify-between lg:flex">
          <AddItemForm
            newName={newName}
            setNewName={setNewName}
            newQuantity={newQuantity}
            setNewQuantity={setNewQuantity}
          />
          <ProductsList products={products} />
        </div>
      </main>
    </>
  );
}
