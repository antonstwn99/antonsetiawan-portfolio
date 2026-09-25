import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import antonLogo from '../assets/anton/anton-logo.png';

// Import data statis lama
import {
  PROJECT_DATABASE, EXPERIENCE_DATA, ACHIEVEMENTS_DATA,
  SKILL_METRICS, EDUCATION_DATA, PARTNERS_DATA
} from '../data/portfolioData';

const Admin = () => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('projects');
  const tabs = ['projects', 'experience', 'achievements', 'skills', 'education', 'partners'];
  
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchItems();
  }, [activeTab, session]);

  const fetchItems = async () => {
    setFetching(true);
    const { data, error } = await supabase.from(activeTab).select('*').order('id', { ascending: false });
    if (!error && data) setItems(data);
    setFetching(false);
  };

  // FUNGSI MIGRASI DENGAN PENANGANAN ERROR YANG BENAR
  const handleMigrateData = async () => {
    if (!window.confirm("PERINGATAN: Menyalin data lokal ke Supabase. Lanjutkan?")) return;
    
    setIsMigrating(true);
    try {
      let insertError = null;

      if (activeTab === 'projects') {
        const payload = PROJECT_DATABASE.map(p => ({
          title: p.title, category: Array.isArray(p.category) ? p.category : [p.category],
          year: p.year, featured: p.featured || false, tools: p.tools || [],
          description: p.description, image: p.image || null
        }));
        const { error } = await supabase.from('projects').insert(payload);
        insertError = error;
      } else if (activeTab === 'experience') {
        const { error } = await supabase.from('experience').insert(EXPERIENCE_DATA);
        insertError = error;
      } else if (activeTab === 'achievements') {
        const { error } = await supabase.from('achievements').insert(ACHIEVEMENTS_DATA);
        insertError = error;
      } else if (activeTab === 'skills') {
        const skillPayload = SKILL_METRICS.map(s => ({ subject: s.subject, score: s.A, full_mark: s.fullMark || 100 }));
        const { error } = await supabase.from('skills').insert(skillPayload);
        insertError = error;
      } else if (activeTab === 'education') {
        const { error } = await supabase.from('education').insert(EDUCATION_DATA);
        insertError = error;
      } else if (activeTab === 'partners') {
        const partnerPayload = PARTNERS_DATA.map(p => ({ name: p.name, logo: p.logo || null }));
        const { error } = await supabase.from('partners').insert(partnerPayload);
        insertError = error;
      }

      // Jika keamanan RLS memblokir, errornya akan muncul di sini
      if (insertError) throw insertError;

      alert(`Migrasi ${activeTab} sukses!`);
      fetchItems();
    } catch (err) {
      alert("GAGAL: Pastikan Anda sudah menjalankan SQL 'Admin Full Access'. Detail: " + err.message);
    }
    setIsMigrating(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let payload = { ...formData };
    
    if (activeTab === 'projects') {
      if(payload.category) payload.category = payload.category.split(',').map(item => item.trim()).filter(Boolean);
      if(payload.tools) payload.tools = payload.tools.split(',').map(item => item.trim()).filter(Boolean);
    }

    const { error } = await supabase.from(activeTab).insert([payload]);
    setIsSubmitting(false);
    
    if (!error) {
      setIsModalOpen(false);
      setFormData({});
      fetchItems();
    } else {
      alert('Gagal menyimpan: ' + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Email atau password salah.');
    setLoading(false);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#05070D] flex items-center justify-center p-6 font-body">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#143DED]/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="w-full max-w-md bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-2xl relative z-10">
          <img src={antonLogo} alt="Logo" className="w-16 h-16 rounded-2xl mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-8 text-center">System Access</h2>
          {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-xl mb-4 text-center text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#05070D]/50 border border-white/10 text-white p-4 rounded-xl outline-none" required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#05070D]/50 border border-white/10 text-white p-4 rounded-xl outline-none" required />
            <button type="submit" disabled={loading} className="w-full bg-[#143DED] text-white font-bold p-4 rounded-xl mt-2">{loading ? 'Loading...' : 'Login'}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070D] text-white flex flex-col md:flex-row font-body">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 border-b md:border-r border-white/10 bg-[#05070D]/50 backdrop-blur-xl flex flex-col sticky top-0 z-20 md:h-screen">
        <div className="p-4 md:p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img src={antonLogo} alt="Logo" className="w-10 h-10 rounded-xl border border-white/10" />
              <div>
                <h1 className="font-bold text-lg leading-tight">Admin CMS</h1>
                <p className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Online</p>
              </div>
            </div>
            
            {/* TOMBOL LOGOUT MOBILE (Dikembalikan!) */}
            <button onClick={() => supabase.auth.signOut()} className="md:hidden border border-white/20 p-2 rounded-lg text-white/50 hover:text-red-400 hover:border-red-500/30 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>

          <nav className="flex md:flex-col gap-2 overflow-x-auto hide-scrollbar">
            {tabs.map(tab => (
              <button key={tab} onClick={() => {setActiveTab(tab); setFormData({});}} className={`text-left px-4 py-2.5 rounded-xl capitalize text-sm shrink-0 outline-none ${activeTab === tab ? 'bg-[#143DED]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>{tab}</button>
            ))}
          </nav>

          {/* TOMBOL LOGOUT DESKTOP */}
          <div className="mt-auto pt-6 hidden md:block border-t border-white/10 mt-6">
            <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-3 text-white/50 hover:text-red-400 transition-colors w-full px-2 py-2 text-sm font-medium outline-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Secure Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto">
         <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
            <div>
              <p className="text-[#143DED] text-[10px] font-bold uppercase tracking-widest">Database</p>
              <h2 className="text-3xl font-bold capitalize">{activeTab}</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={handleMigrateData} disabled={isMigrating} className="bg-white/5 border border-white/20 hover:bg-white/10 px-4 py-2 rounded-full text-xs font-bold text-white transition-all flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                 {isMigrating ? 'Syncing...' : 'Sync Local Data'}
              </button>
              <button onClick={() => setIsModalOpen(true)} className="bg-[#143DED] hover:bg-white hover:text-black px-4 py-2 rounded-full text-xs font-bold transition-colors">
                 + Add New
              </button>
            </div>
         </div>

         {fetching ? (
            <div className="flex justify-center p-20"><div className="w-8 h-8 border-2 border-[#143DED] border-t-transparent rounded-full animate-spin"></div></div>
         ) : items.length === 0 ? (
            <div className="border border-white/10 border-dashed rounded-3xl p-12 text-center text-white/50">
              Kosong. Silakan klik "Sync Local Data" untuk menyalin data lama Anda otomatis.
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="p-5 border border-white/10 rounded-2xl bg-white/[0.02]">
                  <h3 className="font-bold mb-1 truncate">{item.title || item.name || item.degree || item.subject || 'Untitled'}</h3>
                  <p className="text-[10px] text-white/50 mb-3">{item.year || item.score || item.role}</p>
                  {item.description || item.desc ? <p className="text-xs text-white/70 line-clamp-2 mb-4">{item.description || item.desc}</p> : null}
                </div>
              ))}
            </div>
         )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070D]/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#080D18] border border-white/10 w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-400">X</button>
            <h2 className="text-xl font-bold mb-6 capitalize">Add New {activeTab}</h2>
            
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {activeTab === 'projects' && (
                <>
                  <input type="text" placeholder="Title" required onChange={e => setFormData({...formData, title: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <input type="text" placeholder="Year" required onChange={e => setFormData({...formData, year: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <input type="text" placeholder="Category (Pisahkan dgn koma)" required onChange={e => setFormData({...formData, category: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <input type="text" placeholder="Tools (Pisahkan dgn koma)" required onChange={e => setFormData({...formData, tools: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <textarea placeholder="Description" required onChange={e => setFormData({...formData, description: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm"></textarea>
                </>
              )}
              {activeTab === 'experience' && (
                <>
                  <input type="text" placeholder="Year (Misal: 2026 - Now)" required onChange={e => setFormData({...formData, year: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <input type="text" placeholder="Job Title / Company" required onChange={e => setFormData({...formData, title: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <input type="text" placeholder="Role (Misal: CEO & Founder)" required onChange={e => setFormData({...formData, role: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <textarea placeholder="Description" required onChange={e => setFormData({...formData, desc: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm"></textarea>
                </>
              )}
              {!['projects', 'experience'].includes(activeTab) && (
                 <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm text-center text-white/50">Form untuk {activeTab} sedang dimatikan untuk pengujian.</div>
              )}
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#143DED] font-bold py-3.5 rounded-xl mt-4">{isSubmitting ? 'Menyimpan...' : 'Simpan Data'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;