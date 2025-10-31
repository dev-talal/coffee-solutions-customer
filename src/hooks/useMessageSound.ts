"use client";

import { useEffect, useRef, useCallback } from "react";

export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const unlockAudio = () => {
      const audio = audioRef.current;
      if (audio) {
        audio
          .play()
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
          })
          .catch(() => {});
      }
      document.removeEventListener("click", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
    return () => document.removeEventListener("click", unlockAudio);
  }, []);

  const playSound = useCallback(() => {
    const audio = audioRef.current;
    if (!document.hasFocus() && audio) {
      audio.play().catch((err) => console.warn("Audio play blocked:", err));
    }
  }, []);

  return { audioRef, playSound };
}
