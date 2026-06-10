type HostFormErrorProps = {
  message: string;
  className?: string;
};

const HostFormError = ({ message, className = '' }: HostFormErrorProps) => (
  <div
    className={`rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 ${className}`.trim()}
  >
    {message}
  </div>
);

export default HostFormError;
