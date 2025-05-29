"use client";

import Head from 'next/head';
import { useEffect } from 'react';

interface PolicySection {
  title: string;
  content: string | JSX.Element;
}

const privacyPolicy: PolicySection[] = [
  {
    title: 'Introduction',
    content: (
      <>
        This Privacy Policy explains how Global Cuisine Explorer and Custom Cooking On-Demand collects, uses, shares, and protects your personal information when you use our website, mobile application, and related services that connect users with home cooks and professional chefs (the “Services”). By accessing or using the Services you agree to the practices described here.
      </>
    ),
  },
  {
    title: 'Information We Collect',
    content: (
      <div className="space-y-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Category</th>
              <th className="border border-gray-300 p-2 text-left">Examples</th>
              <th className="border border-gray-300 p-2 text-left">Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">Account Data</td>
              <td className="border border-gray-300 p-2">Name, email address, mobile number, password</td>
              <td className="border border-gray-300 p-2">Create and secure your account, communicate with you</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Profile & Preference Data</td>
              <td className="border border-gray-300 p-2">Profile photo, dietary preferences, delivery addresses</td>
              <td className="border border-gray-300 p-2">Personalize meals, display cook/chef profiles, deliver orders</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Transaction Data</td>
              <td className="border border-gray-300 p-2">Order details, payment method token, amounts, refunds</td>
              <td className="border border-gray-300 p-2">Process payments via Razorpay, generate invoices, maintain histories</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Device & Usage Data</td>
              <td className="border border-gray-300 p-2">IP address, browser type, app version, log files, cookies</td>
              <td className="border border-gray-300 p-2">Improve site/app performance, prevent fraud, analytics</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Location Data (optional)</td>
              <td className="border border-gray-300 p-2">GPS or address input</td>
              <td className="border border-gray-300 p-2">Enable delivery tracking, show local cooks</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Feedback & Ratings</td>
              <td className="border border-gray-300 p-2">Meal ratings, reviews, support tickets</td>
              <td className="border border-gray-300 p-2">Maintain service quality, respond to issues</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
  {
    title: 'How We Use Your Information',
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Process and fulfill orders, payments, and refunds.</li>
        <li>Verify identity, send email confirmations, and enforce platform security.</li>
        <li>Match you with suitable cooks/chefs based on cuisine and dietary filters.</li>
        <li>Provide customer support and notify you of order status, promotions, or policy updates.</li>
        <li>Conduct analytics to improve recipes, features, and user experience.</li>
        <li>Comply with legal obligations and resolve disputes.</li>
      </ul>
    ),
  },
  {
    title: 'Legal Bases (GDPR / Indian PDPB Draft)',
    content: 'We process data on one or more of the following grounds: (a) performance of a contract, (b) your explicit consent, (c) legitimate interests (e.g., fraud prevention), or (d) legal compliance.',
  },
  {
    title: 'Sharing & Disclosure',
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Cooks/Chefs:</strong> Receive only the data needed to prepare and deliver your order (name, dietary notes, delivery slot).</li>
        <li><strong>Payment Processor (Razorpay):</strong> Receives encrypted payment information to complete transactions.</li>
        <li><strong>Logistics Partners:</strong> Obtain delivery address and contact number.</li>
        <li><strong>Analytics & Cloud Vendors:</strong> Receive pseudonymized or aggregated data for hosting, analytics, and error logging.</li>
        <li><strong>Legal & Compliance:</strong> Data may be disclosed if required by law, court order, or to protect rights, property, or safety.</li>
        <li>We do not sell your personal information to third parties.</li>
      </ul>
    ),
  },
  {
    title: 'Cookies & Tracking',
    content: (
      <>
        <p>We use first-party and third-party cookies and similar technologies (e.g., local storage, SDKs) to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Keep you signed in,</li>
          <li>Remember preferences,</li>
          <li>Measure traffic and performance,</li>
          <li>Deliver relevant offers.</li>
        </ul>
        <p className="mt-2">You can control cookies through browser settings; disabling them may affect functionality.</p>
      </>
    ),
  },
  {
    title: 'Data Security',
    content: 'We implement TLS encryption in transit, AES-256 encryption at rest, role-based access controls, periodic security audits, and token-based (JWT) session management. Despite safeguards, no method of transmission over the Internet is 100% secure.',
  },
  {
    title: 'Data Retention',
    content: (
      <>
        <p>Personal information is kept for as long as your account is active or as needed to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Provide Services,</li>
          <li>Comply with tax and regulatory requirements,</li>
          <li>Resolve disputes,</li>
          <li>Enforce agreements.</li>
        </ul>
        <p className="mt-2">Data to fulfill legal obligations may be stored beyond account deletion, then securely deleted or anonymized.</p>
      </>
    ),
  },
  {
    title: 'Your Rights',
    content: (
      <>
        <p>Subject to local laws, you may:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Access, correct, or delete your data,</li>
          <li>Withdraw consent at any time (affects future processing),</li>
          <li>Object to or restrict certain processing,</li>
          <li>Request a portable copy of your data,</li>
          <li>Lodge a complaint with a supervisory authority.</li>
        </ul>
        <p className="mt-2">Requests can be sent to privacy@[platform].com; we respond within 30 days.</p>
      </>
    ),
  },
  {
    title: 'Children',
    content: 'The Services are not directed at children under 13 years. We do not knowingly collect their data. If we learn that a child’s data has been collected, we will delete it promptly.',
  },
  {
    title: 'International Transfers',
    content: 'If data is transferred outside your country, we ensure equivalent protection via standard contractual clauses or other lawful mechanisms.',
  },
  {
    title: 'Changes to This Policy',
    content: 'We may update this Privacy Policy to reflect changes in law or our practices. Material changes will be notified via email or an in-app banner. Continued use of the Services after an update constitutes acceptance.',
  },
  {
    title: 'Contact Us',
    content: (
      <>
        <p>For questions about this Privacy Policy or our privacy practices, email privacy@[platform].com or write to:</p>
        <p className="mt-2">Data Protection Officer, [Platform Name], [Company Address].</p>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    // Optional: Add analytics tracking or scroll behavior
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Head>
        <title>Privacy Policy | [Platform Name]</title>
        <meta name="description" content="Privacy Policy for [Platform Name] - Learn how we collect, use, share, and protect your personal information." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mt-1">Last updated: May 29, 2025</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-8">
            <a href="/" className="text-blue-600 hover:underline">Home</a> &gt; <span className="text-gray-500">Privacy Policy</span>
          </nav>

          {/* Policy Sections */}
          <div className="space-y-12">
            {privacyPolicy.map((section, index) => (
              <section key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {index + 1}. {section.title}
                </h2>
                <div className="text-gray-600 leading-relaxed">{section.content}</div>
              </section>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>Contact us at <a href="mailto:privacy@[platform].com" className="underline hover:text-gray-300">privacy@gegosoft.com</a></p>
            <p className="mt-2">&copy; 2025 gegosoft. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}