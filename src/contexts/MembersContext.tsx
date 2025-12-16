import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface Member {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  join_date: string;
  is_active: boolean;
  photo_url?: string;
  membership_type: 'basic' | 'premium' | 'vip';
  created_at?: string;
}

interface Attendance {
  id: string;
  member_id: string;
  member_name: string;
  date: string;
  time: string;
  user_id: string;
  created_at?: string;
}

interface MembersContextType {
  members: Member[];
  attendance: Attendance[];
  loading: boolean;
  addMember: (member: Omit<Member, 'id' | 'user_id' | 'join_date' | 'created_at'>) => Promise<void>;
  updateMember: (id: string, data: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  markAttendance: (memberId: string, memberName: string) => Promise<void>;
  getTodayAttendance: () => number;
  getActiveMembers: () => number;
  getInactiveMembers: () => number;
}

const MembersContext = createContext<MembersContextType | undefined>(undefined);

export function MembersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch members from Supabase
  const fetchMembers = async () => {
    if (!user?.id) {
      setMembers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance from Supabase
  const fetchAttendance = async () => {
    if (!user?.id) {
      setAttendance([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttendance(data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchMembers();
      fetchAttendance();
    }
  }, [user?.id]);

  const addMember = async (memberData: Omit<Member, 'id' | 'user_id' | 'join_date' | 'created_at'>) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('members')
        .insert([
          {
            user_id: user.id,
            full_name: memberData.full_name,
            email: memberData.email,
            phone: memberData.phone,
            is_active: memberData.is_active,
            membership_type: memberData.membership_type,
            photo_url: memberData.photo_url,
            join_date: new Date().toISOString().split('T')[0],
          },
        ])
        .select();

      if (error) throw error;
      await fetchMembers();
    } catch (error) {
      throw error;
    }
  };

  const updateMember = async (id: string, data: Partial<Member>) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('members')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchMembers();
    } catch (error) {
      throw error;
    }
  };

  const deleteMember = async (id: string) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchMembers();
    } catch (error) {
      throw error;
    }
  };

  const markAttendance = async (memberId: string, memberName: string) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const now = new Date();
      const { error } = await supabase
        .from('attendance')
        .insert([
          {
            user_id: user.id,
            member_id: memberId,
            member_name: memberName,
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().split(' ')[0],
          },
        ]);

      if (error) throw error;
      await fetchAttendance();
    } catch (error) {
      throw error;
    }
  };

  const getTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    return attendance.filter(a => a.date === today).length;
  };

  const getActiveMembers = () => members.filter(m => m.is_active).length;
  const getInactiveMembers = () => members.filter(m => !m.is_active).length;

  return (
    <MembersContext.Provider value={{
      members,
      attendance,
      loading,
      addMember,
      updateMember,
      deleteMember,
      markAttendance,
      getTodayAttendance,
      getActiveMembers,
      getInactiveMembers,
    }}>
      {children}
    </MembersContext.Provider>
  );
}

export function useMembers() {
  const context = useContext(MembersContext);
  if (context === undefined) {
    throw new Error('useMembers must be used within a MembersProvider');
  }
  return context;
}
