import React from 'react';
import { SignInButton } from '@clerk/clerk-react';
import {
  Wallet,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Real-Time Cash Flow',
      description:
        'Live calculation of total balance, dynamic income, and categorized expenses updated instantly with every transaction.',
    },
    {
      icon: PieChart,
      title: 'Categorized Breakdown',
      description:
        'Interactive donut charts and distribution visualizers clearly uncover where your money flows every month.',
    },
    {
      icon: ShieldCheck,
      title: 'Clerk-Powered Security',
      description:
        'Protected by enterprise-tier session tokens and secure per-user database tenancy ensuring strict privacy.',
    },
    {
      icon: Zap,
      title: 'Instant Filter & Search',
      description:
        'Rapidly filter transactions by type, category, or keyword without sluggish page reloads.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-slate-900 selection:text-white">
      {/* Top Navbar */}
      <nav className="w-full bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Wallet className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Finance<span className="text-indigo-600">Tracker</span>
            </span>
          </div>

          <div>
            <SignInButton mode="modal">
              <button className="inline-flex items-center justify-center text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-lg transition-colors">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
            Fintech-Grade Personal Accounting
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Smart, Simple <br className="hidden sm:block" />
            Financial Tracking
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Take complete control of your cash flow. Track income, monitor expenses,
            and gain clear visibility into your financial health with modern, minimalist tools.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all duration-150 hover:shadow">
                <span>Start Tracking Free</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </button>
            </SignInButton>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-4 text-slate-700">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          Personal Finance Tracker &bull; Designed with clean Fintech SaaS principles
        </div>
      </footer>
    </div>
  );
}

