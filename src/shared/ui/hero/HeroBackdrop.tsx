import type { ReactNode } from 'react';

type HeroBackdropProps = {
  imageUrl: string;
  children: ReactNode;
  minHeightClass?: string;
};

const HeroBackdrop = ({
  imageUrl,
  children,
  minHeightClass = 'min-h-[92vh]',
}: HeroBackdropProps) => (
  <section className={['relative overflow-hidden', minHeightClass].join(' ')}>
    <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-linear-to-b from-slate-950/75 via-slate-950/50 to-slate-950/85" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,56,92,0.25),transparent_55%)]" />
    {children}
  </section>
);

export default HeroBackdrop;
