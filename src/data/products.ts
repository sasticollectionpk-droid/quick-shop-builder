import kurtaPink from "@/assets/cloth-kurta-pink.jpg";
import suitGreen from "@/assets/cloth-suit-green.jpg";
import clothBlack from "@/assets/cloth-black.jpg";
import menWhite from "@/assets/cloth-men-white.jpg";
import clothBlue from "@/assets/cloth-blue.jpg";
import clothYellow from "@/assets/cloth-yellow.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: "Women" | "Men" | "Unstitched";
  badge?: string;
  description: string;
};

export const products: Product[] = [
  {
    id: "1",
    name: "Pink Embroidered Kurta",
    price: 1499,
    oldPrice: 2499,
    image: kurtaPink,
    category: "Women",
    badge: "Sale",
    description: "Soft pastel pink kurta with delicate embroidery — perfect for daily and casual wear.",
  },
  {
    id: "2",
    name: "Mint Green 2-Piece Suit",
    price: 2299,
    oldPrice: 3499,
    image: suitGreen,
    category: "Women",
    badge: "Best Seller",
    description: "Elegant mint green stitched suit with golden embroidery and matching dupatta.",
  },
  {
    id: "3",
    name: "Black Printed Lawn Set",
    price: 1799,
    image: clothBlack,
    category: "Unstitched",
    description: "Premium printed lawn fabric set with dupatta. 3-piece unstitched.",
  },
  {
    id: "4",
    name: "Men White Cotton Kurta",
    price: 1599,
    oldPrice: 2199,
    image: menWhite,
    category: "Men",
    badge: "New",
    description: "Classic white cotton kurta — comfortable, breathable and timeless.",
  },
  {
    id: "5",
    name: "Royal Blue Embroidered Kurta",
    price: 1999,
    image: clothBlue,
    category: "Women",
    description: "Vibrant royal blue kurta with intricate silver embroidery work.",
  },
  {
    id: "6",
    name: "Yellow Floral Summer Kurta",
    price: 1299,
    oldPrice: 1899,
    image: clothYellow,
    category: "Women",
    badge: "Sale",
    description: "Bright yellow floral printed kurta — light and perfect for summer days.",
  },
];
