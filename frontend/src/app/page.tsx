"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, Send, Zap, Users, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  
  return (
   
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      {/*  //nav,hero,features,cta,footer */}
     {/* ---------------------- */}
      <nav className="py-4 px-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg mr-3">
            EC
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-indigo-900">EmailCraft</h1>
        </div>
        <div className="flex items-center gap-4">
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

     {/* ------------------------- */}
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-indigo-900 leading-tight">
              Craft Engaging Email Sequences That Convert
            </h2>
            <p className="mt-6 text-lg text-indigo-700">
              EmailCraft helps you design, automate, and optimize your email marketing campaigns 
              with an intuitive visual workflow builder.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link 
                href="/register" 
                className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-center"
              >
                Get Started Free
                <ChevronRight className="h-5 w-5 ml-2" />
              </Link>
              <Link 
                href="/login" 
                className="flex items-center justify-center px-6 py-3 border-2 border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-xl border border-indigo-100">
            <div className="aspect-video bg-indigo-100 rounded-lg flex items-center justify-center">
              <Mail className="h-24 w-24 text-indigo-500" />
            </div>
          </div>
        </div>
      </div>

      {/* -------------- */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-2xl md:text-3xl font-bold text-indigo-900 text-center mb-12">
            Why Choose EmailCraft?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <Send className="h-10 w-10 text-indigo-600 mb-4" />
              <h4 className="text-xl font-semibold text-indigo-900 mb-2">
                Visual Campaign Builder
              </h4>
              <p className="text-indigo-700">
                Design complex email sequences with our intuitive drag-and-drop flowchart interface.
              </p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <Zap className="h-10 w-10 text-indigo-600 mb-4" />
              <h4 className="text-xl font-semibold text-indigo-900 mb-2">
                Automated Delivery
              </h4>
              <p className="text-indigo-700">
                Schedule emails and create time delays between messages for maximum impact.
              </p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <Users className="h-10 w-10 text-indigo-600 mb-4" />
              <h4 className="text-xl font-semibold text-indigo-900 mb-2">
                Advanced Lead Management
              </h4>
              <p className="text-indigo-700">
                Import your contacts via CSV and target the right audience with each campaign.
              </p>
            </div>
          </div>
        </div>
      </div>

     {/* ----------------- */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-4">
          Ready to Transform Your Email Marketing?
        </h3>
        <p className="text-lg text-indigo-700 mb-8">
        Join thousands of marketers who&apos;ve improved their email campaigns with EmailCraft.
        </p>
        <Link 
          href="/register" 
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-lg"
        >
          Start Creating Campaigns
          <ChevronRight className="h-5 w-5 ml-2" />
        </Link>
      </div>

      {/* ----------------- */}
      <footer className="bg-white border-t border-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm mr-2">
              EC
            </div>
            <span className="text-indigo-900 font-medium">EmailCraft</span>
          </div>
          <div className="text-indigo-500 text-sm">
            &copy; {new Date().getFullYear()} EmailCraft. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;