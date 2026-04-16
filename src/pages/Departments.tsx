import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  Plus, 
  Users, 
  UserCircle2, 
  MoreVertical,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Department, Member } from '../types';

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headName: '',
    branch: 'Main Branch'
  });

  useEffect(() => {
    const q = query(collection(db, 'departments'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setDepartments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'departments'), {
        ...formData,
        memberCount: 0
      });
      setIsModalOpen(false);
      setFormData({ name: '', description: '', headName: '', branch: 'Main Branch' });
    } catch (err) {
      console.error("Error adding department:", err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-app-text tracking-tight">Departments</h1>
          <p className="text-app-text-light font-medium">Manage church wings, units and departments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-primary px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 shadow-xl shadow-primary/10 transition-all active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          <span>New Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {loading ? (
          <p className="col-span-full text-center text-app-text-light py-12 font-bold uppercase tracking-widest text-[10px]">Loading departments...</p>
        ) : (
          departments.map(dept => (
            <div key={dept.id} className="bg-white rounded-3xl border border-app-border shadow-sm p-8 group hover:shadow-xl transition-all border-b-4 border-b-transparent hover:border-b-primary">
              <div className="flex items-center justify-between mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-primary transition-colors">
                  <LayoutGrid className="h-7 w-7 text-primary group-hover:text-white" />
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              
              <h3 className="text-xl font-extrabold text-app-text tracking-tight mb-2">{dept.name}</h3>
              <p className="text-app-text-light text-sm font-medium line-clamp-2 h-10 mb-8">{dept.description}</p>
              
              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Head of Dept</span>
                  <div className="flex items-center">
                    <UserCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm font-bold text-app-text">{dept.headName || 'Not Assigned'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Members</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-slate-300" />
                    <span className="text-sm font-extrabold text-app-text">{dept.memberCount || 0}</span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-8 py-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-extrabold uppercase tracking-widest text-app-text transition-all flex items-center justify-center group-hover:bg-primary group-hover:text-white">
                Manage Department
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-app-border overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-extrabold text-app-text tracking-tight">Create Department</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full"><X className="h-5 w-5 text-slate-300" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                  <label className="block text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-2 ml-1">Department Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border-app-border rounded-xl py-3 px-4 text-sm font-bold outline-none border focus:border-primary/50 transition-all" 
                    placeholder="e.g. Media Ministry"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-2 ml-1">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-50 border-app-border rounded-xl py-3 px-4 text-sm font-medium outline-none border focus:border-primary/50 transition-all resize-none h-24" 
                    placeholder="Describe the department's purpose..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-2 ml-1">Head Name</label>
                  <input 
                    value={formData.headName}
                    onChange={(e) => setFormData({...formData, headName: e.target.value})}
                    className="w-full bg-slate-50 border-app-border rounded-xl py-3 px-4 text-sm font-bold outline-none border focus:border-primary/50 transition-all" 
                    placeholder="Full name of leader"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-xl font-extrabold shadow-xl shadow-primary/10 hover:opacity-95 transition-all active:scale-[0.98] mt-4 uppercase tracking-widest text-xs"
                >
                  Save Department
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
