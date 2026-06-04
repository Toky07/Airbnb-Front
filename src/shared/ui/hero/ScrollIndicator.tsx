const ScrollIndicator = () => (
  <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block">
    <div className="h-10 w-6 rounded-full border-2 border-white/30 p-1.5">
      <div className="mx-auto h-2 w-1 animate-float rounded-full bg-white/80" />
    </div>
  </div>
);

export default ScrollIndicator;
