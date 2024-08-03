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
import { Product, AddItemFormProps, ProductsListProps } from "@/types";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import { Andada_Pro } from "next/font/google";

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
    <form className="flex flex-col md:flex-row items-center justify-around w-4/5 bg-lime-600 my-3 p-2">
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

export default function Home() {
  const { user, isLoading, error } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [newName, setNewName] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(0);

  useEffect(() => {
    if (isLoading) return; // Do nothing while loading
    if (!user || typeof user.email !== "string") {
      return redirect("/");
    } else {
      const q = query(collection(db, "users", user.email, "products"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const productsArray: Product[] = [];
        querySnapshot.forEach((doc) => {
          productsArray.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsArray);
      });

      return () => unsubscribe();
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center text-gray-500 text-xxl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center text-red text-xxl">{error.message}</div>
    );
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
      <ProductsList products={products} email={user.email} />
    </>
  );
}
