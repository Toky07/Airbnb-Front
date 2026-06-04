import type { ReactNode } from 'react';

type OverlayMediaCardProps = {
  href?: string;
  imageUrl: string;
  alt: string;
  aspectClass?: string;
  footer: ReactNode;
  className?: string;
};

const OverlayMediaCard = ({
  href = '#',
  imageUrl,
  alt,
  aspectClass = 'aspect-[4/5]',
  footer,
  className = '',
}: OverlayMediaCardProps) => (
  <a href={href} className={['group relative block overflow-hidden rounded-2xl', className].join(' ')}>
    <div className={['relative overflow-hidden', aspectClass].join(' ')}>
      <img
        src={imageUrl}
        alt={alt}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">{footer}</div>
    </div>
  </a>
);

export default OverlayMediaCard;
