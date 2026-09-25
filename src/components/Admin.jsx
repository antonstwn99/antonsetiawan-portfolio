import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import antonLogo from '../assets/anton/anton-logo.png';

const Admin = () => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Tab Navigation (Ditambah settings dan capabilities)
  const [activeTab, setActiveTab] = useState('projects');
  const tabs = ['projects', 'experience', 'education', 'achievements', 'skills', 'partners', 'capabilities', 'settings'];
  
  // State Data CRUD
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({});
  const [fetching, setFetching] = useState(false);
  
  // State Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null); // File upload state

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      if (activeTab === 'settings') {
        fetchSettings();
      } else {
        fetchItems();
      }
    }
  }, [activeTab, session]);

  // ==========================================
  // FETCH DATA
  // ==========================================
  const fetchItems = async () => {
    setFetching(true);
    const { data, error } = await supabase.from(activeTab).select('*').order('id', { ascending: false });
    if (!error && data) setItems(data);
    setFetching(false);
  };

  const fetchSettings = async () => {
    setFetching(true);
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (!error && data) {
      setSettings({
        ...data,
        hard_skills: data.hard_skills ? data.hard_skills.join(', ') : '',
        soft_skills: data.soft_skills ? data.soft_skills.join(', ') : ''
      });
    }
    setFetching(false);
  };

  // ==========================================
  // UPLOAD GAMBAR KE SUPABASE STORAGE
  // ==========================================
  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${activeTab}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('portfolio-assets').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // ==========================================
  // CREATE & UPDATE (SAVE DATA)
  // ==========================================
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let payload = { ...formData };

      // 1. Tangani Upload Gambar jika ada file baru yang dipilih
      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        if (activeTab === 'projects') payload.image = imageUrl;
        else payload.logo = imageUrl;
      }

      // 2. Tangani Array/Koma untuk tabel tertentu
      if (activeTab === 'projects') {
        if (payload.category && typeof payload.category === 'string') 
          payload.category = payload.category.split(',').map(item => item.trim()).filter(Boolean);
        if (payload.tools && typeof payload.tools === 'string') 
          payload.tools = payload.tools.split(',').map(item => item.trim()).filter(Boolean);
      }

      // 3. Eksekusi Insert atau Update
      let errorObj;
      if (isEditing) {
        const { error } = await supabase.from(activeTab).update(payload).eq('id', editId);
        errorObj = error;
      } else {
        const { error } = await supabase.from(activeTab).insert([payload]);
        errorObj = error;
      }

      if (errorObj) throw errorObj;

      setIsModalOpen(false);
      resetForm();
      fetchItems();
    } catch (err) {
      alert('Gagal menyimpan data: ' + err.message);
    }
    setIsSubmitting(false);
  };

  // ==========================================
  // SAVE SETTINGS (Khusus Tab Settings)
  // ==========================================
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let payload = { ...settings };
      payload.hard_skills = payload.hard_skills.split(',').map(item => item.trim()).filter(Boolean);
      payload.soft_skills = payload.soft_skills.split(',').map(item => item.trim()).filter(Boolean);

      const { error } = await supabase.from('site_settings').update(payload).eq('id', 1);
      if (error) throw error;
      alert('Pengaturan Website berhasil diperbarui!');
    } catch (err) {
      alert('Gagal menyimpan pengaturan: ' + err.message);
    }
    setIsSubmitting(false);
  };

  // ==========================================
  // DELETE & EDIT HANDLERS
  // ==========================================
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    const { error } = await supabase.from(activeTab).delete().eq('id', id);
    if (!error) fetchItems();
    else alert('Gagal menghapus: ' + error.message);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setImageFile(null); // Reset input file
    
    // Ubah format Array kembali menjadi String Koma agar bisa diedit di input teks
    const formValues = { ...item };
    if (activeTab === 'projects') {
      if (Array.isArray(formValues.category)) formValues.category = formValues.category.join(', ');
      if (Array.isArray(formValues.tools)) formValues.tools = formValues.tools.join(', ');
    }
    
    setFormData(formValues);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({});
    setImageFile(null);
    setIsEditing(false);
    setEditId(null);
  };

  // ==========================================
  // AUTHENTICATION HANDLERS
  // ==========================================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Email atau password salah.');
    setLoading(false);
  };

  // LOGIN SCREEN
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

  // DASHBOARD LAYOUT
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
            <button onClick={() => supabase.auth.signOut()} className="md:hidden border border-white/20 p-2 rounded-lg text-white/50 hover:text-red-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
          <nav className="flex md:flex-col gap-2 overflow-x-auto hide-scrollbar">
            {tabs.map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); resetForm(); }} className={`text-left px-4 py-2.5 rounded-xl capitalize text-sm shrink-0 outline-none ${activeTab === tab ? 'bg-[#143DED]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>{tab}</button>
            ))}
          </nav>
          <div className="mt-auto pt-6 hidden md:block border-t border-white/10 mt-6">
            <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-3 text-white/50 hover:text-red-400 w-full px-2 py-2 text-sm font-medium outline-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Secure Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto">
         <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
            <div>
              <p className="text-[#143DED] text-[10px] font-bold uppercase tracking-widest">
                {activeTab === 'settings' ? 'Global Configuration' : 'Database Management'}
              </p>
              <h2 className="text-3xl font-bold capitalize">{activeTab}</h2>
            </div>
            {activeTab !== 'settings' && (
              <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#143DED] hover:bg-white hover:text-black px-6 py-3 rounded-full text-sm font-bold transition-colors">
                 + Add New
              </button>
            )}
         </div>

         {fetching ? (
            <div className="flex justify-center p-20"><div className="w-8 h-8 border-2 border-[#143DED] border-t-transparent rounded-full animate-spin"></div></div>
         ) : activeTab === 'settings' ? (
            // ==============================================================
            // PANEL SETTINGS (HERO, ABOUT, KONTAK)
            // ==============================================================
            <form onSubmit={handleSaveSettings} className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-10 max-w-4xl mx-auto flex flex-col gap-6">
               <div>
                  <h3 className="text-lg font-bold mb-4 text-[#143DED]">Hero Section</h3>
                  <div className="flex flex-col gap-4">
                     <input type="text" placeholder="Hero Name (e.g., Anton Setiawan)" required value={settings.hero_name || ''} onChange={e => setSettings({...settings, hero_name: e.target.value})} className="w-full bg-[#05070D] border border-white/10 p-4 rounded-xl text-sm" />
                     <textarea placeholder="Hero Description" required rows="3" value={settings.hero_desc || ''} onChange={e => setSettings({...settings, hero_desc: e.target.value})} className="w-full bg-[#05070D] border border-white/10 p-4 rounded-xl text-sm resize-none"></textarea>
                  </div>
               </div>
               <div className="border-t border-white/5 pt-6">
                  <h3 className="text-lg font-bold mb-4 text-[#143DED]">About Me & Skills</h3>
                  <div className="flex flex-col gap-4">
                     <textarea placeholder="About Description" required rows="4" value={settings.about_desc || ''} onChange={e => setSettings({...settings, about_desc: e.target.value})} className="w-full bg-[#05070D] border border-white/10 p-4 rounded-xl text-sm resize-none"></textarea>
                     <input type="text" placeholder="Hard Skills (Pisahkan dengan koma)" required value={settings.hard_skills || ''} onChange={e => setSettings({...settings, hard_skills: e.target.value})} className="w-full bg-[#05070D] border border-white/10 p-4 rounded-xl text-sm" />
                     <input type="text" placeholder="Soft Skills (Pisahkan dengan koma)" required value={settings.soft_skills || ''} onChange={e => setSettings({...settings, soft_skills: e.target.value})} className="w-full bg-[#05070D] border border-white/10 p-4 rounded-xl text-sm" />
                  </div>
               </div>
               <div className="border-t border-white/5 pt-6">
                  <h3 className="text-lg font-bold mb-4 text-[#143DED]">Contact Links</h3>
                  <div className="flex flex-col md:flex-row gap-4">
                     <input type="email" placeholder="Email Address" required value={settings.email || ''} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full bg-[#05070D] border border-white/10 p-4 rounded-xl text-sm" />
                     <input type="text" placeholder="WhatsApp (https://wa.me/...)" required value={settings.whatsapp || ''} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="w-full bg-[#05070D] border border-white/10 p-4 rounded-xl text-sm" />
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 mt-4">
                     <input type="url" placeholder="Instagram URL" required value={settings.instagram || ''} onChange={e => setSettings({...settings, instagram: e.target.value})} className="w-full bg-[#05070D] border border-white/10 p-4 rounded-xl text-sm" />
                     <input type="url" placeholder="LinkedIn URL" required value={settings.linkedin || ''} onChange={e => setSettings({...settings, linkedin: e.target.value})} className="w-full bg-[#05070D] border border-white/10 p-4 rounded-xl text-sm" />
                  </div>
               </div>
               <button type="submit" disabled={isSubmitting} className="mt-6 bg-[#143DED] font-bold py-4 rounded-xl hover:bg-white hover:text-black transition-colors">
                  {isSubmitting ? 'Menyimpan...' : 'Save Settings'}
               </button>
            </form>
         ) : items.length === 0 ? (
            <div className="border border-white/10 border-dashed rounded-3xl p-12 text-center text-white/50">Tidak ada data. Klik "Add New" untuk menambah.</div>
         ) : (
            // ==============================================================
            // RENDER KARTU DATA (CRUD LIST)
            // ==============================================================
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="p-5 border border-white/10 rounded-2xl bg-white/[0.02] flex flex-col h-full">
                  
                  {/* Thumbnail Preview jika ada gambar/logo */}
                  {(item.image || item.logo) && (
                    <div className="w-full h-32 bg-[#05070D] rounded-xl mb-4 overflow-hidden border border-white/5 relative flex items-center justify-center">
                       <img src={item.image || item.logo} alt="Thumbnail" className="w-full h-full object-cover opacity-60" />
                    </div>
                  )}

                  <h3 className="font-bold mb-1 truncate">{item.title || item.name || item.degree || item.subject || item.label || 'Untitled'}</h3>
                  <p className="text-[10px] text-white/50 mb-3">{item.year || item.score || item.role || item.issuer || item.icon}</p>
                  
                  <div className="flex gap-2 border-t border-white/5 pt-3 mt-auto">
                     <button onClick={() => handleEdit(item)} className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded w-full hover:bg-cyan-400/20">Edit</button>
                     <button onClick={() => handleDelete(item.id)} className="text-[10px] font-bold text-red-400 bg-red-400/10 px-3 py-1.5 rounded w-full hover:bg-red-400/20">Delete</button>
                  </div>
                </div>
              ))}
            </div>
         )}
      </main>

      {/* ==============================================================
          MODAL FORM (CREATE & EDIT)
          ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070D]/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#080D18] border border-white/10 w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl relative my-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-400">X</button>
            <h2 className="text-xl font-bold mb-6 capitalize">{isEditing ? 'Edit' : 'Add New'} {activeTab}</h2>
            
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              
              {/* === PROJECTS === */}
              {activeTab === 'projects' && (
                <>
                  <input type="text" placeholder="Title" required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <input type="text" placeholder="Year" required value={formData.year || ''} onChange={e => setFormData({...formData, year: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  
                  {/* Dropdown Kategori Baru */}
                  <select required value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm text-white outline-none">
                     <option value="" disabled>Pilih Kategori Utama</option>
                     <option value="Website">Website</option>
                     <option value="Aplikasi">Aplikasi</option>
                     <option value="Digital Branding">Digital Branding</option>
                     <option value="Desain Grafis">Desain Grafis</option>
                     <option value="Video Pendek">Video Pendek</option>
                     <option value="Animasi & 3D">Animasi & 3D</option>
                     <option value="Game 2D">Game 2D</option>
                  </select>

                  <input type="text" placeholder="Tools (Pisahkan dgn koma)" required value={formData.tools || ''} onChange={e => setFormData({...formData, tools: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <textarea placeholder="Description" required rows="3" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm"></textarea>
                  <input type="url" placeholder="Project URL Link (Opsional)" value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <div className="flex flex-col gap-1">
                     <label className="text-[10px] uppercase text-white/50 font-bold">Cover Image (Rekomendasi 16:9)</label>
                     <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-xs text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#143DED]/20 file:text-[#143DED] hover:file:bg-[#143DED]/30" />
                  </div>
                  <div className="flex items-center gap-3 bg-[#05070D] border border-white/10 p-3 rounded-xl cursor-pointer" onClick={() => setFormData({...formData, featured: !formData.featured})}>
                    <input type="checkbox" checked={formData.featured || false} readOnly className="accent-[#143DED]" /> <span className="text-sm">Jadikan Proyek Unggulan (Featured)</span>
                  </div>
                </>
              )}

              {/* === EXPERIENCE === */}
              {activeTab === 'experience' && (
                <>
                  <input type="text" placeholder="Year (Misal: 2026 - Now)" required value={formData.year || ''} onChange={e => setFormData({...formData, year: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <input type="text" placeholder="Job Title / Company" required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <input type="text" placeholder="Role (Misal: CEO)" required value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <textarea placeholder="Description" required rows="3" value={formData.desc || ''} onChange={e => setFormData({...formData, desc: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm"></textarea>
                  <div className="flex flex-col gap-1">
                     <label className="text-[10px] uppercase text-white/50 font-bold">Company Logo (Opsional, 1:1 Square)</label>
                     <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-xs text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#143DED]/20 file:text-[#143DED]" />
                  </div>
                </>
              )}

              {/* === EDUCATION === */}
              {activeTab === 'education' && (
                <>
                  <input type="text" placeholder="Year" required value={formData.year || ''} onChange={e => setFormData({...formData, year: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <input type="text" placeholder="Degree (Misal: D4 Teknologi Rekayasa Multimedia)" required value={formData.degree || ''} onChange={e => setFormData({...formData, degree: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <input type="text" placeholder="Institution" required value={formData.institution || ''} onChange={e => setFormData({...formData, institution: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <input type="text" placeholder="GPA (Misal: 3.92)" required value={formData.gpa || ''} onChange={e => setFormData({...formData, gpa: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <textarea placeholder="Description" required rows="3" value={formData.desc || ''} onChange={e => setFormData({...formData, desc: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm"></textarea>
                  <div className="flex flex-col gap-1">
                     <label className="text-[10px] uppercase text-white/50 font-bold">University Logo (Opsional, 1:1 Square)</label>
                     <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-xs text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#143DED]/20 file:text-[#143DED]" />
                  </div>
                </>
              )}

              {/* === ACHIEVEMENTS === */}
              {activeTab === 'achievements' && (
                <>
                  <input type="text" placeholder="Year" required value={formData.year || ''} onChange={e => setFormData({...formData, year: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <input type="text" placeholder="Title" required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <input type="text" placeholder="Issuer (Penyelenggara)" required value={formData.issuer || ''} onChange={e => setFormData({...formData, issuer: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <select required value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm text-white outline-none">
                     <option value="" disabled>Pilih Jenis</option>
                     <option value="Achievement">Achievement (Penghargaan)</option>
                     <option value="Certification">Certification (Sertifikasi)</option>
                  </select>
                </>
              )}

              {/* === SKILLS === */}
              {activeTab === 'skills' && (
                <>
                  <input type="text" placeholder="Subject (Misal: UI/UX Design)" required value={formData.subject || ''} onChange={e => setFormData({...formData, subject: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <input type="number" placeholder="Score (0-100)" required min="0" max="100" value={formData.score || ''} onChange={e => setFormData({...formData, score: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                </>
              )}

              {/* === PARTNERS === */}
              {activeTab === 'partners' && (
                <>
                  <input type="text" placeholder="Partner Name" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <div className="flex flex-col gap-1">
                     <label className="text-[10px] uppercase text-white/50 font-bold">Partner Logo (Opsional, 1:1 Square - Putih / Transparan)</label>
                     <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-xs text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#143DED]/20 file:text-[#143DED]" />
                  </div>
                </>
              )}

              {/* === CAPABILITIES === */}
              {activeTab === 'capabilities' && (
                <>
                  <textarea placeholder="Label (Gunakan enter / \n untuk baris baru)" required rows="2" value={formData.label || ''} onChange={e => setFormData({...formData, label: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm resize-none"></textarea>
                  <input type="text" placeholder="Lucide Icon Name (e.g., Code2, PenTool, Video)" required value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} className="bg-[#05070D] border border-white/10 p-3 rounded-xl text-sm" />
                  <p className="text-[10px] text-white/50">Cari nama ikon di <a href="https://lucide.dev/icons" target="_blank" className="text-[#143DED] hover:underline">Lucide Icons</a></p>
                </>
              )}

              <button type="submit" disabled={isSubmitting} className="w-full bg-[#143DED] font-bold py-3.5 rounded-xl mt-4 hover:bg-white hover:text-black transition-colors shadow-[0_0_15px_rgba(20,61,237,0.4)]">
                {isSubmitting ? 'Memproses...' : 'Simpan Data'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;