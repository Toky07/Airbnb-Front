import { type FormEvent, useState } from 'react';
import { Link } from 'react-router';
import { Button, FormErrorAlert, PageContainer, TextField } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import { SITE_PATHS } from '../../core/config/site-urls';
import { submitContactMessage } from '../../infrastructure/submit-contact-message';

const emptyForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const ContactPage = () => {
  usePageTitle('Contact');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const update = (key: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    const result = await submitContactMessage(form);
    setSaving(false);
    if (result.success) {
      setSuccess(result.message);
      setForm(emptyForm);
      return;
    }
    setError(result.error);
  };

  return (
    <PageContainer className="page-mist py-12 lg:py-16">
      <div className="mx-auto max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Assistance</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Contact
        </h1>
        <p className="mt-3 text-base text-ink/60">
          Un problème de paiement, une question sur un séjour ou une candidature hôte : décrivez
          votre demande. Consultez aussi le{' '}
          <Link to={SITE_PATHS.help} className="font-semibold text-brand">
            centre d’aide
          </Link>
          .
        </p>

        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="mt-10 space-y-4 rounded-2xl border border-line bg-surface p-6 sm:p-8"
        >
          {error ? <FormErrorAlert message={error} /> : null}
          {success ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {success}
            </p>
          ) : null}

          <TextField
            label="Nom"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            required
            minLength={2}
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            required
          />
          <TextField
            label="Sujet"
            value={form.subject}
            onChange={(event) => update('subject', event.target.value)}
            required
            minLength={3}
          />
          <TextField
            label="Message"
            multiline
            rows={6}
            value={form.message}
            onChange={(event) => update('message', event.target.value)}
            required
            minLength={10}
          />
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? 'Envoi…' : 'Envoyer'}
          </Button>
        </form>
      </div>
    </PageContainer>
  );
};

export default ContactPage;
