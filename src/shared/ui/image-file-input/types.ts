export type ImageFileInputBaseProps = {
  label?: string;
  hint?: string;
  optional?: boolean;
  accept?: string;
  maxSizeMb?: number;
  maxFiles?: number;
  disabled?: boolean;
  /** Shown in single mode when no image is selected. */
  fallbackInitials?: string;
  /** Called when a local file is selected or cleared (single mode, multipart). */
  onFileSelect?: (file: File | null) => void;
  /** Called when files change in multiple mode (multipart). */
  onFilesSelect?: (files: File[]) => void;
};

export type ImageFileInputSingleProps = ImageFileInputBaseProps & {
  multiple?: false;
  value?: string;
  onChange: (value: string) => void;
};

export type ImageFileInputMultipleProps = ImageFileInputBaseProps & {
  multiple: true;
  value?: string[];
  onChange: (value: string[]) => void;
};

export type ImageFileInputProps =
  | ImageFileInputSingleProps
  | ImageFileInputMultipleProps;

export type ImagePreviewItem = {
  id: string;
  source: string;
  previewUrl: string;
  revokeOnUnmount: boolean;
  file?: File;
};
