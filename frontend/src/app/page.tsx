"use client";

import React from "react";
import Link from "next/link";
import { Mail, Send, Zap, Users, ChevronRight, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      {/*  //nav,hero,features,cta,footer */}
      {/* ---------------------- */}
      {!isAuthenticated && (
        <nav className="py-4 px-4 sm:px-6 flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="flex items-center cursor-pointer">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-base sm:text-lg mr-2 sm:mr-3">
              EC
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-indigo-900">
              EmailCraft
            </h1>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-indigo-700"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-indigo-700 font-medium hover:text-indigo-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </nav>
      )}

      {/* Mobile menu - also conditionally rendered */}
      {!isAuthenticated && isMenuOpen && (
        <div className="md:hidden bg-white border-b border-indigo-100 px-4 py-2">
          <div className="flex flex-col space-y-2">
            <Link
              href="/login"
              className="px-4 py-2 text-indigo-700 font-medium hover:text-indigo-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}

      {/* ------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-900 leading-tight">
              Craft Engaging Email Sequences That Convert
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-indigo-700">
              EmailCraft helps you design, automate, and optimize your email
              marketing campaigns with an intuitive visual workflow builder.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/home"
                    className="flex items-center justify-center px-4 sm:px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-center w-full sm:w-auto"
                  >
                    Go to Dashboard
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Link>
                  <Link
                    href="/flowchart/new"
                    className="flex items-center justify-center px-4 sm:px-6 py-3 border-2 border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-center w-full sm:w-auto mt-2 sm:mt-0"
                  >
                    Create New Campaign
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="flex items-center justify-center px-4 sm:px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-center w-full sm:w-auto"
                  >
                    Get Started Free
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center justify-center px-4 sm:px-6 py-3 border-2 border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-center w-full sm:w-auto mt-2 sm:mt-0"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl border border-indigo-100 mt-6 md:mt-0">
            <div className="aspect-video bg-indigo-100 rounded-lg flex items-center justify-center">
              <Mail className="h-16 w-16 sm:h-24 sm:w-24 text-indigo-500" />
            </div>
          </div>
        </div>
      </div>

      {/* -------------- */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-900 text-center mb-8 sm:mb-12">
            Why Choose EmailCraft?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="bg-indigo-50 p-4 sm:p-6 rounded-xl border border-indigo-100">
              <Send className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 mb-3 sm:mb-4" />
              <h4 className="text-lg sm:text-xl font-semibold text-indigo-900 mb-2">
                Visual Campaign Builder
              </h4>
              <p className="text-sm sm:text-base text-indigo-700">
                Design complex email sequences with our intuitive drag-and-drop
                flowchart interface.
              </p>
            </div>
            <div className="bg-indigo-50 p-4 sm:p-6 rounded-xl border border-indigo-100">
              <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 mb-3 sm:mb-4" />
              <h4 className="text-lg sm:text-xl font-semibold text-indigo-900 mb-2">
                Automated Delivery
              </h4>
              <p className="text-sm sm:text-base text-indigo-700">
                Schedule emails and create time delays between messages for
                maximum impact.
              </p>
            </div>
            <div className="bg-indigo-50 p-4 sm:p-6 rounded-xl border border-indigo-100">
              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 mb-3 sm:mb-4" />
              <h4 className="text-lg sm:text-xl font-semibold text-indigo-900 mb-2">
                Advanced Lead Management
              </h4>
              <p className="text-sm sm:text-base text-indigo-700">
                Import your contacts via CSV and target the right audience with
                each campaign.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-900 mb-3 sm:mb-4">
          Ready to Transform Your Email Marketing?
        </h3>
        <p className="text-base sm:text-lg text-indigo-700 mb-6 sm:mb-8">
          Join thousands of marketers who&apos;ve improved their email campaigns
          with EmailCraft.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center px-4 sm:px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-base sm:text-lg"
        >
          Start Creating Campaigns
          <ChevronRight className="h-5 w-5 ml-2" />
        </Link>
      </div>

      {/* ----------------- */}
      <footer className="bg-white border-t border-indigo-100 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm mr-2">
              EC
            </div>
            <span className="text-indigo-900 font-medium">EmailCraft</span>
          </div>
          <div className="text-indigo-500 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} EmailCraft. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
