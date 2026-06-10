import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import ImageFileInput from './ImageFileInput';

const EMPTY_VALUE: string[] = [];

function MultipleWithParentRerender() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <>
      <ImageFileInput
        multiple
        value={EMPTY_VALUE}
        onChange={vi.fn()}
        onFilesSelect={setFiles}
        maxFiles={5}
      />
      <span data-testid="file-count">{files.length}</span>
    </>
  );
}

describe('ImageFileInput', () => {
  it('affiche le label et la zone de dépôt en mode simple', () => {
    render(
      <ImageFileInput
        label="Avatar"
        value=""
        onChange={vi.fn()}
        fallbackInitials="AB"
      />,
    );

    expect(screen.getByText('Avatar')).toBeInTheDocument();
    expect(screen.getByText(/Cliquez ou glissez une image/i)).toBeInTheDocument();
  });

  it('affiche le bouton de retrait sur l’aperçu en mode simple', () => {
    render(
      <ImageFileInput
        value="data:image/png;base64,abc"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /retirer l’image/i })).toBeInTheDocument();
    expect(screen.getByAltText('Aperçu')).toBeInTheDocument();
  });

  it('appelle onChange avec une chaîne vide au retrait', () => {
    const onChange = vi.fn();

    render(
      <ImageFileInput
        value="data:image/png;base64,abc"
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /retirer l’image/i }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('affiche plusieurs aperçus en mode multiple', () => {
    render(
      <ImageFileInput
        multiple
        value={['data:image/png;base64,a', 'data:image/png;base64,b']}
        onChange={vi.fn()}
        maxFiles={5}
      />,
    );

    expect(screen.getAllByAltText('Aperçu')).toHaveLength(2);
    expect(screen.getByText(/Cliquez ou glissez des images/i)).toBeInTheDocument();
  });

  it('masque la zone de dépôt quand le maximum est atteint', () => {
    render(
      <ImageFileInput
        multiple
        value={['data:image/png;base64,a']}
        onChange={vi.fn()}
        maxFiles={1}
      />,
    );

    expect(screen.queryByText(/Cliquez ou glissez/i)).not.toBeInTheDocument();
  });

  it('conserve l’aperçu après re-render du parent (value=[] stable)', async () => {
    render(<MultipleWithParentRerender />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['pixels'], 'room.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByTestId('file-count')).toHaveTextContent('1');
    });
    await waitFor(() => {
      expect(screen.getByAltText('Aperçu')).toBeInTheDocument();
    });
  });

  it('retire une image en mode multiple', () => {
    const onChange = vi.fn();

    render(
      <ImageFileInput
        multiple
        value={['data:image/png;base64,a', 'data:image/png;base64,b']}
        onChange={onChange}
      />,
    );

    const removeButtons = screen.getAllByRole('button', { name: /retirer l’image/i });
    fireEvent.click(removeButtons[0]!);

    expect(onChange).toHaveBeenCalledWith(['data:image/png;base64,b']);
  });
});
