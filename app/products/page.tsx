"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Star, Heart, Zap } from "lucide-react";
import Image from "next/image";

const products = [
  {
    id: "1",
    name: "Minimalist Mountain",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80&auto=format",
    description: "Clean mountain silhouette design perfect for outdoor enthusiasts",
    category: "Nature",
    rating: 4.8,
    reviews: 124,
    badge: "Best Seller"
  },
  {
    id: "2", 
    name: "Vintage Typography",
    price: 32.99,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&q=80&auto=format",
    description: "Classic vintage-inspired typography with retro vibes",
    category: "Vintage",
    rating: 4.9,
    reviews: 89,
    badge: "Trending"
  },
  {
    id: "3",
    name: "Geometric Patterns",
    price: 27.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80&auto=format",
    description: "Modern geometric patterns with bold colors",
    category: "Modern",
    rating: 4.7,
    reviews: 156,
    badge: "New"
  },
  {
    id: "4",
    name: "Abstract Art",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80&auto=format",
    description: "Unique abstract artwork for creative individuals",
    category: "Abstract",
    rating: 4.6,
    reviews: 78,
    badge: "Limited"
  },
  {
    id: "5",
    name: "Botanical Prints",
    price: 31.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80&auto=format",
    description: "Elegant botanical illustrations with natural colors",
    category: "Nature",
    rating: 4.9,
    reviews: 203,
    badge: "Popular"
  },
  {
    id: "6",
    name: "Urban Street Art",
    price: 28.99,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&q=80&auto=format",
    description: "Bold street art inspired designs for urban style",
    category: "Urban",
    rating: 4.5,
    reviews: 92,
    badge: "Edgy"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Premium Collection
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Explore Our
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Collection</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover unique designs crafted by talented artists. From minimalist to bold, 
              find the perfect style that speaks to you.
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
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="relative">
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant="secondary" 
                      className="bg-white/90 text-gray-800 font-semibold shadow-sm"
                    >
                      {product.badge}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Heart className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-600">
                        {product.rating}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </div>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Don't See What You're Looking For?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Create your own custom design with our AI generator
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-lg"
                onClick={() => window.location.href = '/ai'}
              >
                <Zap className="h-5 w-5 mr-2" />
                Generate Custom Design
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}


