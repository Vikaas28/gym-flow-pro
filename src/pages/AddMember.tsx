import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  User, 
  Mail, 
  Phone, 
  ArrowLeft,
  Loader2,
  Crown,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useMembers } from '@/contexts/MembersContext';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

export default function AddMember() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [membershipType, setMembershipType] = useState<'basic' | 'premium' | 'vip'>('basic');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const { addMember } = useMembers();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      await addMember({
        full_name: fullName,
        email,
        phone,
        membership_type: membershipType,
        is_active: isActive,
      });

      toast({
        title: "Member added successfully!",
        description: `${fullName} has been registered as a ${membershipType} member.`,
      });
      
      navigate('/members');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const membershipOptions = [
    { value: 'basic', label: 'Basic', icon: User, description: 'Standard gym access' },
    { value: 'premium', label: 'Premium', icon: Star, description: 'Gym + classes' },
    { value: 'vip', label: 'VIP', icon: Crown, description: 'Full access + personal trainer' },
  ];

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
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center glow-primary">
                <UserPlus className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Add New Member</CardTitle>
                <CardDescription>Register a new gym member</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2 animate-slide-up delay-100">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Full Name <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Enter member's full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Email */}
              <div className="space-y-2 animate-slide-up delay-200">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address <span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2 animate-slide-up delay-300">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Membership Type */}
              <div className="space-y-3 animate-slide-up delay-400">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Crown className="w-4 h-4 text-primary" />
                  Membership Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {membershipOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMembershipType(option.value as 'basic' | 'premium' | 'vip')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                        membershipType === option.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <option.icon className={`w-6 h-6 mx-auto mb-2 ${
                        membershipType === option.value ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <p className="font-semibold text-sm">{option.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 animate-slide-up">
                <div>
                  <p className="font-medium text-foreground">Active Status</p>
                  <p className="text-sm text-muted-foreground">Member can access the gym</p>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4 animate-slide-up">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="gradient" 
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Add Member
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
