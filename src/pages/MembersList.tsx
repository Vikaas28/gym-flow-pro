import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone,
  Crown,
  Star,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useMembers, Member } from '@/contexts/MembersContext';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MembersList() {
  const { members, deleteMember, updateMember, loading } = useMembers();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.full_name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      member.phone.includes(search);
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && member.is_active) ||
      (filter === 'inactive' && !member.is_active);

    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteMember(id);
      toast({
        title: "Member deleted",
        description: "The member has been removed from the system.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete member",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (member: Member) => {
    try {
      await updateMember(member.id, { is_active: !member.is_active });
      toast({
        title: member.is_active ? "Member deactivated" : "Member activated",
        description: `${member.full_name} has been ${member.is_active ? 'deactivated' : 'activated'}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update member",
        variant: "destructive",
      });
    }
  };

  const membershipIcons = {
    basic: User,
    premium: Star,
    vip: Crown,
  };

  const membershipColors = {
    basic: 'text-muted-foreground bg-muted',
    premium: 'text-warning bg-warning/10',
    vip: 'text-primary bg-primary/10',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-up">
          <div>
            <h1 className="text-3xl font-display font-bold gradient-text">
              Members Management
            </h1>
            <p className="text-muted-foreground mt-1">View and manage all gym members</p>
          </div>
          <Link to="/add-member">
            <Button variant="gradient" size="lg">
              <UserPlus className="w-5 h-5" />
              Add New Member
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="p-4 animate-slide-up delay-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48 h-12 bg-muted/50">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Members Grid */}
        {loading ? (
          <Card className="p-12 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Loading members...</h3>
          </Card>
        ) : filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member, index) => {
              const MembershipIcon = membershipIcons[member.membership_type];
              return (
                <Card 
                  key={member.id} 
                  className="overflow-hidden hover:border-primary/30 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${(index + 2) * 50}ms` }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                          {member.full_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{member.full_name}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${membershipColors[member.membership_type]}`}>
                            <MembershipIcon className="w-3 h-3" />
                            {member.membership_type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.is_active 
                          ? 'bg-success/10 text-success' 
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {member.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {member.phone}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => toggleStatus(member)}
                      >
                        {member.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {member.full_name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-muted hover:bg-muted/80">Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(member.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">No members found</h3>
            <p className="text-muted-foreground mt-2">
              {search || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding your first member'}
            </p>
            {!search && filter === 'all' && (
              <Link to="/add-member" className="mt-4 inline-block">
                <Button variant="gradient">
                  <UserPlus className="w-5 h-5" />
                  Add First Member
                </Button>
              </Link>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
