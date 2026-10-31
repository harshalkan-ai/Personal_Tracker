import React from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Wallet, Calendar } from 'lucide-react';

export default function Navbar() {
  const { user } = useUser();

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const displayName = user?.firstName || user?.username || 'there';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Wallet className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Finance<span className="text-indigo-600">Tracker</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                PRO
              </span>
            </div>
          </div>

          {/* Right: Date, Greeting, and User Profile */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="hidden md:flex items-center text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              <span>{formattedDate}</span>
            </div>

            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500">Welcome back,</p>
              <p className="text-sm font-semibold text-slate-800">{displayName}</p>
            </div>

            <div className="flex items-center pl-2 border-l border-slate-200">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9 border border-slate-200 shadow-sm',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

