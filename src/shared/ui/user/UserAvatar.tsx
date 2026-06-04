import { useEffect, useState } from 'react';
import { resolveMediaUrl } from '../../utils/resolve-media-url';

type UserAvatarProps = {
  src?: string | null;
  initials: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-16 w-16 text-lg',
};

export default function UserAvatar({
  src,
  initials,
  alt,
  size = 'md',
}: UserAvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const imageUrl = src && !hasImageError ? resolveMediaUrl(src) : null;

  useEffect(() => {
    setHasImageError(false);
  }, [src]);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={`${sizeClasses[size]} shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm`}
        onError={() => setHasImageError(true)}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={`${sizeClasses[size]} flex shrink-0 items-center justify-center rounded-full bg-brand font-semibold text-white ring-2 ring-white shadow-sm`}
    >
      {initials}
    </div>
  );
}
