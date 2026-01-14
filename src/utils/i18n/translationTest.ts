/**
 * Translation Testing Utility
 * This file helps verify all translation keys are working correctly
 */

import { translations } from './contexts/LanguageContext';

// Function to get all keys from nested object
function getAllKeys(obj: any, prefix = ''): string[] {
  let keys: string[] = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else if (typeof obj[key] === 'string') {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// Get all English keys
const enKeys = getAllKeys((translations as any).en);
const idKeys = getAllKeys((translations as any).id);

console.log('=== Translation Coverage Report ===\n');
console.log(`Total English keys: ${enKeys.length}`);
console.log(`Total Indonesian keys: ${idKeys.length}`);

// Find missing translations
const missingInId = enKeys.filter(key => !idKeys.includes(key));
const missingInEn = idKeys.filter(key => !enKeys.includes(key));

if (missingInId.length > 0) {
  console.log('\n❌ Missing in Indonesian:');
  missingInId.forEach(key => console.log(`  - ${key}`));
} else {
  console.log('\n✅ All English keys have Indonesian translations');
}

if (missingInEn.length > 0) {
  console.log('\n❌ Missing in English:');
  missingInEn.forEach(key => console.log(`  - ${key}`));
} else {
  console.log('\n✅ All Indonesian keys have English translations');
}

// Show sample translations
console.log('\n=== Sample Translations ===\n');
const sampleKeys = [
  'nav.home',
  'home.hero.title',
  'about.hero.title',
  'services.hero.title',
  'modals.enrollment.title',
  'common.loading',
];

sampleKeys.forEach(key => {
  const enValue = key.split('.').reduce((obj: any, k) => obj?.[k], (translations as any).en);
  const idValue = key.split('.').reduce((obj: any, k) => obj?.[k], (translations as any).id);
  console.log(`${key}:`);
  console.log(`  EN: ${enValue || 'NOT FOUND'}`);
  console.log(`  ID: ${idValue || 'NOT FOUND'}`);
  console.log('');
});

export { };
