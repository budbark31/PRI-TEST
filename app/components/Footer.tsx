"use client";

import Link from "next/link";
import { useEmailSignup } from "@/app/components/EmailSignupProvider";

export default function Footer() {
  const { openSignup } = useEmailSignup();

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Brand & Bio */}
          <div>
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4">Penn Rock Industries</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your trusted partner for heavy trucks, day cabs, and construction equipment. 
              Family-owned and operated in Reading, PA.
            </p>
          </div>

          {/* Column 2: Quick Contact */}
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wide mb-4 text-gray-200">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="mt-0.5">📍</span>
                <a 
                  href="https://maps.google.com/?q=Glenville+PA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Reading, Pennsylvania<br/>
                  (By Appointment Only)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span>📞</span>
                <a href="tel:6105074832" className="hover:text-white transition-colors">
                  610-507-4832
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span>✉️</span>
                <a href="mailto:sales@pennrock.com" className="hover:text-white transition-colors">
                  sales@pennrock.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wide mb-4 text-gray-200">Inventory</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/?category=dump-trucks" className="hover:text-white transition-colors">
                  Dump Trucks
                </Link>
              </li>
              <li>
                <Link href="/?category=day-cabs" className="hover:text-white transition-colors">
                  Day Cabs
                </Link>
              </li>
              <li>
                <Link href="/?category=heavy-equipment" className="hover:text-white transition-colors">
                  Heavy Equipment
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-white transition-colors">
                  Sell Your Truck
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openSignup}
                  className="border-2 border-slate-900 bg-orange-500 px-3 py-1 text-white font-bold uppercase tracking-widest text-xs hover:bg-orange-600 transition-colors"
                >
                  Join Email List
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Penn Rock Industries. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             {/* You can add Privacy Policy links here later */}
             <span>Built with Next.js & Sanity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}