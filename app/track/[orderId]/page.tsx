"use client";

import React from "react";
import { useParams } from "next/navigation";

const checkpoints = [
  { k: "placed", label: "Order placed" },
  { k: "processing", label: "Processing" },
  { k: "printing", label: "Printing" },
  { k: "shipped", label: "Shipped" },
  { k: "delivered", label: "Delivered" },
];

export default function TrackOrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [statusIndex, setStatusIndex] = React.useState(2);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Order {orderId}</h1>
      <ol className="relative border-s pl-6 space-y-4">
        {checkpoints.map((c, idx) => (
          <li key={c.k} className="ms-4">
            <div className={`absolute -start-1.5 size-3 rounded-full ${idx <= statusIndex ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <h3 className={`text-sm ${idx <= statusIndex ? 'text-green-700' : 'text-gray-600'}`}>{c.label}</h3>
          </li>
        ))}
      </ol>
    </div>
  );
}


