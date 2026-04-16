export type UserRole = 'super_admin' | 'pastor' | 'secretary' | 'treasurer' | 'dept_head' | 'member';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  branch: string;
  createdAt: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  momoNetwork: 'MTN' | 'Telecel' | 'AirtelTigo';
  location: string;
  gps?: string;
  occupation: string;
  maritalStatus: 'Single' | 'Married' | 'Widowed' | 'Divorced';
  gender: 'Male' | 'Female';
  department: string;
  branch: string;
  photoURL?: string;
  familyId?: string;
  status: 'Active' | 'Inactive' | 'Visitor';
  createdAt: string;
}

export interface FinanceRecord {
  id: string;
  type: 'Tithe' | 'Offering' | 'Donation' | 'Welfare' | 'Pledge';
  amount: number;
  memberId?: string;
  memberName?: string;
  date: string;
  paymentMethod: 'Cash' | 'MoMo' | 'Bank';
  branch: string;
  period: string;
}

export interface ExpenseRecord {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  receiptUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  branch: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  branch: string;
  recursive?: boolean;
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  memberId: string;
  timestamp: string;
  checkInType: 'Manual' | 'QR';
  branch: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  headUid?: string;
  headName?: string;
  memberCount: number;
  branch: string;
}

export interface MessageLog {
  id: string;
  type: 'SMS' | 'WhatsApp';
  recipientIds: string[];
  content: string;
  status: 'Sent' | 'Pending' | 'Failed';
  sentAt: string;
  sentBy: string;
  branch: string;
}

export interface SundaySchoolSession {
  id: string;
  date: string;
  teacherId: string;
  topic: string;
  attendanceCount: number;
  notes?: string;
  branch: string;
}
