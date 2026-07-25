import React, { useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface AvatarProps {
  size?: number;
  src?: string;
  /** Static frame: reduced-motion + while the video loads. */
  poster?: string;
}

// Morphing orb shape; the `animate-morph` keyframes shift the outline.
const BLOB_RADIUS = '42% 58% 63% 37% / 41% 44% 56% 59%';

/**
 * Motion-Memoji avatar inside a white morphing-blob orb.
 *
 * The Memoji is baked onto a WHITE background (the black recording background
 * was keyed out with a tight threshold so the dark pupils / hair gaps survive
 * and don't leak the orb's white through them). Because the video's white
 * matches the orb's white, it sits seamlessly inside — and being opaque it's a
 * plain MP4 that plays in every browser. The memoji has a baked margin so it
 * stays contained in the orb. The orb morphs and scales on hover.
 *
 * Reduced-motion users get the static poster; a hard load error falls back to
 * the gradient "AK" monogram.
 */
// Filenames are versioned (avatar2.*) to bust the browser's video cache after
// re-encoding the Memoji — bump the number on any future re-encode so browsers
// fetch the new clip instead of replaying the cached old one.
const Avatar: React.FC<AvatarProps> = ({
  size = 150,
  src = '/avatar3.mp4',
  poster = '/avatar3-poster.jpg',
}) => {
  const [errored, setErrored] = useState(false);
  const reduced = usePrefersReducedMotion();

  if (errored) {
    return (
      <div
        className="rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-display font-bold text-white shadow-lg select-none"
        style={{ width: size, height: size, fontSize: size * 0.34 }}
        role="img"
        aria-label="Akhil Kumar"
      >
        AK
      </div>
    );
  }

  return (
    <div
      className="group relative bg-white shadow-xl ring-1 ring-black/5 overflow-hidden animate-morph motion-reduce:animate-none transition-transform duration-300 ease-out hover:scale-[1.05]"
      style={{ width: size, height: size, borderRadius: BLOB_RADIUS }}
      role="img"
      aria-label="Akhil Kumar"
    >
      {reduced ? (
        <img
          src={poster}
          alt="Akhil Kumar"
          onError={() => setErrored(true)}
          draggable={false}
          className="w-full h-full object-cover select-none"
        />
      ) : (
        <video
          key={src}
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setErrored(true)}
          className="w-full h-full object-cover select-none pointer-events-none"
        />
      )}
    </div>
  );
};

export default Avatar;
