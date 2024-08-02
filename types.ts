import { Dispatch, SetStateAction } from "react";

export interface Product {
  id: string;
  name: string;
  quantity: number;
}

export interface AddItemFormProps {
  newName: string;
  setNewName: Dispatch<SetStateAction<string>>;
  newQuantity: number;
  setNewQuantity: Dispatch<SetStateAction<number>>;
}

export interface ProductsListProps {
  products: Product[];
}
