import { useState } from "react";

const example = {
  title: "Belajar Matematika",
  instruction:
    "Ambil buku matematika, buka halaman 15, kerjakan nomor 1 sampai 3, lalu kumpulkan di meja guru.",
  language: "id-ID",
  detailLevel: "simple",
};

const fieldClass =
  "mt-2 block min-h-12 w-full rounded-xl border border-forest/30 bg-white px-4 py-3";

export default function ActivityBuilder({ value, onChange }) {
  const [feedback, setFeedback] = useState(null);

  function updateField(event) {
    const { name, value: nextValue } = event.target;
    onChange({ ...value, [name]: nextValue });
    setFeedback(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = value.title.trim();
    const instruction = value.instruction.trim();

    if (!title || !instruction) {
      setFeedback({
        type: "error",
        message: "Judul dan instruksi tidak boleh hanya berisi spasi.",
      });

      const field = !title ? "title" : "instruction";
      event.currentTarget.elements.namedItem(field)?.focus();
      return;
    }

    onChange({ ...value, title, instruction });
    setFeedback({
      type: "success",
      message: "Instruksi sudah siap diproses.",
    });
  }

  return (
    <section className="py-10 sm:py-14">
      <p className="text-sm font-semibold text-forest">
        Susun aktivitas baru
      </p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
        Mulai dari instruksi kelas.
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink/80">
        Tuliskan kegiatan secara berurutan. Sertakan nomor halaman,
        jumlah, atau aturan penting yang perlu dipertahankan.
      </p>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[2fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-forest/15 bg-white p-6 sm:p-8"
        >
          <div>
            <label htmlFor="title" className="font-semibold">
              Judul aktivitas
            </label>
            <input
              id="title"
              name="title"
              value={value.title}
              onChange={updateField}
              maxLength={100}
              required
              placeholder="Contoh: Belajar Matematika"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="instruction" className="font-semibold">
              Instruksi kegiatan
            </label>
            <textarea
              id="instruction"
              name="instruction"
              value={value.instruction}
              onChange={updateField}
              maxLength={3000}
              required
              rows={6}
              aria-describedby="instruction-hint"
              placeholder="Tuliskan kegiatan yang ingin dipecah menjadi langkah kecil."
              className={`${fieldClass} resize-y`}
            />
            <p
              id="instruction-hint"
              className="mt-2 text-sm leading-relaxed text-ink/75"
            >
              Jangan sertakan nama atau informasi pribadi anak.
              Maksimal 3.000 karakter.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="language" className="font-semibold">
                Bahasa kartu
              </label>
              <select
                id="language"
                name="language"
                value={value.language}
                onChange={updateField}
                className={fieldClass}
              >
                <option value="id-ID">Bahasa Indonesia</option>
                <option value="en-US">English</option>
              </select>
            </div>

            <div>
              <label htmlFor="detailLevel" className="font-semibold">
                Perincian langkah
              </label>
              <select
                id="detailLevel"
                name="detailLevel"
                value={value.detailLevel}
                onChange={updateField}
                className={fieldClass}
              >
                <option value="simple">Ringkas</option>
                <option value="detailed">Lebih Terperinci</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="min-h-12 rounded-xl bg-forest px-5 py-3 font-semibold text-white hover:bg-forest/90"
            >
              Periksa Instruksi
            </button>

            <button
              type="button"
              onClick={() => {
                onChange({ ...example });
                setFeedback(null);
              }}
              className="min-h-12 rounded-xl border border-forest/30 px-5 py-3 font-semibold text-forest hover:bg-cream"
            >
              Isi Contoh
            </button>
          </div>

          {feedback && (
            <p
              role={feedback.type === "error" ? "alert" : "status"}
              className={`rounded-xl p-4 ${
                feedback.type === "error"
                  ? "bg-red-50 text-red-800"
                  : "bg-cream text-forest"
              }`}
            >
              {feedback.message}
            </p>
          )}
        </form>

        <aside className="rounded-2xl bg-sunshine/35 p-6">
          <h2 className="text-lg font-bold">
            Seperti apa instruksi yang jelas?
          </h2>
          <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed">
            <li>Sebutkan tindakan yang konkret.</li>
            <li>Tulis urutan kegiatan yang diinginkan.</li>
            <li>Pertahankan angka dan batasan penting.</li>
          </ul>
          <p className="mt-6 text-sm leading-relaxed">
            Setelah kartu dibuat, kamu dapat meminta revisi AI dengan
            arahan tambahan atau mengeditnya sendiri.
          </p>
        </aside>
      </div>
    </section>
  );
}