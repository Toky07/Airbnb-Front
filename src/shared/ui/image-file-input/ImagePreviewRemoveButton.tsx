import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type ImagePreviewRemoveButtonProps = {
  onClick: () => void;
  label: string;
};

const ImagePreviewRemoveButton = ({
  onClick,
  label,
}: ImagePreviewRemoveButtonProps) => (
  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation();
      onClick();
    }}
    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-xl border-2 border-surface bg-red-500 text-white transition duration-200 hover:bg-red-600"
    aria-label={label}
  >
    <FontAwesomeIcon icon="xmark" className="h-3 w-3" />
  </button>
);

export default ImagePreviewRemoveButton;
