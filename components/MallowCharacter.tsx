'use client';

import { useRef } from 'react';
import { useMallowGaze } from '@/lib/useMallowGaze';

interface MallowCharacterProps {
  className?: string;
  thinking?: boolean;
}

export default function MallowCharacter({ className, thinking }: MallowCharacterProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useMallowGaze(videoRef);

  return (
    <div
      className={['mallow-character', thinking ? 'is-thinking' : '', className ?? ''].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <video ref={videoRef} muted playsInline preload="auto" src="/footer-scrub.mp4" />
    </div>
  );
}
