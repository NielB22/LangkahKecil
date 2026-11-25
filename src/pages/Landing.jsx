const steps = [
  "Ambil buku matematika",
  "Buka halaman 15",
  "Kerjakan soal 1 sampai 3",
  "Kumpulkan di meja guru",
];

export default function Landing({ onStart }) {
  return (
    <>
      <section className="grid items-center gap-12 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="mb-5 inline-block rounded-full bg-sunshine px-4 py-2 text-sm font-semibold">
            Untuk guru dan pendamping belajar
          </p>

          <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
            Instruksi panjang.
            <br />
            Langkah kecil.
            <br />
            <span className="text-forest">Belajar lebih terarah.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/80">
            Susun instruksi kelas menjadi kartu visual dengan bantuan AI.
            Periksa isinya, sesuaikan dengan kebutuhan kegiatan, lalu
            tampilkan atau cetak.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onStart}
              className="min-h-12 rounded-xl bg-forest px-6 py-3 font-semibold text-white hover:bg-forest/90"
            >
              Buat Aktivitas
            </button>

            <a
              href="#contoh"
              className="inline-flex min-h-12 items-center px-3 font-semibold text-forest underline underline-offset-4"
            >
              Lihat Contoh
            </a>
          </div>
        </div>

        <section
          id="contoh"
          aria-labelledby="example-title"
          className="scroll-mt-6 rounded-3xl border border-forest/15 bg-white p-6 sm:p-8"
        >
          <p className="text-sm font-semibold text-forest">
            Contoh kartu aktivitas
          </p>

          <h2 id="example-title" className="mt-2 text-2xl font-bold">
            Belajar Matematika
          </h2>

          <ol className="mt-6 space-y-3">
            {steps.map((step, index) => (
              <li
                key={step}
                className="flex items-center gap-4 rounded-2xl bg-cream p-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sunshine font-bold">
                  {index + 1}
                </span>
                <span className="font-medium">{step}</span>
              </li>
            ))}
          </ol>

          <p className="mt-5 text-sm leading-relaxed text-ink/75">
            Guru dapat menyesuaikan setiap langkah sebelum digunakan.
          </p>
        </section>
      </section>

      <section
        aria-labelledby="how-title"
        className="border-t border-forest/15 py-12"
      >
        <h2 id="how-title" className="text-2xl font-bold">
          Dari instruksi menjadi kegiatan
        </h2>

        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            ["Tulis instruksi", "Ceritakan kegiatan yang ingin dilakukan."],
            ["Periksa langkah", "Revisi dengan AI atau edit sendiri."],
            ["Gunakan kartu", "Tampilkan satu per satu atau cetak."],
          ].map(([title, description], index) => (
            <li key={title} className="rounded-2xl bg-white p-6">
              <p className="text-sm font-bold text-forest">
                Langkah {index + 1}
              </p>
              <h3 className="mt-3 text-lg font-semibold">{title}</h3>
              <p className="mt-2 leading-relaxed text-ink/75">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}