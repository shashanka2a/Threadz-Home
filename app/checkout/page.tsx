"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { total, clear } = useCart();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function pay() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const orderId = Math.random().toString(36).slice(2, 8).toUpperCase();
    clear();
    router.push(`/success?order=${orderId}`);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input placeholder="Full name" />
        <Input placeholder="Email" />
        <Input placeholder="Address" className="sm:col-span-2" />
        <Input placeholder="Card number" />
        <Input placeholder="MM/YY" />
        <Input placeholder="CVC" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="font-semibold">Total</div>
        <div className="font-semibold">${total.toFixed(2)}</div>
      </div>
      <Button onClick={pay} disabled={loading}>{loading ? 'Processing…' : 'Pay now'}</Button>
    </div>
  );
}


