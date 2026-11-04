import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  isArabicUrl: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.services': 'Services',
    'nav.developers': 'Developers',
    'nav.articles': 'Articles',
    'nav.contact': 'Contact',
    'nav.getStarted': 'Get Started',

    // Hero
    'hero.title': 'AXIOMX',
    'hero.subtitle': 'Building the future of digital experiences',
    'hero.description': 'We craft premium software solutions that transform ideas into extraordinary digital products. Websites, mobile apps, games, and intelligent systems.',
    'hero.explore': 'Explore Our Work',
    'hero.contact': 'Launch Project',
    'hero.login': 'Join AXIOMX Team',

    // Client Form
    'form.title': 'Launch Your Project',
    'form.subtitle': 'Tell us about your vision and we\'ll make it reality',
    'form.name': 'Full Name',
    'form.name.placeholder': 'Enter your full name',
    'form.phone': 'Phone Number',
    'form.phone.placeholder': '+1 (555) 000-0000',
    'form.social': 'Social Link',
    'form.social.placeholder': 'LinkedIn, Twitter, or website URL',
    'form.type': 'Project Type',
    'form.type.placeholder': 'Select project type',
    'form.idea': 'Project Idea',
    'form.idea.placeholder': 'Describe your project vision, goals, and key features...',
    'form.submit': 'Submit Request',
    'form.submitting': 'Submitting...',
    'form.success': 'Request submitted successfully!',
    'form.close': 'Close',

    // FAQ Section
    'faq.title': 'Frequently Asked Questions',
    'faq.howContext': 'How does the AI maintain context?',
    'faq.howContext.answer': 'The system uses a sophisticated context management system that stores conversation history and relevant data points, allowing the AI to maintain continuity across multiple interactions.',
    'faq.integrateSystems': 'Can it be integrated with existing systems?',
    'faq.integrateSystems.answer': 'Yes, the AI Assistant provides REST APIs and WebSocket connections for seamless integration with any existing enterprise systems.',
    'faq.languages': 'What languages are supported?',
    'faq.languages.answer': 'Currently supports 25+ languages including English, Spanish, French, German, Arabic, Chinese, and Japanese.',
    'faq.threatAccuracy': 'How accurate is the threat detection?',
    'faq.threatAccuracy.answer': 'The ML models achieve 98.5% accuracy in identifying known threats and 92% for zero-day attacks.',
    'faq.autoResponse': 'Can it automated responses?',
    'faq.autoResponse.answer': 'Yes, the system can execute predefined response playbooks based on threat severity levels.',
    'faq.pageLoad': 'What is the page load time?',
    'faq.pageLoad.answer': 'Average page load time is under 1 second with optimized images and code splitting.',
    'faq.seoOptimized': 'Is it SEO optimized?',
    'faq.seoOptimized.answer': 'Yes, with server-side rendering and proper meta tags, the platform achieves excellent search engine rankings.',

    // Status Labels
    'status.live': 'Live',
    'status.inProgress': 'In Progress',
    'status.completed': 'Completed',

    // Project Details
    'project.overview': 'Project Overview',
    'project.implementation': 'Implementation Details',
    'project.performance': 'Performance Metrics',
    'project.apiExample': 'API Integration Example',
    'project.detection': 'Threat Detection System',
    'project.mlModel': 'Threat Detection Model',
    'project.architecture': 'System Architecture',
    'project.screenshots': 'Interface Screenshots',
    'project.platformScreenshots': 'Platform Screenshots',
    'project.capSystem': 'High-level system architecture showing the integration between multiple services',
    'project.capThreat': 'Real-time threat detection and analysis dashboard',
    'project.startProject': 'Start a Similar Project',
    'project.qualityText': 'Get the same level of quality and innovation for your next project.',

    // Project Types
    'project.type.website': 'Website',
    'project.type.mobile': 'Mobile App',
    'project.type.ai': 'AI System',
    'project.type.dashboard': 'Dashboard',
    'project.type.other': 'Other',

    // Projects
    'projects.title': 'Featured Projects',
    'projects.subtitle': 'Innovative solutions we\'ve delivered',
    'projects.viewProject': 'View Project',
    'projects.tech': 'Tech:',
    'projects.cuttingEdge': 'Cutting-edge solutions that deliver exceptional results',

    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive digital solutions',
    'services.web': 'Web Development',
    'services.web.desc': 'Modern, responsive websites built with cutting-edge technologies.',
    'services.mobile': 'Mobile Applications',
    'services.mobile.desc': 'Native and cross-platform mobile experiences.',
    'services.ui': 'UI/UX Design',
    'services.ui.desc': 'Beautiful interfaces that users love.',
    'services.ai': 'Artificial Intelligence',
    'services.ai.desc': 'Intelligent systems and advanced machine learning solutions.',
    'services.games': 'Game Development',
    'services.games.desc': 'Engaging games across all platforms.',
    'services.software': 'Software Systems',
    'services.software.desc': 'Custom enterprise solutions and systems.',

    // Developers
    'developers.title': 'Meet Our Team',
    'developers.subtitle': 'The minds behind the innovation',
    'developers.orgStructure': 'Organization Structure',
    'developers.exploreHierarchy': 'Explore the AXIOMX team hierarchy',
    'developers.investors': 'Investors',
    'developers.employees': 'Employees',
    'developers.strategicPartners': 'Strategic Partners',
    'developers.teamMembers': 'Team Members',
    'developers.clickToView': 'Click to view profile',
    'developers.founderStory': 'Founder Story',
    'developers.vision': 'Vision',
    'developers.experience': 'Experience Timeline',
    'developers.skills': 'Skills',
    'developers.technologies': 'Technologies',
    'developers.goals': 'Company Goals',

    // Articles
    'articles.title': 'Latest Insights',
    'articles.subtitle': 'Thoughts on technology and design',
    'articles.readMore': 'Read Article',

    // Clients
    'clients.title': 'Trusted By',
    'clients.subtitle': 'Companies that believe in our vision',

    // Footer
    'footer.tagline': 'Building the future, one line of code at a time.',
    'footer.copyright': '© 2026 AXIOMX. All rights reserved.',

    // Project titles
    'project.ecommerce': 'E-Commerce Platform',
    'project.ecommerce.desc': 'A seamless shopping experience with AI-powered recommendations.',
    'project.health': 'Health Tracker',
    'project.health.desc': 'Comprehensive health monitoring mobile application.',
    'project.saas': 'SaaS Platform',
    'project.saas.desc': 'Cloud-based project management solution.',
    'project.ai': 'AI Assistant',
    'project.ai.desc': 'Intelligent virtual assistant with natural language processing.',

    // Article titles
    'article.ai': 'The Future of AI in Web Development',
    'article.ai.category': 'Technology',
    'article.ux': 'Designing for the Next Generation',
    'article.ux.category': 'Design',
    'article.cloud': 'Cloud-Native Architecture Best Practices',
    'article.cloud.category': 'Architecture',

    // Reading time
    'read.time': 'min read',

    // Articles Section
    'articles.insights': 'Insights & Articles',
    'articles.exploreInsights': 'Explore our latest insights on technology, development, and innovation',
    'articles.exploreKnowledgeBase': 'Explore Knowledge Base',

    // Tags
    'tag.react': 'React',
    'tag.node': 'Node.js',
    'tag.python': 'Python',
    'tag.ai': 'AI/ML',
    'tag.cloud': 'Cloud',
    'tag.mobile': 'Mobile',
    'tag.game': 'Game',
    'tag.unity': 'Unity',
    'tag.swift': 'Swift',
    'tag.figma': 'Figma',
    'tag.nextjs': 'Next.js',
    'tag.typescript': 'TypeScript',
    'tag.graphql': 'GraphQL',
    'tag.websocket': 'WebSocket',
    'tag.security': 'Security',

    // New Projects - AXIOMX AI Assistant
    'project.horAI.title': 'AXIOMX AI Assistant',
    'project.horAI.desc': 'Intelligent virtual assistant with natural language processing capabilities.',
    'project.horAI.fullDesc': 'The AXIOMX AI Assistant is a cutting-edge conversational AI platform designed to revolutionize user interaction. Built with advanced natural language processing capabilities, it provides real-time intelligent responses with context awareness and memory. The system features seamless API integrations, multi-language support, and can be customized for various industries including customer service, healthcare, and education.',

    // New Projects - Cyber Security Dashboard
    'project.cyberSecurity.title': 'Cyber Security Dashboard',
    'project.cyberSecurity.desc': 'Real-time threat detection and monitoring system for enterprise security.',
    'project.cyberSecurity.fullDesc': 'Our Cyber Security Dashboard is a comprehensive enterprise-grade security solution that provides real-time threat detection, monitoring, and automated response capabilities. Built with machine learning models for intelligent threat analysis, it offers comprehensive risk assessment, compliance tracking, and seamless integration with existing security infrastructure. The platform features an intuitive dashboard with detailed analytics and customizable alerting.',

    // New Projects - Smart Web Platform
    'project.smartWeb.title': 'Smart Web Platform',
    'project.smartWeb.desc': 'High-performance web application with advanced features and analytics.',
    'project.smartWeb.fullDesc': 'The Smart Web Platform is a modern, high-performance web application built with the latest technologies including Next.js and TypeScript. It features server-side rendering for optimal SEO, a responsive design that works flawlessly across all devices, and a comprehensive analytics dashboard. The platform uses GraphQL for efficient data fetching and is deployed on AWS for maximum reliability and scalability.',

    // Additional Projects
    'project.healthcare.title': 'Healthcare App',
    'project.healthcare.desc': 'A comprehensive healthcare mobile application with telemedicine capabilities.',
    'project.healthcare.fullDesc': 'A HIPAA-compliant healthcare application with telemedicine capabilities, patient records management, and prescription tracking.',

    'project.gaming.title': 'Gaming Platform',
    'project.gaming.desc': 'A cross-platform gaming platform with multiplayer support.',
    'project.gaming.fullDesc': 'A cross-platform gaming platform with multiplayer support, leaderboards, and real-time matchmaking powered by Unity and Photon.',

    'project.fintech.title': 'FinTech Dashboard',
    'project.fintech.desc': 'A comprehensive fintech dashboard for portfolio tracking.',
    'project.fintech.fullDesc': 'A comprehensive fintech dashboard for portfolio tracking, risk analysis, and automated trading with real-time analytics.',

    'project.education.title': 'Education Platform',
    'project.education.desc': 'An interactive education platform with video streaming.',
    'project.education.fullDesc': 'An interactive education platform with video streaming, quizzes, progress tracking, and certificate generation.',

    'project.logistics.title': 'Logistics Tracking',
    'project.logistics.desc': 'A logistics tracking system with route optimization.',
    'project.logistics.fullDesc': 'A logistics tracking system with route optimization, fleet management, and predictive analytics powered by machine learning.',

    'project.social.title': 'Social Media App',
    'project.social.desc': 'A feature-rich social media application.',
    'project.social.fullDesc': 'A feature-rich social media application with real-time chat, timeline feed, and media sharing capabilities.',

    // Article Page UI
    'article.readMore': 'Read Article',
    'article.relatedArticles': 'Related Articles',
    'article.share': 'Share Article',
    'article.shareDesc': 'Share this article with your network',
    'article.backToArticles': 'Back to Articles',
    'article.minRead': 'min read',
    'article.author': 'Author',
    'article.date': 'Date',

    // Project Page UI
    'project.viewProject': 'View Project',
    'project.viewAll': 'View All Projects',
    'project.status': 'Status',
    'project.technologies': 'Technologies Used',
    'project.features': 'Key Features',
    'project.relatedProjects': 'Related Projects',
    'project.relatedServices': 'Related Services',

    // Service Page UI
    'service.exploreService': 'Explore Service',
    'service.relatedProjects': 'Related Projects',
    'service.relatedArticles': 'Related Articles',

    // Common UI
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.notFound': 'Not Found',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.explore': 'Explore',
    'common.learnMore': 'Learn More',
    'common.contact': 'Contact Us',
    'common.startProject': 'Start Your Project',
    'common.returnHome': 'Return Home',
    'common.returnToHome': 'Return Home',
    'common.backToProjects': 'Back to Projects',
    'common.backToArticles': 'Back to Articles',
    'common.share': 'Share',
    'common.relatedArticles': 'Related Articles',
    'common.relatedProjects': 'Related Projects',
    'common.relatedServices': 'Related Services',
    'common.technologiesUsed': 'Technologies Used',
    'common.keyFeatures': 'Key Features',
    'common.projectOverview': 'Project Overview',
    'common.contactUs': 'Contact Us',
    'common.getStarted': 'Get Started',
    'common.serviceCapabilities': 'Service Capabilities',
    'common.techStack': 'Tech Stack',
    'common.exploreMore': 'Explore More',
    'common.relatedContent': 'Related Content',
    'common.readyToStart': 'Ready to start your project?',
    'common.transformIdeas': 'Let\'s transform your ideas into reality with our cutting-edge solutions',
    'common.whatWeOffer': 'What We Offer',
    'common.footerTagline': 'Building the future, one pixel at a time.',
    'common.allRights': 'All rights reserved.',
    'common.footerCopyright': '© 2025 AXIOMX. All rights reserved.',

    // Organization
    'org.organizationStructure': 'Organization Structure',
    'org.exploreHierarchy': 'Explore the AXIOMX team hierarchy',
    'org.investors': 'Investors',
    'org.strategicPartners': 'Strategic Partners',
    'org.team': 'Team',
    'org.teamMembers': 'Team Members',
    'org.founderProfile': 'Founder Profile',
    'org.founderStory': 'Founder Story',
    'org.vision': 'Vision',
    'org.experienceTimeline': 'Experience Timeline',
    'org.skills': 'Skills',
    'org.technologies': 'Technologies',
    'org.companyGoals': 'Company Goals',
    'org.clickToView': 'Click to view profile',
    'org.investorCard': 'Investor Card',
    'org.employeeCard': 'Employee Card',
    'org.contribution': 'Contribution',
    'org.role': 'Role',
    'org.activeMembers': 'active members',
    'org.viewProfile': 'View Profile',

    // Roles & Status
    'role.founderCEO': 'Founder & CEO',
    'role.leadInvestor': 'Lead Investor',
    'role.strategicPartner': 'Strategic Partner',
    'role.techAdvisor': 'Tech Advisor',
    'role.seniorDeveloper': 'Senior Developer',
    'role.uiuxDesigner': 'UI/UX Designer',
    'role.backendEngineer': 'Backend Engineer',
    'role.projectManager': 'Project Manager',
    'role.devopsEngineer': 'DevOps Engineer',
    'role.qaEngineer': 'QA Engineer',
    'role.mobileDeveloper': 'Mobile Developer',
    'role.dataScientist': 'Data Scientist',
    'status.active': 'Active',
    'status.inactive': 'Inactive',
    'status.onLeave': 'On Leave',

    // Section UI
    'section8.teamCount': '{count} active members',
    'section8.investorsCount': '{count} strategic partners',
    'section8.clickToViewProfile': 'Click to view profile',
    'section8.expandSection': 'Expand Section',
    'section8.collapseSection': 'Collapse Section',
    'section8.contribution': 'Contribution',
    'section8.bio': 'Bio',
    'section8.founderTitle': 'Founder',
    'section8.founderRole': 'Founder & CEO',

    // Knowledge Base
    'knowledge.title': 'Insights & Articles',
    'knowledge.subtitle': 'Explore our latest insights on technology, development, and innovation',
    'knowledge.exploreBase': 'Explore Knowledge Base',

    // Projects Page
    'projects.allProjects': 'All Projects',
    'projects.exploreServices': 'Explore Our Services',
    'projects.readArticles': 'Read Our Articles',
    'projects.buildTogether': 'Let\'s Build Something Great Together',
    'projects.projectsEngine': '#5 Project Engines',

    // Articles Cards
    'articles.readArticle': 'Read Article',
    'articles.minRead': 'min read',

    // Services
    'services.exploreService': 'Explore Service',
    'services.exploreServices': 'Explore Our Services',

    // Forms
    'forms.exploreKnowledge': 'Explore Knowledge Base',

    // Project Detail Page
    'projectDetail.faq': 'Frequently Asked Questions',
    'projectDetail.startProject': 'Start a Similar Project',
    'projectDetail.qualityText': 'Get the same level of quality and innovation for your next project.',
    'projectDetail.client': 'Client',
    'projectDetail.year': 'Year',
    'projectDetail.gallery': 'Gallery',
    'projectDetail.imageOf': 'Image {current} of {total}',
    'projectDetail.closeGallery': 'Close Gallery',
    'projectDetail.video': 'Video',
    'projectDetail.watchVideo': 'Watch Video',
    'projectDetail.relatedProjects': 'Related Projects',
    'projectDetail.exploreMore': 'Explore More Projects',
    'projectDetail.loading': 'Loading project...',
    'projectDetail.error': 'Failed to load project',
    'projectDetail.notFound': 'Project not found',

    // Additional Project Labels
    'project.implementationDetails': 'Implementation Details',
    'project.systemArchitecture': 'System Architecture',
    'project.interfaceScreenshots': 'Interface Screenshots',
    'project.performanceMetrics': 'Performance Metrics',
    'project.threatDetection': 'Threat Detection System',
    'project.apiIntegration': 'API Integration Example',

    // Project Metadata
    'project.meta.duration': 'Duration',
    'project.meta.status': 'Status',
    'project.meta.client': 'Client',
    'project.meta.year': 'Year',
    'project.meta.technologies': 'Technologies',

    // Project Article
    'project.article.title': 'Project Article',
    'project.article.description': 'Project Description',
    'project.article.content': 'Content',
    'project.article.gallery': 'Gallery',
    'project.article.videos': 'Videos',
    'project.article.faq': 'Frequently Asked Questions',
    'project.article.cta': 'Call to Action',

    // Project Meta
    'project.meta.category': 'Category',
    'project.meta.tags': 'Tags',
    'project.meta.difficulty': 'Difficulty',
    'project.meta.industry': 'Industry',

    // Status Labels - Extended
    'status.label.active': 'Active',
    'status.label.inactive': 'Inactive',
    'status.planned': 'Planned',
    'status.onHold': 'On Hold',
    'status.cancelled': 'Cancelled',

    // CTA Labels
    'cta.requestSimilarProject': 'Request Similar Project',
    'cta.contactUs': 'Contact Us',
    'cta.sendRequest': 'Send Request',
    'cta.getQuote': 'Get a Quote',
    'cta.learnMore': 'Learn More',
    'cta.viewDemo': 'View Demo',
    'cta.startNow': 'Start Now',
    'cta.bookConsultation': 'Book a Consultation',

    // Project Request Form
    'request.fullName': 'Full Name',
    'request.fullName.placeholder': 'Enter your full name',
    'request.phoneNumber': 'Phone Number',
    'request.phoneNumber.placeholder': '+1 (555) 000-0000',
    'request.socialMedia': 'Social Media',
    'request.socialMedia.placeholder': 'LinkedIn, Twitter, or website URL',
    'request.companyName': 'Company Name',
    'request.companyName.placeholder': 'Enter your company name',
    'request.country': 'Country',
    'request.country.placeholder': 'Select your country',
    'request.projectIdea': 'Project Idea',
    'request.projectIdea.placeholder': 'Describe your project in detail...',
    'request.additionalNotes': 'Additional Notes',
    'request.additionalNotes.placeholder': 'Any additional information...',
    'request.submitRequest': 'Submit Request',
    'request.submitting': 'Submitting...',
    'request.success': 'Your request has been submitted successfully!',
    'request.error': 'Failed to submit request. Please try again.',
    'request.required': 'This field is required',
    'request.invalidEmail': 'Please enter a valid email address',
    'request.invalidPhone': 'Please enter a valid phone number',

    // Admin Labels
    'admin.projectRequests': 'Project Requests',
    'admin.requestDetails': 'Request Details',
    'admin.requestStatus': 'Request Status',
    'admin.newRequest': 'New Request',
    'admin.reviewed': 'Reviewed',
    'admin.contacted': 'Contacted',
    'admin.closed': 'Closed',
    'admin.pending': 'Pending',
    'admin.approved': 'Approved',
    'admin.rejected': 'Rejected',
    'admin.allRequests': 'All Requests',
    'admin.todayRequests': 'Today\'s Requests',
    'admin.weekRequests': 'This Week',
    'admin.monthRequests': 'This Month',
    'admin.exportData': 'Export Data',
    'admin.filterBy': 'Filter By',
    'admin.sortBy': 'Sort By',
    'admin.searchRequests': 'Search Requests',
    'admin.noRequests': 'No requests found',
    'admin.markAsReviewed': 'Mark as Reviewed',
    'admin.markAsContacted': 'Mark as Contacted',
    'admin.markAsClosed': 'Mark as Closed',
    'admin.viewDetails': 'View Details',
    'admin.deleteRequest': 'Delete Request',
    'admin.confirmDelete': 'Are you sure you want to delete this request?',
    'admin.requestId': 'Request ID',
    'admin.submittedOn': 'Submitted On',
    'admin.lastUpdated': 'Last Updated',
    'admin.notes': 'Notes',
    'admin.addNote': 'Add Note',
    'admin.assignTo': 'Assign To',
    'admin.priority': 'Priority',
    'admin.highPriority': 'High Priority',
    'admin.mediumPriority': 'Medium Priority',
    'admin.lowPriority': 'Low Priority',

    // Projects Page Additional
    'projects.engineLabel': '#5 PROJECTS ENGINE',
    'projects.projects': 'Projects',
    'projects.technologies': 'Technologies',
    'projects.successRate': 'Success Rate',
    'projects.relatedTech': 'Related Technologies',
    'projects.internalNav': 'Internal Project Navigation',
    'projects.exploreMore': 'Explore More',
    'projects.servicesLink': 'Services',
    'projects.servicesDesc': 'Explore our comprehensive service offerings',
    'projects.articlesLink': 'Articles',
    'projects.articlesDesc': 'Read our latest insights and knowledge',
    'projects.startProjectLink': 'Start a Project',

    // Service Page
    'service.explore': 'Explore',
    'service.ecommerce': 'E-Commerce Platform',
    'service.fintech': 'Fintech Dashboard',
    'service.health': 'Health App',
    'service.gettingStarted': 'Getting Started Guide',
    'service.bestPractices': 'Best Practices',
    'service.caseStudies': 'Case Studies',
    'service.ahmedHassan': 'Ahmed Hassan',
    'service.sarahChen': 'Sarah Chen',
    'service.marcusWilliams': 'Marcus Williams',
    'service.highPerformance': 'High Performance',
    'service.highPerformanceDesc': 'Lightning-fast load times with optimized code splitting and caching strategies',
    'service.scalableArchitecture': 'Scalable Architecture',
    'service.scalableArchitectureDesc': 'Microservices design that grows with your business needs',
    'service.realTimeUpdates': 'Real-time Updates',
    'service.realTimeUpdatesDesc': 'WebSocket integration for live data synchronization',
    'service.crossPlatform': 'Cross-Platform',
    'service.crossPlatformDesc': 'Single codebase for iOS and Android with native performance',
    'service.nativeUI': 'Native UI',
    'service.nativeUIDesc': 'Platform-specific components for authentic user experiences',
    'service.offlineSupport': 'Offline Support',
    'service.offlineSupportDesc': 'Seamless functionality without internet connection',
    'service.userResearch': 'User Research',
    'service.userResearchDesc': 'Data-driven design decisions based on comprehensive user studies',
    'service.prototyping': 'Prototyping',
    'service.prototypingDesc': 'Interactive mockups for validation before development',
    'service.designSystems': 'Design Systems',
    'service.designSystemsDesc': 'Consistent, scalable component libraries',
    'service.naturalLanguage': 'Natural Language',
    'service.naturalLanguageDesc': 'Advanced NLP models for text understanding and generation',
    'service.computerVision': 'Computer Vision',
    'service.computerVisionDesc': 'Image recognition and processing systems',
    'service.predictiveAnalytics': 'Predictive Analytics',
    'service.predictiveAnalyticsDesc': 'ML-powered forecasting and decision support',
    'service.games2d3d': '2D & 3D Games',
    'service.games2d3dDesc': 'Cross-platform games with stunning visuals',
    'service.multiplayer': 'Multiplayer',
    'service.multiplayerDesc': 'Real-time multiplayer with lag compensation',
    'service.gameAI': 'Game AI',
    'service.gameAIDesc': 'Intelligent NPCs and adaptive difficulty',
    'service.cloudNative': 'Cloud Native',
    'service.cloudNativeDesc': 'Containerized deployments with orchestrated scaling',
    'service.highAvailability': 'High Availability',
    'service.highAvailabilityDesc': 'Multi-region redundancy with automatic failover',
    'service.securityFirst': 'Security First',
    'service.securityFirstDesc': 'Defense-in-depth architecture with compliance automation',
    'service.relatedContent': 'Related Content',
    'service.horLogo': 'AXIOMX Logo',

    // Service Feature Keys
    'service.web.feature1.title': 'High Performance',
    'service.web.feature1.desc': 'Lightning-fast load times with optimized code splitting and caching strategies',
    'service.web.feature2.title': 'Scalable Architecture',
    'service.web.feature2.desc': 'Microservices design that grows with your business needs',
    'service.web.feature3.title': 'Real-time Updates',
    'service.web.feature3.desc': 'WebSocket integration for live data synchronization',
    'service.mobile.feature1.title': 'Cross-Platform',
    'service.mobile.feature1.desc': 'Single codebase for iOS and Android with native performance',
    'service.mobile.feature2.title': 'Native UI',
    'service.mobile.feature2.desc': 'Platform-specific components for authentic user experiences',
    'service.mobile.feature3.title': 'Offline Support',
    'service.mobile.feature3.desc': 'Seamless functionality without internet connection',
    'service.ui.feature1.title': 'User Research',
    'service.ui.feature1.desc': 'Data-driven design decisions based on comprehensive user studies',
    'service.ui.feature2.title': 'Prototyping',
    'service.ui.feature2.desc': 'Interactive mockups for validation before development',
    'service.ui.feature3.title': 'Design Systems',
    'service.ui.feature3.desc': 'Consistent, scalable component libraries',
    'service.ai.feature1.title': 'Natural Language',
    'service.ai.feature1.desc': 'Advanced NLP models for text understanding and generation',
    'service.ai.feature2.title': 'Computer Vision',
    'service.ai.feature2.desc': 'Image recognition and processing systems',
    'service.ai.feature3.title': 'Predictive Analytics',
    'service.ai.feature3.desc': 'ML-powered forecasting and decision support',
    'service.games.feature1.title': '2D & 3D Games',
    'service.games.feature1.desc': 'Cross-platform games with stunning visuals',
    'service.games.feature2.title': 'Multiplayer',
    'service.games.feature2.desc': 'Real-time multiplayer with lag compensation',
    'service.games.feature3.title': 'Game AI',
    'service.games.feature3.desc': 'Intelligent NPCs and adaptive difficulty',
    'service.software.feature1.title': 'Cloud Native',
    'service.software.feature1.desc': 'Containerized deployments with orchestrated scaling',
    'service.software.feature2.title': 'High Availability',
    'service.software.feature2.desc': 'Multi-region redundancy with automatic failover',
    'service.software.feature3.title': 'Security First',
    'service.software.feature3.desc': 'Defense-in-depth architecture with compliance automation',
    'service.card.type.project': 'Project',
    'service.card.type.article': 'Article',
    'service.card.type.developer': 'Developer',

    // Article Page

    // Project Detail - Duration translations
    'project.duration.horAI': '4 months',
    'project.duration.cyberSecurity': '6 months',
    'project.duration.smartWeb': '3 months',
    'project.duration.ecommerce': '8 months',
    'project.duration.healthcare': '12 months',
    'project.duration.gaming': '10 months',
    'project.duration.fintech': '9 months',
    'project.duration.education': '7 months',
    'project.duration.logistics': '11 months',
    'project.duration.social': '6 months',

    // Project Detail - Client translations
    'project.client.horAI': 'Enterprise Tech Corp',
    'project.client.cyberSecurity': 'Global Security Inc',
    'project.client.smartWeb': 'Digital Solutions Ltd',
    'project.client.ecommerce': 'RetailMax Inc',
    'project.client.healthcare': 'MedTech Health',
    'project.client.gaming': 'GameStudio Pro',
    'project.client.fintech': 'FinanceHub Global',
    'project.client.education': 'EduLearn Academy',
    'project.client.logistics': 'FastTrack Logistics',
    'project.client.social': 'SocialConnect',

    // Project Detail - Image alt text
    'project.alt.aiArchitecture': 'AI System Architecture',
    'project.alt.threatDetection': 'Threat Detection Interface',
    'project.alt.galleryImage': 'Image',

    // ProjectsPage - Status and Duration translations
    'projects.status.horAI': 'Live',
    'projects.status.cyberSecurity': 'Live',
    'projects.status.smartWeb': 'Live',
    'projects.status.ecommerce': 'Live',
    'projects.status.healthcare': 'Live',
    'projects.status.gaming': 'Live',
    'projects.status.fintech': 'Live',
    'projects.status.education': 'Live',
    'projects.status.logistics': 'Live',
    'projects.status.social': 'Live',

    'projects.duration.horAI': '4 months',
    'projects.duration.cyberSecurity': '6 months',
    'projects.duration.smartWeb': '3 months',
    'projects.duration.ecommerce': '8 months',
    'projects.duration.healthcare': '12 months',
    'projects.duration.gaming': '10 months',
    'projects.duration.fintech': '9 months',
    'projects.duration.education': '7 months',
    'projects.duration.logistics': '11 months',
    'projects.duration.social': '6 months',

    // ProjectsPage - Technology translations
    'tech.react': 'React',
    'tech.nodejs': 'Node.js',
    'tech.python': 'Python',
    'tech.typescript': 'TypeScript',
    'tech.mongodb': 'MongoDB',
    'tech.postgresql': 'PostgreSQL',
    'tech.aws': 'AWS',
    'tech.docker': 'Docker',
    'tech.tensorflow': 'TensorFlow',
    'tech.graphql': 'GraphQL',
    'tech.redis': 'Redis',
    'tech.nextjs': 'Next.js',
    'tech.openai': 'OpenAI API',
    'tech.django': 'Django',
    'tech.stripe': 'Stripe',
    'tech.reactnative': 'React Native',
    'tech.hl7': 'HL7',
    'tech.fhir': 'FHIR',
    'tech.unity': 'Unity',
    'tech.photon': 'Photon',
    'tech.csharp': 'C#',
    'tech.webgl': 'WebGL',
    'tech.fastapi': 'FastAPI',
    'tech.kubernetes': 'Kubernetes',
    'tech.terraform': 'Terraform',
    'tech.azure': 'Azure',
    'tech.gcp': 'GCP',
    'tech.cicd': 'CI/CD',
    'tech.flutter': 'Flutter',
    'tech.swift': 'Swift',
    'tech.kotlin': 'Kotlin',
    'tech.firebase': 'Firebase',
    'tech.realm': 'Realm',
    'tech.swiftui': 'SwiftUI',
    'tech.figma': 'Figma',
    'tech.adobe': 'Adobe XD',
    'tech.aftereffects': 'After Effects',
    'tech.prototype': 'Prototyping',
    'tech.designsystems': 'Design Systems',
    'tech.a11y': 'Accessibility',
    'tech.pytorch': 'PyTorch',
    'tech.langchain': 'LangChain',
    'tech.huggingface': 'Hugging Face',
    'tech.mlflow': 'MLflow',
    'tech.unreal': 'Unreal Engine',
    'tech.cpp': 'C++',
    'tech.blender': 'Blender',
    'tech.threejs': 'Three.js',

    // ServicePage - Related card titles
    'service.related.ecommerce': 'E-Commerce Platform',
    'service.related.fintech': 'Fintech Dashboard',
    'service.related.health': 'Health App',
    'service.related.startGuide': 'Getting Started Guide',
    'service.related.bestPractices': 'Best Practices',
    'service.related.caseStudies': 'Case Studies',
    'service.related.ahmedHassan': 'Ahmed Hassan',
    'service.related.sarahChen': 'Sarah Chen',
    'service.related.marcusWilliams': 'Marcus Williams',

    // ServicePage - Keyword terms
    'service.keyword.react': 'React',
    'service.keyword.api': 'API',
    'service.keyword.auth': 'Authentication',
    'service.keyword.database': 'Database',
    'service.keyword.cloud': 'Cloud Infrastructure',
    'service.keyword.uiux': 'UI/UX',
    'service.keyword.mobileapi': 'Mobile API',
    'service.keyword.mobileauth': 'Mobile Auth',
    'service.keyword.ml': 'Machine Learning',
    'service.keyword.aiapi': 'AI API Integration',
    'service.keyword.aicloud': 'AI Cloud',
    'service.keyword.ai': 'AI',
    'service.keyword.gamedev': 'Game Development',
    'service.keyword.unity': 'Unity',
    'service.keyword.graphics': '3D Graphics',
    'service.keyword.gameai': 'Game AI',
    'service.keyword.security': 'Cybersecurity',
    'service.keyword.devops': 'DevOps',
    'service.keyword.infradb': 'Infrastructure DB',
    'service.keyword.a11y': 'Accessibility',

    // ArticlePage - Article meta
    'article.meta.ai': 'The Future of AI in Web Development',
    'article.meta.ux': 'Designing for the Next Generation',
    'article.meta.cloud': 'Cloud-Native Architecture Best Practices',
    'article.meta.cybersecurity': 'Cybersecurity Basics for Modern Web',
    'article.meta.react': 'React Framework Deep Dive',
    'article.meta.aiFull': 'The Future of AI',
    'article.meta.cyberFull': 'Cybersecurity Basics',
    'article.meta.reactFull': 'React Framework',
    'article.meta.category.tech': 'Technology',
    'article.meta.category.design': 'Design',
    'article.meta.category.architecture': 'Architecture',

    // ArticlePage - Tags prefix
    'article.tag.prefix': '#',

    // Contact Info
    'contact.email': 'hello@axiomx.com',
    'contact.phone': '+1 (555) 123-4567',
    'contact.location': 'San Francisco, CA',

    // Admin Dashboard - Stats
    'admin.totalUsers': 'Total Users',
    'admin.activeProjects': 'Active Projects',
    'admin.articlesCount': 'Articles',
    'admin.totalViews': 'Total Views',
    'admin.monthlyPerformance': 'Monthly Performance',
    'admin.contentDistribution': 'Content Distribution',
    'admin.recentActivity': 'Recent Activity',
    'admin.quickActions': 'Quick Actions',
    'admin.viewAll': 'View All',

    // Admin Dashboard - Quick Actions
    'admin.newProject': 'New Project',
    'admin.addMember': 'Add Member',
    'admin.writeArticle': 'Write Article',
    'admin.sendMessage': 'Send Message',

    // Admin Dashboard - Welcome
    'admin.welcome': 'Welcome back',
    'admin.welcomeSubtitle': "Here's what's happening with your projects today",

    // Admin - Time Ago
    'admin.minAgo': 'min ago',
    'admin.minsAgo': 'mins ago',
    'admin.hourAgo': 'hour ago',
    'admin.hoursAgo': 'hours ago',
    'admin.justNow': 'just now',

    // Admin - Roles
    'role.owner': 'Owner',
    'role.manager': 'Manager',
    'role.employee': 'Employee',

    // Admin - Notifications
    'admin.notifications': 'Notifications',
    'admin.notification.newProject': 'New project added',
    'admin.notification.teamJoined': 'Team member joined',
    'admin.notification.systemUpdated': 'System update completed',

    // Admin - Header
    'admin.profile': 'Profile',
    'admin.settings': 'Settings',
    'admin.logout': 'Logout',

    // Admin - Sidebar
    'admin.dashboard': 'Dashboard',
    'admin.projects': 'Projects',
    'admin.services': 'Services',
    'admin.articles': 'Articles',
    'admin.team': 'Team',
    'admin.messages': 'Messages',
    'admin.chat': 'Internal Chat',
    'admin.attachments': 'Attachments',
    'admin.permissions': 'Permissions',
    'admin.activity': 'Activity Logs',

    // Admin - Placeholder
    'admin.comingSoon': 'Coming Soon',

    // Admin - General
    'admin.new': 'new',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.projects': 'المشاريع',
    'nav.services': 'الخدمات',
    'nav.developers': 'المطورون',
    'nav.articles': 'المقالات',
    'nav.contact': 'اتصل بنا',
    'nav.getStarted': 'ابدأ الآن',

    // Hero
    'hero.title': 'اكسيومكس',
    'hero.subtitle': 'نبني مستقبل التجارب الرقمية',
    'hero.description': 'نصمم حلول برمجية فاخرة تحوّل الأفكار إلى منتجات رقمية استثنائية. مواقع إلكترونية، تطبيقات جوال، ألعاب، وأنظمة ذكية.',
    'hero.explore': 'استكشف أعمالنا',
    'hero.contact': 'أطلق مشروعك',
    'hero.login': 'انضم إلى فريق AXIOMX',

    // Client Form
    'form.title': 'أطلق مشروعك',
    'form.subtitle': 'أخبرنا عن رؤيتك وسنجعلها حقيقة',
    'form.name': 'الاسم الكامل',
    'form.name.placeholder': 'أدخل اسمك الكامل',
    'form.phone': 'رقم الهاتف',
    'form.phone.placeholder': '+966 50 000 0000',
    'form.social': 'رابط تواصل',
    'form.social.placeholder': 'لينكدإن، تويتر، أو موقعك الإلكتروني',
    'form.type': 'نوع المشروع',
    'form.type.placeholder': 'اختر نوع المشروع',
    'form.idea': 'فكرة المشروع',
    'form.idea.placeholder': 'صف رؤية مشروعك وأهدافه وميزاته الرئيسية...',
    'form.submit': 'إرسال الطلب',
    'form.submitting': 'جارٍ الإرسال...',
    'form.success': 'تم إرسال طلبك بنجاح!',
    'form.close': 'إغلاق',

    // FAQ Section
    'faq.title': 'الأسئلة الشائعة',
    'faq.howContext': 'كيف يحافظ الذكاء الاصطناعي على السياق؟',
    'faq.howContext.answer': 'يستخدم النظام إدارة سياق متطورة تخزن سجل المحادثات ونقاط البيانات ذات الصلة، مما يسمح للذكاء الاصطناعي بالحفاظ على الاستمرارية عبر تفاعلات متعددة.',
    'faq.integrateSystems': 'هل يمكن دمجه مع الأنظمة الحالية؟',
    'faq.integrateSystems.answer': 'نعم، يوفر المساعد الذكي واجهات برمجة تطبيقات REST واتصالات WebSocket للدمج السلس مع أي أنظمة مؤسسية حالية.',
    'faq.languages': 'ما هي اللغات المدعومة؟',
    'faq.languages.answer': 'يدعم حالياً أكثر من 25 لغة بما في ذلك الإنجليزية والإسبانية والفرنسية والألمانية والعربية والصينية واليابانية.',
    'faq.threatAccuracy': 'ما دقة كشف التهديدات؟',
    'faq.threatAccuracy.answer': 'تحقق نماذج تعلم الآلة دقة 98.5% في تحديد التهديدات المعروفة و92% للهجمات الجديدة ذات اليوم الصفري.',
    'faq.autoResponse': 'هل يمكن الاستجابة تلقائياً؟',
    'faq.autoResponse.answer': 'نعم، يمكن للنظام تنفيذ كتب قواعد استجابة محددة مسبقاً بناءً على مستويات خطورة التهديدات.',
    'faq.pageLoad': 'ما هو وقت تحميل الصفحة؟',
    'faq.pageLoad.answer': 'متوسط وقت تحميل الصفحة أقل من ثانية واحدة مع تحسين الصور وتقسيم الشيفرة.',
    'faq.seoOptimized': 'هل محسّن لمحركات البحث؟',
    'faq.seoOptimized.answer': 'نعم، مع العرض من جانب الخادم وعلامات التعريف المناسبة، تحقق المنصة تصنيفات ممتازة في محركات البحث.',

    // Status Labels
    'status.live': 'نشط',
    'status.inProgress': 'قيد التنفيذ',
    'status.completed': 'مكتمل',

    // Project Details
    'project.overview': 'نظرة عامة على المشروع',
    'project.implementation': 'تفاصيل التنفيذ',
    'project.performance': 'مقاييس الأداء',
    'project.apiExample': 'مثال على تكامل API',
    'project.detection': 'نظام كشف التهديدات',
    'project.mlModel': 'نموذج كشف التهديدات',
    'project.architecture': 'هندسة النظام',
    'project.screenshots': 'لقطات شاشة الواجهة',
    'project.platformScreenshots': 'لقطات شاشة المنصة',
    'project.capSystem': 'هندسة النظام عالية المستوى تظهر التكامل بين الخدمات المتعددة',
    'project.capThreat': 'لوحة كشف وتحليل التهديدات في الوقت الفعلي',
    'project.startProject': 'ابدأ مشروعاً مشابهاً',
    'project.qualityText': 'احصل على نفس مستوى الجودة والابتكار لمشروعك القادم.',

    // Project Types
    'project.type.website': 'موقع إلكتروني',
    'project.type.mobile': 'تطبيق جوال',
    'project.type.ai': 'نظام ذكاء اصطناعي',
    'project.type.dashboard': 'لوحة تحكم',
    'project.type.other': 'أخرى',

    // Projects
    'projects.title': 'مشاريع مميزة',
    'projects.subtitle': 'حلول مبتكرة قدمناها',
    'projects.viewProject': 'عرض المشروع',
    'projects.tech': 'التقنيات:',
    'projects.cuttingEdge': 'حلول متطورة توفر نتائج استثنائية',

    // Services
    'services.title': 'خدماتنا',
    'services.subtitle': 'حلول رقمية شاملة',
    'services.web': 'تطوير الويب',
    'services.web.desc': 'مواقع إلكترونية عصرية ومتجاوبة مبنية بأحدث التقنيات.',
    'services.mobile': 'تطبيقات الجوال',
    'services.mobile.desc': 'تجارب تطبيقات جوال أصلية وعابرة للمنصات.',
    'services.ui': 'تصميم UI/UX',
    'services.ui.desc': 'واجهات جميلة يحبها المستخدمون.',
    'services.ai': 'الذكاء الاصطناعي',
    'services.ai.desc': 'أنظمة ذكية وحلول تعلم آلي متقدمة.',
    'services.games': 'تطوير الألعاب',
    'services.games.desc': 'ألعاب جذابة على جميع المنصات.',
    'services.software': 'الأنظمة البرمجية',
    'services.software.desc': 'حلول مؤسسية وأنظمة مخصصة.',

    // Developers
    'developers.title': 'تعرف على فريقنا',
    'developers.subtitle': 'العقول المبدعة وراء الابتكار',
    'developers.orgStructure': 'الهيكل التنظيمي',
    'developers.exploreHierarchy': 'استكشف تسلسل فريق AXIOMX',
    'developers.investors': 'المستثمرون',
    'developers.employees': 'الموظفون',
    'developers.strategicPartners': 'شركاء استراتيجيين',
    'developers.teamMembers': 'أعضاء الفريق',
    'developers.clickToView': 'انقر لعرض الملف الشخصي',

    // Articles
    'articles.title': 'آخر الرؤى',
    'articles.subtitle': 'أفكار حول التكنولوجيا والتصميم',
    'articles.readMore': 'اقرأ المقال',

    // Clients
    'clients.title': 'يثق بنا',
    'clients.subtitle': 'شركات تؤمن برؤيتنا',

    // Footer
    'footer.tagline': 'نبني المستقبل، سطراً من الشيفرة في كل مرة.',
    'footer.copyright': '© 2026 اكسيومكس. جميع الحقوق محفوظة.',

    // Project titles
    'project.ecommerce': 'منصة التجارة الإلكترونية',
    'project.ecommerce.desc': 'تجربة تسوق سلسة مع توصيات مدعومة بالذكاء الاصطناعي.',
    'project.health': 'متتبع الصحة',
    'project.health.desc': 'تطبيق جوال شامل لرصد الصحة.',
    'project.saas': 'منصة SaaS',
    'project.saas.desc': 'حل إدارة مشاريع قائم على السحابة.',
    'project.ai': 'مساعد ذكي',
    'project.ai.desc': 'مساعد افتراضي ذكي بمعالجة اللغة الطبيعية.',

    // Article titles
    'article.ai': 'مستقبل الذكاء الاصطناعي في تطوير الويب',
    'article.ai.category': 'التكنولوجيا',
    'article.ux': 'التصميم للجيل القادم',
    'article.ux.category': 'التصميم',
    'article.cloud': 'أفضل ممارسات البنية السحابية',
    'article.cloud.category': 'البنية',

    // Reading time
    'read.time': 'دقيقة للقراءة',

    // Articles Section
    'articles.insights': 'الرؤى والمقالات',
    'articles.exploreInsights': 'استكشف آخر أفكارنا حول التكنولوجيا والتطوير والابتكار',
    'articles.exploreKnowledgeBase': 'استكشف قاعدة المعرفة',

    // Tags
    'tag.react': 'React',
    'tag.node': 'Node.js',
    'tag.python': 'Python',
    'tag.ai': 'AI/ML',
    'tag.cloud': 'سحابة',
    'tag.mobile': 'جوال',
    'tag.game': 'ألعاب',
    'tag.unity': 'Unity',
    'tag.swift': 'Swift',
    'tag.figma': 'Figma',
    'tag.nextjs': 'Next.js',
    'tag.typescript': 'TypeScript',
    'tag.graphql': 'GraphQL',
    'tag.websocket': 'WebSocket',
    'tag.security': 'أمان',

    // New Projects - AXIOMX AI Assistant
    'project.horAI.title': 'مساعد AXIOMX الذكي',
    'project.horAI.desc': 'مساعد افتراضي ذكي بقدرات معالجة اللغة الطبيعية.',
    'project.horAI.fullDesc': 'مساعد AXIOMX الذكي هو منصة ذكاء اصطناعي متطورة مصممة لإحداث ثورة في تفاعل المستخدم. مبني بقدرات متقدمة في معالجة اللغة الطبيعية، يوفر استجابات ذكية فورية مع وعي بالسياق والذاكرة. يتميز النظام بتكامل سلس مع APIs، ودعم متعدد اللغات، ويمكن تخصيصه لمختلف الصناعات بما في ذلك خدمة العملاء والرعاية الصحية والتعليم.',

    // New Projects - Cyber Security Dashboard
    'project.cyberSecurity.title': 'لوحة أمن السيبراني',
    'project.cyberSecurity.desc': 'نظام كشف ومراقبة التهديدات في الوقت الفعلي للأمن المؤسسي.',
    'project.cyberSecurity.fullDesc': 'لوحة أمن السيبراني هي حل أمني شامل للمؤسسات يوفر قدرات كشف ومراقبة واستجابة آلية للتهديدات في الوقت الفعلي. مبني بنماذج تعلم آلي للتحليل الذكي للتهديدات، يقدم تقييم مخاطر شامل وتتبع الامتثال وتكامل سلس مع البنية التحتية الأمنية الحالية. تتميز المنصة بلوحة تحكم سهلة الاستخدام مع تحليلات مفصلة وتنبيهات قابلة للتخصيص.',

    // New Projects - Smart Web Platform
    'project.smartWeb.title': 'منصة الويب الذكية',
    'project.smartWeb.desc': 'تطبيق ويب عالي الأداء مع ميزات متقدمة وتحليلات.',
    'project.smartWeb.fullDesc': 'منصة الويب الذكية هي تطبيق ويب حديث وعالي الأداء مبني بأحدث التقنيات بما في ذلك Next.js و TypeScript. يتميز بعرض من جانب الخادم لتحسين SEO، وتصميم متجاوب يعمل بسلاسة عبر جميع الأجهزة، ولوحة تحكم تحليلات شاملة. تستخدم المنصة GraphQL لجلب البيانات بكفاءة وتُنشر على AWS لأقصى موثوقية وقابلية للتوسع.',

    // Additional Projects
    'project.healthcare.title': 'تطبيق الرعاية الصحية',
    'project.healthcare.desc': 'تطبيق جوال شامل للرعاية الصحية مع قدرات الطب عن بُعد.',
    'project.healthcare.fullDesc': 'تطبيق رعاية صحية متوافق مع HIPAA مع قدرات الطب عن بُعد وإدارة سجلات المرضى وتتبع الوصفات الطبية.',

    'project.gaming.title': 'منصة الألعاب',
    'project.gaming.desc': 'منصة ألعاب عابرة للمنصات مع دعم اللعب الجماعي.',
    'project.gaming.fullDesc': 'منصة ألعاب عابرة للمنصات مع دعم اللعب الجماعي ولوحات المتصدرين والبحث عن مباريات في الوقت الفعلي مدعومة بـ Unity و Photon.',

    'project.fintech.title': 'لوحة Fintech',
    'project.fintech.desc': 'لوحة fintech شاملة لتتبع المحفظة.',
    'project.fintech.fullDesc': 'لوحة fintech شاملة لتتبع المحفظة وتحليل المخاطر والتداول الآلي مع تحليلات في الوقت الفعلي.',

    'project.education.title': 'منصة التعليم',
    'project.education.desc': 'منصة تعليمية تفاعلية مع البث المباشر للفيديو.',
    'project.education.fullDesc': 'منصة تعليمية تفاعلية مع البث المباشر للفيديو والاختبارات وتتبع التقدم وتوليد الشهادات.',

    'project.logistics.title': 'تتبع后勤',
    'project.logistics.desc': 'نظام تتبع后勤 مع تحسين المسار.',
    'project.logistics.fullDesc': 'نظام تتبع后勤 مع تحسين المسار وإدارة الأسطول والتحليلات التنبؤية المدعومة بتعلم الآلة.',

    'project.social.title': 'تطبيق التواصل الاجتماعي',
    'project.social.desc': 'تطبيق تواصل اجتماعي غني بالميزات.',
    'project.social.fullDesc': 'تطبيق تواصل اجتماعي غني بالميزات مع الدردشة في الوقت الفعلي وخبرات التغذية ومشاركة الوسائط.',

    // Article Page UI
    'article.readMore': 'اقرأ المقال',
    'article.relatedArticles': 'مقالات ذات صلة',
    'article.share': 'شارك المقال',
    'article.shareDesc': 'شارك هذا المقال مع شبكتك',
    'article.backToArticles': 'العودة للمقالات',
    'article.minRead': 'دقيقة للقراءة',
    'article.author': 'المؤلف',
    'article.date': 'التاريخ',

    // Project Page UI
    'project.viewProject': 'عرض المشروع',
    'project.viewAll': 'عرض جميع المشاريع',
    'project.status': 'الحالة',
    'project.technologies': 'التقنيات المستخدمة',
    'project.features': 'المميزات الرئيسية',
    'project.relatedProjects': 'مشاريع ذات صلة',
    'project.relatedServices': 'خدمات ذات صلة',

    // Service Page UI
    'service.exploreService': 'استكشف الخدمة',
    'service.relatedProjects': 'مشاريع ذات صلة',
    'service.relatedArticles': 'مقالات ذات صلة',

    // Common UI
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.notFound': 'غير موجود',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.explore': 'استكشف',
    'common.learnMore': 'اعرف المزيد',
    'common.contact': 'اتصل بنا',
    'common.startProject': 'ابدأ مشروعك',
    'common.returnHome': 'العودة للرئيسية',
    'common.returnToHome': 'العودة للرئيسية',
    'common.backToProjects': 'العودة للمشاريع',
    'common.backToArticles': 'العودة للمقالات',
    'common.share': 'شارك',
    'common.relatedArticles': 'مقالات ذات صلة',
    'common.relatedProjects': 'مشاريع ذات صلة',
    'common.relatedServices': 'خدمات ذات صلة',
    'common.technologiesUsed': 'التقنيات المستخدمة',

    // Contact Info
    'contact.email': 'hello@axiomx.com',
    'contact.phone': '+1 (555) 123-4567',
    'contact.location': 'سان فرانسيسكو، كاليفورنيا',

    // Admin Dashboard - Stats
    'admin.totalUsers': 'إجمالي المستخدمين',
    'admin.activeProjects': 'المشاريع النشطة',
    'admin.articlesCount': 'المقالات',
    'admin.totalViews': 'إجمالي المشاهدات',
    'admin.monthlyPerformance': 'الأداء الشهري',
    'admin.contentDistribution': 'توزيع المحتوى',
    'admin.recentActivity': 'النشاط الأخير',
    'admin.quickActions': 'إجراءات سريعة',
    'admin.viewAll': 'عرض الكل',

    // Admin Dashboard - Quick Actions
    'admin.newProject': 'مشروع جديد',
    'admin.addMember': 'إضافة عضو',
    'admin.writeArticle': 'كتابة مقال',
    'admin.sendMessage': 'إرسال رسالة',

    // Admin Dashboard - Welcome
    'admin.welcome': 'مرحباً',
    'admin.welcomeSubtitle': 'إليك ملخص نشاطك لهذا اليوم',

    // Admin - Time Ago
    'admin.minAgo': 'دقيقة',
    'admin.minsAgo': 'دقائق',
    'admin.hourAgo': 'ساعة',
    'admin.hoursAgo': 'ساعات',
    'admin.justNow': 'الآن',

    // Admin - Roles
    'role.owner': 'المالك',
    'role.manager': 'مدير',
    'role.employee': 'موظف',

    // Admin - Notifications
    'admin.notifications': 'الإشعارات',
    'admin.notification.newProject': 'تم إضافة مشروع جديد',
    'admin.notification.teamJoined': 'انضم عضو جديد للفريق',
    'admin.notification.systemUpdated': 'تم تحديث النظام',

    // Admin - Header
    'admin.profile': 'الملف الشخصي',
    'admin.settings': 'الإعدادات',
    'admin.logout': 'تسجيل الخروج',

    // Admin - Sidebar
    'admin.dashboard': 'لوحة التحكم',
    'admin.projects': 'المشاريع',
    'admin.services': 'الخدمات',
    'admin.articles': 'المقالات',
    'admin.team': 'الفريق',
    'admin.messages': 'الرسائل',
    'admin.chat': 'الشات الداخلي',
    'admin.attachments': 'المرفقات',
    'admin.permissions': 'الصلاحيات',
    'admin.activity': 'سجل النشاط',

    // Admin - Placeholder
    'admin.comingSoon': 'قريباً',

    // Admin - General
    'admin.new': 'جديد',

    // Admin - Activity Labels
    'admin.activity.newUser': 'مستخدم جديد مسجل',
    'admin.activity.userJoined': 'سارة جونسون انضمت للفريق',
    'admin.activity.projectCompleted': 'مشروع مكتمل',
    'admin.activity.websiteRedesign': 'تم إنهاء مشروع إعادة تصميم الموقع',
    'admin.activity.articlePublished': 'مقال منشور',
    'admin.activity.newTechArticle': 'مقال تقني جديد عن اتجاهات الذكاء الاصطناعي',
    'admin.activity.systemUpdated': 'تحديث النظام',
    'admin.activity.securityPatches': 'تم تطبيق تصحيحات الأمان',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const location = useLocation();
  const isInitialized = useRef(false);

  // Detect language from URL path
  const isArabicUrl = location.pathname.startsWith('/ar') || location.pathname === '/ar';

  // Sync language with URL on mount and when URL changes (not when language changes)
  useEffect(() => {
    if (!isInitialized.current) {
      // Initial load: check localStorage first
      const saved = localStorage.getItem('language') as Language;
      if (saved) {
        setLanguageState(saved);
        isInitialized.current = true;
        return;
      }
    }

    // Sync with URL if needed
    if (isArabicUrl && language !== 'ar') {
      setLanguageState('ar');
      isInitialized.current = true;
    } else if (!isArabicUrl && language === 'ar') {
      setLanguageState('en');
      isInitialized.current = true;
    }
  }, [isArabicUrl]); // Only depend on URL, not language to avoid deadlock

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, isArabicUrl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};