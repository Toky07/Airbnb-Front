type InlineErrorPanelProps = {
  message: string;
  hint?: string;
  className?: string;
};

const InlineErrorPanel = ({ message, hint, className = '' }: InlineErrorPanelProps) => (
  <div
    className={`rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-700 ${className}`.trim()}
  >
    {message}
    {hint ? <p className="mt-2 text-sm text-red-600">{hint}</p> : null}
  </div>
);

export default InlineErrorPanel;
