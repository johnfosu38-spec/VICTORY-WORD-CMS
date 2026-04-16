import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCheck, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  X, 
  Plus,
  Users,
  Calendar
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, addDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AttendanceRecord, Member, ChurchEvent } from '../types';
import { format } from 'date-fns';

export default function Attendance() {
  const [sessions, setSessions] = useState<ChurchEvent[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubEvents = onSnapshot(query(collection(db, 'events'), orderBy('date', 'desc')), (snap) => {
      setSessions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChurchEvent)));
    });
    const unsubMembers = onSnapshot(collection(db, 'members'), (snap) => {
      setMembers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member)));
    });
    return () => { unsubEvents(); unsubMembers(); };
  }, []);

  useEffect(() => {
    if (!selectedEvent) {
      setAttendance([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, 'attendance'), where('eventId', '==', selectedEvent));
    const unsubAttend = onSnapshot(q, (snap) => {
      setAttendance(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord)));
      setLoading(false);
    });
    return () => unsubAttend();
  }, [selectedEvent]);

  const handleManualCheckIn = async (memberId: string) => {
    if (!selectedEvent) return;
    try {
      await addDoc(collection(db, 'attendance'), {
        eventId: selectedEvent,
        memberId,
        timestamp: new Date().toISOString(),
        checkInType: 'Manual',
        branch: 'Main Branch'
      });
    } catch (error) {
       console.error("Error checking in:", error);
    }
  };

  const isCheckedIn = (memberId: string) => attendance.some(a => a.memberId === memberId);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-app-text tracking-tight">Attendance Tracking</h1>
          <p className="text-app-text-light font-medium">Record and manage service attendance.</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="bg-white border border-app-border rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm outline-none focus:border-primary/50"
          >
            <option value="">Select Event/Service</option>
            {sessions.map(s => (
              <option key={s.id} value={s.id}>{s.title} ({format(new Date(s.date), 'dd MMM')})</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedEvent ? (
        <div className="bg-white rounded-3xl border border-dashed border-app-border p-20 text-center">
          <ClipboardCheck className="h-12 w-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-app-text">No event selected</h3>
          <p className="text-app-text-light font-medium mt-2">Please select a service or event from the dropdown to start tracking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-app-border shadow-sm overflow-hidden h-fit">
            <div className="p-6 border-b border-app-border bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-app-text">Member List</h3>
              <div className="text-[10px] font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                {attendance.length} Present
              </div>
            </div>
            <div className="divide-y divide-app-border max-h-[600px] overflow-y-auto custom-scrollbar">
              {members.map(member => (
                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-primary border border-app-border">
                      {member.firstName[0]}{member.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-app-text">{member.firstName} {member.lastName}</p>
                      <p className="text-[10px] text-app-text-light font-bold uppercase tracking-widest">{member.phone}</p>
                    </div>
                  </div>
                  {isCheckedIn(member.id) ? (
                    <div className="flex items-center text-app-success font-extrabold text-[10px] uppercase tracking-widest">
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      Checked In
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleManualCheckIn(member.id)}
                      className="px-4 py-2 bg-slate-100 hover:bg-primary hover:text-white transition-all rounded-lg text-[10px] font-extrabold uppercase tracking-widest"
                    >
                      Check In
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-app-border shadow-sm p-6">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-app-text mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {attendance.slice(0, 5).map(a => {
                  const m = members.find(member => member.id === a.memberId);
                  return (
                    <div key={a.id} className="flex items-start space-x-3 text-xs">
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-app-text">{m?.firstName} {m?.lastName}</p>
                        <p className="text-[9px] text-app-text-light font-bold uppercase tracking-widest mt-0.5">
                          {format(new Date(a.timestamp), 'HH:mm:ss')} · {a.checkInType}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-primary p-8 rounded-3xl shadow-xl shadow-primary/20 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               <Users className="h-8 w-8 opacity-50 mb-6" />
               <p className="text-[10px] font-extrabold uppercase tracking-widest text-blue-100">Attendance Rate</p>
               <h2 className="text-4xl font-extrabold mt-1 tracking-tight">
                {members.length > 0 ? Math.round((attendance.length / members.length) * 100) : 0}%
               </h2>
               <div className="mt-8 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                  <p className="text-[9px] font-extrabold uppercase tracking-widest mb-1">Total Congregation</p>
                  <p className="text-lg font-bold"> {members.length} Members</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
