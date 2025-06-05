import React from 'react';

interface CalendarIconProps {
  className?: string;
}

export default function CalendarIcon({ className = "w-4 h-4" }: CalendarIconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 48 48" 
      className={className}
    >
      <path fill="#bbdefb" d="M6,10c0-2.209,1.791-4,4-4h28c2.209,0,4,1.791,4,4v28c0,2.209-1.791,4-4,4H10c-2.209,0-4-1.791-4-4 V10z"/>
      <path fill="#1976d2" d="M20 32h-3V20.082l-3 1.043v-2.75L19.667 16H20V32zM25.683 16L24.642 24 27.667 24 28.317 19 34 19 34 16z"/>
      <path fill="#1976d2" d="M29,21c-2.226,0-3.83,1.418-4.324,3H29c1.103,0,2,0.897,2,2v1c0,1.103-0.897,2-2,2s-2-0.897-2-2h-3 c0,2.757,2.243,5,5,5s5-2.243,5-5v-1C34,23.243,31.757,21,29,21z"/>
    </svg>
  );
}