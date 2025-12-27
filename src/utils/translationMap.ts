/**
 * AUTO-TRANSLATION IMPLEMENTATION GUIDE
 * 
 * Untuk setiap komponen yang belum ditranslasi, tambahkan:
 * 
 * 1. Import hook:
 *    import { useLanguage } from '../../contexts/LanguageContext';
 * 
 * 2. Gunakan hook:
 *    const { t } = useLanguage();
 * 
 * 3. Ganti semua hardcoded text dengan translation key
 */

export const COMPONENT_TRANSLATION_MAP = {
  // MODALS
  'EnrollmentModal': {
    imports: "import { useLanguage } from '../../contexts/LanguageContext';",
    hook: "const { t } = useLanguage();",
    replacements: {
      'Enroll in Course': "t('modals.enrollment.title')",
      'Full Name': "t('modals.enrollment.form.name')",
      'Enter your full name': "t('modals.enrollment.form.namePlaceholder')",
      'Email Address': "t('modals.enrollment.form.email')",
      'your@email.com': "t('modals.enrollment.form.emailPlaceholder')",
      'Phone Number': "t('modals.enrollment.form.phone')",
      '+62 XXX XXXX XXXX': "t('modals.enrollment.form.phonePlaceholder')",
      'Preferred Schedule (Optional)': "t('modals.enrollment.form.schedule')",
      'Day': "t('modals.enrollment.form.day')",
      'Select day': "t('modals.enrollment.form.dayPlaceholder')",
      'Monday': "t('modals.enrollment.form.days.monday')",
      'Tuesday': "t('modals.enrollment.form.days.tuesday')",
      'Wednesday': "t('modals.enrollment.form.days.wednesday')",
      'Thursday': "t('modals.enrollment.form.days.thursday')",
      'Friday': "t('modals.enrollment.form.days.friday')",
      'Saturday': "t('modals.enrollment.form.days.saturday')",
      'Sunday': "t('modals.enrollment.form.days.sunday')",
      'Time': "t('modals.enrollment.form.time')",
      'e.g., 09:00 - 11:00': "t('modals.enrollment.form.timePlaceholder')",
      'Additional Message (Optional)': "t('modals.enrollment.form.message')",
      'Any questions or special requests?': "t('modals.enrollment.form.messagePlaceholder')",
      'Course Information': "t('modals.enrollment.courseInfo')",
      'Course': "t('modals.enrollment.courseName')",
      'Duration': "t('modals.enrollment.duration')",
      'Price': "t('modals.enrollment.price')",
      'Discount': "t('modals.enrollment.discount')",
      'Final Price': "t('modals.enrollment.finalPrice')",
      'Submit Enrollment': "t('modals.enrollment.submit')",
      'Submitting...': "t('modals.enrollment.submitting')",
      'Enrollment Successful!': "t('modals.enrollment.success')",
      'Your enrollment request has been submitted. We will contact you shortly.': "t('modals.enrollment.successMessage')",
      'Full name is required': "t('modals.enrollment.errors.nameRequired')",
      'Email is required': "t('modals.enrollment.errors.emailRequired')",
      'Please enter a valid email address': "t('modals.enrollment.errors.emailInvalid')",
      'Phone number is required': "t('modals.enrollment.errors.phoneRequired')",
      'Please enter a valid phone number': "t('modals.enrollment.errors.phoneInvalid')"
    }
  },
  
  'ConsultationModal': {
    imports: "import { useLanguage } from '../../contexts/LanguageContext';",
    hook: "const { t } = useLanguage();",
    replacements: {
      'Request Consultation': "t('modals.consultation.title')",
      'Let\\'s discuss your project needs': "t('modals.consultation.subtitle')",
      'Full Name': "t('modals.consultation.form.name')",
      'Email Address': "t('modals.consultation.form.email')",
      'Phone Number': "t('modals.consultation.form.phone')",
      'Company Name (Optional)': "t('modals.consultation.form.company')",
      'Project Type': "t('modals.consultation.form.projectType')",
      'Project Details': "t('modals.consultation.form.message')",
      'Tell us about your project requirements': "t('modals.consultation.form.messagePlaceholder')",
      'Solution Information': "t('modals.consultation.solutionInfo')",
      'Solution': "t('modals.consultation.solutionName')",
      'Submit Request': "t('modals.consultation.submit')",
      'Submitting...': "t('modals.consultation.submitting')",
      'Request Submitted!': "t('modals.consultation.success')",
      'We have received your consultation request. Our team will contact you within 24 hours.': "t('modals.consultation.successMessage')"
    }
  },
  
  'ProjectInquiryModal': {
    imports: "import { useLanguage } from '../../contexts/LanguageContext';",
    hook: "const { t } = useLanguage();",
    replacements: {
      'Project Inquiry': "t('modals.projectInquiry.title')",
      'Tell us about your project': "t('modals.projectInquiry.subtitle')",
      'Your Budget (IDR)': "t('modals.projectInquiry.form.budget')",
      'e.g., 10.000.000': "t('modals.projectInquiry.form.budgetPlaceholder')",
      'Project Details': "t('modals.projectInquiry.form.projectDetails')",
      'Describe your project requirements in detail': "t('modals.projectInquiry.form.projectDetailsPlaceholder')",
      'Package Information': "t('modals.projectInquiry.packageInfo')",
      'Package': "t('modals.projectInquiry.packageName')",
      'Starting Price': "t('modals.projectInquiry.price')",
      'Submit Inquiry': "t('modals.projectInquiry.submit')",
      'Budget is required for custom packages': "t('modals.projectInquiry.errors.budgetRequired')",
      'Project details are required': "t('modals.projectInquiry.errors.projectDetailsRequired')"
    }
  },
  
  'WriteReviewModal': {
    imports: "import { useLanguage } from '../../contexts/LanguageContext';",
    hook: "const { t } = useLanguage();",
    replacements: {
      'Write a Review': "t('modals.writeReview.title')",
      'Share your experience with us': "t('modals.writeReview.subtitle')",
      'Your Name': "t('modals.writeReview.form.name')",
      'Enter your name': "t('modals.writeReview.form.namePlaceholder')",
      'Company/Position (Optional)': "t('modals.writeReview.form.company')",
      'Your company or position (optional)': "t('modals.writeReview.form.companyPlaceholder')",
      'Rating': "t('modals.writeReview.form.rating')",
      'Your Review': "t('modals.writeReview.form.review')",
      'Share your experience working with us...': "t('modals.writeReview.form.reviewPlaceholder')",
      'Submit Review': "t('modals.writeReview.submit')",
      'Review Submitted!': "t('modals.writeReview.success')",
      'Thank you for your feedback! Your review will be published after verification.': "t('modals.writeReview.successMessage')"
    }
  },
  
  // PAGES
  'ITLearningPage': {
    replacements: {
      'IT Learning Programs': "t('itLearning.hero.title')",
      'Master Technology with Expert Guidance': "t('itLearning.hero.subtitle')",
      'Available Courses': "t('itLearning.courses.title')",
      'Choose the perfect course for your learning journey': "t('itLearning.courses.subtitle')",
      'Enroll Now': "t('itLearning.enroll')",
      'Save': "t('itLearning.discount')",
      'Week': "t('itLearning.week')",
      'Weeks': "t('itLearning.weeks')"
    }
  },
  
  'ITSolutionsPage': {
    replacements: {
      'IT Solutions': "t('itSolutions.hero.title')",
      'Custom Technology Solutions for Your Business': "t('itSolutions.hero.subtitle')",
      'Our Solutions': "t('itSolutions.solutions.title')",
      'Tailored services to meet your business needs': "t('itSolutions.solutions.subtitle')",
      'Get Consultation': "t('itSolutions.getConsultation')"
    }
  },
  
  'PricingPage': {
    replacements: {
      'Pricing Plans': "t('pricing.hero.title')",
      'Transparent Pricing for Quality Services': "t('pricing.hero.subtitle')",
      'Our Packages': "t('pricing.plans.title')",
      'Flexible options to fit your budget': "t('pricing.plans.subtitle')",
      'Get Started': "t('pricing.getStarted')",
      'Contact Us Now': "t('pricing.contactUs')"
    }
  },
  
  'TestimonialsPage': {
    replacements: {
      'Client Testimonials': "t('testimonials.hero.title')",
      'What Our Clients Say About Us': "t('testimonials.hero.subtitle')",
      'Write a Review': "t('testimonials.writeReview')",
      'All Reviews': "t('testimonials.filter.all')",
      'Most Recent': "t('testimonials.filter.recent')",
      'Highest Rated': "t('testimonials.filter.highest')",
      'Verified Client': "t('testimonials.verified')",
      'Helpful': "t('testimonials.helpful')"
    }
  },
  
  'ContactPage': {
    replacements: {
      'Get in Touch': "t('contact.hero.title')",
      'We\\'d Love to Hear From You': "t('contact.hero.subtitle')",
      'Send us a Message': "t('contact.form.title')",
      'Your Name': "t('contact.form.name')",
      'Your Email': "t('contact.form.email')",
      'Phone Number': "t('contact.form.phone')",
      'Subject': "t('contact.form.subject')",
      'Your Message': "t('contact.form.message')",
      'Send Message': "t('contact.form.send')",
      'Sending...': "t('contact.form.sending')",
      'Contact Information': "t('contact.info.title')",
      'Address': "t('contact.info.address')",
      'Phone': "t('contact.info.phone')",
      'Email': "t('contact.info.email')",
      'Business Hours': "t('contact.info.hours')",
      'Mon - Fri: 9AM - 6PM': "t('contact.info.hoursValue')"
    }
  }
};

// Helper function to apply translations
export function applyTranslations(componentName: string, code: string): string {
  const config = COMPONENT_TRANSLATION_MAP[componentName as keyof typeof COMPONENT_TRANSLATION_MAP];
  if (!config) return code;
  
  let updatedCode = code;
  
  // Replace all text occurrences
  Object.entries(config.replacements).forEach(([original, translated]) => {
    // Handle different quote styles
    const patterns = [
      new RegExp(`['"]${original}['"]`, 'g'),
      new RegExp(`>{${original}}<`, 'g'),
      new RegExp(`placeholder="${original}"`, 'g'),
      new RegExp(`aria-label="${original}"`, 'g'),
    ];
    
    patterns.forEach(pattern => {
      updatedCode = updatedCode.replace(pattern, `{${translated}}`);
    });
  });
  
  return updatedCode;
}

console.log('Translation map loaded successfully!');
console.log(`Total components configured: ${Object.keys(COMPONENT_TRANSLATION_MAP).length}`);
