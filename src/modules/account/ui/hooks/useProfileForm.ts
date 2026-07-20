import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../auth/ui/hooks/useAuth';
import { getUpdateProfileUseCase } from '../../application/composition/account.composition';
import { useNotification } from '../../../../shared/notifications';

export function useProfileForm() {
  const { session, refreshSession } = useAuth();
  const updateProfileUseCase = useMemo(() => getUpdateProfileUseCase(), []);
  const { success: notifySuccess } = useNotification();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session.profile) {
      return;
    }

    setForm({
      firstName: session.profile.firstName,
      lastName: session.profile.lastName,
      phoneNumber: session.profile.phoneNumber,
    });
  }, [session.profile]);

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const result = await updateProfileUseCase.execute({
      ...form,
      avatarFile,
    });

    setSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    await refreshSession();
    setAvatarFile(null);
    setAvatarPreview('');
    notifySuccess('Profil mis à jour.');
  };

  return {
    session,
    form,
    avatarFile,
    avatarPreview,
    error,
    saving,
    setAvatarPreview,
    setAvatarFile,
    update,
    handleSubmit,
  };
}
