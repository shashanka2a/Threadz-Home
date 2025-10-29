"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Star, Heart, Zap } from "lucide-react";
import Image from "next/image";

const products = [
  {
    id: "1",
    name: "LAID OFF",
    price: 29.99,
    image: "/laid-off.png",
    description: "When the algorithm becomes your boss",
    category: "AI Humor",
    rating: 4.8,
    reviews: 124,
    badge: "Best Seller",
    accent: "from-red-500 to-orange-500"
  },
  {
    id: "2", 
    name: "PROMPT ENGINEER IRL",
    price: 32.99,
    image: "/prompt-engineer.png",
    description: "Making AI do the heavy lifting",
    category: "Tech Culture",
    rating: 4.9,
    reviews: 89,
    badge: "Trending",
    accent: "from-blue-500 to-cyan-500"
  },
  {
    id: "3",
    name: "TRUST ME, I ASKED CHATGPT",
    price: 27.99,
    image: "/asked-chatgpt.png",
    description: "AI-approved life decisions",
    category: "Viral",
    rating: 4.7,
    reviews: 156,
    badge: "New",
    accent: "from-green-500 to-emerald-500"
  },
  {
    id: "4",
    name: "COFFEE-N-GPU",
    price: 34.99,
    image: "/coffee-n-gpu.png",
    description: "Caffeine and compute power for the modern dev",
    category: "Dev Life",
    rating: 4.6,
    reviews: 78,
    badge: "Limited",
    accent: "from-purple-500 to-pink-500"
  }
];

export default function ProductsPage() {
  const { addItem } = useCart();

  const handleAddToCart = (product: any) => {
    addItem({
      ...product,
      quantity: 1,
      size: 'M'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/80 to-violet-900/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-600/20 text-purple-300 text-sm font-medium mb-6 border border-purple-500/40">
              <Zap className="h-4 w-4 mr-2" />
              Premium Collection
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Explore Our
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"> Collection</span>
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8 opacity-90">
              Discover unique AI-powered designs crafted for the bold. From viral humor to tech culture, 
              find the perfect style that speaks your language.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <div className="group relative overflow-hidden rounded-2xl cursor-pointer bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="relative">
                  <div className="aspect-[3/4] overflow-hidden bg-gray-900">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                    
                    {/* Neon glow effect */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${product.accent} blur-xl`} />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge 
                      className="bg-purple-600/90 text-white font-semibold shadow-lg border border-purple-400/50"
                    >
                      {product.badge}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-10 h-10 rounded-full bg-black/60 hover:bg-purple-500/20 border border-purple-500/30 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Heart className="h-4 w-4 text-purple-300" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-300 bg-purple-500/10">
                      {product.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-purple-400 text-purple-400" />
                      <span className="text-sm font-medium text-purple-200">
                        {product.rating}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-200">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-white">
                      ${product.price}
                    </div>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-200"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white border-0 shadow-xl rounded-2xl overflow-hidden border border-purple-400/50">
            <div className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Don't See What You're Looking For?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Create your own custom design with our AI generator
              </p>
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-purple-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => window.location.href = '/ai'}
              >
                <Zap className="h-5 w-5 mr-2" />
                Generate Custom Design
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


