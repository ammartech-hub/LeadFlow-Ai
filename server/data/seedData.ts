import {
  Company,
  Contact,
  Deal,
  FollowUp,
  Lead,
  Meeting,
  Communication,
  Activity,
  Solution,
  SalesTarget,
  User
} from '../../src/types/index.js';

export const USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Aditi Sharma',
    email: 'admin@leadflow.demo',
    role: 'ADMIN',
    title: 'VP of Global Sales & Operations',
    monthlyTarget: 5000000
  },
  {
    id: 'user-manager',
    name: 'Rajesh Kulkarni',
    email: 'manager@leadflow.demo',
    role: 'SALES_MANAGER',
    title: 'B2B Sales Director - Enterprise CPaaS',
    monthlyTarget: 3500000
  },
  {
    id: 'user-sales',
    name: 'Ammar Khan',
    email: 'sales@leadflow.demo',
    role: 'SALES_EXECUTIVE',
    title: 'Enterprise Account Executive',
    monthlyTarget: 1500000
  },
  {
    id: 'user-sales-2',
    name: 'Priya Iyer',
    email: 'priya@leadflow.demo',
    role: 'SALES_EXECUTIVE',
    title: 'Senior Business Development Representative',
    monthlyTarget: 1200000
  }
];

export const SOLUTIONS: Solution[] = [
  {
    id: 'sol-sms-api',
    name: 'SMS API',
    category: 'Programmable Messaging',
    shortDescription: 'Global carrier-grade SMS gateway with high-throughput delivery and redundancy.',
    fullDescription: 'High-availability SMS API providing direct telecom carrier routing, ultra-low latency, and DLT regulatory compliance for critical 2-way and bulk enterprise messaging.',
    features: ['Direct Telecom Carrier Routes', 'Real-time DLR (Delivery Reports)', 'DLT Template Whitelisting', 'Dynamic Sender IDs', 'Sub-second Latency'],
    useCases: ['System alerts', 'Customer verification', 'Critical status updates', 'Mass emergency broadcasts'],
    targetIndustries: ['Banking', 'Fintech', 'Logistics', 'Retail', 'Healthcare'],
    customerProfile: 'Enterprises needing rock-solid delivery rates above 99.5% with high concurrent volume throughput.',
    pricingModel: 'Tiered per-SMS volume pricing (starting at ₹0.14 per SMS)',
    benefits: ['99.9% uptime SLA', 'Instant carrier failover routes', 'Transparent delivery analytics']
  },
  {
    id: 'sol-otp-messaging',
    name: 'OTP Messaging',
    category: 'Authentication & Security',
    shortDescription: 'Dedicated high-priority channel for two-factor authentication and one-time passwords.',
    fullDescription: 'Zero-latency dedicated OTP messaging routes optimized for login verification, transaction authorization, and MFA with automatic carrier failover and voice backup fallback.',
    features: ['Dedicated Priority Routing', 'Sub-5-second Delivery SLA', 'Automatic Voice OTP Fallback', 'Fraud Detection & Rate Limiting', 'Encrypted Payload Delivery'],
    useCases: ['User registration verification', 'Payment transaction 2FA', 'Password resets', 'Secure device binding'],
    targetIndustries: ['Banking', 'Fintech', 'E-commerce', 'Healthcare', 'SaaS'],
    customerProfile: 'Web and mobile platforms where signup drop-off or delayed OTP directly causes lost revenue.',
    pricingModel: 'Per-verified-OTP or flat transaction bracket',
    benefits: ['99.8% delivered within 5 seconds', 'Zero cart/login drop-offs due to OTP timeouts', 'Voice fallback redundancy']
  },
  {
    id: 'sol-whatsapp-biz',
    name: 'WhatsApp Business Communication',
    category: 'Conversational Messaging',
    shortDescription: 'Official WhatsApp Business API platform for interactive customer engagement and verified support.',
    fullDescription: 'Meta-verified WhatsApp Business API gateway enabling rich media messaging, interactive call-to-action buttons, automated catalog sharing, and conversational support bots.',
    features: ['Green Tick Official Verification Support', 'Interactive Quick-Reply Buttons', 'Rich Media & PDF Catalogs', 'Multi-agent Inbox & Bot Handoff', '24h Session Window Automation'],
    useCases: ['Order confirmation & shipping updates', 'Interactive customer support', 'Personalized abandoned cart recovery', 'KYC document collection'],
    targetIndustries: ['E-commerce', 'Fintech', 'Retail', 'EdTech', 'Healthcare', 'Logistics'],
    customerProfile: 'B2C & B2B brands looking to improve engagement beyond email with 98% open rates.',
    pricingModel: 'Per-conversation (User-initiated vs Business-initiated marketing/utility/auth)',
    benefits: ['Up to 5x higher engagement than traditional email', 'Frictionless media exchange', 'Verified brand trust']
  },
  {
    id: 'sol-transactional-msg',
    name: 'Transactional Messaging',
    category: 'Automated Notifications',
    shortDescription: 'Mission-critical automated notification infrastructure across multiple channels.',
    fullDescription: 'Unified event-driven notification engine that triggers real-time order receipts, account alerts, shipping milestones, and invoice dispatches via webhook or REST API.',
    features: ['Idempotent Event Dispatch', 'Multi-channel Fallback Matrix', 'Smart Dynamic Templating', 'Audit Log & Delivery Proof', 'Deep Webhook Integration'],
    useCases: ['Invoice and payment receipts', 'Order tracking & courier updates', 'Booking confirmations', 'Policy renewals'],
    targetIndustries: ['E-commerce', 'Banking', 'Logistics', 'SaaS', 'EdTech'],
    customerProfile: 'Growth businesses scaling order and transaction volumes seeking unified notification pipeline.',
    pricingModel: 'Monthly active notifications bracket + payload fees',
    benefits: ['Guaranteed delivery via channel fallback', 'Reduces customer support tickets by 40%', 'Centralized notification logs']
  },
  {
    id: 'sol-promotional-msg',
    name: 'Promotional Messaging',
    category: 'Marketing Campaigns',
    shortDescription: 'Targeted broadcast campaigns with advanced segmenting, opt-out management, and analytics.',
    fullDescription: 'Enterprise campaign manager designed for high-conversion seasonal blasts, product launches, and loyalty discounts with built-in opt-out scrubbers and DND compliance.',
    features: ['Automated DND / Opt-out Registry Scrubbing', 'High-throughput Scheduled Blasts', 'Click-through Link Tracking (Short URLs)', 'Cohort Segmentation & Tagging', 'A/B Content Testing'],
    useCases: ['Seasonal flash sales', 'New feature announcements', 'Loyalty discount coupons', 'Re-engagement campaigns'],
    targetIndustries: ['Retail', 'E-commerce', 'EdTech', 'Real Estate', 'Logistics'],
    customerProfile: 'Marketing and growth teams looking to maximize ROI while respecting regulatory compliance.',
    pricingModel: 'Volume-based consumption tiers',
    benefits: ['100% regulatory DND compliance', 'Real-time click tracking', 'Scales to millions of concurrent messages']
  },
  {
    id: 'sol-cloud-comm',
    name: 'Cloud Communication',
    category: 'Virtual PBX & Cloud Telephony',
    shortDescription: 'Virtual number masking, IVR menus, click-to-call, and smart call routing infrastructure.',
    fullDescription: 'Cloud telephony suite providing virtual number pools, number privacy masking (buyer-seller privacy), multi-level IVRs, and programmatic inbound/outbound call bridging.',
    features: ['Virtual Number Privacy Masking', 'Visual Drag-and-drop IVR Builder', 'Click-to-Call SDK', 'Call Recording & Transcription', 'Geo-distributed SIP Trunks'],
    useCases: ['Marketplace buyer-seller privacy', 'Sales hotline distribution', 'Support IVR routing', 'Remote agent softphones'],
    targetIndustries: ['Logistics', 'Real Estate', 'Healthcare', 'E-commerce', 'SaaS'],
    customerProfile: 'Marketplaces and distributed teams needing telephone privacy and scalable PBX without on-premise hardware.',
    pricingModel: 'Per-minute billing + virtual number monthly rental',
    benefits: ['100% phone number privacy protection', 'No on-premise telecom hardware needed', 'Comprehensive call logs and recordings']
  },
  {
    id: 'sol-ai-voice',
    name: 'AI Voice Agent',
    category: 'Autonomous Conversational AI',
    shortDescription: 'Human-like conversational voice bots for inbound triage and automated outbound calling.',
    fullDescription: 'Autonomous low-latency conversational AI agents powered by generative speech and LLMs that conduct natural telephone conversations for lead qualification, appointment confirmation, and customer surveys.',
    features: ['Sub-500ms Conversational Latency', 'Multi-lingual & Regional Accent Support', 'Dynamic Script & Guardrails Customization', 'Live Agent Transfer Protocol', 'Real-time Intent Extraction & CRM Sync'],
    useCases: ['Outbound lead qualification calls', 'Payment reminder follow-ups', 'Appointment confirmation and rescheduling', 'Feedback surveys'],
    targetIndustries: ['Fintech', 'Banking', 'EdTech', 'Healthcare', 'Real Estate', 'SaaS'],
    customerProfile: 'High-velocity sales and collections teams handling thousands of repetitive calls each week.',
    pricingModel: 'Per-minute of conversational AI execution',
    benefits: ['Reduces SDR repetitive calling burden by 65%', 'Qualifies leads 24/7 in real-time', 'Consistent pitch delivery every time']
  },
  {
    id: 'sol-comm-auto',
    name: 'Communication Automation',
    category: 'Workflow Orchestration',
    shortDescription: 'Visual drip sequences and triggered multi-channel customer lifecycle workflows.',
    fullDescription: 'No-code event-driven communication journey builder that triggers personalized SMS, WhatsApp, and email messages based on user app behaviors, CRM stage changes, or time lapses.',
    features: ['Visual Workflow Canvas', 'Behavior-based Triggers & Webhooks', 'Intelligent Channel Optimization', 'Wait / Delay & Branching Rules', 'Pre-built Sales & Retention Templates'],
    useCases: ['Drip onboarding sequences', 'Abandoned checkout reactivation', 'Customer renewal reminders', 'SDR lead re-engagement journeys'],
    targetIndustries: ['SaaS', 'EdTech', 'E-commerce', 'Fintech', 'Healthcare'],
    customerProfile: 'Companies looking to automate lifecycle touchpoints and eliminate manual follow-up oversights.',
    pricingModel: 'Platform subscription based on Active Workflow Contacts',
    benefits: ['Zero manual follow-up drops', '24/7 automated lead nurturing', 'Deep CRM synchronization']
  },
  {
    id: 'sol-omnichannel',
    name: 'Omnichannel Messaging',
    category: 'Unified Communications',
    shortDescription: 'Unified API combining SMS, WhatsApp, Email, Voice, and In-App Push in a single interface.',
    fullDescription: 'Next-generation single API layer that abstracts all communication protocols. Automatically chooses the optimal channel based on customer preferences, delivery status, and cost optimization.',
    features: ['Single Unified REST API / SDK', 'Smart Cost & Deliverability Routing', 'Unified Customer Contact History', 'Cross-channel Template Harmonization', 'Consolidated Analytics Dashboard'],
    useCases: ['End-to-end customer journey communications', 'Enterprise-wide customer engagement', 'Global multi-channel operations'],
    targetIndustries: ['Fintech', 'Banking', 'E-commerce', 'SaaS', 'Logistics', 'Retail'],
    customerProfile: 'Large enterprise clients managing fragmented vendors seeking a single consolidated contract and API.',
    pricingModel: 'Unified platform commitment + volume consumption discount',
    benefits: ['Single SLA & invoice for all channels', 'Reduces vendor overhead by 70%', 'Unified conversation intelligence']
  }
];

export const COMPANIES: Company[] = [
  {
    id: 'comp-novacart',
    name: 'NovaCart India Pvt Ltd',
    domain: 'novacart.in',
    industry: 'E-commerce',
    size: '250-500 employees',
    location: 'Bengaluru, Karnataka',
    website: 'https://novacart.in',
    description: 'Rapidly growing D2C marketplace processing 80,000 orders monthly with focus on fashion and electronics.',
    annualRevenueRange: '₹40Cr - ₹60Cr',
    createdAt: '2026-08-10T09:00:00Z'
  },
  {
    id: 'comp-credix',
    name: 'Credix Financial Services',
    domain: 'credix.io',
    industry: 'Fintech',
    size: '100-250 employees',
    location: 'Mumbai, Maharashtra',
    website: 'https://credix.io',
    description: 'Digital lending and credit card issuance platform serving MSMEs and young professionals.',
    annualRevenueRange: '₹50Cr - ₹80Cr',
    createdAt: '2026-08-12T10:00:00Z'
  },
  {
    id: 'comp-curepoint',
    name: 'CurePoint Telehealth',
    domain: 'curepoint.health',
    industry: 'Healthcare',
    size: '50-100 employees',
    location: 'Hyderabad, Telangana',
    website: 'https://curepoint.health',
    description: 'Omnichannel clinic consultation booking, lab reports delivery, and prescription verification.',
    annualRevenueRange: '₹15Cr - ₹25Cr',
    createdAt: '2026-08-14T11:00:00Z'
  },
  {
    id: 'comp-skillverse',
    name: 'SkillVerse Learning Solutions',
    domain: 'skillverse.edu',
    industry: 'EdTech',
    size: '500-1000 employees',
    location: 'Gurugram, Haryana',
    website: 'https://skillverse.edu',
    description: 'Executive upskilling platform providing live masterclasses and certification bootcamps.',
    annualRevenueRange: '₹75Cr - ₹100Cr',
    createdAt: '2026-08-15T09:30:00Z'
  },
  {
    id: 'comp-trackswift',
    name: 'TrackSwift Logistics',
    domain: 'trackswift.co',
    industry: 'Logistics',
    size: '1000+ employees',
    location: 'Pune, Maharashtra',
    website: 'https://trackswift.co',
    description: 'Last-mile logistics fleet orchestrator serving major Indian e-commerce hubs.',
    annualRevenueRange: '₹120Cr - ₹180Cr',
    createdAt: '2026-08-18T14:00:00Z'
  },
  {
    id: 'comp-nexushub',
    name: 'NexusHub Cloud ERP',
    domain: 'nexushub.cloud',
    industry: 'SaaS',
    size: '100-250 employees',
    location: 'Bengaluru, Karnataka',
    website: 'https://nexushub.cloud',
    description: 'B2B subscription software providing inventory and GST-compliant billing for retail chains.',
    annualRevenueRange: '₹20Cr - ₹35Cr',
    createdAt: '2026-08-20T11:15:00Z'
  },
  {
    id: 'comp-urbanaura',
    name: 'UrbanAura Living Spaces',
    domain: 'urbanaura.in',
    industry: 'Real Estate',
    size: '50-100 employees',
    location: 'Noida, Uttar Pradesh',
    website: 'https://urbanaura.in',
    description: 'Premium co-living and luxury serviced apartments across tier-1 cities.',
    annualRevenueRange: '₹30Cr - ₹50Cr',
    createdAt: '2026-08-22T13:00:00Z'
  },
  {
    id: 'comp-payflow',
    name: 'PayFlow NeoBank',
    domain: 'payflow.bank',
    industry: 'Banking',
    size: '500-1000 employees',
    location: 'Mumbai, Maharashtra',
    website: 'https://payflow.bank',
    description: 'Digital-first retail banking and payroll platform for enterprise tech workers.',
    annualRevenueRange: '₹150Cr - ₹250Cr',
    createdAt: '2026-08-25T15:00:00Z'
  },
  {
    id: 'comp-retailgenie',
    name: 'RetailGenie Mart',
    domain: 'retailgenie.com',
    industry: 'Retail',
    size: '250-500 employees',
    location: 'Ahmedabad, Gujarat',
    website: 'https://retailgenie.com',
    description: 'Omnichannel grocery chain with 120 dark stores and rapid delivery network.',
    annualRevenueRange: '₹80Cr - ₹120Cr',
    createdAt: '2026-08-28T16:30:00Z'
  },
  {
    id: 'comp-telelink',
    name: 'TeleLink Broadband',
    domain: 'telelink.net',
    industry: 'Telecom',
    size: '1000+ employees',
    location: 'Chennai, Tamil Nadu',
    website: 'https://telelink.net',
    description: 'Fiber-optic high-speed broadband provider with 350,000 active household subscribers.',
    annualRevenueRange: '₹90Cr - ₹140Cr',
    createdAt: '2026-09-01T10:00:00Z'
  }
];

// Generate 20 more realistic companies to satisfy 30+ requirement
const additionalCompanyNames = [
  { name: 'Zenith Payments', domain: 'zenithpay.in', ind: 'Fintech', loc: 'Bengaluru', size: '100-250 employees', rev: '₹45Cr' },
  { name: 'KisanDirect Agro', domain: 'kisandirect.com', ind: 'E-commerce', loc: 'Indore', size: '50-100 employees', rev: '₹18Cr' },
  { name: 'VedaLearn Academy', domain: 'vedalearn.io', ind: 'EdTech', loc: 'Jaipur', size: '50-100 employees', rev: '₹12Cr' },
  { name: 'MedPulse Diagnostic', domain: 'medpulse.in', ind: 'Healthcare', loc: 'Chennai', size: '250-500 employees', rev: '₹35Cr' },
  { name: 'QuickMove Express', domain: 'quickmove.in', ind: 'Logistics', loc: 'Delhi NCR', size: '500-1000 employees', rev: '₹85Cr' },
  { name: 'OmniDesk CRM', domain: 'omnidesk.tech', ind: 'SaaS', loc: 'Pune', size: '50-100 employees', rev: '₹15Cr' },
  { name: 'BharatChit Fund', domain: 'bharatchit.org', ind: 'Banking', loc: 'Kolkata', size: '250-500 employees', rev: '₹60Cr' },
  { name: 'FreshGrocer Express', domain: 'freshgrocer.in', ind: 'Retail', loc: 'Hyderabad', size: '100-250 employees', rev: '₹28Cr' },
  { name: 'AeroConnect Wi-Fi', domain: 'aeroconnect.in', ind: 'Telecom', loc: 'Mumbai', size: '50-100 employees', rev: '₹22Cr' },
  { name: 'Skyline Skyline Developers', domain: 'skylinerealty.in', ind: 'Real Estate', loc: 'Bengaluru', size: '100-250 employees', rev: '₹95Cr' },
  { name: 'InstaLoan Capital', domain: 'instaloan.in', ind: 'Fintech', loc: 'Mumbai', size: '250-500 employees', rev: '₹70Cr' },
  { name: 'ShopClimax Fashion', domain: 'shopclimax.com', ind: 'E-commerce', loc: 'Surat', size: '100-250 employees', rev: '₹32Cr' },
  { name: 'ByteCamp Coding', domain: 'bytecamp.dev', ind: 'EdTech', loc: 'Bengaluru', size: '50-100 employees', rev: '₹14Cr' },
  { name: 'HealthFirst Clinics', domain: 'healthfirst.care', ind: 'Healthcare', loc: 'Kochi', size: '100-250 employees', rev: '₹24Cr' },
  { name: 'TransIndia Cold Chain', domain: 'transindia.log', ind: 'Logistics', loc: 'Nagpur', size: '250-500 employees', rev: '₹55Cr' },
  { name: 'CloudScale DevOps', domain: 'cloudscale.io', ind: 'SaaS', loc: 'Hyderabad', size: '50-100 employees', rev: '₹19Cr' },
  { name: 'CapitalTrust Bank', domain: 'capitaltrust.in', ind: 'Banking', loc: 'Delhi', size: '1000+ employees', rev: '₹350Cr' },
  { name: 'TrendSetter Apparel', domain: 'trendsetter.in', ind: 'Retail', loc: 'Ludhiana', size: '50-100 employees', rev: '₹26Cr' },
  { name: 'SmartVoIP Solutions', domain: 'smartvoip.co', ind: 'Telecom', loc: 'Bengaluru', size: '100-250 employees', rev: '₹40Cr' },
  { name: 'GrandView Estates', domain: 'grandview.co.in', ind: 'Real Estate', loc: 'Chandigarh', size: '50-100 employees', rev: '₹45Cr' }
];

additionalCompanyNames.forEach((item, index) => {
  COMPANIES.push({
    id: `comp-gen-${index + 11}`,
    name: item.name,
    domain: item.domain,
    industry: item.ind as any,
    size: item.size,
    location: item.loc,
    website: `https://${item.domain}`,
    description: `Leading provider of ${item.ind.toLowerCase()} solutions headquartered in ${item.loc}.`,
    annualRevenueRange: item.rev,
    createdAt: new Date(Date.now() - (index + 20) * 86400000).toISOString()
  });
});

export const CONTACTS: Contact[] = [
  {
    id: 'cont-1',
    companyId: 'comp-novacart',
    companyName: 'NovaCart India Pvt Ltd',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@novacart.in',
    phone: '+91 98201 44321',
    designation: 'Head of Engineering & Growth Product',
    linkedInUrl: 'https://linkedin.com/in/rohandeshmukh-demo',
    createdAt: '2026-08-10T09:30:00Z'
  },
  {
    id: 'cont-2',
    companyId: 'comp-credix',
    companyName: 'Credix Financial Services',
    name: 'Meera Nambiar',
    email: 'meera.nambiar@credix.io',
    phone: '+91 98450 78210',
    designation: 'Chief Technology Officer',
    linkedInUrl: 'https://linkedin.com/in/meeranambiar-demo',
    createdAt: '2026-08-12T10:15:00Z'
  },
  {
    id: 'cont-3',
    companyId: 'comp-curepoint',
    companyName: 'CurePoint Telehealth',
    name: 'Dr. Vivek Saxena',
    email: 'v.saxena@curepoint.health',
    phone: '+91 99304 11299',
    designation: 'VP of Digital Patient Experience',
    linkedInUrl: 'https://linkedin.com/in/viveksaxena-demo',
    createdAt: '2026-08-14T11:45:00Z'
  },
  {
    id: 'cont-4',
    companyId: 'comp-skillverse',
    companyName: 'SkillVerse Learning Solutions',
    name: 'Ananya Roy',
    email: 'ananya.roy@skillverse.edu',
    phone: '+91 97112 55643',
    designation: 'Director of Student Admissions & Growth',
    linkedInUrl: 'https://linkedin.com/in/ananyaroy-demo',
    createdAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'cont-5',
    companyId: 'comp-trackswift',
    companyName: 'TrackSwift Logistics',
    name: 'Vikramaditya Rao',
    email: 'vikram.rao@trackswift.co',
    phone: '+91 98901 22874',
    designation: 'VP of Field Operations & Systems',
    linkedInUrl: 'https://linkedin.com/in/vikramadityarao-demo',
    createdAt: '2026-08-18T14:30:00Z'
  },
  {
    id: 'cont-6',
    companyId: 'comp-nexushub',
    companyName: 'NexusHub Cloud ERP',
    name: 'Kavita Menon',
    email: 'kavita@nexushub.cloud',
    phone: '+91 98402 33182',
    designation: 'Head of Product Partnerships',
    linkedInUrl: 'https://linkedin.com/in/kavitamenon-demo',
    createdAt: '2026-08-20T11:45:00Z'
  },
  {
    id: 'cont-7',
    companyId: 'comp-urbanaura',
    companyName: 'UrbanAura Living Spaces',
    name: 'Gaurav Singhal',
    email: 'gaurav.s@urbanaura.in',
    phone: '+91 98110 66201',
    designation: 'Sales & Leasing Operations Head',
    linkedInUrl: 'https://linkedin.com/in/gauravsinghal-demo',
    createdAt: '2026-08-22T13:20:00Z'
  },
  {
    id: 'cont-8',
    companyId: 'comp-payflow',
    companyName: 'PayFlow NeoBank',
    name: 'Tanvi Agarwal',
    email: 'tanvi.agarwal@payflow.bank',
    phone: '+91 99208 90341',
    designation: 'Head of Security & Core Banking Systems',
    linkedInUrl: 'https://linkedin.com/in/tanviagarwal-demo',
    createdAt: '2026-08-25T15:30:00Z'
  },
  {
    id: 'cont-9',
    companyId: 'comp-retailgenie',
    companyName: 'RetailGenie Mart',
    name: 'Suresh Patel',
    email: 'suresh.p@retailgenie.com',
    phone: '+91 98251 77290',
    designation: 'Chief Marketing & Omnichannel Officer',
    linkedInUrl: 'https://linkedin.com/in/sureshpatel-demo',
    createdAt: '2026-08-28T17:00:00Z'
  },
  {
    id: 'cont-10',
    companyId: 'comp-telelink',
    companyName: 'TeleLink Broadband',
    name: 'Bhavna Chawla',
    email: 'bhavna.c@telelink.net',
    phone: '+91 98410 44901',
    designation: 'Senior Director, Customer Care Operations',
    linkedInUrl: 'https://linkedin.com/in/bhavnachawla-demo',
    createdAt: '2026-09-01T10:30:00Z'
  }
];

// Add 42 more contacts across companies to exceed 50 contacts
const sampleFirstNames = ['Amit', 'Sunita', 'Rahul', 'Deepak', 'Sneha', 'Nikhil', 'Pooja', 'Arjun', 'Manish', 'Neha', 'Sanjay', 'Divya', 'Karan', 'Pooja', 'Harish', 'Swati', 'Alok', 'Ritu', 'Akash', 'Shruti'];
const sampleLastNames = ['Verma', 'Kapoor', 'Reddy', 'Chopra', 'Bansal', 'Joshi', 'Gupta', 'Sinha', 'Pillai', 'Malhotra', 'Bhatia', 'Nair', 'Pandey', 'Saxena', 'Mehta', 'Grover', 'Dutta', 'Kaur', 'Soni', 'Bose'];
const sampleDesignations = ['VP of Product', 'Lead Architect', 'Director of Growth', 'Marketing Operations Manager', 'Head of Customer Success', 'Billing Systems Lead', 'Enterprise Solutions Manager', 'Director of IT Infrastructure'];

for (let i = 11; i <= 55; i++) {
  const comp = COMPANIES[i % COMPANIES.length];
  const firstName = sampleFirstNames[i % sampleFirstNames.length];
  const lastName = sampleLastNames[(i * 3) % sampleLastNames.length];
  const desig = sampleDesignations[i % sampleDesignations.length];
  CONTACTS.push({
    id: `cont-${i}`,
    companyId: comp.id,
    companyName: comp.name,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${comp.domain}`,
    phone: `+91 98${(100 + i * 7).toString().padStart(3, '0')} ${(20000 + i * 111).toString()}`,
    designation: desig,
    linkedInUrl: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}-demo`,
    createdAt: new Date(Date.now() - (i * 2) * 86400000).toISOString()
  });
}

// Generate 105 realistic B2B Leads
const requirementTemplates = [
  {
    req: 'We are an e-commerce platform processing around 50,000 OTP requests every month. We also want WhatsApp order notifications and automated customer delivery tracking.',
    ind: 'E-commerce',
    val: 680000,
    score: 88,
    prob: 82,
    prio: 'HOT',
    status: 'QUALIFIED'
  },
  {
    req: 'Fintech digital loan application needs mission-critical OTP with sub-3s delivery SLA, automated loan disbursement SMS, and WhatsApp KYC document verification.',
    ind: 'Fintech',
    val: 950000,
    score: 93,
    prob: 89,
    prio: 'HOT',
    status: 'PROPOSAL'
  },
  {
    req: 'Telemedicine clinic network with 40,000 monthly patients requires automated appointment confirmation, doctor consultation call masking, and WhatsApp lab report dispatch.',
    ind: 'Healthcare',
    val: 520000,
    score: 84,
    prob: 76,
    prio: 'WARM',
    status: 'MEETING'
  },
  {
    req: 'EdTech bootcamps experiencing 45% drop-off in sales calls. Looking for an AI Voice Agent to conduct preliminary outbound screening calls and WhatsApp reminder sequences.',
    ind: 'EdTech',
    val: 780000,
    score: 86,
    prob: 79,
    prio: 'HOT',
    status: 'NEGOTIATION'
  },
  {
    req: 'Logistics express delivery network wants virtual number masking between delivery drivers and customers to protect personal phone numbers and reduce fake attempt disputes.',
    ind: 'Logistics',
    val: 820000,
    score: 89,
    prob: 85,
    prio: 'HOT',
    status: 'WON'
  },
  {
    req: 'B2B SaaS accounting platform needs automated payment reminder SMS, GST e-invoicing WhatsApp notifications, and customer renewal drip automation.',
    ind: 'SaaS',
    val: 450000,
    score: 74,
    prob: 65,
    prio: 'WARM',
    status: 'CONTACTED'
  },
  {
    req: 'Co-living real estate firm looking to automate prospective tenant inquiries through WhatsApp catalog and automated site-visit booking notifications.',
    ind: 'Real Estate',
    val: 380000,
    score: 68,
    prob: 58,
    prio: 'WARM',
    status: 'CONTACTED'
  },
  {
    req: 'Retail grocery dark store chain needs instant transactional order dispatches, promotional seasonal campaign blasting, and customer feedback surveys.',
    ind: 'Retail',
    val: 620000,
    score: 79,
    prob: 71,
    prio: 'WARM',
    status: 'MEETING'
  },
  {
    req: 'Private banking neo-platform needs high-concurrency 2FA authentication, instant transaction debit alerts, and dedicated enterprise account manager support.',
    ind: 'Banking',
    val: 1450000,
    score: 96,
    prob: 92,
    prio: 'HOT',
    status: 'PROPOSAL'
  },
  {
    req: 'Regional fiber internet provider wants automated IVR bill payment helpline and WhatsApp proactive downtime alerts to reduce call center load.',
    ind: 'Telecom',
    val: 540000,
    score: 72,
    prob: 62,
    prio: 'WARM',
    status: 'QUALIFIED'
  },
  {
    req: 'Looking for cheapest bulk SMS sender for cold marketing database of 500,000 unverified phone numbers. Low budget.',
    ind: 'Retail',
    val: 80000,
    score: 32,
    prob: 18,
    prio: 'LOW',
    status: 'LOST'
  },
  {
    req: 'Early-stage startup building consumer mobile app. Interested in free trial credits for SMS OTP and webhook documentation.',
    ind: 'SaaS',
    val: 120000,
    score: 48,
    prob: 35,
    prio: 'COLD',
    status: 'NEW'
  }
];

export const LEADS: Lead[] = [];

// Seed the 100+ leads
const leadSources: any[] = ['LinkedIn', 'Website', 'Referral', 'Cold Email', 'Event', 'Inbound', 'Partner'];
const salesUserList = [USERS[2], USERS[3], USERS[1]];

for (let i = 0; i < 105; i++) {
  const comp = COMPANIES[i % COMPANIES.length];
  const contact = CONTACTS[i % CONTACTS.length];
  const template = requirementTemplates[i % requirementTemplates.length];
  const source = leadSources[(i * 2) % leadSources.length];
  const salesperson = salesUserList[i % salesUserList.length];

  // Adjust deal value and date with slight variations
  const dealValue = template.val + ((i % 7) - 3) * 35000;
  const leadScore = Math.min(99, Math.max(25, template.score + ((i % 5) - 2) * 3));
  const convProb = Math.min(95, Math.max(15, template.prob + ((i % 5) - 2) * 2));
  let priority = template.prio as any;
  if (leadScore >= 80) priority = 'HOT';
  else if (leadScore >= 60) priority = 'WARM';
  else if (leadScore >= 40) priority = 'COLD';
  else priority = 'LOW';

  const statuses: any[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
  // Give a realistic distribution
  const status = i < 12 ? template.status : statuses[(i * 3) % statuses.length];

  const daysAgo = (i % 45) + 1;
  const createdDate = new Date(Date.now() - daysAgo * 86400000).toISOString();
  const lastContactedDays = Math.max(0, daysAgo - (i % 5));
  const lastContactedDate = new Date(Date.now() - lastContactedDays * 86400000).toISOString();
  const nextFollowUpDays = (i % 6) - 1; // some overdue (-1), some today (0), some upcoming
  const nextFollowUpDate = new Date(Date.now() + nextFollowUpDays * 86400000).toISOString().split('T')[0];

  LEADS.push({
    id: `lead-${(i + 1).toString().padStart(3, '0')}`,
    companyId: comp.id,
    companyName: comp.name,
    contactId: contact.id,
    contactName: contact.name,
    email: contact.email,
    phone: contact.phone,
    industry: comp.industry,
    companySize: comp.size,
    location: comp.location,
    website: comp.website,
    leadSource: source,
    businessRequirement: i === 0
      ? 'We are an e-commerce company processing around 50,000 OTP requests every month. We also want WhatsApp order notifications and automated customer updates.'
      : template.req,
    estimatedDealValue: dealValue,
    leadScore: leadScore,
    conversionProbability: convProb,
    priority: priority,
    status: status,
    assignedSalespersonId: salesperson.id,
    assignedSalespersonName: salesperson.name,
    createdAt: createdDate,
    lastContactedAt: lastContactedDate,
    nextFollowUpDate: nextFollowUpDate,
    notes: `Initial qualification performed by ${salesperson.name}. Key pain points discussed: carrier delivery SLA, DLT sender IDs, and transactional latency.`,
    recommendedSolutionIds: ['sol-otp-messaging', 'sol-whatsapp-biz', 'sol-sms-api']
  });
}

// Generate 52 realistic Deals (tied to pipeline)
export const DEALS: Deal[] = [];
const dealStages: any[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];

for (let i = 0; i < 52; i++) {
  const lead = LEADS[i];
  const stage = i < 10 ? (['QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION', 'WON'][i % 5] as any) : dealStages[i % dealStages.length];
  const prob = stage === 'WON' ? 100 : stage === 'LOST' ? 0 : stage === 'NEGOTIATION' ? 85 : stage === 'PROPOSAL' ? 70 : stage === 'MEETING' ? 50 : stage === 'QUALIFIED' ? 40 : 25;

  const closeDate = new Date(Date.now() + ((i % 30) + 5) * 86400000).toISOString().split('T')[0];

  DEALS.push({
    id: `deal-${(i + 1).toString().padStart(3, '0')}`,
    leadId: lead.id,
    companyId: lead.companyId,
    companyName: lead.companyName,
    contactId: lead.contactId,
    contactName: lead.contactName,
    title: `${lead.companyName} - Enterprise CPaaS & Messaging`,
    value: lead.estimatedDealValue,
    stage: stage,
    probability: prob,
    expectedCloseDate: closeDate,
    assignedSalespersonId: lead.assignedSalespersonId,
    assignedSalespersonName: lead.assignedSalespersonName,
    solutions: ['OTP Messaging', 'WhatsApp Business Communication'],
    notes: `Enterprise contract for multi-channel messaging platform. Expected volume 100k+ msgs/mo.`,
    createdAt: lead.createdAt,
    updatedAt: new Date(Date.now() - (i % 10) * 86400000).toISOString()
  });
}

// Generate 32 realistic Meetings
export const MEETINGS: Meeting[] = [];
const meetingTypes: any[] = ['Discovery Call', 'Product Demo', 'Technical Discussion', 'Pricing Discussion', 'Negotiation', 'Follow-up'];

for (let i = 0; i < 32; i++) {
  const lead = LEADS[i % LEADS.length];
  const daysOffset = (i % 7) - 2; // -2, -1 (past), 0 (today), 1, 2, 3, 4 (future)
  const meetingDate = new Date(Date.now() + daysOffset * 86400000).toISOString().split('T')[0];
  const hours = 10 + (i % 7);
  const timeStr = `${hours.toString().padStart(2, '0')}:${(i % 2 === 0 ? '00' : '30')}`;
  const mType = meetingTypes[i % meetingTypes.length];
  const status = daysOffset < 0 ? 'COMPLETED' : 'SCHEDULED';

  MEETINGS.push({
    id: `meet-${(i + 1).toString().padStart(3, '0')}`,
    leadId: lead.id,
    companyId: lead.companyId,
    companyName: lead.companyName,
    contactName: lead.contactName,
    contactEmail: lead.email,
    date: meetingDate,
    time: timeStr,
    durationMinutes: 45,
    meetingType: mType,
    attendees: [lead.contactName, lead.assignedSalespersonName, 'Solutions Architect'],
    agenda: `Review communication volume architecture, evaluate OTP delivery SLA requirements, and present customized CPaaS integration timeline.`,
    notes: daysOffset < 0 ? 'Client was impressed with 99.8% sub-3s OTP delivery SLA and WhatsApp rich media interactive buttons.' : undefined,
    status: status,
    assignedSalespersonId: lead.assignedSalespersonId,
    assignedSalespersonName: lead.assignedSalespersonName
  });
}

// Generate 54 realistic Follow-ups
export const FOLLOWUPS: FollowUp[] = [];
const followupPriorities: any[] = ['HIGH', 'MEDIUM', 'LOW'];
const actionTemplates = [
  'Call the client to review the revised custom OTP pricing proposal.',
  'Send WhatsApp follow-up with technical API sandbox documentation.',
  'Confirm meeting attendees for upcoming executive demo with VP of Product.',
  'Check status of internal procurement approval for Master Service Agreement.',
  'Follow up regarding DLT entity registration and header approval status.',
  'Send comparative benchmark deck highlighting failover latency advantages.'
];

for (let i = 0; i < 54; i++) {
  const lead = LEADS[i % LEADS.length];
  const offset = (i % 6) - 2; // -2 (overdue 2d), -1 (overdue 1d), 0 (today), 1, 2, 3 (upcoming)
  const dueDate = new Date(Date.now() + offset * 86400000).toISOString().split('T')[0];
  const priority = followupPriorities[i % followupPriorities.length];
  const status = offset < 0 ? 'OVERDUE' : (i % 5 === 0 ? 'COMPLETED' : 'PENDING');

  FOLLOWUPS.push({
    id: `fu-${(i + 1).toString().padStart(3, '0')}`,
    leadId: lead.id,
    companyName: lead.companyName,
    contactName: lead.contactName,
    dueDate: dueDate,
    priority: priority,
    actionRequired: actionTemplates[i % actionTemplates.length],
    aiReasoning: priority === 'HIGH' ? 'Hot prospect with deal value > ₹5L and active proposal on the table. Delaying contact reduces close velocity by 28%.' : 'Routine cadence touchpoint.',
    status: status,
    assignedSalespersonId: lead.assignedSalespersonId,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    completedAt: status === 'COMPLETED' ? new Date().toISOString() : undefined
  });
}

// Generate 115 realistic Activities & Audit Logs
export const ACTIVITIES: Activity[] = [];
const activityTypes: any[] = ['CALL', 'EMAIL', 'LINKEDIN', 'WHATSAPP', 'MEETING', 'NOTE', 'STAGE_CHANGE', 'PROPOSAL', 'CREATED'];
const activityDescriptions = [
  'Discovery phone call completed. Discussed 50k monthly OTP traffic and requirement for automated WhatsApp dispatch.',
  'Sent customized proposal deck covering SMS API and WhatsApp Business Solution with tiered pricing.',
  'Sent introductory LinkedIn InMail to Head of Engineering discussing high-deliverability messaging routes.',
  'Conducted live product demo showcasing webhook triggers, failover latency, and real-time delivery dashboards.',
  'Moved deal stage from Contacted to Qualified after confirming budget and decision timeline.',
  'Added internal note: Client mentioned dissatisfaction with existing CPaaS provider due to recurring OTP delivery delays during peak sale hours.',
  'Scheduled technical architecture deep-dive with customer engineering leads.',
  'Sent WhatsApp business sample notification payload for approval.'
];

for (let i = 0; i < 115; i++) {
  const lead = LEADS[i % LEADS.length];
  const type = activityTypes[i % activityTypes.length];
  const desc = activityDescriptions[i % activityDescriptions.length];
  const daysAgo = (i % 25);
  const time = new Date(Date.now() - (daysAgo * 86400000 + (i % 12) * 3600000)).toISOString();

  ACTIVITIES.push({
    id: `act-${(i + 1).toString().padStart(3, '0')}`,
    leadId: lead.id,
    companyName: lead.companyName,
    userId: lead.assignedSalespersonId,
    userName: lead.assignedSalespersonName,
    type: type,
    description: `${lead.companyName}: ${desc}`,
    outcome: type === 'CALL' ? 'Positive interest, requested pricing proposal' : type === 'STAGE_CHANGE' ? 'Advanced pipeline' : 'Delivered successfully',
    timestamp: time
  });
}

// Generate 45 realistic Communications
export const COMMUNICATIONS: Communication[] = [];
const channels: any[] = ['Email', 'LinkedIn', 'WhatsApp', 'Call', 'SMS'];
const commStatuses: any[] = ['Delivered', 'Opened', 'Replied', 'Sent', 'No Response'];

for (let i = 0; i < 45; i++) {
  const lead = LEADS[i % LEADS.length];
  const channel = channels[i % channels.length];
  const status = commStatuses[i % commStatuses.length];
  const hoursAgo = (i % 72) + 1;

  COMMUNICATIONS.push({
    id: `comm-${(i + 1).toString().padStart(3, '0')}`,
    leadId: lead.id,
    companyName: lead.companyName,
    contactName: lead.contactName,
    channel: channel,
    direction: i % 4 === 0 ? 'INBOUND' : 'OUTBOUND',
    status: status,
    subject: channel === 'Email' ? `Accelerating ${lead.companyName}'s Customer Engagement via LeadFlow CPaaS` : undefined,
    content: `Hi ${lead.contactName.split(' ')[0]}, following up on your inquiry regarding scalable OTP verification and WhatsApp business notification infrastructure for ${lead.companyName}. We have prepared benchmark uptime metrics.`,
    timestamp: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
    salespersonName: lead.assignedSalespersonName
  });
}

// Sales Targets
export const TARGETS: SalesTarget[] = [
  {
    id: 'target-1',
    userId: 'user-sales',
    userName: 'Ammar Khan',
    period: 'October 2026',
    targetRevenue: 1500000,
    achievedRevenue: 940000,
    targetDeals: 10,
    achievedDeals: 6,
    targetQualifiedLeads: 25,
    achievedQualifiedLeads: 18,
    targetMeetings: 20,
    achievedMeetings: 14
  },
  {
    id: 'target-2',
    userId: 'user-sales-2',
    userName: 'Priya Iyer',
    period: 'October 2026',
    targetRevenue: 1200000,
    achievedRevenue: 810000,
    targetDeals: 8,
    achievedDeals: 5,
    targetQualifiedLeads: 20,
    achievedQualifiedLeads: 15,
    targetMeetings: 16,
    achievedMeetings: 12
  },
  {
    id: 'target-team',
    userId: 'user-manager',
    userName: 'Sales Team (Total)',
    period: 'October 2026',
    targetRevenue: 3500000,
    achievedRevenue: 2280000,
    targetDeals: 25,
    achievedDeals: 16,
    targetQualifiedLeads: 60,
    achievedQualifiedLeads: 42,
    targetMeetings: 50,
    achievedMeetings: 36
  }
];
