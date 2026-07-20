type PageSkeletonProps = {
  className?: string;
};

const PageSkeleton = ({ className = 'h-64' }: PageSkeletonProps) => (
  <div className={`animate-pulse rounded-3xl border border-slate-100 bg-white p-8 shadow-sm ${className}`.trim()} />
);

export default PageSkeleton;
