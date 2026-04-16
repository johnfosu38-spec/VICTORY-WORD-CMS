import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin,
  Camera,
  X,
  CheckCircle2,
  User,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Member } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    momoNetwork: 'MTN' as any,
    location: '',
    occupation: '',
    gender: 'Male' as any,
    maritalStatus: 'Single' as any,
    department: 'General',
    status: 'Active' as any,
    branch: 'Main Branch',
    photoURL: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'members'), orderBy('createdAt', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
      setMembers(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // Capture at 200x200 for low storage usage
        canvasRef.current.width = 200;
        canvasRef.current.height = 200;
        context.drawImage(videoRef.current, 0, 0, 200, 200);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.7);
        setFormData({ ...formData, photoURL: dataUrl });
        stopCamera();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'members'), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setFormData({
        firstName: '', lastName: '', phone: '', momoNetwork: 'MTN',
        location: '', occupation: '', gender: 'Male', maritalStatus: 'Single',
        department: 'General', status: 'Active', branch: 'Main Branch', photoURL: ''
      });
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const filteredMembers = members.filter(m => 
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm)
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-app-text tracking-tight">Members Directory</h1>
          <p className="text-app-text-light font-medium">Manage your congregation and their profiles.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-primary px-6 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 shadow-xl shadow-primary/10 transition-all active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          <span>New Member</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-app-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-app-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-light" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-app-border rounded-xl py-2 pl-10 pr-4 text-sm focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 text-sm font-bold text-app-text-light hover:bg-white hover:shadow-sm rounded-xl transition-all">
            <Filter className="h-4 w-4" />
            <span className="uppercase tracking-widest text-[10px]">Filters</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-app-text-light text-[10px] uppercase tracking-widest font-extrabold">
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-app-text-light">Loading members...</td></tr>
              ) : filteredMembers.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-app-text-light">No members found.</td></tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary font-bold border border-app-border group-hover:bg-white transition-colors overflow-hidden">
                          {member.photoURL ? (
                            <img src={member.photoURL} alt="Member" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="uppercase">{member.firstName[0]}{member.lastName[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-app-text">{member.firstName} {member.lastName}</p>
                          <p className="text-[10px] text-app-text-light font-bold uppercase tracking-wider">{member.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center text-xs font-semibold text-app-text-light">
                          <Phone className="h-3 w-3 mr-2 text-slate-300" />
                          {member.phone}
                        </div>
                        <div className="flex items-center text-xs text-app-text-light">
                          <MapPin className="h-3 w-3 mr-2 text-slate-300" />
                          {member.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-widest ${
                        member.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-app-text-light text-[11px] uppercase tracking-wide">
                      {member.department}
                    </td>
                    <td className="px-6 py-4 text-[11px] font-medium text-slate-400 font-mono">
                      {format(new Date(member.createdAt), 'dd.MM.yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-300 hover:text-primary rounded-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-transparent hover:border-app-border">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if(!isCameraOpen) setIsModalOpen(false); }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-app-border flex items-center justify-between bg-primary text-white">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight">Register New Member</h2>
                  <p className="text-blue-100 text-[11px] font-bold uppercase tracking-widest mt-1">Digital Enrollment System</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                
                <div className="flex flex-col items-center justify-center space-y-4 pb-8 border-b border-slate-100">
                   <div className="relative group">
                      <div className="h-32 w-32 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                        {formData.photoURL ? (
                          <img src={formData.photoURL} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-12 w-12 text-slate-200" />
                        )}
                      </div>
                      <button 
                        type="button"
                        onClick={startCamera}
                        className="absolute -bottom-2 -right-2 bg-primary text-white p-2.5 rounded-xl shadow-lg hover:scale-105 transition-transform"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                   </div>
                   <p className="text-[10px] font-extrabold text-app-text-light uppercase tracking-widest">Member Portrait</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <h3 className="text-[10px] font-extrabold text-app-text-light uppercase tracking-widest border-b border-slate-100 pb-2">Profile Basics</h3>
                    <div>
                      <label className="block text-[10px] font-extrabold text-app-text-light mb-1.5 ml-1 uppercase">First Name</label>
                      <input 
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full bg-slate-50 border-app-border rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 border focus:border-primary/50 outline-none transition-all font-medium" 
                        placeholder="e.g. Samuel"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-app-text-light mb-1.5 ml-1 uppercase">Last Name</label>
                      <input 
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full bg-slate-50 border-app-border rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 border focus:border-primary/50 outline-none transition-all font-medium" 
                        placeholder="e.g. Ansah"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-app-text-light mb-1.5 ml-1 uppercase">Gender</label>
                        <select 
                          value={formData.gender}
                          onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                          className="w-full bg-slate-50 border-app-border rounded-xl py-3 px-4 text-sm outline-none border focus:border-primary/50 transition-all font-bold text-app-text"
                        >
                          <option>Male</option>
                          <option>Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-app-text-light mb-1.5 ml-1 uppercase">Marital Status</label>
                        <select 
                          value={formData.maritalStatus}
                          onChange={(e) => setFormData({...formData, maritalStatus: e.target.value as any})}
                          className="w-full bg-slate-50 border-app-border rounded-xl py-3 px-4 text-sm outline-none border focus:border-primary/50 transition-all font-bold text-app-text"
                        >
                          <option>Single</option>
                          <option>Married</option>
                          <option>Widowed</option>
                          <option>Divorced</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <h3 className="text-[10px] font-extrabold text-app-text-light uppercase tracking-widest border-b border-slate-100 pb-2">Church Connection</h3>
                    <div>
                      <label className="block text-[10px] font-extrabold text-app-text-light mb-1.5 ml-1 uppercase">Phone Number</label>
                      <input 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-slate-50 border-app-border rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 border focus:border-primary/50 outline-none transition-all font-mono font-bold" 
                        placeholder="024 XXX XXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-app-text-light mb-1.5 ml-1 uppercase">Location</label>
                      <input 
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-slate-50 border-app-border rounded-xl py-3 px-4 text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 border focus:border-primary/50 outline-none transition-all font-medium" 
                        placeholder="e.g. Accra, Ghana"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-app-text-light mb-1.5 ml-1 uppercase">Department</label>
                      <select 
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        className="w-full bg-slate-50 border-app-border rounded-xl py-3 px-4 text-sm outline-none border focus:border-primary/50 transition-all font-bold text-app-text"
                      >
                        <option>General</option>
                        <option>Choir</option>
                        <option>Ushering</option>
                        <option>Media</option>
                        <option>Sunday School</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-8 border-t border-slate-100">
                  <button 
                    type="submit"
                    className="flex-1 bg-primary text-white py-4 rounded-xl font-extrabold shadow-xl shadow-primary/10 hover:opacity-95 transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Complete Enrollment</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 rounded-xl font-bold text-app-text-light hover:bg-slate-50 transition-all font-sans"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {/* Camera Overlay */}
              <AnimatePresence>
                {isCameraOpen && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[60] bg-black flex flex-col items-center justify-center"
                  >
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute bottom-10 flex items-center space-x-8">
                       <button onClick={stopCamera} className="p-4 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20 transition-all">
                          <X className="h-6 w-6" />
                       </button>
                       <button onClick={capturePhoto} className="h-20 w-20 bg-white rounded-full border-8 border-white/20 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-2xl">
                          <div className="h-14 w-14 rounded-full border-2 border-slate-900" />
                       </button>
                       <button className="p-4 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20 transition-all">
                          <RefreshCw className="h-6 w-6" />
                       </button>
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

