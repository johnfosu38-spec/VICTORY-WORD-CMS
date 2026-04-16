import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Bell,
  CheckCircle2,
  Video,
  ExternalLink
} from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ChurchEvent } from '../types';
import { motion } from 'motion/react';
import { format } from 'date-fns';

export default function Events() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChurchEvent));
      setEvents(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-app-text tracking-tight">Events & Programs</h1>
          <p className="text-app-text-light font-medium">Upcoming services, outreaches and meetings.</p>
        </div>
        <button className="flex items-center justify-center space-x-2 bg-primary px-6 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 shadow-xl shadow-primary/10 transition-all active:scale-[0.98]">
          <Plus className="h-5 w-5" />
          <span>New Program</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {loading ? (
          <p className="col-span-full text-center text-app-text-light py-12 font-bold uppercase tracking-widest text-[10px]">Loading programs...</p>
        ) : events.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-app-border flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-slate-50 rounded-2xl mb-4">
              <Calendar className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-extrabold text-app-text tracking-tight">No upcoming events</h3>
            <p className="text-app-text-light max-w-xs mt-2 font-medium">Schedule your first service or program to get started.</p>
          </div>
        ) : (
          events.map(event => (
            <div key={event.id} className="bg-white rounded-3xl border border-app-border shadow-sm hover:shadow-xl transition-all overflow-hidden group">
              <div className="h-40 bg-slate-100 relative overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${event.id}/800/400`} 
                  alt={event.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg border border-white/20">
                  <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest leading-none">Church Live</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                </div>
              </div>
              <div className="p-6 md:p-8 -mt-6 relative">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-app-border group-hover:border-primary/20 transition-colors">
                  <h3 className="text-xl font-extrabold text-app-text leading-tight mb-3 group-hover:text-primary transition-colors tracking-tight">
                    {event.title}
                  </h3>
                  <p className="text-sm text-app-text-light line-clamp-2 mb-6 font-medium">
                    {event.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-app-text text-sm">
                      <div className="p-2 bg-slate-50 rounded-lg mr-4 border border-slate-100">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-bold">{format(new Date(event.date), 'EEEE, MMM d · HH:mm')}</span>
                    </div>
                    <div className="flex items-center text-app-text-light text-sm">
                      <div className="p-2 bg-slate-50 rounded-lg mr-4 border border-slate-100">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium truncate">{event.location}</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => (
                         <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                           <img src={`https://picsum.photos/seed/${event.id}${i}/100/100`} alt="Avatar" referrerPolicy="no-referrer" />
                         </div>
                       ))}
                       <div className="h-8 w-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-extrabold text-white">
                         +
                       </div>
                    </div>
                    <button className="text-primary font-extrabold text-xs uppercase tracking-widest flex items-center hover:translate-x-1 transition-transform">
                      View Program <ExternalLink className="h-3 w-3 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-app-text rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">Empower Your Faith <br className="hidden md:block"/>Digital Media Hub</h2>
             <p className="text-slate-400 mb-10 font-medium text-lg">Connect with brothers and sisters globally through our high-performance integrated media player.</p>
             <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
               <button className="bg-white text-app-text px-8 py-4 rounded-xl font-extrabold hover:bg-slate-50 transition-all flex items-center justify-center shadow-2xl shadow-white/5 active:scale-[0.98]">
                 <Video className="h-5 w-5 mr-3 text-primary" />
                 Launch Media Player
               </button>
               <button className="text-white bg-white/5 px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all border border-white/10 active:scale-[0.98]">
                 Review Archives
               </button>
             </div>
          </div>
          <div className="hidden lg:block flex-shrink-0">
            <div className="bg-white/5 p-5 rounded-[2.5rem] backdrop-blur-md border border-white/10 shadow-2xl shadow-black/50 overflow-hidden group">
              <div className="bg-app-text h-64 w-[28rem] rounded-3xl flex items-center justify-center relative group-hover:scale-[1.02] transition-transform duration-700">
                <Video className="h-16 w-16 text-white opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

