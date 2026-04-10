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
  },
};
