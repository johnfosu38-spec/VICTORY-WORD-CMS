import { 
  Users, 
  TrendingUp, 
  Wallet, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download
} from 'lucide-react';
import { UserProfile } from '../types';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface DashboardProps {
  profile: UserProfile | null;
}

const FINANCE_DATA = [
  { name: 'Mon', income: 400, expense: 240 },
  { name: 'Tue', income: 300, expense: 139 },
  { name: 'Wed', income: 200, expense: 980 },
  { name: 'Thu', income: 278, expense: 390 },
  { name: 'Fri', income: 189, expense: 480 },
  { name: 'Sat', income: 239, expense: 380 },
  { name: 'Sun', income: 849, expense: 430 },
];

const ATTENDANCE_DATA = [
  { name: 'Week 1', total: 400 },
  { name: 'Week 2', total: 1200 },
  { name: 'Week 3', total: 900 },
  { name: 'Week 4', total: 1500 },
];

export default function Dashboard({ profile }: DashboardProps) {
  const stats = [
    { title: 'Total Members', value: '1,284', icon: Users, change: '+12%', positive: true },
    { title: 'Monthly Tithe', value: 'GH₵ 42,400', icon: Wallet, change: '+8.2%', positive: true },
    { title: 'Attendance Avg', value: '84.5%', icon: TrendingUp, change: '-3%', positive: false },
    { title: 'Events This Month', value: '12', icon: Calendar, change: '+2', positive: true },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-app-text tracking-tight">Shalom, {profile?.displayName?.split(' ')[0]}</h1>
          <p className="text-app-text-light font-medium">Welcome to Victory Word Glorious Church dashboard.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-app-border px-5 py-2.5 rounded-xl text-sm font-bold text-app-text hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]">
            <Download className="h-4 w-4" />
            <span>Download Reports</span>
          </button>
          <button className="flex items-center space-x-2 bg-primary px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 shadow-lg shadow-primary/10 transition-all active:scale-[0.98]">
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-app-border shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-primary/5 transition-colors">
                <stat.icon className="h-6 w-6 text-app-text-light group-hover:text-primary transition-colors" />
              </div>
              <div className={`flex items-center text-[10px] font-extrabold uppercase tracking-widest ${stat.positive ? 'text-app-success' : 'text-rose-500'}`}>
                {stat.change}
                {stat.positive ? <ArrowUpRight className="ml-1 h-3 w-3" /> : <ArrowDownRight className="ml-1 h-3 w-3" />}
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-[10px] font-bold text-app-text-light uppercase tracking-widest">{stat.title}</h3>
              <p className="text-2xl font-extrabold text-primary mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-app-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-app-text tracking-tight">Financial Performance</h3>
              <p className="text-sm text-app-text-light font-medium">Weekly income vs expense breakdown</p>
            </div>
            <select className="bg-slate-50 border-none rounded-lg py-1.5 px-3 text-xs font-bold text-app-text-light outline-none cursor-pointer hover:bg-slate-100 transition-colors">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FINANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="income" fill="#1e3a8a" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="expense" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-app-border shadow-sm">
          <h3 className="text-lg font-bold text-app-text mb-2 tracking-tight">Member Growth</h3>
          <p className="text-sm text-app-text-light mb-8 font-medium">Monthly new registrations</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ATTENDANCE_DATA}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#1e3a8a" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                <span className="text-sm text-app-text font-medium">Active Members</span>
              </div>
              <span className="text-sm font-bold text-primary">82%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-primary h-2.5 rounded-full transition-all duration-1000" style={{ width: '82%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

