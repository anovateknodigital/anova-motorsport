'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { Plus, Edit2, Trash2, X, AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface RaceClass {
  id: string;
  event_id: number;
  class_category: 'main-class' | 'supporting-class';
  class_name: string;
  registration_fee: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  events?: {
    title: string;
  };
}

interface Event {
  id: number;
  title: string;
}

interface ClassesTabProps {
  user: User;
}

function AlertModal({
  type,
  message,
  onClose,
}: {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}) {
  const icons = {
    success: <CheckCircle2 size={24} className="text-green-500" />,
    error: <AlertCircle size={24} className="text-red-500" />,
    info: <Info size={24} className="text-blue-500" />,
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
      {icons[type]}
      <p className="text-white text-sm flex-1">{message}</p>
      <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
        <X size={16} />
      </button>
    </div>
  );
}

function ClassModal({
  isOpen,
  onClose,
  onSubmit,
  events,
  editingClass,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  events: Event[];
  editingClass: RaceClass | null;
}) {
  const [eventId, setEventId] = useState(editingClass?.event_id || 0);
  const [classCategory, setClassCategory] = useState<'main-class' | 'supporting-class'>(
    editingClass?.class_category || 'main-class'
  );
  const [className, setClassName] = useState(editingClass?.class_name || '');
  const [registrationFee, setRegistrationFee] = useState(
    editingClass?.registration_fee || 0
  );
  const [isActive, setIsActive] = useState(editingClass?.is_active ?? true);

  useEffect(() => {
    if (editingClass) {
      setEventId(editingClass.event_id);
      setClassCategory(editingClass.class_category);
      setClassName(editingClass.class_name);
      setRegistrationFee(editingClass.registration_fee);
      setIsActive(editingClass.is_active);
    } else {
      setEventId(0);
      setClassCategory('main-class');
      setClassName('');
      setRegistrationFee(0);
      setIsActive(true);
    }
  }, [editingClass, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      event_id: eventId,
      class_category: classCategory,
      class_name: className,
      registration_fee: registrationFee,
      is_active: isActive,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-teko text-2xl font-bold text-white uppercase italic">
            {editingClass ? 'Edit Kelas' : 'Tambah Kelas Baru'}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Event <span className="text-[#D32F2F]">*</span>
            </label>
            <select
              value={eventId}
              onChange={(e) => setEventId(Number(e.target.value))}
              required
              className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
            >
              <option value={0}>-- Pilih Event --</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Kategori Kelas <span className="text-[#D32F2F]">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="classCategory"
                  value="main-class"
                  checked={classCategory === 'main-class'}
                  onChange={(e) => setClassCategory(e.target.value as any)}
                  className="w-4 h-4 text-[#D32F2F]"
                />
                <span className="text-white text-sm">Kelas Utama</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="classCategory"
                  value="supporting-class"
                  checked={classCategory === 'supporting-class'}
                  onChange={(e) => setClassCategory(e.target.value as any)}
                  className="w-4 h-4 text-[#D32F2F]"
                />
                <span className="text-white text-sm">Supporting Class</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Nama Kelas <span className="text-[#D32F2F]">*</span>
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
              className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
              placeholder="Contoh: Underbone 150cc"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Biaya Pendaftaran (Rp) <span className="text-[#D32F2F]">*</span>
            </label>
            <input
              type="number"
              value={registrationFee}
              onChange={(e) => setRegistrationFee(Number(e.target.value))}
              required
              min={0}
              className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
              placeholder="0"
            />
          </div>

          <div className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-4">
            <span className="text-white text-sm font-semibold">Status Aktif</span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isActive ? 'bg-[#D32F2F]' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  isActive ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm font-semibold transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm font-bold transition-all"
            >
              {editingClass ? 'Simpan Perubahan' : 'Tambah Kelas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={22} className="text-red-400" />
        </div>

        <h3 className="font-teko text-2xl font-bold text-white text-center uppercase italic mb-1">
          Hapus Kelas?
        </h3>
        <p className="text-zinc-400 text-sm text-center mb-2">
          Kelas yang akan dihapus:
        </p>
        <p className="text-white font-semibold text-center mb-6">
          {className}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm font-semibold transition-all"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm font-bold transition-all"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClassesTab({ user }: ClassesTabProps) {
  const [classes, setClasses] = useState<RaceClass[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingClass, setEditingClass] = useState<RaceClass | null>(null);
  const [deletingClass, setDeletingClass] = useState<RaceClass | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'main-class' | 'supporting-class'>('all');
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const supabase = createClient();

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load events
      const { data: eventsData } = await supabase
        .from('events')
        .select('id, title')
        .order('title');

      if (eventsData) {
        setEvents(eventsData);
      }

      // Load classes
      const { data: classesData } = await supabase
        .from('race_classes')
        .select(`
          *,
          events!inner(title)
        `)
        .order('created_at', { ascending: false });

      if (classesData) {
        setClasses(classesData as any);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showAlert('error', 'Gagal memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  // Handle add/edit
  const handleAddEdit = async (data: any) => {
    try {
      if (editingClass) {
        // Update
        const { error } = await supabase
          .from('race_classes')
          .update(data)
          .eq('id', editingClass.id);

        if (error) throw error;
        showAlert('success', 'Kelas berhasil diperbarui');
      } else {
        // Insert
        const { error } = await supabase.from('race_classes').insert(data);

        if (error) throw error;
        showAlert('success', 'Kelas berhasil ditambahkan');
      }

      setShowModal(false);
      setEditingClass(null);
      loadData();
    } catch (error: any) {
      console.error('Save error:', error);
      showAlert('error', error.message || 'Gagal menyimpan data');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingClass) return;

    try {
      const { error } = await supabase
        .from('race_classes')
        .delete()
        .eq('id', deletingClass.id);

      if (error) throw error;

      showAlert('success', 'Kelas berhasil dihapus');
      setShowDeleteModal(false);
      setDeletingClass(null);
      loadData();
    } catch (error: any) {
      console.error('Delete error:', error);
      showAlert('error', error.message || 'Gagal menghapus data');
    }
  };

  // Filter classes
  const filteredClasses = classes.filter((cls) => {
    if (activeFilter === 'all') return true;
    return cls.class_category === activeFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#D32F2F]/30 border-t-[#D32F2F] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {alert && (
        <AlertModal
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <ClassModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingClass(null);
        }}
        onSubmit={handleAddEdit}
        events={events}
        editingClass={editingClass}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingClass(null);
        }}
        onConfirm={handleDelete}
        className={deletingClass?.class_name || ''}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-teko text-3xl font-bold uppercase italic text-white mb-1">
            Manajemen Kelas
          </h2>
          <p className="text-zinc-400 text-sm">
            Kelola kelas balap untuk semua event
          </p>
        </div>
        <button
          onClick={() => {
            setEditingClass(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all"
        >
          <Plus size={18} />
          Tambah Kelas
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-[#D32F2F]/15 text-[#D32F2F]'
              : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
          }`}
        >
          Semua Kelas ({classes.length})
        </button>
        <button
          onClick={() => setActiveFilter('main-class')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeFilter === 'main-class'
              ? 'bg-[#D32F2F]/15 text-[#D32F2F]'
              : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
          }`}
        >
          Kelas Utama ({classes.filter((c) => c.class_category === 'main-class').length})
        </button>
        <button
          onClick={() => setActiveFilter('supporting-class')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeFilter === 'supporting-class'
              ? 'bg-[#D32F2F]/15 text-[#D32F2F]'
              : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
          }`}
        >
          Supporting ({classes.filter((c) => c.class_category === 'supporting-class').length})
        </button>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800/50 border-b border-zinc-700">
            <tr>
              <th className="text-left text-xs font-bold uppercase tracking-wider text-zinc-400 px-6 py-4">
                Event
              </th>
              <th className="text-left text-xs font-bold uppercase tracking-wider text-zinc-400 px-6 py-4">
                Kategori
              </th>
              <th className="text-left text-xs font-bold uppercase tracking-wider text-zinc-400 px-6 py-4">
                Nama Kelas
              </th>
              <th className="text-right text-xs font-bold uppercase tracking-wider text-zinc-400 px-6 py-4">
                Biaya
              </th>
              <th className="text-center text-xs font-bold uppercase tracking-wider text-zinc-400 px-6 py-4">
                Status
              </th>
              <th className="text-center text-xs font-bold uppercase tracking-wider text-zinc-400 px-6 py-4">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredClasses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <p className="text-zinc-500 text-sm">
                    Belum ada kelas{activeFilter !== 'all' ? ` untuk filter ini` : ''}
                  </p>
                </td>
              </tr>
            ) : (
              filteredClasses.map((cls) => (
                <tr key={cls.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 text-white text-sm">
                    {(cls as any).events?.title || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        cls.class_category === 'main-class'
                          ? 'bg-[#D32F2F]/15 text-[#D32F2F]'
                          : 'bg-blue-500/15 text-blue-400'
                      }`}
                    >
                      {cls.class_category === 'main-class' ? 'Kelas Utama' : 'Supporting'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white text-sm font-semibold">
                    {cls.class_name}
                  </td>
                  <td className="px-6 py-4 text-white text-sm font-semibold text-right">
                    Rp {cls.registration_fee.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        cls.is_active
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-zinc-700/50 text-zinc-500'
                      }`}
                    >
                      {cls.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingClass(cls);
                          setShowModal(true);
                        }}
                        className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingClass(cls);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
