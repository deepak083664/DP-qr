import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Globe, Share2, MessageSquare, Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '/#features' },
      { name: 'Create QR', href: '/dashboard' },
      { name: 'Pricing', href: '/#pricing' },
      { name: 'API Docs', href: '#' }
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' }
    ],
    social: [
      { name: 'GitHub', icon: Globe, href: 'https://github.com' },
      { name: 'Twitter', icon: Share2, href: 'https://twitter.com' },
      { name: 'LinkedIn', icon: MessageSquare, href: 'https://linkedin.com' },
      { name: 'Instagram', icon: Mail, href: 'https://instagram.com' }
    ]
  };


  return (
    <footer className="bg-white/80 border-t border-slate-200 backdrop-blur-xl pt-16 pb-8 z-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center sm:text-left mb-12">
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
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Mail className="w-4 h-4" /> support@dpqrgenerator.com
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <MapPin className="w-4 h-4" /> Silicon Valley, CA
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
        <p>© {currentYear} DP QR-generator. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="#" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
          <Link to="#" className="hover:text-slate-600 transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
