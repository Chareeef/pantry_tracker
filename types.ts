import { UserProfile } from "@auth0/nextjs-auth0/client";
import { Dispatch, MouseEventHandler, SetStateAction } from "react";

export interface ClientProfileProps {
  user: UserProfile;
}

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
  email: string;
}

export interface ProductsListProps {
  products: Product[];
  email: string;
}

export interface Idea {
  ideaName: string;
  description: string;
}

export interface IdeasListProps {
  isOpen: boolean;
  onClose: MouseEventHandler<HTMLButtonElement>;
  products: Product[];
}
