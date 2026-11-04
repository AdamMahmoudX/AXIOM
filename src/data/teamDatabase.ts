// =====================================================
// TEAM DATABASE - AXIOMX ADMIN SYSTEM
// Phase 4D: Team Block
// Mock Team Database with 15 Professional Employees
// =====================================================

export interface TeamEmployee {
  id: string;
  employeeId: string;
  fullName: string;
  fullNameAr: string;
  email: string;
  phone: string;
  avatar: string;
  jobTitle: string;
  jobTitleAr: string;
  department: string;
  departmentAr: string;
  bio: string;
  bioAr: string;
  skills: string[];
  skillsAr: string[];
  specialization: string;
  specializationAr: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  status: 'active' | 'inactive' | 'on_leave';
}

// Helper function to generate random date
const randomDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Mock Team Database with 15 Professional Employees
export const TEAM_DATABASE: TeamEmployee[] = [
  {
    id: 'team-1',
    employeeId: 'EMP-001',
    fullName: 'Ahmed Hassan Al-Mansouri',
    fullNameAr: 'أحمد حسن المنصوري',
    email: 'ahmed.hassan@axiomx.com',
    phone: '+966 50 123 4567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    jobTitle: 'Chief Executive Officer',
    jobTitleAr: 'الرئيس التنفيذي',
    department: 'Executive',
    departmentAr: 'الإدارة التنفيذية',
    bio: 'Visionary leader with 15+ years of experience in technology and business development. Founded AXIOMX with a mission to revolutionize digital experiences.',
    bioAr: 'قائد ذو رؤية مع أكثر من 15 عامًا من الخبرة في التكنولوجيا وتطوير الأعمال. أسس AXIOMX بمهمة إعادة صياغة التجارب الرقمية.',
    skills: ['Strategic Planning', 'Business Development', 'Leadership', 'Innovation', 'Digital Transformation'],
    skillsAr: ['التخطيط الاستراتيجي', 'تطوير الأعمال', 'القيادة', 'الابتكار', 'التحول الرقمي'],
    specialization: 'Technology Leadership',
    specializationAr: 'القيادة التقنية',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/ahmedhassan',
      twitter: 'https://twitter.com/ahmedhassan',
    },
    status: 'active',
  },
  {
    id: 'team-2',
    employeeId: 'EMP-002',
    fullName: 'Sarah Chen Williams',
    fullNameAr: 'سارة تشن ويليامز',
    email: 'sarah.chen@axiomx.com',
    phone: '+966 50 234 5678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    jobTitle: 'Chief Technology Officer',
    jobTitleAr: 'الرئيس التنفيذي للتقنية',
    department: 'Engineering',
    departmentAr: 'الهندسة',
    bio: 'PhD in Computer Science from Stanford. Expert in distributed systems and cloud architecture with a passion for building scalable solutions.',
    bioAr: 'دكتوراه في علوم الحاسب من ستانفورد. خبيرة في الأنظمة الموزعة وهندسة السحابة مع شغف ببناء حلول قابلة للتوسع.',
    skills: ['Cloud Architecture', 'Distributed Systems', 'Machine Learning', 'System Design', 'Python', 'Go'],
    skillsAr: ['هندسة السحابة', 'الأنظمة الموزعة', 'تعلم الآلة', 'تصميم الأنظمة', 'بايثون', 'جو'],
    specialization: 'Cloud & Distributed Systems',
    specializationAr: 'الأنظمة السحابية والموزعة',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahchen',
      github: 'https://github.com/sarahchen',
    },
    status: 'active',
  },
  {
    id: 'team-3',
    employeeId: 'EMP-003',
    fullName: 'Mohammed Abdulrahman Al-Otaibi',
    fullNameAr: 'محمد عبدالرحمن العتيبي',
    email: 'mohammed.abdulrahman@axiomx.com',
    phone: '+966 50 345 6789',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    jobTitle: 'Senior Full Stack Developer',
    jobTitleAr: 'مطور كامل أول',
    department: 'Engineering',
    departmentAr: 'الهندسة',
    bio: 'Full stack expert with deep knowledge in React, Node.js, and modern web technologies. Specializes in building high-performance web applications.',
    bioAr: 'خبير تطوير كامل مع معرفة عميقة في React و Node.js والتقنيات الحديثة للويب. متخصص في بناء تطبيقات ويب عالية الأداء.',
    skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL', 'Docker'],
    skillsAr: ['رياكت', 'نيكست.جيس', 'نود.جيس', 'تايب سكريبت', 'بوستغري إس كيو إل', 'جراف كيو إل', 'دوكر'],
    specialization: 'Full Stack Web Development',
    specializationAr: 'تطوير الويب الكامل',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/mohammedabdulrahman',
      github: 'https://github.com/mabdulrahman',
    },
    status: 'active',
  },
  {
    id: 'team-4',
    employeeId: 'EMP-004',
    fullName: 'Fatima Ibrahim Al-Zahrani',
    fullNameAr: 'فاطمة إبراهيم الزهراني',
    email: 'fatima.ibrahim@axiomx.com',
    phone: '+966 50 456 7890',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    jobTitle: 'Lead UI/UX Designer',
    jobTitleAr: 'مصممة UI/UX أولى',
    department: 'Design',
    departmentAr: 'التصميم',
    bio: 'Award-winning designer with a passion for creating intuitive and beautiful user experiences. Believes in design thinking and user-centered approach.',
    bioAr: 'مصممة حاصلة على جوائز مع شغف بإنشاء تجارب مستخدم سهلة وجميلة. تؤمن بالتفكير التصميمي والنهج المتمركز حول المستخدم.',
    skills: ['UI Design', 'UX Research', 'Figma', 'Adobe XD', 'Prototyping', 'Design Systems', 'User Testing'],
    skillsAr: ['تصميم الواجهة', 'بحث تجربة المستخدم', 'فيغما', 'أدوبي إكس دي', 'النمذجة الأولية', 'أنظمة التصميم', 'اختبار المستخدمين'],
    specialization: 'User Experience Design',
    specializationAr: 'تصميم تجربة المستخدم',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/fatimaibrahim',
      twitter: 'https://twitter.com/fatimaibrahim',
    },
    status: 'active',
  },
  {
    id: 'team-5',
    employeeId: 'EMP-005',
    fullName: 'Khaled Nasser Al-Mutairi',
    fullNameAr: 'خالد ناصر المطيري',
    email: 'khaled.nasser@axiomx.com',
    phone: '+966 50 567 8901',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    jobTitle: 'Backend Engineer',
    jobTitleAr: 'مهندس خلفية',
    department: 'Engineering',
    departmentAr: 'الهندسة',
    bio: 'Backend specialist with expertise in Python, Django, and microservices architecture. Builds robust and scalable server-side applications.',
    bioAr: 'متخصص في تطوير الخلفية مع خبرة في بايثون و Django وهندسة الخدمات المصغرة. يبني تطبيقات خلفية قوية وقابلة للتوسع.',
    skills: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis', 'Kubernetes', 'AWS'],
    skillsAr: ['بايثون', 'جانغو', 'فاست أي بي آي', 'بوستغري إس كيو إل', 'ريديس', 'كوبرنيتس', 'أي دبليو إس'],
    specialization: 'Backend Architecture',
    specializationAr: 'هندسة الخلفية',
    socialLinks: {
      github: 'https://github.com/knasser',
    },
    status: 'active',
  },
  {
    id: 'team-6',
    employeeId: 'EMP-006',
    fullName: 'Noura Sultan Al-Subaie',
    fullNameAr: 'نورة سلطان السبيعي',
    email: 'noura.sultan@axiomx.com',
    phone: '+966 50 678 9012',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    jobTitle: 'Marketing Director',
    jobTitleAr: 'مديرة التسويق',
    department: 'Marketing',
    departmentAr: 'التسويق',
    bio: 'Strategic marketing professional with 10+ years of experience in digital marketing, brand development, and growth strategies across MENA region.',
    bioAr: 'محترفة في التسويق الاستراتيجي مع أكثر من 10 سنوات من الخبرة في التسويق الرقمي وتطوير العلامة التجارية واستراتيجيات النمو في منطقة الشرق الأوسط.',
    skills: ['Digital Marketing', 'Brand Strategy', 'Social Media', 'SEO/SEM', 'Content Marketing', 'Analytics'],
    skillsAr: ['التسويق الرقمي', 'استراتيجية العلامة التجارية', 'وسائل التواصل الاجتماعي', 'سيو/سم', 'تسويق المحتوى', 'التحليلات'],
    specialization: 'Digital Marketing Strategy',
    specializationAr: 'استراتيجية التسويق الرقمي',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/nourasultan',
      twitter: 'https://twitter.com/nourasultan',
    },
    status: 'active',
  },
  {
    id: 'team-7',
    employeeId: 'EMP-007',
    fullName: 'Abdullah Rashed Al-Fahad',
    fullNameAr: 'عبدالله راشد الفهد',
    email: 'abdullah.rashed@axiomx.com',
    phone: '+966 50 789 0123',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face',
    jobTitle: 'DevOps Engineer',
    jobTitleAr: 'مهندس ديف أوبس',
    department: 'Engineering',
    departmentAr: 'الهندسة',
    bio: 'DevOps expert specializing in CI/CD pipelines, container orchestration, and infrastructure automation. Passionate about efficiency and reliability.',
    bioAr: 'خبير ديف أوبس متخصص في خطوط CI/CD وتنسيق الحاويات وأتمتة البنية التحتية. شغوف بالكفاءة والموثوقية.',
    skills: ['Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'AWS', 'Azure', 'Linux', 'Monitoring'],
    skillsAr: ['دوكر', 'كوبرنيتس', 'تيرا فورم', 'جينكينز', 'أي دبليو إس', 'أزور', 'لينكس', 'المراقبة'],
    specialization: 'Infrastructure & DevOps',
    specializationAr: 'البنية التحتية وديف أوبس',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/abdullahfahad',
      github: 'https://github.com/afahad',
    },
    status: 'active',
  },
  {
    id: 'team-8',
    employeeId: 'EMP-008',
    fullName: 'Layla Hassan Al-Shahrani',
    fullNameAr: 'ليلى حسن الشهري',
    email: 'layla.hassan@axiomx.com',
    phone: '+966 50 890 1234',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    jobTitle: 'HR Manager',
    jobTitleAr: 'مديرة الموارد البشرية',
    department: 'Human Resources',
    departmentAr: 'الموارد البشرية',
    bio: 'HR professional with expertise in talent acquisition, employee development, and organizational culture. Creates positive workplace environments.',
    bioAr: 'محترفة في الموارد البشرية مع خبرة في استقطاب المواهب وتطوير الموظفين وثقافة المؤسسة. تنشئ بيئات عمل إيجابية.',
    skills: ['Talent Acquisition', 'Employee Relations', 'Training & Development', 'HRIS', 'Recruitment', 'Culture Building'],
    skillsAr: ['استقطاب المواهب', 'علاقات الموظفين', 'التدريب والتطوير', 'نظام معلومات الموارد البشرية', 'التوظيف', 'بناء الثقافة'],
    specialization: 'Human Resources Management',
    specializationAr: 'إدارة الموارد البشرية',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/laylaalhassan',
    },
    status: 'active',
  },
  {
    id: 'team-9',
    employeeId: 'EMP-009',
    fullName: 'Yousef Sultan Al-Enizi',
    fullNameAr: 'يوسف سلطان العنزي',
    email: 'yousef.sultan@axiomx.com',
    phone: '+966 50 901 2345',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    jobTitle: 'Mobile Developer',
    jobTitleAr: 'مطور تطبيقات جوال',
    department: 'Engineering',
    departmentAr: 'الهندسة',
    bio: 'Mobile development expert specializing in iOS and Android native development, as well as cross-platform solutions using React Native.',
    bioAr: 'خبير في تطوير تطبيقات الجوال متخصص في التطوير الأصلي لنظامي iOS و Android، بالإضافة إلى الحلول العابرة للمنصات باستخدام React Native.',
    skills: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'iOS', 'Android', 'Firebase', 'Mobile Architecture'],
    skillsAr: ['سويفت', 'كوتلين', 'رياكت نيتف', 'فلوتر', 'آي أو إس', 'أندرويد', 'فايربيز', 'هندسة الجوال'],
    specialization: 'Mobile Application Development',
    specializationAr: 'تطوير تطبيقات الجوال',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/yousefsultan',
      github: 'https://github.com/ysultan',
    },
    status: 'active',
  },
  {
    id: 'team-10',
    employeeId: 'EMP-010',
    fullName: 'Hind Mohammed Al-Qahtani',
    fullNameAr: 'هند محمد القحطاني',
    email: 'hind.qahtani@axiomx.com',
    phone: '+966 50 012 3456',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&crop=face',
    jobTitle: 'Quality Assurance Engineer',
    jobTitleAr: 'مهندسة ضمان الجودة',
    department: 'Quality Assurance',
    departmentAr: 'ضمان الجودة',
    bio: 'QA professional with expertise in test automation, manual testing, and quality assurance processes. Committed to delivering bug-free software.',
    bioAr: 'محترفة في ضمان الجودة مع خبرة في أتمتة الاختبارات والاختبار اليدوي وعمليات ضمان الجودة. ملتزمة بتقديم برامج خالية من الأخطاء.',
    skills: ['Selenium', 'Cypress', 'Jest', 'Postman', 'API Testing', 'Performance Testing', 'Agile Testing'],
    skillsAr: ['سيلينيوم', 'سايبس', 'جست', 'بوستمان', 'اختبار API', 'اختبار الأداء', 'الاختبار الرشيق'],
    specialization: 'Software Quality Assurance',
    specializationAr: 'ضمان جودة البرمجيات',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/hindqahtani',
    },
    status: 'active',
  },
  {
    id: 'team-11',
    employeeId: 'EMP-011',
    fullName: 'Rashid Khalid Al-Dosari',
    fullNameAr: 'راشد خالد الدوسري',
    email: 'rashid.khalid@axiomx.com',
    phone: '+966 51 111 2222',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face',
    jobTitle: 'Security Engineer',
    jobTitleAr: 'مهندس أمن',
    department: 'Security',
    departmentAr: 'الأمن',
    bio: 'Cybersecurity expert specializing in application security, penetration testing, and security architecture. Protects systems from threats.',
    bioAr: 'خبير في الأمن السيبراني متخصص في أمان التطبيقات واختبار الاختراق وهندسة الأمان. يحمي الأنظمة من التهديدات.',
    skills: ['Penetration Testing', 'Security Auditing', 'OWASP', 'Cryptography', 'SIEM', 'Incident Response'],
    skillsAr: ['اختبار الاختراق', 'تدقيق الأمان', 'أو واسب', 'التشفير', 'سييم', 'الاستجابة للحوادث'],
    specialization: 'Cybersecurity',
    specializationAr: 'الأمن السيبراني',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/rashidaldosari',
      twitter: 'https://twitter.com/rshidsec',
    },
    status: 'active',
  },
  {
    id: 'team-12',
    employeeId: 'EMP-012',
    fullName: 'Mona Abdullah Al-Harthi',
    fullNameAr: 'منى عبدالله الحارثي',
    email: 'mona.abdullah@axiomx.com',
    phone: '+966 51 222 3333',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    jobTitle: 'Data Scientist',
    jobTitleAr: 'عالمة بيانات',
    department: 'Data Science',
    departmentAr: 'علوم البيانات',
    bio: 'Data scientist with expertise in machine learning, statistical analysis, and data visualization. Turns data into actionable insights.',
    bioAr: 'عالمة بيانات مع خبرة في تعلم الآلة والتحليل الإحصائي وتصور البيانات. تحول البيانات إلى رؤى قابلة للتنفيذ.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Analysis', 'Machine Learning', 'SQL', 'Tableau', 'NLP'],
    skillsAr: ['بايثون', 'تينسور فلو', 'بايتورش', 'تحليل البيانات', 'تعلم الآلة', 'إس كيو إل', 'تابلو', 'معالجة اللغة الطبيعية'],
    specialization: 'Machine Learning & AI',
    specializationAr: 'تعلم الآلة والذكاء الاصطناعي',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/monaalharthi',
      github: 'https://github.com/monaData',
    },
    status: 'active',
  },
  {
    id: 'team-13',
    employeeId: 'EMP-013',
    fullName: 'Omar Faisal Al-Khamis',
    fullNameAr: 'عمر فيصل الخميش',
    email: 'omar.faisal@axiomx.com',
    phone: '+966 51 333 4444',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop&crop=face',
    jobTitle: 'Project Manager',
    jobTitleAr: 'مدير مشاريع',
    department: 'Operations',
    departmentAr: 'العمليات',
    bio: 'PMP-certified project manager with expertise in Agile and Scrum methodologies. Delivers projects on time and within budget.',
    bioAr: 'مدير مشاريع حاصل على شهادة PMP مع خبرة في منهجيات أجايل وسكرام. يقدم المشاريع في الوقت المحدد وضمن الميزانية.',
    skills: ['Project Management', 'Agile', 'Scrum', 'Jira', 'Risk Management', 'Stakeholder Management', 'Budgeting'],
    skillsAr: ['إدارة المشاريع', 'أجايل', 'سكرام', 'جيرا', 'إدارة المخاطر', 'إدارة أصحاب المصلحة', 'إدارة الميزانية'],
    specialization: 'Project Management',
    specializationAr: 'إدارة المشاريع',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/omarfaisal',
    },
    status: 'active',
  },
  {
    id: 'team-14',
    employeeId: 'EMP-014',
    fullName: 'Reem Talal Al-Meqlad',
    fullNameAr: 'ريم طلال المقلة',
    email: 'reem.talal@axiomx.com',
    phone: '+966 51 444 5555',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face',
    jobTitle: 'Frontend Developer',
    jobTitleAr: 'مطورة واجهات أمامية',
    department: 'Engineering',
    departmentAr: 'الهندسة',
    bio: 'Passionate frontend developer specializing in React ecosystem, accessibility, and responsive design. Creates beautiful and accessible web experiences.',
    bioAr: 'مطورة واجهات أمامية شغوفة متخصصة في نظام React البيئي وإمكانية الوصول والتصميم المتجاوب. تنشئ تجارب ويب جميلة ويمكن الوصول إليها.',
    skills: ['React', 'TypeScript', 'CSS/SCSS', 'Tailwind CSS', 'Next.js', 'Accessibility', 'Performance Optimization'],
    skillsAr: ['رياكت', 'تايب سكريبت', 'سي إس إس/إس سي إس إس', 'تيلويند سي إس إس', 'نيكست.جيس', 'إمكانية الوصول', 'تحسين الأداء'],
    specialization: 'Frontend Development',
    specializationAr: 'تطوير الواجهات الأمامية',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/reemtalaal',
      github: 'https://github.com/reemfrontend',
    },
    status: 'active',
  },
  {
    id: 'team-15',
    employeeId: 'EMP-015',
    fullName: 'Ali Hassan Al-Malki',
    fullNameAr: 'علي حسن المالكي',
    email: 'ali.hassan@axiomx.com',
    phone: '+966 51 555 6666',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face',
    jobTitle: 'Customer Success Manager',
    jobTitleAr: 'مدير نجاح العملاء',
    department: 'Customer Success',
    departmentAr: 'نجاح العملاء',
    bio: 'Customer success professional with a track record of building strong client relationships and ensuring customer satisfaction and retention.',
    bioAr: 'محترف في نجاح العملاء بسجل حافل في بناء علاقات قوية مع العملاء وضمان رضاهم والاحتفاظ بهم.',
    skills: ['Customer Success', 'Account Management', 'Communication', 'Problem Solving', 'CRM', 'Data Analysis'],
    skillsAr: ['نجاح العملاء', 'إدارة الحسابات', 'التواصل', 'حل المشكلات', 'سي آر إم', 'تحليل البيانات'],
    specialization: 'Customer Relationship Management',
    specializationAr: 'إدارة علاقات العملاء',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alihmalki',
    },
    status: 'active',
  },
];

// Helper function to get employee by ID
export const getTeamMemberById = (id: string): TeamEmployee | undefined => {
  return TEAM_DATABASE.find(member => member.id === id);
};

// Helper function to get multiple employees by IDs
export const getTeamMembersByIds = (ids: string[]): TeamEmployee[] => {
  return TEAM_DATABASE.filter(member => ids.includes(member.id));
};

// Helper function to search employees
export const searchTeamMembers = (query: string, language: 'en' | 'ar'): TeamEmployee[] => {
  const lowerQuery = query.toLowerCase();
  return TEAM_DATABASE.filter(member => {
    if (language === 'ar') {
      return (
        member.fullNameAr.toLowerCase().includes(lowerQuery) ||
        member.jobTitleAr.toLowerCase().includes(lowerQuery) ||
        member.departmentAr.toLowerCase().includes(lowerQuery) ||
        member.specializationAr.toLowerCase().includes(lowerQuery)
      );
    }
    return (
      member.fullName.toLowerCase().includes(lowerQuery) ||
      member.jobTitle.toLowerCase().includes(lowerQuery) ||
      member.department.toLowerCase().includes(lowerQuery) ||
      member.specialization.toLowerCase().includes(lowerQuery)
    );
  });
};

// Helper function to get team statistics
export const getTeamStats = () => {
  const total = TEAM_DATABASE.length;
  const active = TEAM_DATABASE.filter(m => m.status === 'active').length;
  const byDepartment = TEAM_DATABASE.reduce((acc, member) => {
    const dept = member.department;
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return { total, active, byDepartment };
};