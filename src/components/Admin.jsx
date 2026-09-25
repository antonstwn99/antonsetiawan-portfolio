import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Admin = () => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cek status sesi saat komponen dimuat
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
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError('Email atau password salah.');
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // TAMPILAN 1: JIKA BELUM LOGIN (FORM LOGIN)
  if (!session) {
    return (
      <div className="min-h-screen bg-[#05070D] flex items-center justify-center p-6 font-body selection:bg-[#143DED] selection:text-white">
        <div className="w-full max-w-md bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="w-3 h-3 rounded-full bg-[#143DED] mb-6 animate-pulse"></div>
          <h2 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">Admin Access</h2>
          <p className="text-white/50 text-sm mb-8">Silakan login untuk mengakses sistem CMS.</p>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#05070D]/50 border border-white/10 text-white px-5 py-3.5 rounded-xl outline-none focus:border-[#143DED] transition-colors text-sm"
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#05070D]/50 border border-white/10 text-white px-5 py-3.5 rounded-xl outline-none focus:border-[#143DED] transition-colors text-sm"
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#143DED] text-white font-bold py-3.5 rounded-xl hover:bg-white hover:text-[#05070D] transition-all mt-4 disabled:opacity-50 text-sm"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // TAMPILAN 2: JIKA SUDAH LOGIN (DASHBOARD CMS)
  return (
    <div className="min-h-screen bg-[#05070D] text-white p-6 font-body">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-6 mt-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[#143DED]"></div>
             <h1 className="text-xl md:text-2xl font-bold font-heading">CMS Dashboard</h1>
          </div>
          <button 
            onClick={handleLogout} 
            className="border border-white/20 px-5 py-2 rounded-full text-xs font-bold hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-colors"
          >
            Logout Session
          </button>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Ini kotak dummy, nanti kita ubah jadi tabel manajer proyek betulan */}
          <div className="p-6 md:p-8 border border-white/10 rounded-2xl bg-white/[0.02] hover:border-[#143DED]/50 transition-colors">
             <h3 className="text-white font-bold text-lg mb-2">Projects Database</h3>
             <p className="text-sm text-white/50 mb-6">Kelola karya, kategori, dan deskripsi portofolio.</p>
             <button className="text-[10px] uppercase tracking-widest font-bold text-[#143DED] bg-[#143DED]/10 px-4 py-2 rounded-lg">Manage Data</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;