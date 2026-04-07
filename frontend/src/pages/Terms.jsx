import React from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <div className="flex flex-col items-center pb-20 pt-10 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8 sm:p-12"
      >
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Terms and Conditions</h1>
          <p className="text-slate-500 font-medium">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
          <p>
            Welcome to <strong>DP QR Generator</strong>. By accessing or using our website and services, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.
          </p>

          <h3 className="text-xl mt-8 mb-4">1. Acceptance of Terms</h3>
          <p>
            By using DP QR Generator, you agree to these Terms and Conditions. If you do not agree, please do not use our services.
          </p>

          <h3 className="text-xl mt-8 mb-4">2. Use of Services</h3>
          <p>
            DP QR Generator allows users to create, manage, and share QR codes for personal and business use. You agree to use the platform only for lawful purposes and in a way that does not violate any applicable laws or regulations.
          </p>

          <h3 className="text-xl mt-8 mb-4">3. User Accounts</h3>
          <p>
            To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
          </p>

          <h3 className="text-xl mt-8 mb-4">4. Prohibited Activities</h3>
          <p>You agree not to use DP QR Generator to:</p>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li>Share or promote illegal, harmful, or fraudulent content</li>
            <li>Violate any intellectual property rights</li>
            <li>Distribute malware, spam, or harmful links</li>
            <li>Attempt to gain unauthorized access to our systems</li>
          </ul>

          <h3 className="text-xl mt-8 mb-4">5. Content Responsibility</h3>
          <p>
            You are solely responsible for the content you create, upload, or share using QR codes generated on our platform. DP QR Generator does not monitor or control user content.
          </p>

          <h3 className="text-xl mt-8 mb-4">6. Service Availability</h3>
          <p>
            We strive to keep our services available at all times, but we do not guarantee uninterrupted or error-free service. We may modify, suspend, or discontinue any part of the service at any time without notice.
          </p>

          <h3 className="text-xl mt-8 mb-4">7. Limitation of Liability</h3>
          <p>
            DP QR Generator shall not be held liable for any direct, indirect, or incidental damages resulting from the use or inability to use our services.
          </p>

          <h3 className="text-xl mt-8 mb-4">8. Privacy</h3>
          <p>
            Your use of our services is also governed by our Privacy Policy. We are committed to protecting your data and privacy.
          </p>

          <h3 className="text-xl mt-8 mb-4">9. Changes to Terms</h3>
          <p>
            We reserve the right to update or modify these Terms at any time. Continued use of the service after changes means you accept the updated Terms.
          </p>

          <h3 className="text-xl mt-8 mb-4">10. Contact Us</h3>
          <p>
            If you have any questions about these Terms and Conditions, you can contact us through the website.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
