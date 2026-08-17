export const SITE_URL = "https://pigaru.site"
export const SITE_NAME = "PIGARU"
export const SITE_TAGLINE = "Pusat Informasi Generus Bandung Selatan"

export const DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`
export const DEFAULT_DESCRIPTION =
  "PIGARU (Pusat Informasi Generus) adalah aplikasi PPG Bandung Selatan untuk mendata generus, mencatat capaian materi, dan merekap kehadiran kegiatan."

// Hanya halaman di daftar ini yang boleh muncul di hasil pencarian. Sisanya
// butuh login, jadi crawler cuma melihat halaman kosong -> ditandai noindex
// supaya tidak jadi sitelink yang tidak informatif.
//
// `canonical` halaman login sengaja diarahkan ke root: "/" langsung redirect ke
// "/login" untuk pengunjung anonim, jadi keduanya adalah halaman yang sama di
// mata Google dan sebaiknya digabung jadi satu entri.
const pageMeta = {
  "/": {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    canonical: `${SITE_URL}/`,
  },
  "/login": {
    title: `Login ${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Masuk ke PIGARU memakai nomor HP, email, atau username untuk melihat data generus, capaian materi, dan kehadiran kegiatan PPG Bandung Selatan.",
    canonical: `${SITE_URL}/`,
  },
  "/forgot-password": {
    title: `Lupa Password — ${SITE_NAME}`,
    description:
      "Lupa password akun PIGARU? Kirim permohonan reset dengan nomor HP, email, atau username Anda, lalu pengurus akan membuatkan password sementara.",
    canonical: `${SITE_URL}/forgot-password`,
  },
  "/register": {
    title: `Daftar Akun — ${SITE_NAME}`,
    description:
      "Buat akun PIGARU untuk generus, pengajar, dan pengurus PPG Bandung Selatan agar bisa mencatat capaian materi dan mengikuti absensi kegiatan.",
    canonical: `${SITE_URL}/register`,
  },
}

export const getPageMeta = (pathname) => {
  // Samakan "/login/" dengan "/login".
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
  const meta = pageMeta[path]
  if (meta) return { ...meta, indexable: true }

  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    canonical: `${SITE_URL}/`,
    indexable: false,
  }
}

export default pageMeta
