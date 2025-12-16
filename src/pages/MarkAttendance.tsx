import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  ArrowLeft,
  Loader2,
  Check,
  Calendar,
  Clock,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useMembers } from '@/contexts/MembersContext';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MarkAttendance() {
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const { members, markAttendance, attendance } = useMembers();
  const navigate = useNavigate();
  
  const activeMembers = members.filter(m => m.is_active);
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember) {
      toast({
        title: "Error",
        description: "Please select a member",
        variant: "destructive",
      });
      return;
    }

    // Check if already marked today
    const alreadyMarked = todayAttendance.some(a => a.member_id === selectedMember);
    if (alreadyMarked) {
      toast({
        title: "Already Checked In",
        description: "This member has already been marked for today.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const member = members.find(m => m.id === selectedMember);
      if (!member) throw new Error('Member not found');
      
      await markAttendance(selectedMember, member.full_name);
      
      toast({
        title: "Attendance Marked!",
        description: `${member.full_name} has been checked in successfully.`,
      });
      
      setSelectedMember('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark attendance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedMemberData = members.find(m => m.id === selectedMember);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Card className="animate-slide-up">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl gradient-secondary flex items-center justify-center glow-secondary">
                <ClipboardCheck className="w-7 h-7 text-secondary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Mark Attendance</CardTitle>
                <CardDescription>Check in members for today</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {activeMembers.length > 0 ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date & Time Display */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 animate-slide-up delay-100">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-5 h-5 text-secondary" />
                    <span>{new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-5 h-5 text-secondary" />
                    <span>{new Date().toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>

                {/* Member Selection */}
                <div className="space-y-2 animate-slide-up delay-200">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-secondary" />
                    Select Member
                  </label>
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger className="h-12 bg-muted/50">
                      <SelectValue placeholder="Choose a member..." />
                    </SelectTrigger>
                    <SelectContent>
                      {activeMembers.map((member) => {
                        const isCheckedIn = todayAttendance.some(a => a.member_id === member.id);
                        return (
                          <SelectItem 
                            key={member.id} 
                            value={member.id}
                            disabled={isCheckedIn}
                          >
                            <div className="flex items-center gap-2">
                              <span>{member.full_name}</span>
                              <span className="text-muted-foreground">- {member.email}</span>
                              {isCheckedIn && (
                                <span className="text-success text-xs">(Already checked in)</span>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selected Member Preview */}
                {selectedMemberData && (
                  <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 animate-scale-in">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center text-secondary-foreground font-bold">
                        {selectedMemberData.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{selectedMemberData.full_name}</p>
                        <p className="text-sm text-muted-foreground">{selectedMemberData.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4 animate-slide-up delay-300">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="secondary" 
                    className="flex-1"
                    disabled={loading || !selectedMember}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Mark Attendance
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">No Active Members</h3>
                <p className="text-muted-foreground mt-2">
                  There are no active members to mark attendance for.
                </p>
                <Button 
                  variant="gradient" 
                  className="mt-4"
                  onClick={() => navigate('/add-member')}
                >
                  Add a Member
                </Button>
              </div>
            )}

            {/* Today's Check-ins */}
            {todayAttendance.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border/50 animate-slide-up">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  Today's Check-ins ({todayAttendance.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {todayAttendance.map((record) => (
                    <div 
                      key={record.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-success" />
                        </div>
                        <span className="font-medium text-foreground">{record.member_name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{record.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
