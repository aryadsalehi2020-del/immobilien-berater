import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Admin-Link nur für Superuser
  const adminItem = user?.is_superuser ? {
    to: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    label: 'Admin',
    isAdmin: true
  } : null;

  const navItems = [
    {
      to: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: 'Dashboard'
    },
    {
      to: '/analyze',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      label: 'Neue Analyse'
    },
    {
      to: '/library',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      label: 'Library'
    },
    {
      to: '/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: 'Mein Profil'
    },
    {
      to: '/tools',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      label: 'Profi-Tools'
    },
    {
      to: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Einstellungen'
    }
  ];

  // Sidebar content (shared between mobile and desktop)
  const SidebarContent = () => (
    <>
      {/* Animated Glow Orbs */}
      <div className="glow-orb w-32 h-32 bg-neon-blue/30 -top-16 -left-16" />
      <div className="glow-orb w-24 h-24 bg-neon-purple/20 bottom-20 -right-12" style={{ animationDelay: '2s' }} />

      {/* Logo */}
      <div className="p-4 md:p-6 border-b border-white/10 relative z-10">
        <NavLink to="/dashboard" className="block group">
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl md:text-3xl font-black">
              <span className="text-neon-blue text-3xl md:text-4xl text-glow-blue">A</span>
              <span className="text-white">mlak</span>
              <span className="text-neon-purple text-3xl md:text-4xl text-glow-purple">I</span>
            </h1>
            <span className="text-text-muted text-[10px] hidden md:inline">by Arya Salehi</span>
          </div>
          <p className="text-gradient-neon text-xs tracking-wide mt-1 font-semibold">
            Immobilien Intelligence
          </p>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 md:p-4 relative z-10 overflow-y-auto">
        <ul className="space-y-1 md:space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 md:py-3 rounded-xl transition-all duration-300 min-h-[44px] ${
                    isActive
                      ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-neon-blue font-bold border border-neon-blue/50 shadow-neon-blue'
                      : 'text-text-secondary hover:bg-white/5 hover:text-neon-blue hover:border-neon-blue/30 border border-transparent active:bg-white/10'
                  }`
                }
              >
                {item.icon}
                <span className="text-sm md:text-base">{item.label}</span>
              </NavLink>
            </li>
          ))}
          {/* Admin Link - nur für Superuser */}
          {adminItem && (
            <li>
              <NavLink
                to={adminItem.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 md:py-3 rounded-xl transition-all duration-300 min-h-[44px] ${
                    isActive
                      ? 'bg-gradient-to-r from-red-500/20 to-neon-purple/20 text-red-400 font-bold border border-red-500/50'
                      : 'text-red-400/70 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 border border-transparent active:bg-red-500/20'
                  }`
                }
              >
                {adminItem.icon}
                <span className="text-sm md:text-base">{adminItem.label}</span>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-3 md:p-4 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-3 px-3 md:px-4 py-3 glass-neon rounded-xl mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center text-white font-bold shadow-neon-blue flex-shrink-0">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {user?.username || 'User'}
            </p>
            <p className="text-text-secondary text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 md:py-3 border border-white/20 text-text-secondary hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 min-h-[44px] active:bg-red-500/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Abmelden</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass-card border-b border-neon-blue/20 px-4 py-3 flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-baseline gap-1">
          <span className="text-neon-blue text-2xl font-black text-glow-blue">A</span>
          <span className="text-white text-xl font-black">mlak</span>
          <span className="text-neon-purple text-2xl font-black text-glow-purple">I</span>
        </NavLink>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-11 h-11 flex items-center justify-center rounded-xl border border-white/20 text-white hover:border-neon-blue/50 hover:text-neon-blue transition-all active:bg-white/10"
          aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar (Slide-in) */}
      <div className={`
        md:hidden fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] glass-card border-r border-neon-blue/20
        flex flex-col z-50 transform transition-transform duration-300 ease-out overflow-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button for mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl border border-white/20 text-text-secondary hover:text-white hover:border-white/40 z-20"
          aria-label="Menü schließen"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar (Always visible) */}
      <div className="hidden md:flex w-64 glass-card border-r border-neon-blue/20 flex-col h-screen sticky top-0 relative overflow-hidden">
        <SidebarContent />
      </div>
    </>
  );
}

export default Sidebar;
