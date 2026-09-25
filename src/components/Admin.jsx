import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import antonLogo from '../assets/anton/anton-logo.png';

const Admin = () => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State CMS Core
  const [activeTab, setActiveTab] = useState('projects');
  const tabs = ['projects', 'experience', 'achievements', 'skills', 'education', 'partners'];
  
  // State Data & Modal
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State (Fokus ke Projects)
  const [formData, setFormData] = useState({
    title: '', category: '', year: '', tools: '', description: '', link: '', featured: false
  });

  // 1. Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Data dari Supabase (Otomatis jalan saat tab berubah atau setelah insert)
  useEffect(() => {
    if (session) fetchItems();
  }, [activeTab, session]);

  const fetchItems = async () => {
    setFetching(true);
    const { data, error } = await supabase.from(activeTab).select('*').order('id', { ascending: false });
    if (!error && data) setItems(data);
    setFetching(false);
  };

  // 3. Handle Submit (Create Data)
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Logika khusus tabel Projects: Ubah teks koma menjadi Array untuk database
    let payload = { ...formData };
    if (activeTab === 'projects') {
      payload.category = formData.category.split(',').map(item => item.trim()).filter(Boolean);
      payload.tools = formData.tools.split(',').map(item => item.trim()).filter(Boolean);
    }

    const { error } = await supabase.from(activeTab).insert([payload]);
    
    setIsSubmitting(false);
    if (!error) {
      setIsModalOpen(false);
      setFormData({ title: '', category: '', year: '', tools: '', description: '', link: '', featured: false });
      fetchItems(); // Refresh data setelah berhasil simpan
    } else {
      alert('Gagal menyimpan data: ' + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Email atau password salah.');
    setLoading(false);
  };

  const handleLogout = async () => await supabase.auth.signOut();

  // TAMPILAN 1: HALAMAN LOGIN PREMIUM
  if (!session) {
    return (
      <div className="min-h-screen bg-[#05070D] flex items-center justify-center p-6 font-body selection:bg-[#143DED] selection:text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#143DED]/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none"></div>
        <div className="w-full max-w-md bg-white/[0.02] border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative z-10">
          <div className="flex justify-center mb-8">
            <img src={antonLogo} alt="Anton Logo" className="w-16 h-16 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(20,61,237,0.3)] object-cover" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight text-center">System Access</h2>
          <p className="text-white/50 text-sm mb-8 text-center">Secure authentication required.</p>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium px-4 py-3 rounded-xl mb-6 text-center">{error}</div>}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#05070D]/50 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-[#143DED] transition-colors text-sm" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#05070D]/50 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-[#143DED] transition-colors text-sm" required />
            <button type="submit" disabled={loading} className="w-full bg-[#143DED] text-white font-bold py-4 rounded-xl hover:bg-white hover:text-[#05070D] transition-all mt-2 disabled:opacity-50 text-sm shadow-[0_0_20px_rgba(20,61,237,0.4)]">
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // TAMPILAN 2: DASHBOARD CMS
  return (
    <div className="min-h-screen bg-[#05070D] text-white flex flex-col md:flex-row font-body selection:bg-[#143DED] selection:text-white">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-[#05070D]/50 backdrop-blur-xl flex flex-col md:h-screen sticky top-0 z-20">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between md:justify-start gap-4 mb-4 md:mb-8">
            <div className="flex items-center gap-3">
              <img src={antonLogo} alt="Logo" className="w-10 h-10 rounded-xl border border-white/10 object-cover" />
              <div>
                <h1 className="font-heading font-bold text-lg leading-tight">Admin CMS</h1>
                <p className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Online</p>
              </div>
            </div>
            <button onClick={handleLogout} className="md:hidden border border-white/20 p-2 rounded-lg text-white/50 hover:text-red-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible hide-scrollbar pb-2 md:pb-0">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-4 py-2.5 md:py-3 rounded-xl transition-all text-xs md:text-sm font-medium capitalize whitespace-nowrap shrink-0 outline-none ${
                  activeTab === tab ? 'bg-[#143DED] text-white shadow-[0_0_15px_rgba(20,61,237,0.4)]' : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6 border-t border-white/10 mt-auto hidden md:block">
          <button onClick={handleLogout} className="flex items-center gap-3 text-white/50 hover:text-red-400 transition-colors w-full px-2 py-2 text-sm font-medium outline-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Secure Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto">
         <div className="flex justify-between items-end mb-8 pb-4 md:pb-6 border-b border-white/10">
            <div>
              <p className="text-[#143DED] text-[10px] font-bold uppercase tracking-widest mb-1">Database Management</p>
              <h2 className="text-2xl md:text-4xl font-heading font-bold capitalize">{activeTab}</h2>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-[#05070D] hover:bg-[#143DED] hover:text-white transition-colors px-4 py-2.5 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 outline-none shadow-lg shrink-0"
            >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
               <span className="hidden sm:block">Add New Data</span>
               <span className="sm:hidden">Add</span>
            </button>
         </div>

         {/* RENDER DATA ATAU EMPTY STATE */}
         {fetching ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-2 border-[#143DED] border-t-transparent rounded-full animate-spin"></div>
            </div>
         ) : items.length === 0 ? (
            <div className="border border-white/10 border-dashed rounded-3xl bg-white/[0.01] p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px]">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/10 bg-[#05070D] flex items-center justify-center mx-auto mb-6 shadow-xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </div>
              <h3 className="text-white font-bold text-lg md:text-xl mb-2">No Data Found</h3>
              <p className="text-white/50 text-xs md:text-sm max-w-md mx-auto">
                Tabel <span className="capitalize text-white font-bold">"{activeTab}"</span> masih kosong. Klik tombol Add di atas untuk mengisi.
              </p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {items.map((item) => (
                <div key={item.id} className="p-5 md:p-6 border border-white/10 rounded-2xl bg-white/[0.02] hover:border-[#143DED]/50 transition-all group flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-bold text-base md:text-lg mb-1 leading-tight">{item.title || item.name || item.degree || 'Untitled'}</h3>
                    <p className="text-[10px] text-white/50 mb-4">{item.year || item.created_at?.split('T')[0]}</p>
                    {item.description && <p className="text-xs text-white/70 line-clamp-3 mb-4">{item.description}</p>}
                  </div>
                  <div className="flex gap-2 border-t border-white/5 pt-4 mt-auto">
                     <button className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-md hover:bg-cyan-400/20 w-full transition-colors">Edit</button>
                     <button className="text-[10px] font-bold text-red-400 bg-red-400/10 px-3 py-1.5 rounded-md hover:bg-red-400/20 w-full transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
         )}
      </main>

      {/* MODAL FORM (Tampil di atas segalanya) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070D]/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#080D18] border border-white/10 w-full max-w-2xl rounded-3xl p-6 md:p-8 my-auto shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors outline-none"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
            
            <h2 className="text-xl md:text-2xl font-bold mb-6 font-heading">Add New {activeTab}</h2>
            
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {activeTab === 'projects' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold ml-1">Project Title</label>
                      <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-[#05070D] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#143DED] outline-none" placeholder="Misal: Stokin Aja" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold ml-1">Year</label>
                      <input type="text" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="bg-[#05070D] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#143DED] outline-none" placeholder="Misal: 2026" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold ml-1">Category (Pisahkan dengan koma)</label>
                    <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-[#05070D] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#143DED] outline-none" placeholder="Misal: Desain Grafis, Digital Branding" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold ml-1">Tools / Tech Stack (Pisahkan dengan koma)</label>
                    <input type="text" required value={formData.tools} onChange={e => setFormData({...formData, tools: e.target.value})} className="bg-[#05070D] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#143DED] outline-none" placeholder="Misal: React Vite, Tailwind CSS, Figma" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold ml-1">Description</label>
                    <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="4" className="bg-[#05070D] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#143DED] outline-none resize-none" placeholder="Tuliskan detail case study project ini..."></textarea>
                  </div>
                  <div className="flex items-center gap-3 bg-[#05070D] border border-white/10 rounded-xl px-4 py-3 cursor-pointer" onClick={() => setFormData({...formData, featured: !formData.featured})}>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${formData.featured ? 'bg-[#143DED] border-[#143DED]' : 'border-white/20'}`}>
                      {formData.featured && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                    <span className="text-sm">Jadikan Proyek Unggulan (Featured)</span>
                  </div>
                </>
              ) : (
                <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-xl text-sm text-center">
                  Formulir untuk tabel <strong>{activeTab}</strong> belum diaktifkan dalam pembaruan ini.
                </div>
              )}

              <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl transition-colors text-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting || activeTab !== 'projects'} className="flex-1 bg-[#143DED] text-white font-bold py-3.5 rounded-xl hover:bg-white hover:text-[#05070D] transition-all disabled:opacity-50 text-sm shadow-lg">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;