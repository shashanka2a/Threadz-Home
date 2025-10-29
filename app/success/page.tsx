"use client";

import React, { Suspense } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Package, Truck, Home, Eye } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const order = params.get('order') ?? 'ORDER-XXXXXX';

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
            <div className="w-24 h-24 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-600/20 text-purple-300 text-sm font-medium mb-6 border border-purple-500/40 backdrop-blur-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Payment Confirmed
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Order
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"> Confirmed</span>
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8 opacity-90">
              Thank you for your purchase! Your order has been successfully processed and is being prepared for shipment.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Success Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Order Details */}
          <Card className="border border-purple-500/20 shadow-xl bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white">
                Order Details
              </CardTitle>
              <CardDescription className="text-lg text-purple-200 opacity-90">
                Your order information and next steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center px-6 py-3 bg-gray-800/50 rounded-lg border border-purple-500/30">
                  <Package className="h-6 w-6 text-purple-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-300">Order Number</p>
                    <p className="text-xl font-bold text-white font-mono">{order}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-purple-600/10 rounded-xl border border-purple-500/20">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                    <Package className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Order Confirmed</h3>
                  <p className="text-sm text-gray-300">Your order has been received and is being processed</p>
                </div>
                
                <div className="p-6 bg-orange-600/10 rounded-xl border border-orange-500/20">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
                    <Truck className="h-6 w-6 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Preparing for Shipment</h3>
                  <p className="text-sm text-gray-300">Your items are being prepared and will ship within 1-2 business days</p>
                </div>
                
                <div className="p-6 bg-green-600/10 rounded-xl border border-green-500/20">
                  <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <Truck className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Estimated Delivery</h3>
                  <p className="text-sm text-gray-300">3-5 business days from shipment date</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => router.push(`/track/${order}`)}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-200 h-12 px-8"
            >
              <Eye className="h-5 w-5 mr-2" />
              Track Your Order
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="border-2 border-purple-500/50 hover:border-purple-400 hover:text-purple-300 text-white bg-black/60 backdrop-blur-sm h-12 px-8"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
          </motion.div>

          {/* Additional Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-gray-900/50 to-purple-900/30 border border-purple-500/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-4">
                  What's Next?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="font-semibold text-white mb-2">📧 Email Confirmation</h4>
                    <p className="text-sm text-gray-300">
                      You'll receive an email confirmation with your order details and tracking information.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">📱 SMS Updates</h4>
                    <p className="text-sm text-gray-300">
                      Get real-time updates about your order status via SMS notifications.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"
          />
          <p className="text-purple-200">Loading order details...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}


