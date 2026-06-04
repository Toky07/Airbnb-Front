import type { ReactNode } from 'react';

type MediaCardProps = {
  image: ReactNode;
  footer: ReactNode;
  className?: string;
};

const MediaCard = ({ image, footer, className = '' }: MediaCardProps) => (
  <article className={['group cursor-pointer', className].join(' ')}>
    {image}
    <div className="mt-3">{footer}</div>
  </article>
);

export default MediaCard;
