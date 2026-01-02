'use client';

import { useState } from 'react';
import {
    Users,
    Plus,
    Mail,
    Shield,
    Crown,
    Eye,
    Edit,
    Trash2,
    Clock,
    MessageSquare,
    UserPlus,
    Copy,
    Link,
    Check,
    MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type Role = 'owner' | 'admin' | 'editor' | 'viewer';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: Role;
    status: 'online' | 'offline' | 'away';
    lastActive?: string;
}

interface Comment {
    id: string;
    author: string;
    avatar?: string;
    content: string;
    timestamp: string;
    resolved?: boolean;
}

const roleIcons: Record<Role, typeof Crown> = {
    owner: Crown,
    admin: Shield,
    editor: Edit,
    viewer: Eye
};

const roleColors: Record<Role, string> = {
    owner: 'text-yellow-500',
    admin: 'text-purple-500',
    editor: 'text-blue-500',
    viewer: 'text-gray-500'
};

export function CollaborationPanel() {
    const [activeTab, setActiveTab] = useState<'team' | 'comments' | 'activity'>('team');
    const [showInvite, setShowInvite] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<Role>('editor');
    const [linkCopied, setLinkCopied] = useState(false);

    const [teamMembers] = useState<TeamMember[]>([
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'owner', status: 'online' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin', status: 'online' },
        { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'editor', status: 'away', lastActive: '5 min ago' },
        { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'viewer', status: 'offline', lastActive: '2 hours ago' },
    ]);

    const [comments] = useState<Comment[]>([
        { id: '1', author: 'Jane Smith', content: 'Can we update the hero section font?', timestamp: '10 min ago' },
        { id: '2', author: 'Bob Wilson', content: 'The CTA button color should be more vibrant.', timestamp: '1 hour ago', resolved: true },
        { id: '3', author: 'John Doe', content: 'Added new footer component, please review.', timestamp: '2 hours ago' },
    ]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText('https://webbuilder.io/invite/abc123');
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const tabs = [
        { id: 'team', label: 'Team', icon: Users },
        { id: 'comments', label: 'Comments', icon: MessageSquare },
        { id: 'activity', label: 'Activity', icon: Clock },
    ] as const;

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Collaboration</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Work together with your team
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors',
                            activeTab === tab.id
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <tab.icon className="h-3.5 w-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {activeTab === 'team' && (
                        <>
                            {!showInvite ? (
                                <>
                                    <Button
                                        className="w-full"
                                        onClick={() => setShowInvite(true)}
                                    >
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Invite Team Member
                                    </Button>

                                    {/* Online Members */}
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">
                                            Online ({teamMembers.filter(m => m.status === 'online').length})
                                        </Label>
                                        {teamMembers.filter(m => m.status === 'online').map((member) => {
                                            const RoleIcon = roleIcons[member.role];
                                            return (
                                                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                                                    <div className="relative">
                                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                                                            {member.name.charAt(0)}
                                                        </div>
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-medium text-sm truncate">{member.name}</span>
                                                            <RoleIcon className={cn('h-3.5 w-3.5', roleColors[member.role])} />
                                                        </div>
                                                        <span className="text-xs text-muted-foreground truncate block">{member.email}</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Offline Members */}
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">
                                            Offline ({teamMembers.filter(m => m.status !== 'online').length})
                                        </Label>
                                        {teamMembers.filter(m => m.status !== 'online').map((member) => {
                                            const RoleIcon = roleIcons[member.role];
                                            return (
                                                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted opacity-60">
                                                    <div className="relative">
                                                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                                                            {member.name.charAt(0)}
                                                        </div>
                                                        <div className={cn(
                                                            'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background',
                                                            member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                                                        )} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-medium text-sm truncate">{member.name}</span>
                                                            <RoleIcon className={cn('h-3.5 w-3.5', roleColors[member.role])} />
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">{member.lastActive}</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Share Link */}
                                    <div className="pt-4 border-t space-y-2">
                                        <Label className="text-xs">Share Link</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value="https://webbuilder.io/invite/abc123"
                                                readOnly
                                                className="text-xs h-8"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8"
                                                onClick={handleCopyLink}
                                            >
                                                {linkCopied ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Anyone with this link can view the project
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label className="text-sm font-medium">Invite Member</Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowInvite(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Email Address</Label>
                                            <Input
                                                type="email"
                                                placeholder="colleague@example.com"
                                                value={inviteEmail}
                                                onChange={(e) => setInviteEmail(e.target.value)}
                                                className="text-sm"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-xs">Role</Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {(['admin', 'editor', 'viewer'] as Role[]).map((role) => {
                                                    const RoleIcon = roleIcons[role];
                                                    return (
                                                        <button
                                                            key={role}
                                                            onClick={() => setInviteRole(role)}
                                                            className={cn(
                                                                'flex flex-col items-center gap-1 p-3 border rounded-lg transition-colors',
                                                                inviteRole === role && 'border-primary bg-primary/5'
                                                            )}
                                                        >
                                                            <RoleIcon className={cn('h-4 w-4', roleColors[role])} />
                                                            <span className="text-xs capitalize">{role}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="text-xs text-muted-foreground p-2 bg-muted rounded-lg">
                                            {inviteRole === 'admin' && 'Can manage team members and all project settings'}
                                            {inviteRole === 'editor' && 'Can edit content and design elements'}
                                            {inviteRole === 'viewer' && 'Can only view the project'}
                                        </div>

                                        <Button className="w-full">
                                            <Mail className="h-4 w-4 mr-2" />
                                            Send Invitation
                                        </Button>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {activeTab === 'comments' && (
                        <>
                            <div className="space-y-3">
                                {comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className={cn(
                                            'p-3 border rounded-lg',
                                            comment.resolved && 'opacity-60'
                                        )}
                                    >
                                        <div className="flex items-start gap-2 mb-2">
                                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                                                {comment.author.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm">{comment.author}</span>
                                                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                                </div>
                                                <p className="text-sm mt-1">{comment.content}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-8">
                                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                                                Reply
                                            </Button>
                                            {comment.resolved ? (
                                                <span className="flex items-center text-xs text-green-600">
                                                    <Check className="h-3 w-3 mr-1" />
                                                    Resolved
                                                </span>
                                            ) : (
                                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                                    Resolve
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t">
                                <Label className="text-xs mb-2 block">Add Comment</Label>
                                <Textarea
                                    placeholder="Leave a comment..."
                                    className="min-h-[80px] text-sm mb-2"
                                />
                                <Button size="sm" className="w-full">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Post Comment
                                </Button>
                            </div>
                        </>
                    )}

                    {activeTab === 'activity' && (
                        <div className="space-y-3">
                            {[
                                { user: 'John Doe', action: 'updated the hero section', time: '5 min ago' },
                                { user: 'Jane Smith', action: 'added a new component', time: '15 min ago' },
                                { user: 'Bob Wilson', action: 'changed button styles', time: '1 hour ago' },
                                { user: 'Alice Brown', action: 'viewed the project', time: '2 hours ago' },
                                { user: 'John Doe', action: 'published the website', time: '3 hours ago' },
                                { user: 'Jane Smith', action: 'invited Bob Wilson', time: '1 day ago' },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 p-2">
                                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium shrink-0">
                                        {activity.user.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            <span className="font-medium">{activity.user}</span>
                                            <span className="text-muted-foreground"> {activity.action}</span>
                                        </p>
                                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
