export const translations = {
  en: {
    nav1: 'ARCHETYPERS',
    nav2: 'SERVICES',
    nav3: 'PROJECTS',
    nav4: 'CONTACT',
    heroScript: 'Finally',
    heroHeadline: 'built right.',
    heroTagline: 'Strategy, design, and growth — built as one system.',
    heroCta: "LET'S SEE WHAT'S POSSIBLE",
    heroNote: 'Free call. Honest answers. Zero pressure.',
    bottomLeft:
      'Rooted in Egypt and built for ambitious businesses, The Archetypers shapes brand strategy, visual identity, and digital experiences that help companies stand out, earn trust, and grow with purpose.',
    bottomRightTitle: 'DESIGNED FOR GROWTH',
    bottomRight:
      'Our work goes beyond aesthetics. We build websites, stores, and digital systems that support credibility, conversion, and long-term business growth.',
    painHook: "You're not behind because you're not working hard enough.",
    painTruth1: 'Your brand looks like 5 different businesses.',
    painTruth2: "A competitor is winning your clients — not because they're better, but because they look it.",
    painTruth3: "You've tried the obvious fixes. New logo. New website. Still the same results.",
    painPivot: "That's not an effort problem. That's a brand problem. And it's exactly what we fix.",
    painCta: 'See how we think about this →',
  },
  ar: {
    nav1: 'أركيتايبرز',
    nav2: 'خدماتنا',
    nav3: 'مشاريعنا',
    nav4: 'تواصل معنا',
    heroScript: 'أخيراً',
    heroHeadline: 'هوية مبنية بشكل صحيح.',
    heroTagline: 'الاستراتيجية والتصميم والنمو — منظومة واحدة متكاملة.',
    heroCta: 'لنرَ ما هو ممكن',
    heroNote: 'مكالمة مجانية. إجابات صريحة. بدون ضغط.',
    bottomLeft:
      'متجذرون في مصر وبُنينا لخدمة الأعمال الطموحة. نحن في أركيتايبرز نُشكّل استراتيجية العلامة التجارية والهوية البصرية والتجارب الرقمية التي تساعد الشركات على التميز وكسب الثقة والنمو بهدف.',
    bottomRightTitle: 'مصمم للنمو',
    bottomRight:
      'عملنا يتجاوز الجماليات. نبني مواقع ومتاجر وأنظمة رقمية تدعم المصداقية والتحويل والنمو التجاري على المدى الطويل.',
    painHook: 'أنت لست متأخراً لأنك لا تبذل جهداً كافياً.',
    painTruth1: 'علامتك التجارية تبدو كخمسة أعمال مختلفة.',
    painTruth2: 'منافس يفوز بعملائك — ليس لأنه أفضل، بل لأنه يبدو أفضل.',
    painTruth3: 'جربت الحلول الواضحة. شعار جديد. موقع جديد. نفس النتائج.',
    painPivot: 'هذه ليست مشكلة جهد. هذه مشكلة هوية تجارية. وهذا بالضبط ما نصلحه.',
    painCta: 'اكتشف كيف نفكر في هذا ←',
  },
} as const;

export type Translations = { [K in keyof typeof translations.en]: string };
export type Lang = keyof typeof translations;
