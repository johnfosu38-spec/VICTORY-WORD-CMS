import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Baby, 
  Plus, 
  Search, 
  MapPin, 
  Users, 
  Calendar,
  BookOpen,
  Star
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SundaySchoolSession, Member } from '../types';
import { format } from 'date-fns';

export default function SundaySchool() {
  const [children, setChildren] = useState<Member[]>([]);
  const [sessions, setSessions] = useState<SundaySchoolSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter for members under 13 (simplified for mock-up) or those in Sunday School department
    const unsubChildren = onSnapshot(query(collection(db, 'members'), where('department', '==', 'Sunday School')), (snap) => {
      setChildren(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member)));
    });
    const unsubSessions = onSnapshot(query(collection(db, 'sundaySchool'), orderBy('date', 'desc')), (snap) => {
      setSessions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SundaySchoolSession)));
      setLoading(false);
    });
    return () => { unsubChildren(); unsubSessions(); };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-app-text tracking-tight">Sunday School Hub</h1>
          <p className="text-app-text-light font-medium">Nurturing the next generation in faith.</p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-500 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 shadow-xl shadow-indigo-500/10 transition-all">
          <Plus className="h-5 w-5" />
          <span>New Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-3xl border border-app-border shadow-sm overflow-hidden">
            <div className="p-8 border-b border-app-border bg-slate-50/30 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-app-text">Recent Sunday School Sessions</h3>
                <p className="text-[10px] text-app-text-light font-bold uppercase tracking-widest mt-1">Teaching logs and records</p>
              </div>
              <button className="p-3 bg-white border border-app-border rounded-xl text-slate-400 hover:text-primary transition-colors">
                <Search className="h-5 w-5" />
              </button>
            </div>
            
            <div className="divide-y divide-app-border">
              {sessions.length === 0 ? (
                <div className="p-20 text-center">
                  <BookOpen className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                  <p className="text-app-text-light font-medium">No sessions recorded yet.</p>
                </div>
              ) : (
                sessions.map(session => (
                  <div key={session.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center space-x-6">
                      <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 font-extrabold text-indigo-600 text-lg">
                        {format(new Date(session.date), 'dd')}
                      </div>
                      <div>
                        <h4 className="text-lg font-extrabold text-app-text tracking-tight">{session.topic}</h4>
                        <div className="flex items-center space-x-4 mt-2">
                           <div className="flex items-center text-app-text-light text-[10px] font-bold uppercase tracking-widest">
                             <Calendar className="h-3 w-3 mr-1.5" />
                             {format(new Date(session.date), 'MMMM yyyy')}
                           </div>
                           <div className="flex items-center text-app-text-light text-[10px] font-bold uppercase tracking-widest">
                             <Users className="h-3 w-3 mr-1.5" />
                             {session.attendanceCount} Children
                           </div>
                        </div>
                      </div>
                    </div>
                    <button className="px-5 py-2.5 bg-white border border-app-border rounded-xl text-[10px] font-extrabold uppercase tracking-widest text-app-text hover:bg-slate-50 transition-all">
                      View Notes
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-600/20 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
            <Baby className="h-10 w-10 opacity-50 mb-6" />
            <h2 className="text-4xl font-extrabold tracking-tight">{children.length}</h2>
            <p className="text-indigo-100 text-[10px] font-extrabold uppercase tracking-widest mt-1">Total Children Registered</p>
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-200">Active this month</span>
              <div className="flex items-center text-emerald-300 font-bold text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-app-border shadow-sm p-8">
            <h4 className="text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-6">Upcoming Birthday Star</h4>
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-app-text">Emmanuel Osei</p>
                <p className="text-[10px] text-app-text-light font-bold uppercase tracking-widest mt-1">April 24th · Age 8</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TrendingUp(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
