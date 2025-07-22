"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, Zap, Users, ChevronRight, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated } = useAuth();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const fadeInLeft:any = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay: 0.2 }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay: 0.4 }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      {!isAuthenticated && (
        <motion.nav 
          className="py-4 px-4 sm:px-6 flex justify-between items-center max-w-7xl mx-auto relative z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Link href="/" className="flex items-center cursor-pointer">
            <motion.div 
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-base sm:text-lg mr-2 sm:mr-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              EC
            </motion.div>
            <h1 className="text-lg sm:text-2xl font-bold text-indigo-900">
              EmailCraft
            </h1>
          </Link>

          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-indigo-700 relative z-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6 cursor-pointer" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-indigo-700 font-medium hover:text-indigo-900 transition-colors"
            >
              Sign In
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </motion.nav>
      )}

      <AnimatePresence>
        {!isAuthenticated && isMenuOpen && (
          <>
            
            <motion.div
              className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMenuOpen(false)}
            />
            
           
            <motion.div
              className="fixed top-0 left-0 right-0 bg-white border-b border-indigo-100 shadow-lg z-50 md:hidden"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex justify-between items-center px-4 py-4 border-b border-indigo-100">
                <Link href="/" className="flex items-center cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-base mr-2">
                    EC
                  </div>
                  <h1 className="text-lg font-bold text-indigo-900">
                    EmailCraft
                  </h1>
                </Link>
                
                <motion.button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-indigo-700 hover:bg-indigo-50 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-5 w-5 cursor-pointer" />
                </motion.button>
              </div>
              
              <motion.div 
                className="px-4 py-4"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <div className="flex flex-col space-y-3">
                  <motion.div variants={staggerItem}>
                    <Link
                      href="/login"
                      className="block px-4 py-3 text-indigo-700 font-medium hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <Link
                      href="/register"
                      className="block px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div {...fadeInLeft}>
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-900 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Craft Engaging Email Sequences That Convert
            </motion.h2>
            <motion.p 
              className="mt-4 sm:mt-6 text-base sm:text-lg text-indigo-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              EmailCraft helps you design, automate, and optimize your email
              marketing campaigns with an intuitive visual workflow builder.
            </motion.p>
            <motion.div 
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {isAuthenticated ? (
                <>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/home"
                      className="flex items-center justify-center px-4 sm:px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-center w-full sm:w-auto"
                    >
                      Go to Dashboard
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/flowchart/new"
                      className="flex items-center justify-center px-4 sm:px-6 py-3 border-2 border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-center w-full sm:w-auto mt-2 sm:mt-0"
                    >
                      Create New Campaign
                    </Link>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/register"
                      className="flex items-center justify-center px-4 sm:px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-center w-full sm:w-auto"
                    >
                      Get Started Free
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/login"
                      className="flex items-center justify-center px-4 sm:px-6 py-3 border-2 border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-center w-full sm:w-auto mt-2 sm:mt-0"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
          <motion.div 
            className="bg-white p-4 sm:p-6 rounded-xl shadow-xl border border-indigo-100 mt-6 md:mt-0"
            {...fadeInRight}
            whileHover={{ 
              y: -5,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="aspect-video bg-indigo-100 rounded-lg flex items-center justify-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                <Mail className="h-16 w-16 sm:h-24 sm:w-24 text-indigo-500" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="bg-white py-12 sm:py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h3 
            className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-900 text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Choose EmailCraft?
          </motion.h3>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div 
              className="bg-indigo-50 p-4 sm:p-6 rounded-xl border border-indigo-100"
              variants={staggerItem}
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Send className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 mb-3 sm:mb-4" />
              </motion.div>
              <h4 className="text-lg sm:text-xl font-semibold text-indigo-900 mb-2">
                Visual Campaign Builder
              </h4>
              <p className="text-sm sm:text-base text-indigo-700">
                Design complex email sequences with our intuitive drag-and-drop
                flowchart interface.
              </p>
            </motion.div>
            <motion.div 
              className="bg-indigo-50 p-4 sm:p-6 rounded-xl border border-indigo-100"
              variants={staggerItem}
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 mb-3 sm:mb-4" />
              </motion.div>
              <h4 className="text-lg sm:text-xl font-semibold text-indigo-900 mb-2">
                Automated Delivery
              </h4>
              <p className="text-sm sm:text-base text-indigo-700">
                Schedule emails and create time delays between messages for
                maximum impact.
              </p>
            </motion.div>
            <motion.div 
              className="bg-indigo-50 p-4 sm:p-6 rounded-xl border border-indigo-100"
              variants={staggerItem}
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 mb-3 sm:mb-4" />
              </motion.div>
              <h4 className="text-lg sm:text-xl font-semibold text-indigo-900 mb-2">
                Advanced Lead Management
              </h4>
              <p className="text-sm sm:text-base text-indigo-700">
                Import your contacts via CSV and target the right audience with
                each campaign.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      
      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.h3 
          className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-900 mb-3 sm:mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Ready to Transform Your Email Marketing?
        </motion.h3>
        <motion.p 
          className="text-base sm:text-lg text-indigo-700 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Join thousands of marketers who&apos;ve improved their email campaigns
          with EmailCraft.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/register"
            className="inline-flex items-center px-4 sm:px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-base sm:text-lg"
          >
            Start Creating Campaigns
            <ChevronRight className="h-5 w-5 ml-2" />
          </Link>
        </motion.div>
      </motion.div>

     
      <motion.footer 
        className="bg-white border-t border-indigo-100 py-6 sm:py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            className="flex items-center mb-4 md:mb-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm mr-2"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              EC
            </motion.div>
            <span className="text-indigo-900 font-medium">EmailCraft</span>
          </motion.div>
          <motion.div 
            className="text-indigo-500 text-xs sm:text-sm"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            &copy; {new Date().getFullYear()} EmailCraft. All rights reserved.
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;