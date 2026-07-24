import FormErrorAlert from '../../../../shared/ui/form/FormErrorAlert';

type HostFormErrorProps = {
  message: string;
  className?: string;
};

const HostFormError = ({ message, className = '' }: HostFormErrorProps) => (
  <FormErrorAlert message={message} className={`rounded-xl px-5 py-4 ${className}`.trim()} />
);

export default HostFormError;
