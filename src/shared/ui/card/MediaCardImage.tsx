import type { ReactNode } from 'react';
import Badge from '../badge/Badge';

type MediaCardImageProps = {
  src: string;
  alt: string;
  aspectClass?: string;
  tag?: string;
  children?: ReactNode;
};

const MediaCardImage = ({
  src,
  alt,
  aspectClass = 'aspect-[4/3]',
  tag,
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
    {children}
  </div>
);

export default MediaCardImage;
