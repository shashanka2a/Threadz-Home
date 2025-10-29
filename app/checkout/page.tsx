"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { CreditCard, Lock, Shield, CheckCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderId = `ORDER-${Date.now()}`;
    clear();
    router.push(`/success?order=${orderId}`);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.cardNumber && formData.expiryDate && formData.cvv && formData.name && formData.email && formData.address && formData.city && formData.zipCode;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <div className="relative overflow-hidden pt-16 bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-600/20 text-purple-300 text-sm font-medium mb-6 border border-purple-500/40 backdrop-blur-sm">
              <Lock className="h-4 w-4 mr-2" />
              Secure Checkout
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Complete Your
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"> Order</span>
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto opacity-90">
              Secure payment processing with industry-standard encryption
            </p>
          </motion.div>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Payment Information */}
              <Card className="border border-purple-500/20 shadow-xl bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-purple-400" />
                    Payment Information
                  </CardTitle>
                  <CardDescription className="text-lg text-purple-200 opacity-90">
                    Enter your payment details to complete your order
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="cardNumber" className="text-sm font-semibold text-purple-200 mb-2 block">
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className="text-lg bg-black/50 border-purple-500/50 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate" className="text-sm font-semibold text-purple-200 mb-2 block">
                        Expiry Date
                      </Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className="bg-black/50 border-purple-500/50 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-sm font-semibold text-purple-200 mb-2 block">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        className="bg-black/50 border-purple-500/50 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold text-purple-200 mb-2 block">
                      Name on Card
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-black/50 border-purple-500/50 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card className="border border-purple-500/20 shadow-xl bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                    <Shield className="h-6 w-6 text-purple-400" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-purple-200 mb-2 block">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-black/50 border-purple-500/50 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-sm font-semibold text-purple-200 mb-2 block">
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="bg-black/50 border-purple-500/50 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm font-semibold text-purple-200 mb-2 block">
                        City
                      </Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="bg-black/50 border-purple-500/50 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode" className="text-sm font-semibold text-purple-200 mb-2 block">
                        ZIP Code
                      </Label>
                      <Input
                        id="zipCode"
                        placeholder="10001"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="bg-black/50 border-purple-500/50 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="sticky top-8 border border-purple-500/20 shadow-xl bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <Image
                          src={item.image || '/threadz-logo.png'}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="w-15 h-15 object-cover rounded-lg border border-purple-500/30"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                          <p className="text-gray-300 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-semibold text-white">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3 border-t border-purple-500/30 pt-4">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span>₹{total.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Shipping</span>
                      <span className="text-green-400 font-semibold">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Tax</span>
                      <span>₹{(total * 0.18).toFixed(0)}</span>
                    </div>
                    <div className="border-t border-purple-500/30 pt-3">
                      <div className="flex justify-between text-xl font-bold text-white">
                        <span>Total</span>
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          ₹{(total * 1.18).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={!isFormValid || isProcessing}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-200 disabled:opacity-50"
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

                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>256-bit SSL encryption</span>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => router.push('/cart')}
                    className="w-full border-2 border-purple-500/50 hover:border-purple-400 hover:text-purple-300 text-white bg-black/60 backdrop-blur-sm"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Cart
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}


