"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";

export default function AIPage() {
  const [prompt, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState<string | null>(null);
  const { addItem } = useCart();

  const generate = async () => {
    setLoading(true);
    // Mock AI: generate placeholder URL based on prompt
    await new Promise((r) => setTimeout(r, 800));
    setImage(`https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.0.3`);
    setLoading(false);
  };

  const addToCart = () => {
    if (!image) return;
    addItem({ id: `ai-${Date.now()}`, name: `AI Tee: ${prompt || 'Custom'}`, price: 29, image, quantity: 1, size: 'M' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">AI Design Lab</h1>
      <div className="flex gap-2">
        <Input placeholder="Describe your vibe" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <Button onClick={generate} disabled={loading}>{loading ? 'Generating…' : 'Generate'}</Button>
      </div>
      {image && (
        <div className="space-y-3">
          <img src={image} alt="AI Design" className="w-full rounded-lg border" />
          <Button onClick={addToCart}>Add to cart - $29</Button>
        </div>
      )}
    </div>
  );
}


