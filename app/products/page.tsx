"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Star, Heart, Zap, X, Plus, Minus, Trash2, CreditCard, Lock, Package, Truck, CheckCircle, Clock, MapPin, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Helper function to calculate price based on colors in design
// Base price: ₹899, +₹100 per additional color (max ₹1299)
function calculatePriceBasedOnColors(colors: string[]): number {
  const basePrice = 899;
  const colorCount = colors.length || 1; // Default to 1 if no colors specified
  const additionalColorPrice = Math.min(colorCount - 1, 4) * 100; // Max 4 additional colors
  return Math.min(basePrice + additionalColorPrice, 1299);
}

const products = [
  {
    id: "1",
    name: "LAID OFF",
    colors: ["red", "orange", "black"], // 3 colors
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
    colors: ["blue", "cyan", "white", "black"], // 4 colors
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
    colors: ["green", "emerald", "black"], // 3 colors
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
    colors: ["purple", "pink", "black", "white"], // 4 colors
    image: "/coffee-n-gpu.png",
    description: "Caffeine and compute power for the modern dev",
    category: "Dev Life",
    rating: 4.6,
    reviews: 78,
    badge: "Limited",
    accent: "from-purple-500 to-pink-500"
  },
  {
    id: "5",
    name: "404 ERROR",
    colors: ["orange", "red", "black"], // 3 colors
    image: "/404-error.png",
    description: "Page not found, but style always found",
    category: "Dev Life",
    rating: 4.8,
    reviews: 142,
    badge: "Popular",
    accent: "from-orange-500 to-red-500"
  },
  {
    id: "6",
    name: "LOW LATENCY",
    colors: ["cyan", "blue", "white", "black"], // 4 colors
    image: "/low-latency.png",
    description: "Fast response times, instant style",
    category: "Tech Culture",
    rating: 4.9,
    reviews: 98,
    badge: "Hot",
    accent: "from-cyan-500 to-blue-500"
  }
].map(product => ({
  ...product,
  price: calculatePriceBasedOnColors(product.colors || [])
}));

export default function ProductsPage() {
  const { items, addItem, updateQuantity, removeItem, clear, total } = useCart();
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [showCart, setShowCart] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    mobile: '',
    whatsappUpdates: false
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const handleAddToCart = (product: any) => {
    addItem({
      ...product,
      quantity: 1,
      size: 'M'
    });
    setShowCart(true);
  };

  const toggleLike = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newOrderId = `ORDER-${Date.now()}`;
    setOrderId(newOrderId);
    clear();
    setShowCheckout(false);
    setShowCart(false);
    setIsProcessing(false);
    setShowTracking(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactInfoChange = (field: string, value: string | boolean) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleContactInfoSubmit = () => {
    if (contactInfo.name && (contactInfo.email || contactInfo.mobile)) {
      // Pre-fill payment data with contact info
      setPaymentData(prev => ({
        ...prev,
        name: contactInfo.name,
        email: contactInfo.email
      }));
      setShowContactInfo(false);
      setShowCheckout(true);
    }
  };

  const isContactInfoValid = contactInfo.name && (contactInfo.email || contactInfo.mobile);

  const isFormValid = paymentData.cardNumber && paymentData.expiryDate && paymentData.cvv && paymentData.name && paymentData.email && paymentData.address && paymentData.city && paymentData.zipCode;

  // Helper function to format dates dynamically
  const formatTrackingDate = (daysFromNow: number) => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysFromNow);
    
    if (daysFromNow === 0) return "Today";
    if (daysFromNow === 1) return "Tomorrow";
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = targetDate.getDate();
    const month = months[targetDate.getMonth()];
    return `${month} ${day}`;
  };

  const trackingSteps = [
    { id: 1, title: "Order Confirmed", description: "Your order has been received", status: "completed", date: formatTrackingDate(0), time: "Now", icon: CheckCircle },
    { id: 2, title: "Processing", description: "Items being prepared", status: "completed", date: formatTrackingDate(0), time: "Now", icon: Package },
    { id: 3, title: "Shipped", description: "Order shipped", status: "pending", date: formatTrackingDate(1), time: "9:00 AM", icon: Truck },
    { id: 4, title: "Out for Delivery", description: "Package out for delivery", status: "pending", date: formatTrackingDate(2), time: "8:00 AM", icon: Truck },
    { id: 5, title: "Delivered", description: "Package delivered", status: "pending", date: formatTrackingDate(2), time: "2:00 PM", icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Back to Home Button */}
      <div className="fixed top-4 left-4 z-40">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            className="bg-black/60 hover:bg-purple-500/20 border border-purple-500/30 text-white backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 bg-black">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-purple-600/20 text-purple-300 text-sm font-medium mb-6 border border-purple-500/40 backdrop-blur-sm"
            >
              <Zap className="h-4 w-4 mr-2" />
              Premium Collection
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Explore Our
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"> Collection</span>
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8 opacity-90 leading-relaxed">
              Discover unique AI-powered designs crafted for the bold. From viral humor to tech culture, 
              find the perfect style that speaks your language.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1 * index,
                ease: [0.22, 1, 0.36, 1]
              }}
              onHoverStart={() => setHoveredCard(product.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <motion.div 
                className="group relative overflow-hidden rounded-2xl cursor-pointer bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300"
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative">
                  <div className="aspect-[3/4] overflow-hidden bg-gray-900">
                    <motion.div
                      animate={hoveredCard === product.id ? { scale: 1.05 } : { scale: 1 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    {/* Dark overlay for text readability */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredCard === product.id ? 0.7 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Neon glow effect */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${product.accent} blur-xl`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredCard === product.id ? 0.2 : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                  {/* Badge */}
                  <motion.div 
                    className="absolute top-4 left-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index + 0.2 }}
                  >
                    <Badge 
                      className="bg-purple-600/90 text-white font-semibold shadow-lg border border-purple-400/50 backdrop-blur-sm"
                    >
                      {product.badge}
                    </Badge>
                  </motion.div>
                  
                  {/* Like Button */}
                  <motion.div 
                    className="absolute top-4 right-4"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: hoveredCard === product.id ? 1 : 0, scale: hoveredCard === product.id ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => toggleLike(product.id, e)}
                      className="w-10 h-10 rounded-full bg-black/60 hover:bg-purple-500/20 border border-purple-500/30 shadow-sm transition-all duration-200"
                    >
                      <motion.div
                        animate={{ scale: likedProducts.has(product.id) ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart 
                          className={`h-4 w-4 transition-colors duration-200 ${
                            likedProducts.has(product.id) ? 'fill-purple-400 text-purple-400' : 'text-purple-300'
                          }`} 
                        />
                      </motion.div>
                    </Button>
                  </motion.div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
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
                  
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-200">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-2xl font-bold text-white">
                      ₹{product.price}
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-200"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 lg:mt-24"
        >
          <div className="relative bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 text-white border border-purple-500/20 shadow-xl rounded-2xl overflow-hidden backdrop-blur-sm">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-red-600/10" />
            
            <div className="relative p-8 sm:p-12 lg:p-16">
              <motion.h2 
                className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                Don't See What You're Looking For?
              </motion.h2>
              <motion.p 
                className="text-xl mb-8 opacity-90 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                Create your own custom design with our AI generator
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-purple-50 font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200"
                    onClick={() => window.location.href = '/ai'}
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Generate Custom Design
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-gradient-to-br from-gray-900 via-purple-900/20 to-black border-l border-purple-500/30 shadow-2xl z-[70] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Your Cart
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCart(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-purple-500/20"
                        >
                          <Image
                            src={item.image || '/threadz-logo.png'}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{item.name}</h3>
                            <p className="text-sm text-gray-400">₹{item.price} × {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="border-t border-purple-500/30 pt-4 space-y-4 mb-6">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal</span>
                        <span>₹{total.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Tax (18%)</span>
                        <span>₹{(total * 0.18).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-white border-t border-purple-500/30 pt-2">
                        <span>Total</span>
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          ₹{(total * 1.18).toFixed(0)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setShowCart(false);
                        setShowContactInfo(true);
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white h-12 text-lg font-semibold"
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contact Info Modal */}
      <AnimatePresence>
        {showContactInfo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              onClick={() => setShowContactInfo(false)}
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-[500px] max-h-[90vh] bg-gradient-to-br from-gray-900 via-purple-900/20 to-black border border-purple-500/30 rounded-2xl shadow-2xl overflow-y-auto pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Contact Information
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowContactInfo(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className="text-purple-300 mb-2 block">Full Name *</Label>
                      <Input
                        placeholder="John Doe"
                        value={contactInfo.name}
                        onChange={(e) => handleContactInfoChange('name', e.target.value)}
                        className="bg-gray-800/50 border-purple-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300 mb-2 block">Email *</Label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={contactInfo.email}
                        onChange={(e) => handleContactInfoChange('email', e.target.value)}
                        className="bg-gray-800/50 border-purple-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300 mb-2 block">Mobile Number *</Label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={contactInfo.mobile}
                        onChange={(e) => handleContactInfoChange('mobile', e.target.value)}
                        className="bg-gray-800/50 border-purple-500/30 text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">At least email or mobile is required</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                      <Checkbox
                        id="whatsapp-updates"
                        checked={contactInfo.whatsappUpdates}
                        onCheckedChange={(checked) => handleContactInfoChange('whatsappUpdates', checked === true)}
                        className="border-purple-500/50 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 mt-1"
                      />
                      <Label 
                        htmlFor="whatsapp-updates" 
                        className="text-sm text-gray-300 cursor-pointer leading-relaxed"
                      >
                        Get order updates and exclusive offers via WhatsApp
                      </Label>
                    </div>
                    <div className="border-t border-purple-500/30 pt-4">
                      <Button
                        onClick={handleContactInfoSubmit}
                        disabled={!isContactInfoValid}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white h-12 text-lg font-semibold disabled:opacity-50"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              onClick={() => setShowCheckout(false)}
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-[600px] max-h-[90vh] bg-gradient-to-br from-gray-900 via-purple-900/20 to-black border border-purple-500/30 rounded-2xl shadow-2xl overflow-y-auto pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Secure Checkout
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCheckout(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-purple-300 mb-2 block">Card Number</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className="bg-gray-800/50 border-purple-500/30 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-purple-300 mb-2 block">Expiry</Label>
                      <Input
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className="bg-gray-800/50 border-purple-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300 mb-2 block">CVV</Label>
                      <Input
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        className="bg-gray-800/50 border-purple-500/30 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-purple-300 mb-2 block">Name</Label>
                    <Input
                      placeholder="John Doe"
                      value={paymentData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-gray-800/50 border-purple-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-purple-300 mb-2 block">Email</Label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={paymentData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-gray-800/50 border-purple-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-purple-300 mb-2 block">Address</Label>
                    <Input
                      placeholder="123 Main Street"
                      value={paymentData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="bg-gray-800/50 border-purple-500/30 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-purple-300 mb-2 block">City</Label>
                      <Input
                        placeholder="Mumbai"
                        value={paymentData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="bg-gray-800/50 border-purple-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300 mb-2 block">ZIP Code</Label>
                      <Input
                        placeholder="400001"
                        value={paymentData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="bg-gray-800/50 border-purple-500/30 text-white"
                      />
                    </div>
                  </div>
                  <div className="border-t border-purple-500/30 pt-4">
                    <div className="flex justify-between text-xl font-bold text-white mb-4">
                      <span>Total</span>
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        ₹{(total * 1.18).toFixed(0)}
                      </span>
                    </div>
                    <Button
                      onClick={handlePayment}
                      disabled={!isFormValid || isProcessing}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white h-12 text-lg font-semibold disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="h-5 w-5 mr-2" />
                          Confirm Payment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Order Tracking Modal */}
      <AnimatePresence>
        {showTracking && orderId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              onClick={() => setShowTracking(false)}
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-[600px] max-h-[90vh] bg-gradient-to-br from-gray-900 via-purple-900/20 to-black border border-purple-500/30 rounded-2xl shadow-2xl overflow-y-auto pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Order Tracking
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTracking(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                <div className="mb-6 p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                  <p className="text-sm text-gray-400">Order ID</p>
                  <p className="text-lg font-bold text-white">{orderId}</p>
                </div>

                <div className="space-y-6">
                  {trackingSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = step.status === 'completed';
                    const isPending = step.status === 'pending';
                    
                    return (
                      <div key={step.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-green-500' : isPending ? 'bg-gray-600' : 'bg-purple-500'
                          }`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          {index < trackingSteps.length - 1 && (
                            <div className={`w-0.5 h-16 ${
                              isCompleted ? 'bg-green-500' : 'bg-gray-600'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-white">{step.title}</h3>
                            <span className="text-xs text-gray-400">{step.date} • {step.time}</span>
                          </div>
                          <p className="text-sm text-gray-400">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-purple-500/30">
                  <Button
                    onClick={() => setShowTracking(false)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
