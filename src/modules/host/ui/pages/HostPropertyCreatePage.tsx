import { type FormEvent } from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import PropertyForm from '../components/PropertyForm';
import { useHostPropertyForm } from '../hooks/useHostPropertyForm';

const HostPropertyCreatePage = () => {
  usePageTitle('Nouvel établissement');
  const navigate = useNavigate();
  const {
    types,
    form,
    imageValue,
    loading,
    saving,
    error,
    setImagePreview,
    update,
    handleSubmit,
    amenityIds,
    setAmenityIds,
  } = useHostPropertyForm('create', null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const saved = await handleSubmit(event);
    if (saved) {
      navigate(`/host/property/${saved.id}`);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Link
        to="/host/property"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
        Retour à mes établissements
      </Link>

      <div>
        <h1 className="font-serif text-4xl font-bold text-slate-900">Nouvel établissement</h1>
        <p className="mt-3 text-lg text-slate-500">
          Ajoutez un nouvel hôtel ou établissement à votre compte.
        </p>
      </div>

      {loading ? (
        <div className="h-96 animate-pulse rounded-3xl bg-white" />
      ) : (
        <PropertyForm
          propertyExists={false}
          form={form}
          types={types}
          imageValue={imageValue}
          error={error}
          saving={saving}
          onSubmit={onSubmit}
          onImagePreviewChange={setImagePreview}
          onImageFileSelect={(file) => update('imageFile', file)}
          onUpdate={update}
          amenityIds={amenityIds}
          onAmenityIdsChange={setAmenityIds}
        />
      )}
    </div>
  );
};

export default HostPropertyCreatePage;
