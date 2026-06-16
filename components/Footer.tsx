import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 text-slate-300 py-12 px-4 sm:px-8 relative z-10 border-t border-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-black text-white shadow-lg">
              <span>WB</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">The Weekend Baddy</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            Premium weekend badminton sessions for players of all levels. Join our community, stay active, and smash your goals!
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-white">Legal & Policies</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms & Conditions</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/refunds" className="hover:text-indigo-400 transition-colors">Cancellation & Refund Policy</Link>
            </li>
            <li>
              <Link href="/terms#delivery" className="hover:text-indigo-400 transition-colors">Service Delivery Policy</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-white">Contact Us</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-indigo-400" />
              <a href="mailto:support@theweekendbaddy.com" className="hover:text-indigo-400 transition-colors">
                [Your Email Here]
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-indigo-400" />
              <span>+91 [Your Phone Number]</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                [Your Venue Name]<br/>
                [Your Full Address Here]
              </span>
            </li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-sm font-medium text-slate-500">
        © {currentYear} The Weekend Baddy. All rights reserved.
      </div>
    </footer>
  );
}
