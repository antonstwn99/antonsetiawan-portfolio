import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import antonLogo from '../assets/anton/anton-logo.png';

const Admin = () => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State untuk navigasi CMS
  const [activeTab, setActiveTab] = useState('projects');
  const tabs = ['projects', 'experience', 'achievements', 'skills', 'education', 'partners'];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Email atau password salah.');
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // =========================================================================
  // TAMPILAN 1: HALAMAN LOGIN PREMIUM
  // =========================================================================
  if (!session) {
    return (
      <div className="min-h-screen bg-[#05070D] flex items-center justify-center p-6 font-body selection:bg-[#143DED] selection:text-white relative overflow-hidden">
        {/* Latar Belakang Hologram */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#143DED]/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-md bg-white/[0.02] border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative z-10">
          <div className="flex justify-center mb-8">
            <img 
              src={antonLogo} 
              alt="Anton Logo" 
              className="w-16 h-16 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(20,61,237,0.3)] object-cover" 
            />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight text-center">
            System Access
          </h2>
          <p className="text-white/50 text-sm mb-8 text-center">
            Secure authentication required.
          </p>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium px-4 py-3 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="relative">
              <input 
                type="email" 
                placeholder="Admin Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#05070D]/50 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-[#143DED] transition-colors text-sm"
                required
              />
            </div>
            <div className="relative">
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#05070D]/50 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-[#143DED] transition-colors text-sm"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#143DED] text-white font-bold py-4 rounded-xl hover:bg-white hover:text-[#05070D] transition-all mt-2 disabled:opacity-50 text-sm shadow-[0_0_20px_rgba(20,61,237,0.4)]"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TAMPILAN 2: DASHBOARD CMS
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#05070D] text-white flex flex-col md:flex-row font-body selection:bg-[#143DED] selection:text-white">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-[#05070D]/50 backdrop-blur-xl flex flex-col md:h-screen sticky top-0 z-20">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <img src={antonLogo} alt="Logo" className="w-10 h-10 rounded-xl border border-white/10 object-cover" />
            <div>
              <h1 className="font-heading font-bold text-lg leading-tight">Admin CMS</h1>
              <p className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Online</p>
            </div>
          </div>
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible hide-scrollbar pb-2 md:pb-0">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-4 py-3 rounded-xl transition-all text-sm font-medium capitalize whitespace-nowrap shrink-0 outline-none ${
                  activeTab === tab 
                  ? 'bg-[#143DED] text-white shadow-[0_0_15px_rgba(20,61,237,0.4)]' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6 border-t border-white/10 mt-auto hidden md:block">
          <button onClick={handleLogout} className="flex items-center gap-3 text-white/50 hover:text-red-400 transition-colors w-full px-2 py-2 text-sm font-medium outline-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Secure Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
         <div className="flex justify-between items-end mb-10 pb-6 border-b border-white/10">
            <div>
              <p className="text-[#143DED] text-[10px] font-bold uppercase tracking-widest mb-1">Database Management</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold capitalize">{activeTab}</h2>
            </div>
            <button className="bg-white text-[#05070D] hover:bg-[#143DED] hover:text-white transition-colors px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 outline-none shadow-lg">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 <line x1="12" y1="5" x2="12" y2="19"></line>
                 <line x1="5" y1="12" x2="19" y2="12"></line>
               </svg>
               <span className="hidden sm:block">Add New Data</span>
               <span className="sm:hidden">Add</span>
            </button>
         </div>

         {/* KOTAK KOSONG (Placeholder Data) */}
         <div className="border border-white/10 border-dashed rounded-3xl bg-white/[0.01] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full border border-white/10 bg-[#05070D] flex items-center justify-center mx-auto mb-6 shadow-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl mb-2">No Data Found</h3>
            <p className="text-white/50 text-sm max-w-md mx-auto">
              Tabel <span className="capitalize text-white font-bold">"{activeTab}"</span> di database Supabase Anda saat ini masih kosong. Silakan klik tombol "Add New Data" di atas untuk mulai mengisi portofolio.
            </p>
         </div>
      </main>
    </div>
  );
};

export default Admin;