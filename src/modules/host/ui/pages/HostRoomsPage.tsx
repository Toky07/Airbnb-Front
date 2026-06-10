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
import { notifyMessages, useNotification } from '../../../../shared/notifications';

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
  const { success: notifySuccess } = useNotification();

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
    notifySuccess(
      editingRoom
        ? notifyMessages.room.updated(form.name.trim())
        : notifyMessages.room.created(form.name.trim()),
    );
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

    notifySuccess(notifyMessages.room.deleted(room.name));
    await loadRooms();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl font-bold text-slate-900">Mes chambres</h1>
          <p className="mt-3 text-lg text-slate-500">Ajoutez, modifiez ou supprimez vos logements.</p>
        </div>
        <Button onClick={openCreate} className="px-6 py-3">
          <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
          Nouvelle chambre
        </Button>
      </div>

      {error && !showForm ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
      ) : null}

      {showForm ? (
        <form onSubmit={handleSubmit} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6 sm:px-10">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                {editingRoom ? 'Modifier la chambre' : 'Nouvelle chambre'}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
              >
                Fermer
              </button>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            {error ? (
              <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
            ) : null}

            <div className="grid gap-8 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Nom de la chambre</span>
                <input
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                  required
                  placeholder="Ex: Suite Vue Mer"
                />
              </label>
              
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) => update('description', event.target.value)}
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                  placeholder="Décrivez les atouts de cette chambre..."
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Prix / nuit (€)</span>
                <input
                  type="number"
                  min={1}
                  value={form.pricePerNight}
                  onChange={(event) => update('pricePerNight', Number(event.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Statut</span>
                <select
                  value={form.status}
                  onChange={(event) => update('status', event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                >
                  <option value="available">Disponible</option>
                  <option value="occupied">Occupée</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Type</span>
                <select
                  value={form.roomTypeId ?? ''}
                  onChange={(event) =>
                    update('roomTypeId', event.target.value ? Number(event.target.value) : null)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
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
                <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Voyageurs max</span>
                <input
                  type="number"
                  min={1}
                  value={form.maxGuests}
                  onChange={(event) => update('maxGuests', Number(event.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </label>

              <div className="grid grid-cols-3 gap-4 md:col-span-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Chambres</span>
                  <input
                    type="number"
                    min={0}
                    value={form.bedrooms}
                    onChange={(event) => update('bedrooms', Number(event.target.value))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Lits</span>
                  <input
                    type="number"
                    min={0}
                    value={form.beds}
                    onChange={(event) => update('beds', Number(event.target.value))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Surface (m²)</span>
                  <input
                    type="number"
                    min={1}
                    value={form.size}
                    onChange={(event) => update('size', Number(event.target.value))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </label>
              </div>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Photos</span>
                <div className="relative mt-2 flex justify-center rounded-2xl border border-dashed border-slate-300 px-6 py-10 transition hover:border-brand hover:bg-slate-50">
                  <div className="text-center">
                    <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                      <label
                        htmlFor="file-upload-room"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-brand focus-within:outline-none focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 hover:text-brand/80"
                      >
                        <span>Télécharger des fichiers</span>
                        <input
                          id="file-upload-room"
                          name="file-upload-room"
                          type="file"
                          multiple
                          className="sr-only"
                          accept="image/*"
                          onChange={(event) =>
                            update('imageFiles', event.target.files ? Array.from(event.target.files) : [])
                          }
                        />
                      </label>
                      <p className="pl-1">ou glisser-déposer</p>
                    </div>
                    <p className="text-xs leading-5 text-slate-500">PNG, JPG, GIF jusqu'à 10MB</p>
                  </div>
                </div>
                {editingRoom && form.keptImagePaths && form.keptImagePaths.length > 0 ? (
                  <div className="mt-6 flex flex-wrap gap-4">
                    {resolveRoomImageUrls(form.keptImagePaths).map((url) => (
                      <div key={url} className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                        <img src={url} alt="" className="h-24 w-32 object-cover" />
                      </div>
                    ))}
                  </div>
                ) : null}
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-slate-100 bg-slate-50 px-8 py-6 sm:px-10">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="px-6 py-3">
              Annuler
            </Button>
            <Button type="submit" disabled={saving} className="px-8 py-3">
              {saving ? 'Enregistrement…' : editingRoom ? 'Enregistrer' : 'Créer la chambre'}
            </Button>
          </div>
        </form>
      ) : null}

      {loading ? (
        <div className="h-48 animate-pulse rounded-3xl bg-white p-8" />
      ) : rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
            <FontAwesomeIcon icon={faBed} className="h-8 w-8 text-slate-300" />
          </div>
          <p className="mt-6 font-serif text-2xl font-bold text-slate-900">Aucune chambre pour le moment</p>
          <p className="mt-2 text-slate-500">Commencez par ajouter votre première chambre.</p>
        </div>
      ) : (
        <div className="grid gap-4 divide-y divide-slate-100 rounded-3xl bg-white p-2 shadow-sm">
          {rooms.map((room) => {
            const image = getRoomPrimaryImage(room);
            return (
              <article
                key={room.id}
                className="group relative flex flex-col gap-6 rounded-2xl bg-white p-4 transition-all hover:bg-slate-50 sm:flex-row sm:items-center"
              >
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-32 sm:w-48">
                  {image ? (
                    <img src={image} alt={room.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
                      <FontAwesomeIcon icon={faBed} className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-2xl font-bold text-slate-900">{room.name}</h3>
                    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide uppercase ${
                      room.status === 'available' ? 'bg-emerald-50 text-emerald-700' :
                      room.status === 'occupied' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {getRoomStatusLabel(room.status)}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span>{room.maxGuests} voyageurs</span>
                    <span className="text-slate-300">•</span>
                    <span>{room.bedrooms} chambre{room.bedrooms > 1 ? 's' : ''}</span>
                    <span className="text-slate-300">•</span>
                    <span>{room.beds} lit{room.beds > 1 ? 's' : ''}</span>
                    <span className="text-slate-300">•</span>
                    <span>{room.bathrooms} sdb</span>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-brand">{formatPricePerNight(room.pricePerNight)}</span>
                      <span className="text-sm text-slate-500">/ nuit</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(room)}
                        className="flex h-10 items-center justify-center gap-2 rounded-full bg-slate-100 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 hover:text-slate-900"
                      >
                        <FontAwesomeIcon icon={faPen} className="h-3.5 w-3.5" />
                        <span>Modifier</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(room)}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        title="Supprimer"
                      >
                        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
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
