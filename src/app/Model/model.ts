export interface Review {
  user: string;
  rating: number;
  comment: string;
}


// model/product.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  specs?: { [key: string]: string }; // Ab ye optional hai
  reviews?: Review[];               // Ab ye optional hai
}