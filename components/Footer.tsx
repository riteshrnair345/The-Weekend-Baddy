import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-brand-purple text-brand-yellow-light/80 py-12 px-4 sm:px-8 relative z-10 border-t border-[#4A2A6D]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="RacketHeads Kochi Logo" className="h-12 w-auto rounded-xl shadow-lg object-contain" />
            <h3 className="text-xl font-bold text-white tracking-tight">RacketHeads Kochi</h3>
          </div>
          <p className="text-sm text-brand-yellow-light/60 leading-relaxed max-w-sm">
            A Badminton community — play, compete, connect.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-white">Legal & Policies</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <Link href="/terms" className="hover:text-brand-pink transition-colors">Terms & Conditions</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-brand-pink transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/refunds" className="hover:text-brand-pink transition-colors">Cancellation & Refund Policy</Link>
            </li>
            <li>
              <Link href="/terms#delivery" className="hover:text-brand-pink transition-colors">Service Delivery Policy</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-white">Contact Us</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-brand-pink" />
              <a href="mailto:support@theweekendbaddy.com" className="hover:text-brand-pink transition-colors">
                [Your Email Here]
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-brand-pink" />
              <span>+91 [Your Phone Number]</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                [Your Venue Name]<br/>
                [Your Full Address Here]
              </span>
            </li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-[#4A2A6D] text-center text-sm font-medium text-brand-yellow-light/50">
        © {currentYear} RacketHeads Kochi. All rights reserved.
      </div>
    </footer>
  );
}
