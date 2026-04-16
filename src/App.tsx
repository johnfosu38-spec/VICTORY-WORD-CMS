/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { UserProfile } from './types';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Finance from './pages/Finance';
import Events from './pages/Events';
import Attendance from './pages/Attendance';
import Expenses from './pages/Expenses';
import Departments from './pages/Departments';
import SundaySchool from './pages/SundaySchool';
import Communication from './pages/Communication';
import Media from './pages/Media';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        try {
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Anonymous',
              photoURL: firebaseUser.photoURL || undefined,
              role: firebaseUser.email === "johnfosu38@gmail.com" ? 'super_admin' : 'member',
              branch: 'Main Branch',
              createdAt: new Date().toISOString(),
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-app-bg">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl shadow-primary/10"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-app-bg font-sans text-app-text">
        <Sidebar profile={profile} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header profile={profile} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard profile={profile} />} />
                <Route path="/members" element={<Members />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/finance" element={<Finance profile={profile} />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/events" element={<Events />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/sunday-school" element={<SundaySchool />} />
                <Route path="/communication" element={<Communication />} />
                <Route path="/media" element={<Media />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

