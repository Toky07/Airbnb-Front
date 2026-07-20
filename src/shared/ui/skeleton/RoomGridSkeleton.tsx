type RoomGridSkeletonProps = {
  count?: number;
  variant?: 'card' | 'search';
};

const RoomGridSkeleton = ({ count = 8, variant = 'card' }: RoomGridSkeletonProps) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, index) =>
      variant === 'search' ? (
        <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200">
          <div className="aspect-[4/3] bg-slate-100" />
          <div className="space-y-3 p-4">
            <div className="h-4 rounded bg-slate-100" />
            <div className="h-3 w-2/3 rounded bg-slate-100" />
          </div>
        </div>
      ) : (
        <div key={index} className="animate-pulse overflow-hidden rounded-xl">
          <div className="aspect-square rounded-xl bg-slate-200" />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-3/4 rounded bg-slate-200" />
            <div className="h-3 w-1/2 rounded bg-slate-200" />
            <div className="h-4 w-1/4 rounded bg-slate-200" />
          </div>
        </div>
      ),
    )}
  </div>
);

export default RoomGridSkeleton;
