import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type FormEvent, useEffect, useState } from 'react';
import { getHostService } from '../../core/services/host.service';
import type { RoomFormPayload } from '../../core/types/host.types';
import type { CategorySummary, RoomListItem } from '../../../rooms/core/types/room.types';
import {
  formatPricePerNight,
  getRoomPrimaryImage,
  getRoomStatusLabel,
  resolveRoomImageUrls,
} from '../../../rooms/core/types/room.types';
import { Button } from '../../../../shared/ui';

const defaultForm: RoomFormPayload = {
  name: '',
  description: '',
  pricePerNight: 80,
  maxGuests: 2,
  bedrooms: 1,
  bathrooms: 1,
  beds: 1,
  quantity: 1,
  size: 20,
  status: 'available',
  roomTypeId: null,
  imageFiles: [],
  keptImagePaths: [],
};

const HostRoomsPage = () => {
  const [rooms, setRooms] = useState<RoomListItem[]>([]);
  const [roomTypes, setRoomTypes] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomListItem | null>(null);
  const [form, setForm] = useState<RoomFormPayload>(defaultForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadRooms = async () => {
    setLoading(true);
    const hostService = getHostService();
    const [roomsData, types] = await Promise.all([
      hostService.listRooms({ page: 1, limit: 25 }),
      hostService.listRoomTypeOptions(),
    ]);
    setRooms(roomsData.data);
    setRoomTypes(types);
    setLoading(false);
  };

  useEffect(() => {
    void loadRooms();
  }, []);

  const openCreate = () => {
    setEditingRoom(null);
    setForm(defaultForm);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (room: RoomListItem) => {
    setEditingRoom(room);
    setForm({
      name: room.name,
      description: room.description,
      pricePerNight: room.pricePerNight,
      maxGuests: room.maxGuests,
      bedrooms: room.bedrooms,
      bathrooms: room.bathrooms,
      beds: room.beds,
      quantity: room.quantity,
      size: room.size,
      status: room.status,
      roomTypeId: room.roomTypeId,
      imageFiles: [],
      keptImagePaths: room.images,
    });
    setError(null);
    setShowForm(true);
  };

  const update = <K extends keyof RoomFormPayload>(key: K, value: RoomFormPayload[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const hostService = getHostService();
    const result = editingRoom
      ? await hostService.updateRoom(editingRoom.id, form)
      : await hostService.createRoom(form);

    setSaving(false);

    if (!result.success) {
      setError(result.error ?? 'Enregistrement impossible.');
      return;
    }

    setShowForm(false);
    await loadRooms();
  };

  const handleDelete = async (room: RoomListItem) => {
    if (!window.confirm(`Supprimer la chambre « ${room.name} » ?`)) {
      return;
    }

    const result = await getHostService().deleteRoom(room.id);
    if (!result.success) {
      setError(result.error ?? 'Suppression impossible.');
      return;
    }

    await loadRooms();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mes chambres</h1>
          <p className="mt-2 text-slate-500">Ajoutez, modifiez ou supprimez vos logements.</p>
        </div>
        <Button onClick={openCreate}>
          <FontAwesomeIcon icon={faPlus} className="mr-2 h-3.5 w-3.5" />
          Nouvelle chambre
        </Button>
      </div>

      {error && !showForm ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {showForm ? (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              {editingRoom ? 'Modifier la chambre' : 'Nouvelle chambre'}
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              Fermer
            </button>
          </div>

          {error ? (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Nom</span>
              <input
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                required
              />
            </label>
            <label className="md:col-span-2 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
              <textarea
                value={form.description}
                onChange={(event) => update('description', event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Prix / nuit (€)</span>
              <input
                type="number"
                min={1}
                value={form.pricePerNight}
                onChange={(event) => update('pricePerNight', Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Statut</span>
              <select
                value={form.status}
                onChange={(event) => update('status', event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                <option value="available">Disponible</option>
                <option value="occupied">Occupée</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Type</span>
              <select
                value={form.roomTypeId ?? ''}
                onChange={(event) =>
                  update('roomTypeId', event.target.value ? Number(event.target.value) : null)
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                <option value="">Sélectionner</option>
                {roomTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Voyageurs max</span>
              <input
                type="number"
                min={1}
                value={form.maxGuests}
                onChange={(event) => update('maxGuests', Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Chambres</span>
              <input
                type="number"
                min={0}
                value={form.bedrooms}
                onChange={(event) => update('bedrooms', Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Lits</span>
              <input
                type="number"
                min={0}
                value={form.beds}
                onChange={(event) => update('beds', Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Surface (m²)</span>
              <input
                type="number"
                min={1}
                value={form.size}
                onChange={(event) => update('size', Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <label className="md:col-span-2 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Photos</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) =>
                  update('imageFiles', event.target.files ? Array.from(event.target.files) : [])
                }
                className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm"
              />
              {editingRoom && form.keptImagePaths && form.keptImagePaths.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {resolveRoomImageUrls(form.keptImagePaths).map((url) => (
                    <img key={url} src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  ))}
                </div>
              ) : null}
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Enregistrement…' : editingRoom ? 'Enregistrer' : 'Créer la chambre'}
            </Button>
          </div>
        </form>
      ) : null}

      {loading ? (
        <div className="animate-pulse rounded-3xl bg-white p-8 h-48 border border-slate-200" />
      ) : rooms.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-lg font-medium text-slate-700">Aucune chambre pour le moment</p>
          <p className="mt-2 text-sm text-slate-500">Commencez par ajouter votre première chambre.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {rooms.map((room) => {
            const image = getRoomPrimaryImage(room);
            return (
              <article
                key={room.id}
                className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <div className="h-24 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:w-32">
                  {image ? (
                    <img src={image} alt={room.name} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900">{room.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatPricePerNight(room.pricePerNight)} / nuit · {getRoomStatusLabel(room.status)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(room)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
                  >
                    <FontAwesomeIcon icon={faPen} className="h-3.5 w-3.5" />
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(room)}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
                    Supprimer
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HostRoomsPage;
