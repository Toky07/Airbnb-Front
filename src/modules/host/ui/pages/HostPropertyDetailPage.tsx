import { useMemo, useState, type FormEvent } from 'react';
import { useParams } from 'react-router';
import { PageSkeleton } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import HostPropertyDetailHeader from '../components/HostPropertyDetailHeader';
import HostPropertyNotFound from '../components/HostPropertyNotFound';
import { HostPropertyInfoTab, HostPropertyRoomsTab } from '../components/HostPropertyDetailTabs';
import HostPropertyAvailabilityTab from '../components/HostPropertyAvailabilityTab';
import HostPropertyPricingTab from '../components/HostPropertyPricingTab';
import { useHostPropertyForm } from '../hooks/useHostPropertyForm';
import { useHostRooms } from '../hooks/useHostRooms';
import { useRoomForm } from '../hooks/useRoomForm';

type DetailTab = 'rooms' | 'info' | 'availability' | 'pricing';

const HostPropertyDetailPage = () => {
  const { id } = useParams();
  const propertyId = Number(id);
  const validPropertyId = Number.isFinite(propertyId) && propertyId > 0 ? propertyId : null;
  const [activeTab, setActiveTab] = useState<DetailTab>('rooms');

  const propertyForm = useHostPropertyForm('edit', validPropertyId);
  const roomsState = useHostRooms(validPropertyId);
  const roomFormState = useRoomForm({
    propertyId: validPropertyId ?? 0,
    onSaved: roomsState.loadRooms,
  });

  usePageTitle(propertyForm.property?.name ?? 'Établissement');

  const locationLabel = useMemo(() => {
    if (!propertyForm.property) {
      return '';
    }
    return [propertyForm.property.city, propertyForm.property.country].filter(Boolean).join(', ');
  }, [propertyForm.property]);

  const handlePropertySubmit = async (event: FormEvent) => {
    event.preventDefault();
    await propertyForm.handleSubmit(event);
  };

  const handleDeleteRoom = async (room: Parameters<typeof roomsState.deleteRoom>[0]) => {
    roomsState.setError(null);
    await roomsState.deleteRoom(room);
  };

  if (!validPropertyId) {
    return <HostPropertyNotFound />;
  }

  if (propertyForm.loading) {
    return <PageSkeleton className="h-96" />;
  }

  if (!propertyForm.property) {
    return <HostPropertyNotFound />;
  }

  const subtitle = [
    locationLabel || propertyForm.property.address || 'Localisation non renseignée',
    `${propertyForm.property.roomCount} chambre${propertyForm.property.roomCount > 1 ? 's' : ''}`,
  ].join(' · ');

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <HostPropertyDetailHeader
        name={propertyForm.property.name}
        subtitle={subtitle}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'rooms' ? (
        <HostPropertyRoomsTab
          rooms={roomsState.rooms}
          roomsLoading={roomsState.loading}
          error={roomsState.error}
          showForm={roomFormState.showForm}
          editingRoom={roomFormState.editingRoom}
          roomForm={roomFormState.form}
          roomTypes={roomsState.roomTypes}
          existingImages={roomFormState.existingImages}
          newImagesValue={roomFormState.newImagesValue}
          roomFormError={roomFormState.error}
          roomSaving={roomFormState.saving}
          roomAmenityIds={roomFormState.amenityIds}
          onOpenCreate={roomFormState.openCreate}
          onCloseForm={roomFormState.closeForm}
          onSubmitRoom={roomFormState.handleSubmit}
          onUpdateRoom={roomFormState.update}
          onRemoveExistingImage={roomFormState.removeExistingImage}
          onRoomAmenityIdsChange={roomFormState.setAmenityIds}
          onEditRoom={roomFormState.openEdit}
          onDeleteRoom={handleDeleteRoom}
        />
      ) : null}

      {activeTab === 'availability' ? (
        <HostPropertyAvailabilityTab
          propertyId={validPropertyId}
          rooms={roomsState.rooms}
          roomsLoading={roomsState.loading}
        />
      ) : null}

      {activeTab === 'pricing' ? (
        <HostPropertyPricingTab
          propertyId={validPropertyId}
          rooms={roomsState.rooms}
          roomsLoading={roomsState.loading}
        />
      ) : null}

      {activeTab === 'info' ? (
        <HostPropertyInfoTab
          form={propertyForm.form}
          types={propertyForm.types}
          imageValue={propertyForm.imageValue}
          error={propertyForm.error}
          saving={propertyForm.saving}
          amenityIds={propertyForm.amenityIds}
          onSubmit={handlePropertySubmit}
          onImagePreviewChange={propertyForm.setImagePreview}
          onImageFileSelect={(file) => propertyForm.update('imageFile', file)}
          onUpdate={propertyForm.update}
          onAmenityIdsChange={propertyForm.setAmenityIds}
        />
      ) : null}
    </div>
  );
};

export default HostPropertyDetailPage;
