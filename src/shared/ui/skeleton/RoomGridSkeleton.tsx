type RoomGridSkeletonProps = {
  count?: number;
  variant?: 'card' | 'search';
};

const RoomGridSkeleton = ({ count = 8, variant = 'card' }: RoomGridSkeletonProps) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, index) =>
      variant === 'search' ? (
        <div key={index} className="animate-pulse overflow-hidden rounded-2xl bg-mist">
          <div className="aspect-[4/3] bg-line/50" />
          <div className="space-y-3 p-4">
            <div className="h-4 rounded-lg bg-line/50" />
            <div className="h-3 w-2/3 rounded-lg bg-line/50" />
          </div>
        </div>
      ) : (
        <div key={index} className="animate-pulse overflow-hidden rounded-2xl">
          <div className="aspect-square rounded-2xl bg-mist" />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-3/4 rounded-lg bg-mist" />
            <div className="h-3 w-1/2 rounded-lg bg-mist" />
            <div className="h-4 w-1/4 rounded-lg bg-mist" />
          </div>
        </div>
      ),
    )}
  </div>
);

export default RoomGridSkeleton;
