import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Wallet, 
  TrendingUp,
  ArrowUpRight, 
  ArrowDownRight, 
  Download,
  Calendar as CalendarIcon,
  Search,
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FinanceRecord, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface FinanceProps {
  profile: UserProfile | null;
}

export default function Finance({ profile }: FinanceProps) {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    type: 'Tithe',
    amount: 0,
    memberName: '',
    paymentMethod: 'Cash',
    branch: 'Main Branch',
    period: format(new Date(), 'MMMM yyyy')
  });

  useEffect(() => {
    const q = query(collection(db, 'finance'), orderBy('date', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FinanceRecord));
      setRecords(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'finance'), {
        ...formData,
        date: new Date().toISOString()
      });
      setIsModalOpen(false);
      setFormData({
        type: 'Tithe', amount: 0, memberName: '', paymentMethod: 'Cash',
        branch: 'Main Branch', period: format(new Date(), 'MMMM yyyy')
      });
    } catch (error) {
      console.error("Error adding finance record:", error);
    }
  };

  const totalIncome = records.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-app-text tracking-tight">Church Treasury</h1>
          <p className="text-app-text-light font-medium">Track tithes, offerings, and donations.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-app-border px-4 py-2.5 rounded-xl text-sm font-bold text-app-text hover:bg-slate-50 transition-all shadow-sm">
            <Download className="h-4 w-4" />
            <span className="uppercase tracking-widest text-[10px]">Export</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-app-success px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 shadow-xl shadow-app-success/10 transition-all active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            <span>Record Income</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl border border-app-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-app-border flex items-center justify-between bg-slate-50/30">
            <h3 className="font-extrabold text-app-text text-sm uppercase tracking-widest">Recent Transactions</h3>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-slate-300" />
              <button className="text-[10px] font-extrabold text-primary hover:underline uppercase tracking-widest px-2 py-1">View All</button>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-app-text-light text-[10px] uppercase tracking-widest font-extrabold">
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {loading ? (
                   <tr><td colSpan={5} className="px-6 py-8 text-center text-app-text-light">Loading records...</td></tr>
                ) : records.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-app-text-light">No transactions recorded yet.</td></tr>
                ) : (
                  records.map(record => (
                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-app-text">{record.type}</p>
                          <p className="text-[10px] font-bold text-app-text-light uppercase tracking-wide">{record.memberName || 'General'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                          {record.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-primary text-sm">
                        ₵ {record.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-[11px] font-medium text-slate-400 font-mono">
                        {format(new Date(record.date), 'dd.MM HH:mm')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-app-success">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          <span className="text-[9px] font-extrabold uppercase tracking-widest">Verified</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-primary p-8 rounded-3xl shadow-2xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="relative z-10 text-white">
              <div className="flex items-center justify-between mb-8">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                  <Wallet className="h-6 w-6" />
                </div>
                <TrendingUp className="h-4 w-4 opacity-50" />
              </div>
              <p className="text-blue-100 text-[10px] font-extrabold uppercase tracking-widest">Church Balance</p>
              <h2 className="text-3xl font-extrabold mt-1 tracking-tight">₵ {totalIncome.toLocaleString()}</h2>
              <div className="mt-8">
                <span className="bg-app-success/20 text-emerald-300 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-app-success/20">Active Session</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-app-border shadow-sm">
            <h4 className="text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-6">Allocation</h4>
            <div className="space-y-5">
              {[
                { label: 'Tithe', color: 'bg-primary' },
                { label: 'Offering', color: 'bg-slate-300' },
                { label: 'Welfare', color: 'bg-secondary' }
              ].map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-2 w-2 rounded-full ${cat.color}`}></div>
                    <span className="text-xs font-bold text-app-text-light uppercase tracking-wide">{cat.label}</span>
                  </div>
                  <span className="text-xs font-extrabold text-app-text">{70 - i * 20}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 border border-app-border">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-extrabold text-app-text tracking-tight">Post Transaction</h2>
                  <p className="text-app-text-light text-[10px] font-bold uppercase tracking-widest mt-1">Direct Entry</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full"><X className="h-5 w-5 text-slate-300" /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6 text-app-text">
                <div>
                  <label className="block text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-2 ml-1">Member Reference</label>
                  <input 
                    value={formData.memberName}
                    onChange={(e) => setFormData({...formData, memberName: e.target.value})}
                    className="w-full bg-slate-50 border-app-border rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 border focus:border-primary/50 outline-none transition-all font-medium" 
                    placeholder="Enter name (optional)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-2 ml-1">Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-slate-50 border-app-border rounded-xl py-3 px-4 text-sm font-bold outline-none border focus:border-primary/50 transition-all cursor-pointer"
                    >
                      <option>Tithe</option>
                      <option>Offering</option>
                      <option>Donation</option>
                      <option>Welfare</option>
                      <option>Pledge</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-2 ml-1">Method</label>
                    <select 
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      className="w-full bg-slate-50 border-app-border rounded-xl py-3 px-4 text-sm font-bold outline-none border focus:border-primary/50 transition-all cursor-pointer"
                    >
                      <option>Cash</option>
                      <option>MoMo</option>
                      <option>Bank</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-2 ml-1">Amount (GHS)</label>
                  <input 
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    className="w-full bg-slate-50 border-app-border rounded-xl py-4 px-4 text-3xl font-extrabold text-primary focus:bg-white focus:ring-4 focus:ring-primary/5 border focus:border-primary/50 outline-none transition-all text-center" 
                    placeholder="0.00"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-xl font-extrabold shadow-xl shadow-primary/10 hover:opacity-95 transition-all active:scale-[0.98] mt-4 uppercase tracking-widest text-xs"
                >
                  Confirm Posting
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
