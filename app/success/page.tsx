"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const order = params.get('order') ?? 'ORDER-XXXXXX';

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
      <h1 className="text-2xl font-semibold">Payment confirmed</h1>
      <p className="text-gray-600">Thanks! Your order <span className="font-mono font-semibold">{order}</span> is confirmed.</p>
      <div className="space-x-2">
        <Button onClick={() => router.push(`/track/${order}`)}>Track order</Button>
        <Button variant="outline" onClick={() => router.push('/')}>Back home</Button>
      </div>
    </div>
  );
}


