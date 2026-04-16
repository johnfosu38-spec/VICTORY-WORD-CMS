import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { Church, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg p-4 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-5 bg-primary rounded-[2rem] shadow-2xl shadow-primary/20 mb-6">
            <Church className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-app-text tracking-tight leading-tight">Victory Word <br/>Glorious Church</h1>
          <p className="mt-3 text-app-text-light font-bold uppercase tracking-widest text-[10px]">Management System</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-app-border">
          <div className="space-y-6">
            <button
              onClick={handleGoogleSignIn}
              className="w-full h-14 flex items-center justify-center space-x-3 bg-white border border-app-border rounded-2xl font-bold text-app-text hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-[0.98]"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
              <span>Continue with Google</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-app-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-app-text-light font-bold uppercase tracking-widest text-[9px]">Admin Portal</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@church.com"
                  className="w-full bg-slate-50 border-app-border rounded-2xl py-3.5 px-4 text-sm focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none border"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-app-text-light uppercase tracking-widest mb-1.5 ml-1">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-app-border rounded-2xl py-3.5 px-4 text-sm focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none border"
                />
              </div>
            </div>

            <button className="w-full bg-primary text-white h-14 rounded-2xl font-extrabold shadow-lg shadow-primary/20 hover:opacity-95 transition-all active:scale-[0.98]">
              Sign in to Dashboard
            </button>
            
            <p className="text-center text-[10px] text-app-text-light font-bold uppercase tracking-wider">
              Protected by Enterprise Security
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-6">
          <a href="#" className="text-[10px] font-bold text-app-text-light hover:text-primary uppercase tracking-widest transition-colors">Privacy Policy</a>
          <a href="#" className="text-[10px] font-bold text-app-text-light hover:text-primary uppercase tracking-widest transition-colors">Support</a>
        </div>
      </motion.div>
    </div>
  );
}

