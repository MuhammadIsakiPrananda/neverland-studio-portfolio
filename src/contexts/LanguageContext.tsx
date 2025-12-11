import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type Language = "en" | "id";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return saved === "en" || saved === "id" ? saved : "id";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Translation function
  const t = (key: string): string => {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Translations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translations: Record<Language, any> = {
  en: {
    nav: {
      home: "Home",
      services: "Services",
      process: "Process",
      portfolio: "Portfolio",
      team: "Team",
      pricing: "Pricing",
      testimonials: "Testimonials",
      contact: "Contact",
      login: "Login",
      dashboard: "Dashboard",
      logout: "Logout",
    },
    hero: {
      badge: "Your Partner in Digital Innovation",
      title1: "Navigating",
      title2: "Digital",
      highlight: "Neverlands",
      description:
        "We blend creative artistry with technical excellence to build digital solutions that are not only visually stunning but also deliver measurable results. Your vision, our expertise.",
      getStarted: "Get Started",
      watchDemo: "Watch Demo",
      trustedBy: "Trusted By",
      stats: {
        projects: "Projects",
        clients: "Happy Clients",
        awards: "Awards",
        satisfaction: "Satisfaction",
      },
    },
    benefits: {
      title: "Why Choose Neverland Studio",
      subtitle:
        "Transform your digital presence with our comprehensive solutions",
    },
    services: {
      title: "Our Services",
      subtitle: "Comprehensive digital solutions tailored to your needs",
      learnMore: "Learn More",
    },
    process: {
      title: "Our Process",
      subtitle: "From concept to deployment, we follow a proven methodology",
    },
    portfolio: {
      title: "Our Portfolio",
      subtitle: "Discover our latest projects and case studies",
      viewProject: "View Project",
      all: "All",
      webDevelopment: "Web Development",
      mobileApp: "Mobile App",
      uiUxDesign: "UI/UX Design",
      branding: "Branding",
      viewMore: "View More",
      showLess: "Show Less",
      startProject: "Start Your Project",
      filters: {
        all: "All",
        web: "Web",
        mobile: "Mobile",
        design: "Design",
        video: "Video",
        photography: "Photography",
        animation: "Animation",
      },
    },
    team: {
      title: "Meet Our Team",
      subtitle: "Talented professionals dedicated to your success",
      joinTeam: "Join Our Team",
    },
    pricing: {
      title: "Pricing Plans",
      subtitle: "Choose the perfect plan for your project",
      perProject: "/project",
      popular: "Most Popular",
      getStarted: "Get Started",
      contactUs: "Contact Us",
      scheduleCall: "Schedule a Consultation",
      downloadBrochure: "Download Pricing Guide",
      customSolutionTitle: "Need a Custom Solution?",
      customSolutionDesc:
        "We offer tailored enterprise solutions. Contact us for a personalized quote and strategy session.",
    },
    testimonials: {
      title: "What Our Clients Say",
      subtitle: "Real feedback from satisfied customers",
      writeReview: "Write a Review",
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions",
      stillHaveQuestions: "Still have questions? We're here to help.",
      contactSupport: "Contact Support",
    },
    cta: {
      title: "Ready to Start Your Project?",
      subtitle:
        "Let's build something amazing together. Contact us today for a free consultation and quote.",
      button: "Get a Free Quote",
      getStarted: "Get Started Today",
      quickActions: "Quick Actions",
      scheduleCall: "Schedule a Call",
      scheduleDetail: "Book a free consultation",
      viewPortfolio: "View Portfolio",
      viewPortfolioDetail: "See our latest work",
      getQuote: "Get a Quote",
      getQuoteDetail: "Request project pricing",
      emailTitle: "Send us an Email",
      sendNow: "Send Now",
      scheduleTitle: "Schedule a Call",
      schedule: "Schedule",
      linkedinTitle: "Connect on LinkedIn",
      linkedinDetail: "Let's build a professional network.",
      connect: "Connect",
    },
    contact: {
      title: "Get In Touch",
      subtitle: "We'd love to hear from you",
      name: "Full Name",
      email: "Email Address",
      subject: "Subject",
      message: "Your Message",
      send: "Send Message",
      sending: "Sending...",
      address: "Address",
      phone: "Phone",
      email2: "Email",
      followUs: "Follow Us",
      visitWebsite: "Visit Website",
      callNow: "Call Now",
      sendEmail: "Send Email",
      form: {
        service: "Service",
        selectService: "Select a service",
        webDev: "Web Development",
        mobileApp: "Mobile App Development",
        uiux: "UI/UX Design",
        other: "Other",
      },
      emailUs: "Email Us",
      callUs: "Call Us",
      visitUs: "Visit Us",
      generalInquiries: "General Inquiries:",
      businessHours: "Mon-Fri from 9am to 5pm",
      sendAnEmail: "Send an Email",
      getDirections: "Get Directions",
    },
    footer: {
      description: "Creating digital experiences that inspire and engage.",
      companyTitle: "Company",
      about: "About Us",
      careers: "Careers",
      blog: "Blog",
      press: "Press Kit",
      servicesTitle: "Services",
      webDev: "Web Development",
      mobileDev: "Mobile Development",
      uiux: "UI/UX Design",
      consulting: "Consulting",
      support: "Support",
      helpCenter: "Help Center",
      documentation: "Documentation",
      api: "API Reference",
      status: "System Status",
      legal: "Legal",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      cookies: "Cookie Policy",
      allRights: "All rights reserved.",
      paymentMethods: "Payment Methods",
      paymentDescription: "We accept secure payments through",
      digitalMarketing: "Digital Marketing",
      ourProcess: "Our Process",
      ourTeam: "Our Team",
      portfolio: "Portfolio",
      contact: "Contact",
    },
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome back",
      profile: "Profile",
      account: "Account",
      apiKeys: "API Keys",
      billing: "Billing",
      notifications: "Notifications",
      appearance: "Appearance",
      help: "Help Center",
    },
    auth: {
      login: "Login",
      signup: "Sign Up",
      forgotPassword: "Forgot Password?",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      rememberMe: "Remember me",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      orContinueWith: "Or continue with",
      resetPassword: "Reset Password",
      backToLogin: "Back to Login",
    },
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      submit: "Submit",
      search: "Search",
      filter: "Filter",
      sortBy: "Sort by",
      viewAll: "View All",
      learnMore: "Learn More",
    },
  },
  id: {
    nav: {
      home: "Beranda",
      services: "Layanan",
      process: "Proses",
      portfolio: "Portofolio",
      team: "Tim",
      pricing: "Harga",
      testimonials: "Testimoni",
      contact: "Kontak",
      login: "Masuk",
      dashboard: "Dasbor",
      logout: "Keluar",
    },
    hero: {
      badge: "Mitra Anda dalam Inovasi Digital",
      title1: "Menjelajahi",
      title2: "Digital",
      highlight: "Neverlands",
      description:
        "Kami memadukan seni kreatif dengan keunggulan teknis untuk membangun solusi digital yang tidak hanya memukau secara visual tetapi juga memberikan hasil yang terukur. Visi Anda, keahlian kami.",
      getStarted: "Mulai Sekarang",
      watchDemo: "Tonton Demo",
      trustedBy: "Dipercaya Oleh",
      stats: {
        projects: "Proyek",
        clients: "Klien Puas",
        awards: "Penghargaan",
        satisfaction: "Kepuasan",
      },
    },
    benefits: {
      title: "Mengapa Memilih Neverland Studio",
      subtitle:
        "Transformasikan kehadiran digital Anda dengan solusi komprehensif kami",
    },
    services: {
      title: "Layanan Kami",
      subtitle:
        "Solusi digital komprehensif yang disesuaikan dengan kebutuhan Anda",
      learnMore: "Pelajari Lebih Lanjut",
    },
    process: {
      title: "Proses Kami",
      subtitle:
        "Dari konsep hingga deployment, kami mengikuti metodologi yang terbukti",
    },
    portfolio: {
      title: "Portofolio Kami",
      subtitle: "Temukan proyek dan studi kasus terbaru kami",
      viewProject: "Lihat Proyek",
      all: "Semua",
      webDevelopment: "Pengembangan Web",
      mobileApp: "Aplikasi Mobile",
      uiUxDesign: "Desain UI/UX",
      branding: "Branding",
      viewMore: "Lihat Lebih Banyak",
      showLess: "Tampilkan Lebih Sedikit",
      startProject: "Mulai Proyek Anda",
      filters: {
        all: "Semua",
        web: "Web",
        mobile: "Mobile",
        design: "Desain",
        video: "Video",
        photography: "Fotografi",
        animation: "Animasi",
      },
    },
    team: {
      title: "Tim Kami",
      subtitle: "Profesional berbakat yang berdedikasi untuk kesuksesan Anda",
      joinTeam: "Bergabung dengan Tim",
    },
    pricing: {
      title: "Paket Harga",
      subtitle: "Pilih paket yang sempurna untuk proyek Anda",
      perProject: "/proyek",
      popular: "Paling Populer",
      getStarted: "Mulai Sekarang",
      contactUs: "Hubungi Kami",
      scheduleCall: "Jadwalkan Konsultasi",
      downloadBrochure: "Unduh Panduan Harga",
      customSolutionTitle: "Butuh Solusi Khusus?",
      customSolutionDesc:
        "Kami menawarkan solusi enterprise yang disesuaikan. Hubungi kami untuk penawaran dan sesi strategi yang dipersonalisasi.",
    },
    testimonials: {
      title: "Kata Klien Kami",
      subtitle: "Umpan balik nyata dari pelanggan yang puas",
      writeReview: "Tulis Review",
    },
    faq: {
      title: "Pertanyaan yang Sering Diajukan",
      subtitle: "Temukan jawaban untuk pertanyaan umum",
      stillHaveQuestions: "Masih ada pertanyaan? Kami siap membantu.",
      contactSupport: "Hubungi Dukungan",
    },
    cta: {
      title: "Siap Memulai Proyek Anda?",
      subtitle:
        "Mari bersama membangun sesuatu yang luar biasa. Hubungi kami hari ini untuk konsultasi dan penawaran gratis.",
      button: "Dapatkan Penawaran Gratis",
      getStarted: "Mulai Hari Ini",
      quickActions: "Aksi Cepat",
      scheduleCall: "Jadwalkan Panggilan",
      scheduleDetail: "Pesan konsultasi gratis",
      viewPortfolio: "Lihat Portofolio",
      viewPortfolioDetail: "Lihat karya terbaru kami",
      getQuote: "Dapatkan Penawaran",
      getQuoteDetail: "Minta harga proyek",
      emailTitle: "Kirim Email kepada Kami",
      sendNow: "Kirim Sekarang",
      scheduleTitle: "Jadwalkan Panggilan",
      schedule: "Jadwalkan",
      linkedinTitle: "Terhubung di LinkedIn",
      linkedinDetail: "Mari bangun jaringan profesional.",
      connect: "Terhubung",
    },
    contact: {
      title: "Hubungi Kami",
      subtitle: "Kami ingin mendengar dari Anda",
      name: "Nama Lengkap",
      email: "Alamat Email",
      subject: "Subjek",
      message: "Pesan Anda",
      send: "Kirim Pesan",
      sending: "Mengirim...",
      address: "Alamat",
      phone: "Telepon",
      email2: "Email",
      followUs: "Ikuti Kami",
      visitWebsite: "Kunjungi Website",
      callNow: "Telepon Sekarang",
      sendEmail: "Kirim Email",
      form: {
        service: "Layanan",
        selectService: "Pilih layanan",
        webDev: "Pengembangan Web",
        mobileApp: "Pengembangan Aplikasi Mobile",
        uiux: "Desain UI/UX",
        other: "Lainnya",
      },
      emailUs: "Email Kami",
      callUs: "Telepon Kami",
      visitUs: "Kunjungi Kami",
      generalInquiries: "Pertanyaan Umum:",
      businessHours: "Sen-Jum dari 9 pagi sampai 5 sore",
      sendAnEmail: "Kirim Email",
      getDirections: "Dapatkan Petunjuk Arah",
    },
    footer: {
      description:
        "Menciptakan pengalaman digital yang menginspirasi dan melibatkan.",
      companyTitle: "Perusahaan",
      about: "Tentang Kami",
      careers: "Karir",
      blog: "Blog",
      press: "Kit Pers",
      servicesTitle: "Layanan",
      webDev: "Pengembangan Web",
      mobileDev: "Pengembangan Mobile",
      uiux: "Desain UI/UX",
      consulting: "Konsultasi",
      support: "Dukungan",
      helpCenter: "Pusat Bantuan",
      documentation: "Dokumentasi",
      api: "Referensi API",
      status: "Status Sistem",
      legal: "Hukum",
      privacy: "Kebijakan Privasi",
      terms: "Syarat Layanan",
      cookies: "Kebijakan Cookie",
      allRights: "Semua hak dilindungi.",
      paymentMethods: "Metode Pembayaran",
      paymentDescription: "Kami menerima pembayaran aman melalui",
      digitalMarketing: "Pemasaran Digital",
      ourProcess: "Proses Kami",
      ourTeam: "Tim Kami",
      portfolio: "Portofolio",
      contact: "Kontak",
    },
    dashboard: {
      title: "Dasbor",
      welcome: "Selamat datang kembali",
      profile: "Profil",
      account: "Akun",
      apiKeys: "Kunci API",
      billing: "Tagihan",
      notifications: "Notifikasi",
      appearance: "Tampilan",
      help: "Pusat Bantuan",
    },
    auth: {
      login: "Masuk",
      signup: "Daftar",
      forgotPassword: "Lupa Kata Sandi?",
      email: "Email",
      password: "Kata Sandi",
      confirmPassword: "Konfirmasi Kata Sandi",
      rememberMe: "Ingat saya",
      noAccount: "Belum punya akun?",
      hasAccount: "Sudah punya akun?",
      orContinueWith: "Atau lanjutkan dengan",
      resetPassword: "Reset Kata Sandi",
      backToLogin: "Kembali ke Login",
    },
    common: {
      loading: "Memuat...",
      save: "Simpan",
      cancel: "Batal",
      delete: "Hapus",
      edit: "Edit",
      close: "Tutup",
      submit: "Kirim",
      search: "Cari",
      filter: "Filter",
      sortBy: "Urutkan berdasarkan",
      viewAll: "Lihat Semua",
      learnMore: "Pelajari Lebih Lanjut",
    },
  },
};
