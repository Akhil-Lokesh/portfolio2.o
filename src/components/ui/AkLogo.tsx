import React from 'react';

interface AkLogoProps {
  size?: number;
  className?: string;
}

const AkLogo: React.FC<AkLogoProps> = ({ size = 40, className = '' }) => {
  return (
    <img 
      src="/ak-logo.svg" 
      alt="ak. logo" 
      width={size} 
      height={size}
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default AkLogo; 