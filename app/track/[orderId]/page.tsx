"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";
import { Package, Truck, CheckCircle, Clock, MapPin, Home, RefreshCw } from "lucide-react";

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
  {
    id: 1,
    title: "Order Confirmed",
    description: "Your order has been received and confirmed",
    status: "completed",
    date: formatTrackingDate(0),
    time: "2:30 PM",
    icon: CheckCircle,
    color: "green"
  },
  {
    id: 2,
    title: "Processing",
    description: "Your items are being prepared for shipment",
    status: "completed",
    date: formatTrackingDate(0),
    time: "3:45 PM",
    icon: Package,
    color: "blue"
  },
  {
    id: 3,
    title: "Shipped",
    description: "Your order has been shipped and is on its way",
    status: "completed",
    date: formatTrackingDate(1),
    time: "9:00 AM",
    icon: Truck,
    color: "purple"
  },
  {
    id: 4,
    title: "Out for Delivery",
    description: "Your package is out for delivery",
    status: "current",
    date: formatTrackingDate(2),
    time: "8:00 AM",
    icon: Truck,
    color: "orange"
  },
  {
    id: 5,
    title: "Delivered",
    description: "Your package has been delivered",
    status: "pending",
    date: formatTrackingDate(2),
    time: "2:00 PM",
    icon: MapPin,
    color: "green"
  }
];

export default function TrackOrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-orange-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return { text: 'Completed', variant: 'default' as const, className: 'bg-green-600/20 text-green-400 border border-green-500/30' };
      case 'current': return { text: 'Current', variant: 'default' as const, className: 'bg-orange-600/20 text-orange-400 border border-orange-500/30' };
      case 'pending': return { text: 'Pending', variant: 'secondary' as const, className: 'bg-gray-600/20 text-gray-400 border border-gray-500/30' };
      default: return { text: 'Unknown', variant: 'secondary' as const, className: 'bg-gray-600/20 text-gray-400 border border-gray-500/30' };
    }
  };

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
              <Truck className="h-4 w-4 mr-2" />
              Order Tracking
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Track Your
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"> Order</span>
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8 opacity-90">
              Monitor your order's journey from our warehouse to your doorstep
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tracking Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Order Info */}
          <Card className="border border-purple-500/20 shadow-xl bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white">
                Order Information
              </CardTitle>
              <CardDescription className="text-lg text-purple-200 opacity-90">
                Track your order in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center px-6 py-3 bg-gray-800/50 rounded-lg border border-purple-500/30">
                  <Package className="h-6 w-6 text-purple-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-300">Order Number</p>
                    <p className="text-xl font-bold text-white font-mono">{orderId}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-purple-600/10 rounded-xl border border-purple-500/20">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                    <Package className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">2 Items</h3>
                  <p className="text-sm text-gray-300">Premium quality apparel</p>
                </div>
                
                <div className="p-6 bg-green-600/10 rounded-xl border border-green-500/20">
                  <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <Truck className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Free Shipping</h3>
                  <p className="text-sm text-gray-300">Standard delivery included</p>
                </div>
                
                <div className="p-6 bg-pink-600/10 rounded-xl border border-pink-500/20">
                  <div className="w-12 h-12 bg-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-500/30">
                    <Clock className="h-6 w-6 text-pink-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">3-5 Days</h3>
                  <p className="text-sm text-gray-300">Estimated delivery time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card className="border border-purple-500/20 shadow-xl bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                Tracking Timeline
              </CardTitle>
              <CardDescription className="text-lg text-purple-200 opacity-90">
                Follow your order's journey step by step
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const statusBadge = getStatusBadge(step.status);
                  
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className="flex items-start gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(step.status)} border-2 border-white/20`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        {index < trackingSteps.length - 1 && (
                          <div className={`w-0.5 h-16 mt-2 ${step.status === 'completed' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                          <Badge className={statusBadge.className}>
                            {statusBadge.text}
                          </Badge>
                        </div>
                        <p className="text-gray-300 mb-2">{step.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {step.date}
                          </span>
                          <span>{step.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-200 h-12 px-8"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh Status
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
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-gray-900/50 to-purple-900/30 border border-purple-500/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-4">
                  Need Help?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="font-semibold text-white mb-2">📞 Customer Support</h4>
                    <p className="text-sm text-gray-300">
                      Contact our support team for any questions about your order.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">📧 Email Updates</h4>
                    <p className="text-sm text-gray-300">
                      We'll send you email notifications when your order status changes.
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


