import { useEffect, useState } from 'react';
import { resolveAvatarUrl } from './avatar-url';

type AvatarProps = {
  src?: string;
  initials: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

const sizeClasses = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl',
};

export default function Avatar({ src, initials, alt, size = 'md' }: AvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const imageUrl = src && !hasImageError ? resolveAvatarUrl(src) : null;

  useEffect(() => {
    setHasImageError(false);
  }, [src]);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={`${sizeClasses[size]} shrink-0 rounded-full object-cover ring-2 ring-line`}
        onError={() => setHasImageError(true)}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} flex shrink-0 items-center justify-center rounded-full bg-brand font-semibold text-white ring-2 ring-brand/20`}
      aria-hidden
    >
      {initials}
    </div>
  );
}
