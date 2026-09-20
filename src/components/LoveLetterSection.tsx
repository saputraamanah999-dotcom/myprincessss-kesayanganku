import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MailOpen, Heart, Sparkles, RotateCcw, Copy, Check, Edit3, X } from 'lucide-react';
import { NiaBloomingGardenSvg } from './NiaBloomingGardenSvg.tsx';
import { HeartPop } from './HeartPopManager.tsx';

const DEFAULT_LETTER_TEXT = `Niaa tersayang,

Mungkin kata-kata ini terdengar sederhana, tapi setiap huruf di dalamnya kutulis dengan tulus dari dalam hatiku.

Sejak pertama kali mengenalmu, ada rasa nyaman dan damai yang sulit kujelaskan. Senyumanmu, caramu berbicara, tatapanmu yang hangat, bahkan warna biru yang selalu terlihat cocok untuk dirimu—hal hal kecil tentangmu perlahan menjadi bagian yang berarti dalam hari-hariku.

Aku juga paham kalau mungkin masih ada rasa takut atau ragu dalam dirimu. ituu ndakkpapa kokk, kamu nggak perlu terburu-buru atau merasa harus membalas perasaanku ini. aku menghargai apa pun yang kamu rasakan dan keputusan yang kamu pilih.

Aku nggak datang untuk menghapus masa lalu atau memaksamu percaya begitu saja denganku. Aku hanya ingin menunjukkan lewat sikap dan waktu bahwa aku menghargai kamuu, cerita ceritamu, dan kenyamanan yang selama ini kamu berikan ke aku.

Terima kasih sudah hadir dan sudah mau berbagi cerita denganku. Apa pun hubungan kita nantinya, aku tetap berharap bisa menjadi seseorang yang membawa hal baik dalam hidupmu, bisa tertawa bersamamu di hari-hari menyenangkan, dan tetap menghargaimu ketika hari sedang terasa berat.

— Saputra`;

export const LoveLetterSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [letterContent, setLetterContent] = useState(DEFAULT_LETTER_TEXT);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(DEFAULT_LETTER_TEXT);
  const [copied, setCopied] = useState(false);

  // Typewriter effect triggered when letter opens
  useEffect(() => {
    if (!isOpen) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);
    let currentIndex = 0;
    const fullText = letterContent;

    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 28); // natural handwriting/typewriter cadence

    return () => clearInterval(interval);
  }, [isOpen, letterContent]);

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDisplayedText('');
    setIsTyping(true);
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < letterContent.length) {
        setDisplayedText(letterContent.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 25);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    setLetterContent(editText);
    setIsEditing(false);
    if (isOpen) {
      setDisplayedText(editText);
    }
  };

  return (
    <section id="surat-cinta" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-slate-50 via-pink-50/25 to-blue-50/40">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 text-blue-800 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-4 shadow-sm">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            Sebuah Surat Pribadi
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Secarik Surat Untuk{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">
              Nia
            </span>
          </h2>
          <p className="font-body text-slate-600 text-base sm:text-lg max-w-md mx-auto">
            {isOpen ? "Bacalah perlahan setiap kata yang kutuliskan khusus untukmu." : "Sentuh amplop berstempel lilin di bawah ini untuk membukanya."}
          </p>
        </div>

        {/* Envelope Container */}
        <div className="w-full max-w-xl perspective-1000">
          
          {/* Closed Envelope View */}
          {!isOpen ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              onClick={() => setIsOpen(true)}
              className="relative w-full aspect-[16/10] bg-gradient-to-br from-blue-100 via-sky-50 to-pink-100 rounded-3xl p-6 shadow-2xl shadow-blue-500/15 border-2 border-blue-200 cursor-pointer group flex flex-col items-center justify-center overflow-hidden hover:border-blue-400 hover:shadow-blue-500/25 transition-all duration-300"
            >
              {/* Envelope Flap Lines */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polygon points="0,0 50,48 100,0" fill="#bfdbfe" opacity="0.5" />
                  <polygon points="0,0 50,48 0,100" fill="#dbeafe" opacity="0.3" />
                  <polygon points="100,0 50,48 100,100" fill="#dbeafe" opacity="0.3" />
                  <polygon points="0,100 50,48 100,100" fill="#fbcfe8" opacity="0.35" />
                </svg>
              </div>

              {/* Heart Wax Seal (Cap Lilin Romantis) */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <HeartPop>
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 shadow-xl shadow-blue-600/40 border-4 border-white flex items-center justify-center relative group-hover:shadow-blue-500/60 transition-all duration-300"
                  >
                    <Heart className="w-10 h-10 text-white fill-white drop-shadow-md animate-pulse" />
                    <span className="absolute -bottom-1 text-[10px] uppercase font-bold tracking-wider text-blue-100">
                      NIA
                    </span>
                  </motion.div>
                </HeartPop>

                <div className="text-center">
                  <p className="font-heading text-xl sm:text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                    Sentuh Untuk Membuka Surat
                  </p>
                  <span className="font-romantic text-2xl sm:text-3xl text-pink-600 flex items-center justify-center gap-1.5">
                    Hanya untukmu, Nia 💌
                  </span>
                </div>
              </div>

              {/* Floating Sparkles Indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-1 text-blue-500 text-xs font-medium">
                <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Kesayangankui</span>
              </div>
            </motion.div>
          ) : (
            /* Opened Letter View (Paper Card with SVG Artwork + Direct Text Letter Below) */
            <motion.div
              initial={{ scale: 0.92, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative w-full paper-texture rounded-3xl p-5 sm:p-9 shadow-2xl border-2 border-blue-200 shadow-blue-400/10 text-slate-800"
            >
              {/* Top Ribbon & Controls */}
              <div className="flex items-center justify-between border-b border-blue-100 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-400" />
                  <div className="w-3 h-3 rounded-full bg-blue-400" />
                  <span className="font-romantic text-2xl sm:text-3xl text-blue-700 ml-1">Dari Hatiku Untuk Nia</span>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors flex items-center gap-1"
                  title="Tutup Amplop"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tutup</span>
                </button>
              </div>

              {/* 1. Animated SVG Garden Artwork (Nia Sayaangku) */}
              <div className="w-full flex flex-col items-center mb-6">
                <NiaBloomingGardenSvg className="w-full" />
                <p className="text-center text-xs text-slate-400 mt-2 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>Sentuh kelopak bunga atau langit untuk memunculkan efek cinta bermekaran 💕</span>
                </p>
              </div>

              {/* 2. Surat Teks Langsung Tampil Dibawahnya Tanpa Harus Dipencet Dulu */}
              <div className="mt-6 pt-5 border-t border-dashed border-blue-200">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-1.5 text-blue-800 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    <MailOpen className="w-4 h-4 text-blue-600" />
                    <span>Catatan Sepenuh Hati</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleReplay}
                      className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs flex items-center gap-1 transition-colors border border-blue-100"
                      title="Ketik Ulang Surat"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span className="text-[11px] font-medium hidden sm:inline">Ketik Ulang</span>
                    </button>
                    <button
                      onClick={handleCopy}
                      className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs flex items-center gap-1 transition-colors border border-pink-100"
                      title="Salin Teks Surat"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                      <span className="text-[11px] font-medium hidden sm:inline">{copied ? "Tersalin" : "Salin"}</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditText(letterContent);
                        setIsEditing(true);
                      }}
                      className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 transition-colors"
                      title="Ubah Kata-Kata"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span className="text-[11px] font-medium hidden sm:inline">Ubah</span>
                    </button>
                  </div>
                </div>

                {/* Surat Text Card */}
                <div className="p-5 sm:p-7 rounded-2xl bg-white/90 border border-blue-100/90 shadow-sm whitespace-pre-line font-body text-slate-700 text-sm sm:text-base leading-relaxed relative">
                  {displayedText}
                  {isTyping && (
                    <span className="inline-block w-2 h-4 bg-blue-500 ml-1 translate-y-0.5 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Romantic Bottom Sign-off */}
              <div className="mt-8 pt-4 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Ditulis dengan penuh ketulusan</span>
                </div>
                <p className="font-romantic text-3xl sm:text-4xl text-blue-600">
                  Selamanya mengagumimu 💙
                </p>
              </div>

              {/* Envelope Re-fold Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <MailOpen className="w-3.5 h-3.5" />
                  Tutup Kembali Amplop Surat
                </button>
              </div>
            </motion.div>
          )}

        </div>

        {/* Edit Letter Modal */}
        {isEditing && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setIsEditing(false)}
          >
            <div 
              className="relative max-w-lg w-full bg-white rounded-3xl shadow-2xl p-6 border border-blue-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  Sesuaikan Kata-Kata Surat
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-3">
                Tuliskan kata-kata tulus Anda sendiri untuk Nia. Teks ini akan langsung muncul dengan animasi mesin tik.
              </p>

              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={8}
                className="w-full p-4 rounded-2xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm font-body leading-relaxed"
              />

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-medium shadow-md hover:from-blue-700 hover:to-sky-600 transition-all"
                >
                  <Check className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
