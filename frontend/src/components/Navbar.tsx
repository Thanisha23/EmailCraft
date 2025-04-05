import React, { useState } from 'react'
import { LogOut, Mail, LayoutDashboard, Settings, Menu, X } from "lucide-react";
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-indigo-100 shadow-sm">
      <div className="flex justify-between items-center py-4 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/home" className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg mr-3 shadow-sm">
            EC
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-indigo-900">EmailCraft</h1>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/home" 
            className={`text-indigo-700 hover:text-indigo-900 font-medium flex items-center transition-colors ${
              isActive('/home') ? 'text-indigo-900 font-semibold' : ''
            }`}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
          <Link 
            href="/flowchart/new" 
            className={`text-indigo-700 hover:text-indigo-900 font-medium flex items-center transition-colors ${
              isActive('/flowchart/new') ? 'text-indigo-900 font-semibold' : ''
            }`}
          >
            <Mail className="h-4 w-4 mr-2" />
            New Campaign
          </Link>
          {/* <Link 
            href="/settings" 
            className={`text-indigo-700 hover:text-indigo-900 font-medium flex items-center transition-colors ${
              isActive('/settings') ? 'text-indigo-900 font-semibold' : ''
            }`}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link> */}
          
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 bg-white border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ml-4"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <button
            onClick={logout}
            className="flex items-center px-3 py-1.5 bg-white border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Logout</span>
          </button>
          
          <button
            onClick={toggleMenu}
            className="p-2 text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-6 border-t border-indigo-100 shadow-lg animate-fadeIn">
          <div className="flex flex-col space-y-4">
            <Link 
              href="/home" 
              className={`text-indigo-700 hover:text-indigo-900 font-medium flex items-center py-2 ${
                isActive('/home') ? 'text-indigo-900 font-semibold bg-indigo-50 -mx-2 px-2 rounded-md' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
            <Link 
              href="/flowchart/new" 
              className={`text-indigo-700 hover:text-indigo-900 font-medium flex items-center py-2 ${
                isActive('/flowchart/new') ? 'text-indigo-900 font-semibold bg-indigo-50 -mx-2 px-2 rounded-md' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Mail className="h-5 w-5 mr-3" />
              New Campaign
            </Link>
            {/* <Link 
              href="/settings" 
              className={`text-indigo-700 hover:text-indigo-900 font-medium flex items-center py-2 ${
                isActive('/settings') ? 'text-indigo-900 font-semibold bg-indigo-50 -mx-2 px-2 rounded-md' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;