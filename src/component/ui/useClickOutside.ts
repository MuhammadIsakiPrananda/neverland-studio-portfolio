import { useEffect, type RefObject } from 'react';

type Event = MouseEvent | TouchEvent;

/**
 * Hook kustom untuk mendeteksi klik di luar elemen yang ditentukan.
 * @param ref - Ref ke elemen yang ingin dideteksi klik di luarnya.
 * @param handler - Fungsi yang akan dipanggil saat klik di luar terdeteksi.
 */
export const useClickOutside = (ref: RefObject<HTMLElement | null>, handler: (event: Event) => void) => {
  useEffect(() => {
    const listener = (event: Event) => {
      // Jangan lakukan apa-apa jika ref atau elemennya tidak ada, atau jika klik terjadi di dalam elemen
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};