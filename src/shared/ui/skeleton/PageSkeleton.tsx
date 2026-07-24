type PageSkeletonProps = {
  className?: string;
};

const PageSkeleton = ({ className = 'h-64' }: PageSkeletonProps) => (
  <div className={`surface animate-pulse rounded-2xl p-8 soft-shadow ${className}`.trim()} />
);

export default PageSkeleton;
