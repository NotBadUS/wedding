import { useEffect, useRef, useState } from "react";

export default function MiniPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);

const hasFadedIn = useRef(false);

  const track = "/music/wedding.mp3";

  useEffect(() => {
    const audio = new Audio(track);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0; // стартуем с 0 для fade-in

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const fadeIn = (audio, duration = 3000) => {
  const targetVolume = 0.2;
  const steps = 40; // чем больше, тем плавнее
  const stepTime = duration / steps;
  const stepVolume = targetVolume / steps;

  let vol = 0;
  audio.volume = 0;

  const interval = setInterval(() => {
    vol += stepVolume;

    if (vol >= targetVolume) {
      audio.volume = targetVolume;
      clearInterval(interval);
    } else {
      audio.volume = vol;
    }
  }, stepTime);
};

  const toggle = async () => {
  const audio = audioRef.current;
  if (!audio) return;

  try {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    // старт с 1:53 только один раз
    if (!hasStartedOnce) {
      audio.currentTime = 113;
      setHasStartedOnce(true);
    }

    await audio.play();
    setIsPlaying(true);

    // 🔥 fade-in только ПЕРВЫЙ раз
    if (!hasFadedIn.current) {
      fadeIn(audio, 2000);
      hasFadedIn.current = true;
    } else {
      audio.volume = 0.2; // сразу норм громкость
    }

  } catch (e) {
    console.log("Play error:", e);
  }
};

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div
  onClick={toggle}
  className={`relative w-20 h-20 rounded-full cursor-pointer
  shadow-[inset_0_0_10px_rgba(255,255,255,0.08),0_10px_25px_rgba(0,0,0,0.35)]
  border border-white/10 flex items-center justify-center transition-transform active:scale-95
  ${isPlaying ? "animate-spin-slow" : ""}`}
  style={{
    backgroundImage: "url('/images/vinyl.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
        {/* play / pause */}
        {isPlaying ? (
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <rect x="6" y="5" width="4" height="14" rx="2" fill="#f4efe6" />
            <rect x="14" y="5" width="4" height="14" rx="2" fill="#f4efe6" />
          </svg>
        ) : (
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path d="M8 5L19 12L8 19V5Z" fill="#f4efe6" />
          </svg>
        )}
      </div>
    </div>
  );
}