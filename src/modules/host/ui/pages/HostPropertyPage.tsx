import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import PropertyForm from '../components/PropertyForm';
import { useHostPropertyForm } from '../hooks/useHostPropertyForm';

const HostPropertyPage = () => {
  usePageTitle('Mon établissement');
  const {
    property,
    types,
    form,
    imageValue,
    loading,
    saving,
    error,
    setImagePreview,
    update,
    handleSubmit,
  } = useHostPropertyForm();

  if (loading) {
    return (
      <div className="h-96 animate-pulse rounded-3xl border border-slate-100 bg-white p-8 shadow-sm" />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <div>
        <h1 className="font-serif text-4xl font-bold text-slate-900">Mon établissement</h1>
        <p className="mt-3 text-lg text-slate-500">
          {property
            ? 'Modifiez les informations visibles par les voyageurs.'
            : 'Créez votre hôtel ou établissement.'}
        </p>
      </div>

      <PropertyForm
        propertyExists={Boolean(property)}
        form={form}
        types={types}
        imageValue={imageValue}
        error={error}
        saving={saving}
        onSubmit={handleSubmit}
        onImagePreviewChange={setImagePreview}
        onImageFileSelect={(file) => update('imageFile', file)}
        onUpdate={update}
      />
    </div>
  );
};

export default HostPropertyPage;
