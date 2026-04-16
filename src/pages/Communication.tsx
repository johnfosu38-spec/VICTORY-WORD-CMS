import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle,
  Users,
  Search,
  History,
  Info
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, addDoc, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MessageLog, Member } from '../types';
import { format } from 'date-fns';

export default function Communication() {
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');
  const [msgType, setMsgType] = useState<'SMS' | 'WhatsApp'>('SMS');
  const [content, setContent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All Members');

  useEffect(() => {
    const unsubMsgs = onSnapshot(query(collection(db, 'messages'), orderBy('sentAt', 'desc'), limit(50)), (snap) => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MessageLog)));
    });
    const unsubMembers = onSnapshot(collection(db, 'members'), (snap) => {
      setMembers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member)));
      setLoading(false);
    });
    return () => { unsubMsgs(); unsubMembers(); };
  }, []);

  const handleSendMessage = async () => {
    if (!content.trim()) return;
    try {
      await addDoc(collection(db, 'messages'), {
        type: msgType,
        recipientIds: members.map(m => m.id), // Simplified for "All Members"
        content,
        status: 'Sent',
        sentAt: new Date().toISOString(),
        sentBy: 'System Admin',
        branch: 'Main Branch'
      });
      setContent('');
      setActiveTab('history');
    } catch (err) {
      console.error("Error logging message:", err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-app-text tracking-tight">Communication Hub</h1>
          <p className="text-app-text-light font-medium">Broadcast messages via SMS and WhatsApp.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-app-border shadow-sm">
          <button 
            onClick={() => setActiveTab('send')}
            className={`px-6 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all ${activeTab === 'send' ? 'bg-primary text-white' : 'text-app-text-light hover:text-primary'}`}
          >
            Compose
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-primary text-white' : 'text-app-text-light hover:text-primary'}`}
          >
            Log History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === 'send' ? (
            <div className="bg-white rounded-3xl border border-app-border shadow-sm p-8 md:p-12">
               <div className="flex flex-col sm:flex-row gap-6 mb-12">
                  <button 
                    onClick={() => setMsgType('SMS')}
                    className={`flex-1 flex flex-col items-center p-8 rounded-2xl border-2 transition-all group ${msgType === 'SMS' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-primary/20 bg-slate-50/50'}`}
                  >
                    <Smartphone className={`h-8 w-8 mb-4 ${msgType === 'SMS' ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                    <span className={`font-extrabold text-sm tracking-tight ${msgType === 'SMS' ? 'text-app-text' : 'text-app-text-light'}`}>Bulk SMS</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Direct Carrier</span>
                  </button>
                  <button 
                    onClick={() => setMsgType('WhatsApp')}
                    className={`flex-1 flex flex-col items-center p-8 rounded-2xl border-2 transition-all group ${msgType === 'WhatsApp' ? 'border-app-success bg-app-success/5' : 'border-slate-100 hover:border-app-success/20 bg-slate-50/50'}`}
                  >
                    <MessageSquare className={`h-8 w-8 mb-4 ${msgType === 'WhatsApp' ? 'text-app-success' : 'text-slate-400 group-hover:text-app-success'}`} />
                    <span className={`font-extrabold text-sm tracking-tight ${msgType === 'WhatsApp' ? 'text-app-text' : 'text-app-text-light'}`}>WhatsApp</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Digital API</span>
                  </button>
               </div>

               <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-3 ml-1">Recipient Group</label>
                      <select 
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="w-full bg-slate-50 border-app-border rounded-2xl py-3.5 px-5 text-sm font-bold outline-none border focus:border-primary/50"
                      >
                        <option>All Members</option>
                        <option>Leaders Only</option>
                        <option>Choir Department</option>
                        <option>Youth Fellowship</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-4 bg-slate-50 px-6 rounded-2xl border border-app-border border-dashed self-end h-[54px]">
                      <Users className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-extrabold text-app-text-light uppercase tracking-widest">Total Recipients</p>
                        <p className="text-sm font-extrabold text-app-text">{members.length} Members</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3 ml-1">
                      <label className="block text-[10px] font-extrabold text-app-text-light uppercase tracking-widest">Message Content</label>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${content.length > 160 ? 'text-rose-500' : 'text-slate-400'}`}>
                        {content.length} / 160 (1 Page)
                      </span>
                    </div>
                    <textarea 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full bg-slate-50 border-app-border rounded-3xl py-6 px-6 text-sm font-medium outline-none border focus:border-primary/50 transition-all resize-none h-48"
                      placeholder="Type your announcement here..."
                    />
                    <div className="flex items-start mt-4 p-4 bg-slate-50 rounded-2xl border border-app-border">
                       <Info className="h-4 w-4 text-primary mr-3 mt-0.5" />
                       <p className="text-[10px] text-app-text-light font-medium leading-relaxed">
                        Messages are processed instantly. Please ensure content complies with church communication guidelines. WhatsApp messages support rich media.
                       </p>
                    </div>
                  </div>

                  <button 
                    onClick={handleSendMessage}
                    className={`w-full py-5 rounded-2xl font-extrabold shadow-xl flex items-center justify-center space-x-3 transition-all active:scale-[0.98] ${msgType === 'SMS' ? 'bg-primary text-white shadow-primary/20' : 'bg-app-success text-white shadow-app-success/20'}`}
                  >
                    <Send className="h-5 w-5" />
                    <span>Broadcast Broadcast {msgType}</span>
                  </button>
               </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-app-border shadow-sm overflow-hidden">
               <div className="p-8 border-b border-app-border bg-slate-50/30 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-app-text">Message Archive</h3>
                  <button className="text-[10px] font-extrabold text-primary hover:underline uppercase tracking-widest">Export All</button>
               </div>
               <div className="divide-y divide-app-border">
                  {messages.length === 0 ? (
                    <div className="p-20 text-center">
                      <History className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                      <p className="text-app-text-light font-medium">No broadcast history found.</p>
                    </div>
                  ) : (
                    messages.map(log => (
                      <div key={log.id} className="p-8 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${log.type === 'SMS' ? 'bg-primary/10 text-primary' : 'bg-app-success/10 text-app-success'}`}>
                              {log.type === 'SMS' ? <Smartphone className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                            </div>
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-app-text">{log.type} Broadcast</span>
                          </div>
                          <span className="text-[11px] font-medium text-slate-400">{format(new Date(log.sentAt), 'MMM dd, HH:mm')}</span>
                        </div>
                        <p className="text-sm text-app-text font-medium leading-relaxed mb-4">{log.content}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <div className="flex items-center text-[10px] font-bold text-app-text-light uppercase tracking-widest">
                            <Users className="h-3.5 w-3.5 mr-2" />
                            To {log.recipientIds.length} Recipients
                          </div>
                          <div className="flex items-center text-app-success text-[10px] font-extrabold uppercase tracking-widest">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                            {log.status}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-3xl border border-app-border shadow-sm p-8">
              <h4 className="text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-6">Messaging Quota</h4>
              <div className="space-y-6">
                 <div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                       <span className="text-slate-400">Monthly SMS</span>
                       <span className="text-app-text">850 / 1000</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                       <div className="bg-primary h-full w-[85%] rounded-full"></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                       <span className="text-slate-400">WhatsApp API</span>
                       <span className="text-app-text">Unlimited</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                       <div className="bg-app-success h-full w-full rounded-full"></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/40 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <Info className="h-8 w-8 text-primary mb-6" />
              <h3 className="text-lg font-extrabold tracking-tight mb-2">Need Help?</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                Broadcast messages are optimized for Ghanaian carrier networks (MTN, Telecel, AirtelTigo).
              </p>
              <button className="text-[10px] font-extrabold text-primary hover:underline uppercase tracking-widest">View API Guide</button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
