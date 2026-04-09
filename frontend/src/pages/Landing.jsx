import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { QrCode, Zap, ShieldCheck, Download } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card flex flex-col items-center text-center gap-4"
  >
    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </motion.div>
);

const Landing = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center pb-20">
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 lg:py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold mb-5 sm:mb-6 tracking-tight leading-tight text-slate-900">
            Create Stunning <br className="hidden sm:block" /> <span className="gradient-text">QR Codes</span> Instantly
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 px-4">
            The ultimate tool to transform URLs, texts, images, and PDFs into beautifully customized QR Codes tailored for your brand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-6 sm:px-0">
            {user ? (
              <Link to="/dashboard" className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2">
                Go to Dashboard <Zap className="w-5 h-5"/>
              </Link>
            ) : (
              <Link to="/signup" className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2">
                Get Started <Zap className="w-5 h-5"/>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Demo QR Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12 sm:mt-16 md:mt-20 relative"
        >
          <div className="glass p-3 sm:p-4 rounded-[2rem] sm:rounded-3xl inline-block shadow-2xl relative">
            <img 
              src="/home-qr.png" 
              alt="QR Preview" 
              className="rounded-2xl w-48 sm:w-64 h-48 sm:h-64 object-contain" 
            />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="w-full max-w-6xl mx-auto px-6 py-12 sm:py-20">
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900">Why Choose DP QR-generator?</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={QrCode} title="Complete Customization" 
            description="Change colors, backgrounds, and upload a central logo to perfectly match your brand's identity." delay={0} />
          <FeatureCard 
            icon={Download} title="High-Res Export" 
            description="Download pristine quality SVGs and PNGs ready for standard print or digital marketing materials." delay={0.2} />
          <FeatureCard 
            icon={ShieldCheck} title="Multi-format Support" 
            description="Support for URLs, raw text, and powerful integrated direct uploads for Images and PDFs." delay={0.4} />
        </div>
      </section>

    </div>
  );
};

export default Landing;
