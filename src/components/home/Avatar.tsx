import React, { useState } from 'react';

interface AvatarProps {
  size?: number;
  src?: string;
}

/**
 * Renders the visitor-facing avatar. Attempts to load an image; if it is missing
 * or fails to load (e.g. public/avatar.jpg not yet added), falls back to a
 * gradient "AK" monogram so the homepage always looks intentional.
 */
const Avatar: React.FC<AvatarProps> = ({ size = 88, src = '/avatar.jpg' }) => {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className="rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-display font-bold text-white select-none shadow-lg"
        style={{ width: size, height: size, fontSize: size * 0.38 }}
        role="img"
        aria-label="Akhil Kumar"
      >
        AK
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Akhil Kumar"
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className="rounded-full object-cover border border-white/10 shadow-lg"
      style={{ width: size, height: size }}
    />
  );
};

export default Avatar;
