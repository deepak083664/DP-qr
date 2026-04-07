import React from 'react';
import { motion } from 'framer-motion';

const Privacy = () => {
  return (
    <div className="flex flex-col items-center pb-20 pt-10 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8 sm:p-12"
      >
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-500 font-medium">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
          <p>
            At <strong>DP QR Generator</strong>, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.
          </p>

          <h3 className="text-xl mt-8 mb-4">1. Information We Collect</h3>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li>Personal Information (such as name, email address, login details)</li>
            <li>Usage Data (such as pages visited, actions performed, device/browser information)</li>
            <li>QR Code Data (content you create, upload, or manage through our platform)</li>
          </ul>

          <h3 className="text-xl mt-8 mb-4">2. How We Use Your Information</h3>
          <p>We use your information to:</p>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li>Provide and improve our services</li>
            <li>Manage user accounts and authentication</li>
            <li>Generate and manage QR codes</li>
            <li>Communicate important updates and notifications</li>
            <li>Ensure security and prevent fraud</li>
          </ul>

          <h3 className="text-xl mt-8 mb-4">3. Data Sharing</h3>
          <p>
            We do not sell, trade, or rent your personal information to others. However, we may share data:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li>With trusted service providers (e.g., hosting, analytics)</li>
            <li>If required by law or legal processes</li>
            <li>To protect our rights, users, or platform security</li>
          </ul>

          <h3 className="text-xl mt-8 mb-4">4. Data Security</h3>
          <p>
            We implement appropriate security measures to protect your data from unauthorized access, alteration, or disclosure. However, no online system is 100% secure.
          </p>

          <h3 className="text-xl mt-8 mb-4">5. Cookies and Tracking</h3>
          <p>
            We may use cookies and similar technologies to enhance user experience, analyze traffic, and improve our services.
          </p>

          <h3 className="text-xl mt-8 mb-4">6. User Responsibilities</h3>
          <p>
            You are responsible for keeping your account credentials secure. Do not share your login details with others.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacy;
