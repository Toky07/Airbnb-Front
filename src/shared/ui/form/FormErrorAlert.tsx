type FormErrorAlertProps = {
  message: string;
  className?: string;
};

const FormErrorAlert = ({ message, className = '' }: FormErrorAlertProps) => (
  <div
    role="alert"
    className={`rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-700 ${className}`.trim()}
  >
    {message}
  </div>
);

export default FormErrorAlert;
