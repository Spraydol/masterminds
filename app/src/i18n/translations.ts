export type Language = 'en' | 'fr' | 'ar';

export interface Translation {
  nav: {
    features: string;
    community: string;
    login: string;
    startLearning: string;
  };
  hero: {
    headline: string;
    subhead: string;
    courses: string;
    exams: string;
    communityLabel: string;
    daysInRow: string;
    joinCommunity: string;
  };
  dashboard: {
    resources: string;
    aiAssistant: string;
    welcomeBack: string;
    accessResources: string;
    upload: string;
    shareResources: string;
    askHelp: string;
    getHelp247: string;
    searchResources: string;
    allSectors: string;
    allYears: string;
    allTypes: string;
    noDocuments: string;
    beFirst: string;
    uploadDocument: string;
    profileSettings: string;
    settings: string;
    myStreaks: string;
    achievements: string;
    points: string;
    logout: string;
    by: string;
  };
}

export const translations: Record<Language, Translation> = {
  en: {
    nav: {
      features: 'Features',
      community: 'Community',
      login: 'Login',
      startLearning: 'Start Learning',
    },
    hero: {
      headline: 'Your Smart Study Partner',
      subhead: 'Edubuddy helps you understand faster, revise smarter, and succeed with confidence.',
      courses: 'Courses',
      exams: 'Exams',
      communityLabel: 'Community',
      daysInRow: 'days in a row',
      joinCommunity: 'Join Community',
    },
    dashboard: {
      resources: 'Resources',
      aiAssistant: 'AI Assistant',
      welcomeBack: 'Welcome back',
      accessResources: 'Access all your study resources in one place',
      upload: 'Upload',
      shareResources: 'Share resources',
      askHelp: 'Ask & help',
      getHelp247: 'Get help 24/7',
      searchResources: 'Search resources...',
      allSectors: 'All Sectors',
      allYears: 'All Years',
      allTypes: 'All Types',
      noDocuments: 'No documents found',
      beFirst: 'Be the first to upload a resource!',
      uploadDocument: 'Upload Document',
      profileSettings: 'Profile Settings',
      settings: 'Settings',
      myStreaks: 'My Streaks',
      achievements: 'Achievements',
      points: 'Points',
      logout: 'Logout',
      by: 'by',
    },
  },
  fr: {
    nav: {
      features: 'Fonctionnalités',
      community: 'Communauté',
      login: 'Connexion',
      startLearning: 'Commencer à apprendre',
    },
    hero: {
      headline: 'Votre partenaire d\'étude intelligent',
      subhead: 'Edubuddy vous aide à comprendre plus vite, réviser plus intelligemment et réussir avec confiance.',
      courses: 'Cours',
      exams: 'Examens',
      communityLabel: 'Communauté',
      daysInRow: 'jours d\'affilée',
      joinCommunity: 'Rejoindre la communauté',
    },
    dashboard: {
      resources: 'Ressources',
      aiAssistant: 'Assistant IA',
      welcomeBack: 'Bon retour',
      accessResources: 'Accédez à toutes vos ressources d\'étude au même endroit',
      upload: 'Téléverser',
      shareResources: 'Partager des ressources',
      askHelp: 'Demander et aider',
      getHelp247: 'Obtenir de l\'aide 24/7',
      searchResources: 'Rechercher des ressources...',
      allSectors: 'Toutes les filières',
      allYears: 'Toutes les années',
      allTypes: 'Tous les types',
      noDocuments: 'Aucun document trouvé',
      beFirst: 'Soyez le premier à téléverser une ressource !',
      uploadDocument: 'Téléverser un document',
      profileSettings: 'Paramètres du profil',
      settings: 'Paramètres',
      myStreaks: 'Mes séries',
      achievements: 'Succès',
      points: 'Points',
      logout: 'Déconnexion',
      by: 'par',
    },
  },
  ar: {
    nav: {
      features: 'الميزات',
      community: 'المجتمع',
      login: 'تسجيل الدخول',
      startLearning: 'ابدأ التعلم',
    },
    hero: {
      headline: 'شريكك الذكي للدراسة',
      subhead: 'إيديوبادي يساعدك على الفهم بشكل أسرع، والمراجعة بذكاء، والنجاح بثقة.',
      courses: 'الدورات',
      exams: 'الامتحانات',
      communityLabel: 'المجتمع',
      daysInRow: 'أيام متتالية',
      joinCommunity: 'انضم إلى المجتمع',
    },
    dashboard: {
      resources: 'الموارد',
      aiAssistant: 'مساعد الذكاء الاصطناعي',
      welcomeBack: 'مرحباً بعودتك',
      accessResources: 'احصل على جميع مواردك الدراسية في مكان واحد',
      upload: 'رفع',
      shareResources: 'مشاركة الموارد',
      askHelp: 'اسأل وساعد',
      getHelp247: 'احصل على مساعدة على مدار الساعة',
      searchResources: 'البحث عن الموارد...',
      allSectors: 'جميع التخصصات',
      allYears: 'جميع السنوات',
      allTypes: 'جميع الأنواع',
      noDocuments: 'لم يتم العثور على مستندات',
      beFirst: 'كن أول من يرفع موردًا!',
      uploadDocument: 'رفع مستند',
      profileSettings: 'إعدادات الملف الشخصي',
      settings: 'الإعدادات',
      myStreaks: 'سلسلة أيامي',
      achievements: 'الإنجازات',
      points: 'نقاط',
      logout: 'تسجيل الخروج',
      by: 'بواسطة',
    },
  },
};
