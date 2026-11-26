import { BookOpen } from "lucide-react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router";
import ActivityBuilderPage from "../pages/ActivityBuilderPage.jsx";

import ActivitiesPage from "../pages/ActivitiesPage.jsx";
import ActivityDetailPage from "../pages/ActivityDetailPage.jsx";
import ActivityEditPage from "../pages/ActivityEditPage.jsx";

function PageHeading({ title, children }) {
  return (
    <section className="py-12 sm:py-20">
      <h1 className="max-w-3xl text-3xl leading-tight font-bold sm:text-5xl">
        {title}
      </h1>
      {children}
    </section>
  );
}

function LandingPage() {
  return (
    <PageHeading title="Satu tugas, langkah kecil yang jelas.">
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
        Bantu guru menyusun tugas kelas menjadi kartu instruksi visual
        yang dapat disesuaikan, ditampilkan, dan dicetak.
      </p>

      <p className="mt-4 max-w-xl leading-relaxed text-ink/80">
        Mulai dari tugas buku paket, menggambar atau mewarnai,
        hingga menulis.
      </p>

      <Link
        to="/activities/new"
        className="mt-8 inline-flex min-h-12 items-center rounded-xl bg-forest px-6 py-3 font-semibold text-white hover:bg-forest/90"
      >
        Buat Aktivitas
      </Link>
    </PageHeading>
  );
}

export default function App() {

  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:bg-white focus:p-4"
      >
        Lewati ke konten utama
      </a>

      <header className="border-b border-forest/15 bg-white">
        <nav
          aria-label="Navigasi utama"
          className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4"
        >
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 text-xl font-bold text-forest"
          >
            <BookOpen aria-hidden="true" size={26} />
            LangkahKecil
          </Link>

          <div className="flex flex-wrap gap-2">
            {[
              ["/activities/new", "Buat Aktivitas"],
              ["/activities", "Aktivitas Saya"],
            ].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `inline-flex min-h-11 items-center rounded-lg px-3 py-2 font-medium ${
                    isActive
                      ? "bg-forest text-white"
                      : "text-forest hover:bg-cream"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-5"
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/activities" element={<ActivitiesPage />} />
                    
          <Route
            path="/activities/new"
            element={
              <ActivityBuilderPage
                key="new"
                onSaved={(saved) =>
                  navigate(
                    `/activities/${encodeURIComponent(saved.id)}`,
                    { replace: true, state: { saved: true } },
                  )
                }
              />
            }
          />

          <Route
            path="/activities/:id"
            element={<ActivityDetailPage />}
          />

          <Route
            path="/activities/:id/edit"
            element={<ActivityEditPage />}
          />

          <Route
            path="*"
            element={
              <PageHeading title="Halaman tidak ditemukan">
                <Link
                  to="/"
                  className="mt-6 inline-flex min-h-11 items-center text-forest underline"
                >
                  Kembali ke beranda
                </Link>
              </PageHeading>
            }
          />
        </Routes>
      </main>

      <footer className="border-t border-forest/15 px-5 py-6">
        <p className="mx-auto max-w-6xl text-sm leading-relaxed text-ink/75">
          LangkahKecil — Guru perlu memeriksa dan menyesuaikan kartu
          sebelum digunakan dalam kegiatan belajar.
        </p>
      </footer>
    </div>
  );
}