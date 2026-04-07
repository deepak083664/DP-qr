import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Lightbulb, Users, Zap, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col items-center pb-20 pt-10">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
            About Us
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight text-slate-900">
            Empowering Connections with <br className="hidden sm:block" />
            <span className="gradient-text">Smart QR Technology</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            DP QR Generator is built on a simple premise: making the bridge between physical and digital worlds as seamless and beautiful as possible.
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-10 flex flex-col items-start gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Target className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed">
            To provide businesses and individuals with a fast, reliable, and highly customizable QR code generation tool that enhances their digital presence and marketing efforts. We believe in simplicity without sacrificing power.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-10 flex flex-col items-start gap-4 relative overflow-hidden"
        >
          {/* subtle glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <Lightbulb className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
          <p className="text-slate-600 leading-relaxed">
            We envision a connected world where every scanned interaction is meaningful. By continuously innovating our SaaS platform, we aim to be the standard solution for next-generation interactive codes globally.
          </p>
        </motion.div>
      </section>

      {/* Core Values / Features */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">Our Core Values</h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center p-6"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-6 shadow-inner">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Efficiency</h3>
            <p className="text-slate-500 text-sm">Lightning-fast generation with zero latency. Getting your codes ready in seconds.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center text-center p-6"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-6 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Reliability</h3>
            <p className="text-slate-500 text-sm">High-res outputs that never expire unexpectedly. Built on a secure and stable infrastructure.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center p-6"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-6 shadow-inner">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">User First</h3>
            <p className="text-slate-500 text-sm">An intuitive UI designed for humans. We constantly evolve based on community feedback.</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
            Ready to upgrade your brand?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto relative z-10">
            Join thousands of users who are already generating smart, tracked, and beautiful QR codes with DP QR Generator.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link to="/signup" className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1">
              Started for Free
            </Link>
            <Link to="/#pricing" className="bg-slate-800 text-white border border-slate-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-700 transition-all">
              View Plans
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
