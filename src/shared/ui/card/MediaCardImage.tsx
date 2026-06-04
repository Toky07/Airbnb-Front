import type { ReactNode } from 'react';
import Badge from '../badge/Badge';
import FavoriteButton from './FavoriteButton';

type MediaCardImageProps = {
  src: string;
  alt: string;
  aspectClass?: string;
  tag?: string;
  showFavorite?: boolean;
  children?: ReactNode;
};

const MediaCardImage = ({
  src,
  alt,
  aspectClass = 'aspect-[4/3]',
  tag,
  showFavorite = true,
  children,
}: MediaCardImageProps) => (
  <div className={['relative overflow-hidden rounded-2xl bg-slate-100', aspectClass].join(' ')}>
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      loading="lazy"
    />
    {tag && (
      <span className="absolute left-3 top-3">
        <Badge variant="overlay">{tag}</Badge>
      </span>
    )}
    {showFavorite && <FavoriteButton />}
    {children}
  </div>
);

export default MediaCardImage;
