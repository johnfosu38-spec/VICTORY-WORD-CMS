import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PlayCircle, 
  Video, 
  Mic, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  Share2,
  Lock,
  Users
} from 'lucide-react';

export default function Media() {
  const [activeCategory, setActiveCategory] = useState('All Media');

  const mediaItems = [
    { title: 'The Power of Divine Favor', Date: '2024-04-14', type: 'Sermon', speaker: 'Rev. John Doe', duration: '45:20', thumbnail: 'https://picsum.photos/seed/sermon1/800/400' },
    { title: 'Victory Worship Night', Date: '2024-04-07', type: 'Worship', speaker: 'Worship Team', duration: '1:12:05', thumbnail: 'https://picsum.photos/seed/worship1/800/400' },
    { title: 'Mid-Week Faith Builders', Date: '2024-04-10', type: 'Teaching', speaker: 'Pastor Sarah Smith', duration: '32:15', thumbnail: 'https://picsum.photos/seed/teaching1/800/400' },
    { title: 'Easter Sunday Celebration', Date: '2024-03-31', type: 'Special', speaker: 'General Overseer', duration: '2:05:00', thumbnail: 'https://picsum.photos/seed/easter1/800/400' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-app-text tracking-tight">Media Hub</h1>
          <p className="text-app-text-light font-medium">Stream sermons, worship sessions and archives.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-app-border shadow-sm">
           {['All Media', 'Sermons', 'Worship', 'Special'].map(cat => (
             <button 
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-6 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-primary text-white shadow-md' : 'text-app-text-light hover:text-primary'}`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-app-text rounded-[2.5rem] p-12 md:p-16 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <div className="flex items-center space-x-3 mb-6">
               <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
               <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-[0.2em] leading-none">Live Now</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight italic">Victory Sunday <br/>Breakthrough Service</h2>
            <p className="text-slate-400 mb-10 font-medium text-lg lg:text-xl">Join thousands globally as we worship and receive Word from heaven.</p>
            <div className="flex flex-wrap gap-4">
               <button className="bg-primary text-white px-10 py-5 rounded-2xl font-extrabold hover:opacity-90 transition-all flex items-center shadow-2xl shadow-primary/30 active:scale-[0.98]">
                 <PlayCircle className="h-6 w-6 mr-3" />
                 Join Live Stream
               </button>
               <button className="bg-white/5 text-white px-10 py-5 rounded-2xl font-extrabold hover:bg-white/10 transition-all border border-white/10 active:scale-[0.98]">
                 Set Reminder
               </button>
            </div>
          </div>
          <div className="hidden lg:block w-full max-w-md">
             <div className="aspect-video bg-black/40 rounded-[2.5rem] border border-white/10 flex items-center justify-center relative shadow-2xl overflow-hidden group">
                <img src="https://picsum.photos/seed/live/800/450" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" alt="Live Preview" />
                <PlayCircle className="h-20 w-20 text-white opacity-60 relative z-10" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10">
                   <div className="flex items-center text-white/60 text-[10px] font-bold uppercase tracking-widest">
                      <Users className="h-3.5 w-3.5 mr-2" />
                      1.2k Watching
                   </div>
                   <div className="flex items-center text-white/60 text-[10px] font-bold uppercase tracking-widest">
                      <Clock className="h-3.5 w-3.5 mr-2" />
                      01:14:05
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {mediaItems.map((item, i) => (
           <div key={i} className="bg-white rounded-3xl border border-app-border overflow-hidden shadow-sm group hover:shadow-xl transition-all">
              <div className="aspect-video relative overflow-hidden">
                 <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <PlayCircle className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100 duration-300" />
                 </div>
                 <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-bold text-white uppercase tracking-widest">
                    {item.duration}
                 </div>
              </div>
              <div className="p-6">
                 <div className="flex items-center space-x-2 mb-3">
                    <span className="text-[9px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-widest leading-none">{item.type}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{item.Date}</span>
                 </div>
                 <h4 className="text-base font-extrabold text-app-text tracking-tight line-clamp-2 h-12 group-hover:text-primary transition-colors">{item.title}</h4>
                 <p className="text-xs text-app-text-light font-medium mt-2">{item.speaker}</p>
                 <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                    <button className="text-[10px] font-extrabold text-app-text uppercase tracking-widest flex items-center hover:text-primary transition-colors">
                       Listen Now <ChevronRight className="h-3 w-3 ml-1" />
                    </button>
                    <button className="p-2 text-slate-300 hover:text-primary transition-colors">
                       <Share2 className="h-4 w-4" />
                    </button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-3xl border border-app-border p-10 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center space-x-6">
            <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-app-border">
               <Mic className="h-8 w-8 text-primary" />
            </div>
            <div>
               <h3 className="text-xl font-extrabold text-app-text tracking-tight">Audio Messages Archive</h3>
               <p className="text-app-text-light font-medium mt-1">High-quality audio recordings for focused listening.</p>
            </div>
         </div>
         <button className="flex items-center bg-app-text text-white px-8 py-4 rounded-xl font-extrabold text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98]">
            Access Audio Vault <Lock className="h-4 w-4 ml-3 opacity-50" />
         </button>
      </div>
    </motion.div>
  );
}
