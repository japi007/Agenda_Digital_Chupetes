export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'teacher' | 'parent';
  status?: 'active' | 'inactive';
  photoUrl?: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Notification {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
  type: 'general' | 'personal' | 'announcement';
  senderId: number;
  recipientId: number;
  createdAt: string;
}

export interface Newsletter {
  id: number;
  title: string;
  content: string;
  attachments?: string;
  publishedAt: string;
  status: 'draft' | 'published';
  authorId: number;
}

export interface Authorization {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  responseDate?: string;
  responseNotes?: string;
  expiryDate?: string;
  studentId: number;
  parentId: number;
  requestedById: number;
  respondedById?: number;
}

export interface Document {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  isPublic: boolean;
  category?: string;
  uploadedById: number;
}

export interface MonthlyMenu {
  id: number;
  month: number;
  year: number;
  fileUrl: string;
  description?: string;
  uploadedById: number;
}

export interface StudentFollowUp {
  id: number;
  date: string;
  notes: string;
  activities?: string;
  mood?: 'happy' | 'neutral' | 'sad';
  sleep?: 'good' | 'fair' | 'poor';
  appetite?: 'good' | 'fair' | 'poor';
  behavior?: string;
  learningProgress?: string;
  studentId: number;
  teacherId: number;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  allergies?: string;
  medicalNotes?: string;
  enrollmentDate: string;
  classroomId?: number;
}

export interface Teacher {
  id: number;
  specialization?: string;
  bio?: string;
  phone?: string;
  userId: number;
  classroomId?: number;
}

export interface Parent {
  id: number;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  relationship?: string;
  userId: number;
}

export interface Classroom {
  id: number;
  name: string;
  description?: string;
  capacity: number;
  ageGroup?: string;
}

export interface AuthorizedPerson {
  id: number;
  firstName: string;
  lastName: string;
  relationship: string;
  phone: string;
  email?: string;
  identificationNumber?: string;
  studentId: number;
}
