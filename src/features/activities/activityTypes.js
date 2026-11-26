export const ACTIVITY_TYPES = [
  {
    id: "book",
    label: "Tugas Buku Paket",
    description: "Susun tugas berdasarkan buku, halaman, dan nomor soal.",
    icon: "book",
  },
  {
    id: "drawing",
    label: "Menggambar / Mewarnai",
    description: "Siapkan kartu kegiatan menggambar atau mewarnai.",
    icon: "palette",
  },
  {
    id: "writing",
    label: "Menulis",
    description: "Susun tugas menyalin, cerita pendek, atau ringkasan.",
    icon: "pencil",
  },
];

export function isActivityType(value) {
  return ACTIVITY_TYPES.some((type) => type.id === value);
}

export const ICON_OPTIONS = [
  { id: "book", label: "Buku" },
  { id: "book-open", label: "Buku terbuka" },
  { id: "pencil", label: "Pensil" },
  { id: "palette", label: "Alat warna" },
  { id: "eye", label: "Amati" },
  { id: "scissors", label: "Gunting" },
  { id: "check-circle", label: "Selesai" },
  { id: "clipboard-check", label: "Periksa tugas" },
  { id: "file-text", label: "Tulisan" },
  { id: "image", label: "Gambar" },
  { id: "list-checks", label: "Daftar langkah" },
];

export function isAllowedIcon(value) {
  return ICON_OPTIONS.some((icon) => icon.id === value);
}