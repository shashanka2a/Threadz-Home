"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.id} className="flex items-center gap-3 border rounded p-3">
              {i.image && <img src={i.image} alt={i.name} className="size-16 rounded" />}
              <div className="flex-1">
                <div className="font-medium">{i.name}</div>
                <div className="text-sm text-gray-500">${i.price} ×</div>
              </div>
              <input
                type="number"
                min={1}
                value={i.quantity}
                onChange={(e) => updateQuantity(i.id, Number(e.target.value))}
                className="w-16 border rounded px-2 py-1"
              />
              <Button variant="ghost" onClick={() => removeItem(i.id)}>Remove</Button>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="font-semibold">Total</div>
            <div className="font-semibold">${total.toFixed(2)}</div>
          </div>
          <Button onClick={() => router.push('/checkout')}>Checkout</Button>
        </div>
      )}
    </div>
  );
}


