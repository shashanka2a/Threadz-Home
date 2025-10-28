"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const products = [
  { id: "tee-black", name: "Classic Tee (Black)", price: 25, image: "/og-image.png" },
  { id: "hoodie-grey", name: "Hoodie (Grey)", price: 49, image: "/og-image.png" },
];

export default function ProductsPage() {
  const { addItem } = useCart();
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid sm:grid-cols-2 gap-6">
      {products.map((p) => (
        <div key={p.id} className="border rounded-lg p-4 space-y-3">
          <img src={p.image} alt={p.name} className="w-full rounded" />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-500">${p.price}</div>
            </div>
            <Button onClick={() => addItem({ id: p.id, name: p.name, price: p.price, image: p.image, quantity: 1 })}>Add</Button>
          </div>
        </div>
      ))}
    </div>
  );
}


