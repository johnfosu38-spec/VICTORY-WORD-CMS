import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  X, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, addDoc, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ExpenseRecord } from '../types';
import { format } from 'date-fns';

export default function Expenses() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    category: 'Voucher',
    amount: 0,
    status: 'Pending' as const,
    branch: 'Main Branch'
  });

  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('date', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snap) => {
      setExpenses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExpenseRecord)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'expenses'), {
        ...formData,
        date: new Date().toISOString()
      });
      setIsModalOpen(false);
      setFormData({
        description: '', category: 'Voucher', amount: 0, status: 'Pending', branch: 'Main Branch'
      });
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-app-text tracking-tight">Expenditures</h1>
          <p className="text-app-text-light font-medium">Manage church operational costs and vouchers.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-app-border px-4 py-2.5 rounded-xl text-sm font-bold text-app-text hover:bg-slate-50 transition-all shadow-sm">
            <Download className="h-4 w-4" />
            <span className="uppercase tracking-widest text-[10px]">Export Statement</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-rose-500 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 shadow-xl shadow-rose-500/10 transition-all active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            <span>Add Voucher</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl border border-app-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-app-border flex items-center justify-between bg-slate-50/30">
            <h3 className="font-extrabold text-app-text text-sm uppercase tracking-widest">Expense Ledger</h3>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-slate-300" />
              <button className="text-[10px] font-extrabold text-primary hover:underline uppercase tracking-widest px-2 py-1">Filter Records</button>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-app-text-light text-[10px] uppercase tracking-widest font-extrabold">
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {loading ? (
                   <tr><td colSpan={5} className="px-6 py-12 text-center text-app-text-light">Loading ledger...</td></tr>
                ) : expenses.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-app-text-light">No expenses recorded yet.</td></tr>
                ) : (
                  expenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-app-text">{exp.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-rose-500 text-sm">
                        ₵ {exp.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center ${exp.status === 'Approved' ? 'text-app-success' : 'text-amber-500'}`}>
                          {exp.status === 'Approved' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                          <span className="text-[9px] font-extrabold uppercase tracking-widest">{exp.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[11px] font-medium text-slate-400 font-mono">
                        {format(new Date(exp.date), 'dd.MM.yy')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-rose-500 p-8 rounded-3xl shadow-2xl shadow-rose-500/20 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
            <CreditCard className="h-8 w-8 opacity-50 mb-6" />
            <p className="text-rose-100 text-[10px] font-extrabold uppercase tracking-widest">Total Expenditure</p>
            <h2 className="text-3xl font-extrabold mt-1 tracking-tight">₵ {totalExpenses.toLocaleString()}</h2>
            <div className="mt-8">
              <span className="bg-white/20 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/10">30-Day Period</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-app-border shadow-sm">
            <h4 className="text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-6">Top Categories</h4>
            <div className="space-y-5">
              {[
                { label: 'Admin', color: 'bg-primary' },
                { label: 'Utility', color: 'bg-secondary' },
                { label: 'Welfare', color: 'bg-rose-400' }
              ].map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-2 w-2 rounded-full ${cat.color}`}></div>
                    <span className="text-xs font-bold text-app-text-light uppercase tracking-wide">{cat.label}</span>
                  </div>
                  <span className="text-xs font-extrabold text-app-text">{45 - i * 15}%</span>
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
                  <h2 className="text-xl font-extrabold text-app-text tracking-tight">Expense Voucher</h2>
                  <p className="text-app-text-light text-[10px] font-bold uppercase tracking-widest mt-1">Manual Entry</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full"><X className="h-5 w-5 text-slate-300" /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-2 ml-1">Description</label>
                  <input 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-50 border-app-border rounded-xl py-3 px-4 text-sm font-medium outline-none border focus:border-primary/50 transition-all" 
                    placeholder="e.g. Utility Bills - March"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-2 ml-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-slate-50 border-app-border rounded-xl py-3 px-4 text-sm font-bold outline-none border focus:border-primary/50 transition-all cursor-pointer"
                    >
                      <option>Admin</option>
                      <option>Utility</option>
                      <option>Welfare</option>
                      <option>Project</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-2 ml-1">Amount (GHS)</label>
                    <input 
                       type="number"
                       required
                       value={formData.amount}
                       onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                       className="w-full bg-slate-50 border-app-border rounded-xl py-3 px-4 text-sm font-bold outline-none border focus:border-rose-500/50 transition-all" 
                       placeholder="0.00"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-rose-500 text-white py-4 rounded-xl font-extrabold shadow-xl shadow-rose-500/10 hover:opacity-95 transition-all active:scale-[0.98] mt-4 uppercase tracking-widest text-xs"
                >
                  Post Voucher
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
