import React, { useState } from 'react';
import { Heart, Sparkles, Image as ImageIcon, Edit3, X, Camera, ZoomIn } from 'lucide-react';
import { PhotoItem } from '../types.ts';
import { HeartPop } from './HeartPopManager.tsx';

// Catatan untuk Pengguna:
// Anda dapat mengganti URL foto di array defaultPhotos di bawah ini
// Atau gunakan tombol "Ubah Foto Nia" langsung di halaman!
const DEFAULT_PHOTOS: PhotoItem[] = [
  {
    id: 'photo-1',
    url: 'https://i.ibb.co.com/5hXmqJBB/img1.jpg',
    title: 'Senyuman Yang Selalu Kurindukan',
    caption: 'Setiap kali melihat senyummu, hariku yang mendung terasa cerah kembalii.',
  },
  {
    id: 'photo-2',
    url: 'https://i.ibb.co.com/4wTC1BKJ/img2.jpg',
    title: 'Kehangatan Dalam Melihat Tatapan Terindahku',
    caption: 'Ada ketenangan tak terlukiskan di setiap tatapan manismu, Nia.',
  },
  {
    id: 'photo-3',
    url: 'https://i.ibb.co.com/xtD23RSZ/img3.jpg',
    title: 'Cantik Luar dan Dalam',
    caption: 'Kebaikan hatimu membuatmu semakin bersinar di mataku setiap saat.',
  }
];

export const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>(DEFAULT_PHOTOS);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');
  
  // Romantic reaction likes per Polaroid
  const [likes, setLikes] = useState<Record<string, number>>({
    'photo-1': 14,
    'photo-2': 19,
    'photo-3': 28,
  });

  const handleLike = (photoId: string) => {
    setLikes(prev => ({
      ...prev,
      [photoId]: (prev[photoId] || 0) + 1,
    }));
  };

  const openEditModal = (photo: PhotoItem) => {
    setEditingPhoto(photo);
    setEditUrl(photo.url);
    setEditTitle(photo.title);
    setEditCaption(photo.caption);
  };

  const saveEditedPhoto = () => {
    if (!editingPhoto) return;
    setPhotos(prev =>
      prev.map(p =>
        p.id === editingPhoto.id
          ? { ...p, url: editUrl.trim() || p.url, title: editTitle.trim() || p.title, caption: editCaption.trim() || p.caption }
          : p
      )
    );
    setEditingPhoto(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEditUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset tilt rotations for Polaroid cards
  const polaroidStyles = [
    {
      baseRotate: '-rotate-2 sm:-rotate-3',
      washiColor: 'bg-rose-200/80 border-rose-300/60',
      washiAngle: 'rotate-[-3deg]',
      handwrittenNote: 'Senyumanmuu selaluu bikinn akuu bahagia setiap saat..✨',
    },
    {
      baseRotate: 'rotate-1.5 sm:rotate-2',
      washiColor: 'bg-sky-200/80 border-sky-300/60',
      washiAngle: 'rotate-[2deg]',
      handwrittenNote: 'Tatapan manis yang bikin salting teruss..🤍',
    },
    {
      baseRotate: '-rotate-1 sm:-rotate-2',
      washiColor: 'bg-purple-200/80 border-purple-300/60',
      washiAngle: 'rotate-[-1.5deg]',
      handwrittenNote: 'Cantik luar dalam, bidadariku 🤍',
    },
  ];

  return (
    <section id="galeri-foto" className="py-20 sm:py-28 px-4 sm:px-6 relative bg-gradient-to-b from-slate-50 via-blue-50/20 to-pink-50/30">
      {/* Background decoration */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-pink-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-4 shadow-sm">
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            Galeri Memori Indah
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Pesona Yang Selalu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">
              Menghiasi Hariku
            </span>
          </h2>
          <p className="font-body text-slate-600 text-base sm:text-lg">
            Setiap sudut senyumanmu punya cara tersendiri untuk membuat duniaku terasa jauh lebih damai, manis, dan berwarna.
          </p>
        </div>

        {/* Aesthetic Polaroid Photo Gallery with subtle tilt & hover straighten */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 pt-6">
          {photos.map((item, index) => {
            const styleConfig = polaroidStyles[index % polaroidStyles.length];

            return (
              <div
                key={item.id}
                className="relative group transition-all duration-300 ease-out flex justify-center"
              >
                {/* Vintage Washi Tape on top of Polaroid */}
                <div
                  className={`absolute -top-3.5 z-30 w-28 h-7 ${styleConfig.washiColor} ${styleConfig.washiAngle} shadow-sm border-t border-b backdrop-blur-sm opacity-90 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-0 pointer-events-none rounded-xs`}
                  style={{
                    clipPath: 'polygon(0% 0%, 97% 2%, 100% 98%, 3% 100%)',
                  }}
                />

                {/* Polaroid Frame Card */}
                <div
                  className={`w-full max-w-sm bg-[#fefefe] p-3.5 sm:p-4 pb-6 sm:pb-7 rounded-2xl border border-stone-200/90 shadow-lg shadow-stone-400/20 group-hover:shadow-2xl group-hover:shadow-pink-400/25 group-hover:scale-[1.03] group-hover:-translate-y-2.5 group-hover:rotate-0 transition-all duration-400 ease-out transform ${styleConfig.baseRotate}`}
                >
                  {/* Inner Photo Container */}
                  <div className="relative overflow-hidden rounded-xl bg-stone-100 aspect-[4/4.8] flex items-center justify-center border border-stone-200/70 group/photo">
                    {/* The Image */}
                    <img
                      src={item.url}
                      alt={`Foto Nia - ${item.title}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Subtle warm vintage film glow & soft gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Top Action Buttons (Zoom & Quick Edit) */}
                    <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md backdrop-blur-sm transition-all transform hover:scale-110"
                        title="Ganti Foto Ini"
                      >
                        <Edit3 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => setSelectedPhoto(item)}
                        className="p-2 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md backdrop-blur-sm transition-all transform hover:scale-110"
                        title="Perbesar Foto"
                      >
                        <ZoomIn className="w-4 h-4 text-slate-700" />
                      </button>
                    </div>

                    {/* Quick tap indicator to enlarge */}
                    <button
                      onClick={() => setSelectedPhoto(item)}
                      className="absolute inset-0 w-full h-full cursor-zoom-in"
                      aria-label="Perbesar Foto"
                    />
                  </div>

                  {/* Polaroid Bottom White Margin (Handwritten Note & Reaction) */}
                  <div className="pt-4 px-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-romantic text-2xl sm:text-[26px] text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="font-body text-xs sm:text-[13px] text-slate-500 mt-1 line-clamp-2 leading-relaxed italic">
                        "{item.caption}"
                      </p>
                    </div>

                    {/* Bottom Metadata & Romantic Heart Like Counter */}
                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-pink-600 font-body">
                        <Sparkles className="w-3 h-3 text-pink-400" />
                        <span>{styleConfig.handwrittenNote}</span>
                      </div>

                      {/* Interactive Heart Pop Button */}
                      <HeartPop
                        onClick={() => handleLike(item.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded-full bg-pink-50 hover:bg-pink-100 border border-pink-200/70 text-pink-600 text-xs font-semibold shadow-xs"
                      >
                        <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                        <span className="text-[11px]">{likes[item.id] || 0}</span>
                      </HeartPop>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      {/* Lightbox Zoom Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-3 border-2 border-blue-400"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[3/4] sm:aspect-auto max-h-[75vh] overflow-hidden rounded-2xl">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain bg-slate-900"
              />
            </div>
            <div className="p-4 sm:p-6 text-center">
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-1">
                {selectedPhoto.title}
              </h3>
              <p className="font-body text-sm text-slate-600">
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Photo URL & Content Modal */}
      {editingPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
          onClick={() => setEditingPhoto(null)}
        >
          <div 
            className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 border border-blue-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                Ganti Foto Nia
              </h3>
              <button
                onClick={() => setEditingPhoto(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Unggah dari HP / Laptop
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-xs text-slate-400">atau masukkan URL</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Link / URL Foto
                </label>
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="https://example.com/foto-nia.jpg"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Judul Foto
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pesan Manis / Caption
                </label>
                <textarea
                  rows={3}
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={saveEditedPhoto}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow-md hover:shadow-lg transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
};
