'use client';

import { useState } from 'react';
import {
    Play,
    Clock,
    BookOpen,
    Video,
    FileText,
    GraduationCap,
    Star,
    Users,
    CheckCircle,
    Lock,
    ChevronRight,
    Trophy,
    Zap,
    Target,
    Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const COURSE_CATEGORIES = [
    { id: 'all', label: 'All Courses' },
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'design', label: 'Design Basics' },
    { id: 'advanced', label: 'Advanced Techniques' },
    { id: 'ai', label: 'AI Features' },
    { id: 'seo', label: 'SEO & Marketing' },
    { id: 'ecommerce', label: 'E-Commerce' },
];

const LEARNING_PATHS = [
    {
        id: 'beginner',
        title: 'Beginner Path',
        description: 'Start from zero and build your first website',
        courses: 5,
        duration: '4 hours',
        icon: GraduationCap,
        color: 'from-green-500 to-emerald-500',
    },
    {
        id: 'designer',
        title: 'Design Mastery',
        description: 'Create stunning, professional designs',
        courses: 8,
        duration: '8 hours',
        icon: Target,
        color: 'from-purple-500 to-pink-500',
    },
    {
        id: 'ai-expert',
        title: 'AI Power User',
        description: 'Master all AI features and automation',
        courses: 6,
        duration: '5 hours',
        icon: Zap,
        color: 'from-blue-500 to-cyan-500',
    },
];

const MOCK_COURSES = [
    {
        id: '1',
        title: 'Getting Started with WebBuilder',
        description: 'Learn the basics of creating your first website with our intuitive builder.',
        category: 'getting-started',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=225&fit=crop',
        duration: '45 min',
        lessons: 8,
        level: 'Beginner',
        isPremium: false,
        rating: 4.9,
        students: 15234,
        instructor: 'Sarah Johnson',
        progress: 60,
        completed: false,
    },
    {
        id: '2',
        title: 'AI-Powered Website Generation',
        description: 'Harness the power of AI to generate complete websites from descriptions.',
        category: 'ai',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop',
        duration: '1h 15min',
        lessons: 12,
        level: 'Intermediate',
        isPremium: true,
        rating: 4.8,
        students: 8456,
        instructor: 'Mike Chen',
        progress: 0,
        completed: false,
    },
    {
        id: '3',
        title: 'Professional Web Design Principles',
        description: 'Master the fundamentals of color theory, typography, and layout.',
        category: 'design',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
        duration: '2h 30min',
        lessons: 18,
        level: 'Intermediate',
        isPremium: true,
        rating: 4.9,
        students: 12890,
        instructor: 'Emma Wilson',
        progress: 100,
        completed: true,
    },
    {
        id: '4',
        title: 'SEO Optimization for Beginners',
        description: 'Learn how to make your website rank higher in search engines.',
        category: 'seo',
        thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=225&fit=crop',
        duration: '1h 45min',
        lessons: 14,
        level: 'Beginner',
        isPremium: false,
        rating: 4.7,
        students: 9876,
        instructor: 'David Park',
        progress: 25,
        completed: false,
    },
    {
        id: '5',
        title: 'Building E-Commerce Stores',
        description: 'Create a fully functional online store with products and payments.',
        category: 'ecommerce',
        thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop',
        duration: '3h',
        lessons: 22,
        level: 'Advanced',
        isPremium: true,
        rating: 4.8,
        students: 6543,
        instructor: 'Lisa Zhang',
        progress: 0,
        completed: false,
    },
    {
        id: '6',
        title: 'Advanced Animations & Interactions',
        description: 'Create stunning animations and interactive elements.',
        category: 'advanced',
        thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=225&fit=crop',
        duration: '2h',
        lessons: 16,
        level: 'Advanced',
        isPremium: true,
        rating: 4.9,
        students: 4321,
        instructor: 'Alex Rivera',
        progress: 0,
        completed: false,
    },
];

const QUICK_TUTORIALS = [
    { id: '1', title: 'Adding a Contact Form', duration: '3 min', views: '12K' },
    { id: '2', title: 'Customizing Navigation', duration: '5 min', views: '8.5K' },
    { id: '3', title: 'Using AI Image Generation', duration: '4 min', views: '15K' },
    { id: '4', title: 'Mobile Responsive Design', duration: '6 min', views: '10K' },
    { id: '5', title: 'Adding Custom Fonts', duration: '2 min', views: '7.2K' },
];

export default function LearnPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = MOCK_COURSES.filter((course) => {
        if (selectedCategory !== 'all' && course.category !== selectedCategory) return false;
        if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const inProgressCourses = MOCK_COURSES.filter(c => c.progress > 0 && !c.completed);
    const completedCourses = MOCK_COURSES.filter(c => c.completed);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Learning Center</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Master website building with our comprehensive courses and tutorials. From beginner to expert.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-12">
                    <div className="bg-card border rounded-xl p-6 text-center">
                        <div className="text-3xl font-bold text-primary">50+</div>
                        <div className="text-sm text-muted-foreground">Courses</div>
                    </div>
                    <div className="bg-card border rounded-xl p-6 text-center">
                        <div className="text-3xl font-bold text-primary">200+</div>
                        <div className="text-sm text-muted-foreground">Video Lessons</div>
                    </div>
                    <div className="bg-card border rounded-xl p-6 text-center">
                        <div className="text-3xl font-bold text-primary">100K+</div>
                        <div className="text-sm text-muted-foreground">Students</div>
                    </div>
                    <div className="bg-card border rounded-xl p-6 text-center">
                        <div className="text-3xl font-bold text-primary">4.8</div>
                        <div className="text-sm text-muted-foreground">Avg. Rating</div>
                    </div>
                </div>

                {/* Learning Paths */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Learning Paths</h2>
                    <div className="grid grid-cols-3 gap-6">
                        {LEARNING_PATHS.map((path) => (
                            <div
                                key={path.id}
                                className="relative overflow-hidden bg-card border rounded-xl p-6 hover:border-primary transition-colors cursor-pointer"
                            >
                                <div className={cn(
                                    'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4',
                                    path.color
                                )}>
                                    <path.icon className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{path.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{path.description}</p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1">
                                        <BookOpen className="h-4 w-4" />
                                        {path.courses} courses
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {path.duration}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Continue Learning */}
                {inProgressCourses.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
                        <div className="grid grid-cols-2 gap-6">
                            {inProgressCourses.map((course) => (
                                <div key={course.id} className="bg-card border rounded-xl p-4 flex gap-4">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-32 h-20 object-cover rounded-lg"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold mb-1">{course.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {course.lessons} lessons • {course.duration}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-grow h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full"
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium">{course.progress}%</span>
                                        </div>
                                    </div>
                                    <Button size="sm">
                                        <Play className="h-4 w-4 mr-1" />
                                        Continue
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Tutorials */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Quick Tutorials</h2>
                        <Button variant="ghost" size="sm">
                            View All <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                        {QUICK_TUTORIALS.map((tutorial) => (
                            <div key={tutorial.id} className="bg-card border rounded-xl p-4 hover:border-primary transition-colors cursor-pointer">
                                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mb-3">
                                    <Video className="h-5 w-5 text-primary" />
                                </div>
                                <h4 className="font-medium text-sm mb-2">{tutorial.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{tutorial.duration}</span>
                                    <span>•</span>
                                    <span>{tutorial.views} views</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {COURSE_CATEGORIES.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={cn(
                                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                                    selectedCategory === category.id
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted hover:bg-muted/80'
                                )}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative ml-auto">
                        <Input
                            placeholder="Search courses..."
                            className="w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* All Courses */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">All Courses</h2>
                    <div className="grid grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No courses found matching your criteria.</p>
                        </div>
                    )}
                </div>

                {/* Achievements */}
                {completedCourses.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Your Achievements</h2>
                        <div className="bg-card border rounded-xl p-6">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                                        <Trophy className="h-8 w-8 text-amber-500" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Courses Completed</div>
                                        <div className="text-2xl font-bold text-primary">{completedCourses.length}</div>
                                    </div>
                                </div>
                                <div className="w-px h-12 bg-border" />
                                <div className="flex gap-4">
                                    {completedCourses.map((course) => (
                                        <div key={course.id} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm font-medium">{course.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Premium CTA */}
                <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-white text-center">
                    <Crown className="h-12 w-12 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Unlock All Premium Courses</h2>
                    <p className="text-white/80 mb-6 max-w-xl mx-auto">
                        Get unlimited access to all courses, including advanced tutorials and exclusive content.
                    </p>
                    <Button size="lg" variant="secondary">
                        Upgrade to Pro
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface CourseCardProps {
    course: typeof MOCK_COURSES[0];
}

function CourseCard({ course }: CourseCardProps) {
    return (
        <div className="group bg-card border rounded-xl overflow-hidden hover:border-primary transition-colors">
            {/* Thumbnail */}
            <div className="relative aspect-video">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                        <Play className="h-6 w-6 text-primary fill-primary" />
                    </button>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full',
                        course.level === 'Beginner' && 'bg-green-500 text-white',
                        course.level === 'Intermediate' && 'bg-blue-500 text-white',
                        course.level === 'Advanced' && 'bg-purple-500 text-white'
                    )}>
                        {course.level}
                    </span>
                    {course.isPremium && (
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                            <Crown className="h-3 w-3" />
                            Premium
                        </span>
                    )}
                </div>

                {/* Duration */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
                    {course.duration}
                </div>

                {/* Progress */}
                {course.progress > 0 && !course.completed && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                        <div
                            className="h-full bg-primary"
                            style={{ width: `${course.progress}%` }}
                        />
                    </div>
                )}

                {/* Completed badge */}
                {course.completed && (
                    <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Completed
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {course.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {course.lessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            ({course.students.toLocaleString()} students)
                        </span>
                    </div>

                    <Button size="sm" variant={course.isPremium ? 'default' : 'outline'}>
                        {course.completed ? 'Review' : course.progress > 0 ? 'Continue' : 'Start'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
