import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QrCode, Mail } from 'lucide-react';

const Instagram = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const footerLinks = {
    product: [
      { name: 'Features', href: '/#features' },
      { name: 'Create QR', href: '/dashboard' },
      { name: 'Pricing', href: '/#pricing' },
      { name: 'API Docs', href: '#' }
    ],
    support: [
      { name: 'About Us', href: '/about' },
      { name: 'Terms and Conditions', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Help Center', href: '/help-center' }
    ],
    social: [
      { name: 'Mail', icon: Mail, href: 'mailto:support@dpqr.online' },
      { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/dp_qr_generator?igsh=MWtjdjJoam15Zm8weg==' },
      { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/share/1B57oKPnY5/' }
    ]
  };

  const isDashboardOrMyQRs = pathname => pathname.startsWith('/dashboard') || pathname.startsWith('/my-qrs');

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 z-20 relative overflow-hidden">
      {/* Global Upgrade Button (Website Niche) */}
      {!isDashboardOrMyQRs(location.pathname) && (
        <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/5">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Ready to remove all limits?</h3>
              <p className="text-slate-600 max-w-lg">Unlock unlimited QR scans, dynamic URL editing, and premium analytical features.</p>
            </div>
            <Link to="/pricing" className="whitespace-nowrap bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-primary/30 flex items-center gap-2 transform hover:-translate-y-1">
              <span className="text-lg">Upgrade to Premium</span>
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center sm:text-left mb-12 relative z-10">
        {/* Brand Column */}
        <div className="flex flex-col gap-4 items-center sm:items-start">
          <Link to="/" className="flex items-center gap-2 mb-2">
            <QrCode className="text-primary w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">DP <span className="gradient-text">QR-generator</span></span>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
            Empowering brands with beautifully customized QR codes for the digital age. Fast, high-res, and professional.
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-start gap-2 text-slate-400 text-sm">
              <Mail className="w-4 h-4 shrink-0 mt-0.5" /> <span className="break-all">support@dpqr.online</span>
            </div>
          </div>
        </div>

        {/* Product Column */}
        <div>
          <h4 className="text-slate-900 font-bold mb-6">Product</h4>
          <ul className="flex flex-col gap-4">
            {footerLinks.product.map((link) => (
              <li key={link.name}>
                <Link to={link.href} className="text-slate-500 hover:text-primary transition-colors text-sm">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h4 className="text-slate-900 font-bold mb-6">Company</h4>
          <ul className="flex flex-col gap-4">
            {footerLinks.support.map((link) => (
              <li key={link.name}>
                <Link to={link.href} className="text-slate-500 hover:text-primary transition-colors text-sm">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Column */}
        <div>
          <h4 className="text-slate-900 font-bold mb-6">Connect</h4>
          <p className="text-slate-500 text-sm mb-6">Join our community and stay updated with the latest tools.</p>
          <div className="flex gap-4 justify-center sm:justify-start">
            {footerLinks.social.map((social) => (
              <a 
                key={social.name} 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-primary/10 hover:text-primary transition-all"
                title={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
          <p>© {currentYear} DP QR-generator. All rights reserved.</p>
          <span className="hidden sm:inline">|</span>
          <p>Powered by <a href="https://launchliftx.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors font-semibold">LaunchLiftX</a></p>
        </div>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-slate-600 transition-colors">Terms and Conditions</Link>
          <Link to="#" className="hover:text-slate-600 transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
