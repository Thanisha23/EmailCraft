import React from 'react'
import Link from 'next/link'
import { Mail, Github, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-indigo-100 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm mr-2">
                EC
              </div>
              <span className="font-bold text-indigo-900">EmailCraft</span>
            </div>
            <p className="text-sm text-indigo-500">
              © {new Date().getFullYear()} EmailCraft. All rights reserved.
            </p>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link href="#" className="text-sm text-indigo-600 hover:text-indigo-800">Privacy Policy</Link>
            <Link href="#" className="text-sm text-indigo-600 hover:text-indigo-800">Terms of Service</Link>
            <Link href="#" className="text-sm text-indigo-600 hover:text-indigo-800">Help Center</Link>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" aria-label="GitHub" className="text-indigo-500 hover:text-indigo-700 transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter" className="text-indigo-500 hover:text-indigo-700 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Email" className="text-indigo-500 hover:text-indigo-700 transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="md:hidden flex flex-wrap justify-center mt-4 space-x-4">
          <Link href="#" className="text-xs text-indigo-600 hover:text-indigo-800">Privacy</Link>
          <Link href="#" className="text-xs text-indigo-600 hover:text-indigo-800">Terms</Link>
          <Link href="#" className="text-xs text-indigo-600 hover:text-indigo-800">Help</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer