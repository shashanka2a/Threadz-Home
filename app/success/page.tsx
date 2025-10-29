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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
              <CheckCircle className="h-4 w-4 mr-2" />
              Payment Confirmed
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Order
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Confirmed</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
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
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Order Details
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Your order information and next steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center px-6 py-3 bg-gray-100 rounded-lg">
                  <Package className="h-6 w-6 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="text-xl font-bold text-gray-900 font-mono">{order}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-blue-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Order Confirmed</h3>
                  <p className="text-sm text-gray-600">Your order has been received and is being processed</p>
                </div>
                
                <div className="p-6 bg-yellow-50 rounded-xl">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Preparing for Shipment</h3>
                  <p className="text-sm text-gray-600">Your items are being prepared and will ship within 1-2 business days</p>
                </div>
                
                <div className="p-6 bg-green-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Estimated Delivery</h3>
                  <p className="text-sm text-gray-600">3-5 business days from shipment date</p>
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-8"
            >
              <Eye className="h-5 w-5 mr-2" />
              Track Your Order
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 h-12 px-8"
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
            <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-0">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  What's Next?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📧 Email Confirmation</h4>
                    <p className="text-sm text-gray-600">
                      You'll receive an email confirmation with your order details and tracking information.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📱 SMS Updates</h4>
                    <p className="text-sm text-gray-600">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}


