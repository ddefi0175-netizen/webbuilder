'use client';

import { useState } from 'react';
import {
    Users,
    Clock,
    Calendar,
    Video,
    Phone,
    MessageSquare,
    Star,
    Check,
    ChevronRight,
    ChevronLeft,
    Headphones,
    Zap,
    Shield,
    Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const SUPPORT_TIERS = [
    {
        id: 'basic',
        name: 'Basic Support',
        price: 0,
        description: 'Community and documentation',
        features: [
            'Community forums',
            'Knowledge base access',
            'Email support (48h response)',
            'Video tutorials',
        ],
        responseTime: '48 hours',
        included: true,
    },
    {
        id: 'priority',
        name: 'Priority Support',
        price: 49,
        description: 'Faster response and chat support',
        features: [
            'Everything in Basic',
            'Live chat support',
            'Email support (24h response)',
            'Screen sharing sessions',
            'Priority ticket queue',
        ],
        responseTime: '24 hours',
        included: false,
    },
    {
        id: 'premium',
        name: 'Premium Support',
        price: 199,
        description: 'Dedicated support team',
        popular: true,
        features: [
            'Everything in Priority',
            'Dedicated support agent',
            'Phone support',
            'Email support (4h response)',
            '1 consulting hour/month',
            'Custom training sessions',
        ],
        responseTime: '4 hours',
        included: false,
    },
];

const CONSULTING_PACKAGES = [
    {
        id: 'single',
        name: 'Single Session',
        price: 149,
        duration: '1 hour',
        description: 'One-on-one expert consultation',
        features: [
            '1 hour video call',
            'Screen sharing',
            'Actionable recommendations',
            'Follow-up summary email',
        ],
    },
    {
        id: 'pack3',
        name: '3-Session Pack',
        price: 399,
        duration: '3 hours',
        description: 'Extended support over multiple sessions',
        popular: true,
        features: [
            '3 hours of video calls',
            'Flexible scheduling',
            'Project planning help',
            'Implementation guidance',
            'Priority booking',
        ],
    },
    {
        id: 'pack10',
        name: '10-Session Pack',
        price: 999,
        duration: '10 hours',
        description: 'Comprehensive consulting engagement',
        features: [
            '10 hours of video calls',
            'Dedicated consultant',
            'Custom website audit',
            'Strategic roadmap',
            'Monthly check-ins',
            'Slack access',
        ],
    },
];

const CONSULTANTS = [
    {
        id: '1',
        name: 'Sarah Johnson',
        role: 'Senior Web Consultant',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        rating: 4.9,
        reviews: 156,
        specialties: ['E-commerce', 'SEO', 'Conversions'],
        availability: ['Mon', 'Tue', 'Wed', 'Thu'],
    },
    {
        id: '2',
        name: 'Mike Chen',
        role: 'AI & Automation Expert',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 4.8,
        reviews: 98,
        specialties: ['AI Features', 'Automation', 'Integration'],
        availability: ['Tue', 'Wed', 'Fri'],
    },
    {
        id: '3',
        name: 'Emma Wilson',
        role: 'Design Specialist',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        rating: 5.0,
        reviews: 203,
        specialties: ['UI/UX', 'Branding', 'Mobile Design'],
        availability: ['Mon', 'Wed', 'Thu', 'Fri'],
    },
];

const TIME_SLOTS = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

export default function SupportPage() {
    const [activeTab, setActiveTab] = useState<'support' | 'consulting'>('support');
    const [selectedPackage, setSelectedPackage] = useState('pack3');
    const [selectedConsultant, setSelectedConsultant] = useState(CONSULTANTS[0]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [bookingStep, setBookingStep] = useState(1);

    // Generate dates for the next 14 days
    const dates = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        return date;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Support & Consulting</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Get help from our expert team. From basic support to one-on-one consulting.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-muted rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('support')}
                            className={cn(
                                'px-6 py-2 rounded-md text-sm font-medium transition-colors',
                                activeTab === 'support'
                                    ? 'bg-background shadow'
                                    : 'hover:text-foreground'
                            )}
                        >
                            <Headphones className="h-4 w-4 inline mr-2" />
                            Support Plans
                        </button>
                        <button
                            onClick={() => setActiveTab('consulting')}
                            className={cn(
                                'px-6 py-2 rounded-md text-sm font-medium transition-colors',
                                activeTab === 'consulting'
                                    ? 'bg-background shadow'
                                    : 'hover:text-foreground'
                            )}
                        >
                            <Users className="h-4 w-4 inline mr-2" />
                            Consulting
                        </button>
                    </div>
                </div>

                {activeTab === 'support' && (
                    <>
                        {/* Support Tiers */}
                        <div className="grid grid-cols-3 gap-6 mb-16">
                            {SUPPORT_TIERS.map((tier) => (
                                <div
                                    key={tier.id}
                                    className={cn(
                                        'bg-card border rounded-2xl p-6 relative',
                                        tier.popular && 'border-primary ring-2 ring-primary/20'
                                    )}
                                >
                                    {tier.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                                            Recommended
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>

                                    <div className="mb-6">
                                        {tier.price === 0 ? (
                                            <span className="text-2xl font-bold">Included</span>
                                        ) : (
                                            <>
                                                <span className="text-4xl font-bold">${tier.price}</span>
                                                <span className="text-muted-foreground">/month</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mb-4 p-2 bg-muted rounded-lg">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Response time: {tier.responseTime}</span>
                                    </div>

                                    <ul className="space-y-3 mb-6">
                                        {tier.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm">
                                                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        className="w-full"
                                        variant={tier.included ? 'outline' : tier.popular ? 'default' : 'outline'}
                                        disabled={tier.included}
                                    >
                                        {tier.included ? 'Currently Active' : 'Upgrade'}
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Support Features */}
                        <div className="grid grid-cols-4 gap-6 mb-16">
                            {[
                                { icon: MessageSquare, title: 'Live Chat', desc: '24/7 chat support' },
                                { icon: Video, title: 'Screen Share', desc: 'Real-time assistance' },
                                { icon: Phone, title: 'Phone Support', desc: 'Direct line to experts' },
                                { icon: Shield, title: 'SLA Guarantee', desc: 'Response time guarantee' },
                            ].map((feature, index) => (
                                <div key={index} className="text-center p-6 bg-card border rounded-xl">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'consulting' && (
                    <>
                        {/* Consulting Packages */}
                        <div className="grid grid-cols-3 gap-6 mb-16">
                            {CONSULTING_PACKAGES.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    onClick={() => setSelectedPackage(pkg.id)}
                                    className={cn(
                                        'bg-card border rounded-2xl p-6 relative cursor-pointer transition-all',
                                        selectedPackage === pkg.id && 'border-primary ring-2 ring-primary/20',
                                        pkg.popular && selectedPackage !== pkg.id && 'border-primary/50'
                                    )}
                                >
                                    {pkg.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                                            Best Value
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>

                                    <div className="mb-4">
                                        <span className="text-4xl font-bold">${pkg.price}</span>
                                        <div className="text-sm text-muted-foreground">{pkg.duration} total</div>
                                    </div>

                                    <ul className="space-y-3 mb-6">
                                        {pkg.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm">
                                                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        className="w-full"
                                        variant={selectedPackage === pkg.id ? 'default' : 'outline'}
                                    >
                                        {selectedPackage === pkg.id ? 'Selected' : 'Select'}
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Booking Section */}
                        <div className="bg-card border rounded-2xl p-6 mb-16">
                            <h2 className="text-xl font-bold mb-6">Book a Session</h2>

                            {/* Steps */}
                            <div className="flex items-center justify-center gap-4 mb-8">
                                {[
                                    { num: 1, label: 'Choose Consultant' },
                                    { num: 2, label: 'Select Date & Time' },
                                    { num: 3, label: 'Confirm Booking' },
                                ].map((step, index) => (
                                    <div key={step.num} className="flex items-center">
                                        <div className={cn(
                                            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                                            bookingStep >= step.num
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                        )}>
                                            {step.num}
                                        </div>
                                        <span className={cn(
                                            'ml-2 text-sm',
                                            bookingStep >= step.num ? 'font-medium' : 'text-muted-foreground'
                                        )}>
                                            {step.label}
                                        </span>
                                        {index < 2 && (
                                            <ChevronRight className="h-4 w-4 mx-4 text-muted-foreground" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {bookingStep === 1 && (
                                <div>
                                    <h3 className="font-medium mb-4">Select a Consultant</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {CONSULTANTS.map((consultant) => (
                                            <div
                                                key={consultant.id}
                                                onClick={() => setSelectedConsultant(consultant)}
                                                className={cn(
                                                    'p-4 border rounded-xl cursor-pointer transition-all',
                                                    selectedConsultant.id === consultant.id && 'border-primary ring-2 ring-primary/20'
                                                )}
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <img
                                                        src={consultant.avatar}
                                                        alt={consultant.name}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <div className="font-semibold">{consultant.name}</div>
                                                        <div className="text-sm text-muted-foreground">{consultant.role}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 mb-3">
                                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                                    <span className="text-sm font-medium">{consultant.rating}</span>
                                                    <span className="text-sm text-muted-foreground">({consultant.reviews} reviews)</span>
                                                </div>

                                                <div className="flex flex-wrap gap-1">
                                                    {consultant.specialties.map((specialty) => (
                                                        <span key={specialty} className="px-2 py-0.5 bg-muted text-xs rounded-full">
                                                            {specialty}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end mt-6">
                                        <Button onClick={() => setBookingStep(2)}>
                                            Continue
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {bookingStep === 2 && (
                                <div>
                                    <h3 className="font-medium mb-4">Select Date & Time</h3>

                                    {/* Date Selection */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-medium mb-3">Available Dates</h4>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {dates.map((date) => {
                                                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                                                const isAvailable = selectedConsultant.availability.includes(dayName);
                                                const isSelected = selectedDate?.toDateString() === date.toDateString();

                                                return (
                                                    <button
                                                        key={date.toISOString()}
                                                        onClick={() => isAvailable && setSelectedDate(date)}
                                                        disabled={!isAvailable}
                                                        className={cn(
                                                            'flex flex-col items-center p-3 rounded-lg border min-w-[70px] transition-colors',
                                                            isSelected && 'border-primary bg-primary/5',
                                                            !isAvailable && 'opacity-50 cursor-not-allowed',
                                                            isAvailable && !isSelected && 'hover:border-primary/50'
                                                        )}
                                                    >
                                                        <span className="text-xs text-muted-foreground">{dayName}</span>
                                                        <span className="text-lg font-semibold">{date.getDate()}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {date.toLocaleDateString('en-US', { month: 'short' })}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Time Selection */}
                                    {selectedDate && (
                                        <div className="mb-6">
                                            <h4 className="text-sm font-medium mb-3">Available Times</h4>
                                            <div className="grid grid-cols-7 gap-2">
                                                {TIME_SLOTS.map((time) => (
                                                    <button
                                                        key={time}
                                                        onClick={() => setSelectedTime(time)}
                                                        className={cn(
                                                            'px-3 py-2 border rounded-lg text-sm transition-colors',
                                                            selectedTime === time
                                                                ? 'border-primary bg-primary text-primary-foreground'
                                                                : 'hover:border-primary/50'
                                                        )}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between mt-6">
                                        <Button variant="outline" onClick={() => setBookingStep(1)}>
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Back
                                        </Button>
                                        <Button
                                            onClick={() => setBookingStep(3)}
                                            disabled={!selectedDate || !selectedTime}
                                        >
                                            Continue
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {bookingStep === 3 && (
                                <div>
                                    <h3 className="font-medium mb-4">Confirm Your Booking</h3>

                                    <div className="bg-muted/50 rounded-xl p-6 mb-6">
                                        <div className="flex items-start gap-4 mb-6">
                                            <img
                                                src={selectedConsultant.avatar}
                                                alt={selectedConsultant.name}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                            <div>
                                                <div className="font-semibold text-lg">{selectedConsultant.name}</div>
                                                <div className="text-muted-foreground">{selectedConsultant.role}</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-sm text-muted-foreground">Package</div>
                                                <div className="font-medium">
                                                    {CONSULTING_PACKAGES.find(p => p.id === selectedPackage)?.name}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground">Price</div>
                                                <div className="font-medium">
                                                    ${CONSULTING_PACKAGES.find(p => p.id === selectedPackage)?.price}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground">Date</div>
                                                <div className="font-medium">
                                                    {selectedDate?.toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground">Time</div>
                                                <div className="font-medium">{selectedTime}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Your Name</label>
                                            <Input placeholder="Enter your name" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Email</label>
                                            <Input type="email" placeholder="Enter your email" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">What would you like help with?</label>
                                            <textarea
                                                className="w-full border rounded-lg p-3 text-sm min-h-[100px]"
                                                placeholder="Describe your project or questions..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <Button variant="outline" onClick={() => setBookingStep(2)}>
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Back
                                        </Button>
                                        <Button>
                                            Confirm & Pay ${CONSULTING_PACKAGES.find(p => p.id === selectedPackage)?.price}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-4 gap-6">
                            {[
                                { icon: Award, title: 'Expert Consultants', desc: 'Certified professionals' },
                                { icon: Shield, title: 'Satisfaction Guarantee', desc: 'Money back if not satisfied' },
                                { icon: Zap, title: 'Instant Booking', desc: 'Confirm in minutes' },
                                { icon: Video, title: 'HD Video Calls', desc: 'Crystal clear sessions' },
                            ].map((badge, index) => (
                                <div key={index} className="text-center p-6">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <badge.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold mb-1">{badge.title}</h3>
                                    <p className="text-sm text-muted-foreground">{badge.desc}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
