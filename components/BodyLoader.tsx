'use client';
import { useEffect } from 'react';

export function BodyLoader() {
  useEffect(() => {
    const timer = setTimeout(() => document.body.classList.add('loaded'), 80);
    return () => clearTimeout(timer);
  }, []);
  return null;
}
