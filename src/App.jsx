import { useEffect, useRef, useState } from "react";
import Landing from "./pages/Landing.jsx";
import ActivityBuilder from "./pages/ActivityBuilder.jsx";
import ReviewEditor from "./pages/ReviewEditor.jsx";
import { createExampleActivity } from "./data/exampleActivity.js";

export default function App() {
    const [page, setPage] = useState("landing");
    const [form, setForm] = useState({
      title: "",
      instruction: "",
      language: "id-ID",
      detailLevel: "simple",
    });
  
    const [activity, setActivity] = useState(null);
  
    const mainRef = useRef(null);
    const previousPage = useRef(page);

    useEffect(() => {
        const titles = {
          landing: "LangkahKecil",
          builder: "Buat Aktivitas | LangkahKecil",
          review: "Periksa Draft | LangkahKecil",
        };

        document.title = titles[page] ?? "LangkahKecil";

        if (previousPage.current !== page) {
          mainRef.current?.focus();
          window.scrollTo(0, 0);
          previousPage.current = page;
        }
    }, [page]);

    function openExample() {
        if (
          activity &&
          !window.confirm("Ganti draft aktivitas saat ini dengan contoh baru?")
        ) {
          return;
        }
    
        setActivity(createExampleActivity());
        setPage("review");
    }

    function updateActivity(nextActivity) {
        setActivity((current) => ({
            ...nextActivity,
            revision: current.revision + 1,
            status: "draft",
            approvedRevision: null,
            approvedAt: null,
            updatedAt: new Date().toISOString(),
        }));
    }


    return (
        <div className="min-h-dvh">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:bg-white focus:p-4"
          >
            Lewati ke konten utama
          </a>

          <header className="border-b border-forest/15">
            <nav
              aria-label="Navigasi utama"
              className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4"
            >
              <button
                type="button"
                onClick={() => setPage("landing")}
                className="min-h-11 text-xl font-bold tracking-tight text-forest"
              >
                LangkahKecil
              </button>

              <button
                type="button"
                onClick={() =>
                  setPage(page === "landing" ? "builder" : "landing")
                }
                className="min-h-11 rounded-lg px-4 py-2 font-semibold text-forest hover:bg-forest/5"
              >
                {page === "landing" ? "Buat Aktivitas" : "Kembali ke Beranda"}
              </button>
            </nav>
          </header>

          <main
            id="main"
            ref={mainRef}
            tabIndex={-1}
            className="mx-auto max-w-6xl px-6"
          >
                {page === "landing" && (
                  <Landing onStart={() => setPage("builder")} />
                )}
                
                {page === "builder" && (
                  <>
                    <ActivityBuilder
                      value={form}
                      onChange={setForm}
                      onOpenExample={openExample}
                    />
                
                    {activity && (
                      <button
                        type="button"
                        onClick={() => setPage("review")}
                        className="mb-10 min-h-12 rounded-xl border border-forest/30 px-5 py-3 font-semibold text-forest"
                      >
                        Lanjutkan Edit Draft
                      </button>
                    )}
                  </>
                )}
                
                {page === "review" && activity && (
                  <ReviewEditor activity={activity} onChange={updateActivity} />
                )}
          </main>

          <footer className="border-t border-forest/15 px-6 py-6">
            <p className="mx-auto max-w-6xl text-sm leading-relaxed text-ink/75">
              LangkahKecil — Materi hasil AI perlu diperiksa guru sebelum
              digunakan dalam kegiatan belajar.
            </p>
          </footer>
        </div>
    );
}