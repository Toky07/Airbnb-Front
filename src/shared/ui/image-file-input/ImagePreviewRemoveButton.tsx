import { faXmark } from '@fortawesome/free-solid-svg-icons';
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
    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-red-500 text-white shadow-md transition hover:bg-red-600"
    aria-label={label}
  >
    <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
  </button>
);

export default ImagePreviewRemoveButton;
