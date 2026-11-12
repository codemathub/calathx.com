import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function SiteSettings() {
  const [settings, setSettings] = useState({
    siteName: 'CalathX',
    contactPhone: '+919953609096',
    contactEmail: 'info@calathx.com',
    instagramUsername: 'calathx_official',
  });

  useEffect(() => {
    api.settings.get().then((res) => {
      if (res.data.data) setSettings((prev) => ({ ...prev, ...res.data.data }));
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.settings.update(settings);
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-brand-black">Site Settings</h1>
      <form onSubmit={handleSave} className="space-y-4 rounded bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-gray-600">Site Name</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-gray-600">Contact Phone</label>
          <input
            type="text"
            value={settings.contactPhone}
            onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-gray-600">Contact Email</label>
          <input
            type="email"
            value={settings.contactEmail}
            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-gray-600">Instagram Username</label>
          <input
            type="text"
            value={settings.instagramUsername}
            onChange={(e) => setSettings({ ...settings, instagramUsername: e.target.value })}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-brand-primary px-6 py-2 text-sm font-bold text-brand-black hover:bg-brand-hover hover:text-white"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}

