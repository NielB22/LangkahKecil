import {
  createEmptyStep,
  ICON_OPTIONS,
} from "../data/exampleActivity.js";

const inputClass =
  "mt-2 block w-full rounded-xl border border-forest/30 bg-white px-4 py-3";

const buttonClass =
  "min-h-11 rounded-lg border border-forest/30 px-4 py-2 text-sm font-semibold text-forest hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40";

export default function ReviewEditor({ activity, onChange }) {
  function updateStep(id, field, value) {
    onChange({
      ...activity,
      steps: activity.steps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step,
      ),
    });
  }

  function moveStep(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= activity.steps.length) return;

    const steps = [...activity.steps];
    [steps[index], steps[target]] = [steps[target], steps[index]];
    onChange({ ...activity, steps });
  }

  const incomplete =
    !activity.title.trim() ||
    activity.steps.some(
      (step) => !step.title.trim() || !step.instruction.trim(),
    );

  return (
    <section className="py-10 sm:py-14">
      <p className="text-sm font-semibold text-forest">
        Periksa aktivitas · Draft
      </p>
      <h1 className="mt-2 text-3xl font-bold">
        Sesuaikan setiap langkah.
      </h1>

      {activity.source === "example" && (
        <p className="mt-5 rounded-xl bg-sunshine/40 p-4">
          Aktivitas contoh Matematika. Ini bukan hasil AI dari
          instruksi yang kamu masukkan.
        </p>
      )}

      <details className="mt-6 rounded-xl border border-forest/20 p-4">
        <summary className="cursor-pointer font-semibold">
          Lihat instruksi asli
        </summary>
        <p className="mt-3 whitespace-pre-wrap leading-relaxed">
          {activity.sourceInstruction}
        </p>
      </details>

      <div className="mt-6">
        <label htmlFor="activity-title" className="font-semibold">
          Judul aktivitas
        </label>
        <input
          id="activity-title"
          value={activity.title}
          maxLength={100}
          aria-required="true"
          aria-invalid={!activity.title.trim()}
          onChange={(event) =>
            onChange({ ...activity, title: event.target.value })
          }
          className={inputClass}
        />
      </div>

      <ol className="mt-8 space-y-6">
        {activity.steps.map((step, index) => (
          <li
            key={step.id}
            className="rounded-2xl border border-forest/20 bg-white p-5 sm:p-6"
          >
            <fieldset>
              <legend className="px-1 text-lg font-bold text-forest">
                Langkah {index + 1}
              </legend>

              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${step.id}-title`}>
                    Judul langkah
                  </label>
                  <input
                    id={`${step.id}-title`}
                    value={step.title}
                    maxLength={100}
                    aria-required="true"
                    aria-invalid={!step.title.trim()}
                    onChange={(event) =>
                      updateStep(step.id, "title", event.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor={`${step.id}-icon`}>
                    Kategori ikon
                  </label>
                  <select
                    id={`${step.id}-icon`}
                    value={step.icon}
                    onChange={(event) =>
                      updateStep(step.id, "icon", event.target.value)
                    }
                    className={inputClass}
                  >
                    {ICON_OPTIONS.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor={`${step.id}-instruction`}>
                    Instruksi utama
                  </label>
                  <textarea
                    id={`${step.id}-instruction`}
                    value={step.instruction}
                    maxLength={300}
                    rows={2}
                    aria-required="true"
                    aria-invalid={!step.instruction.trim()}
                    onChange={(event) =>
                      updateStep(
                        step.id,
                        "instruction",
                        event.target.value,
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor={`${step.id}-help`}>
                    Bantuan tambahan (opsional)
                  </label>
                  <textarea
                    id={`${step.id}-help`}
                    value={step.help}
                    maxLength={300}
                    rows={2}
                    onChange={(event) =>
                      updateStep(step.id, "help", event.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveStep(index, -1)}
                  aria-label={`Pindahkan langkah ${index + 1} ke atas`}
                  className={buttonClass}
                >
                  Naik
                </button>

                <button
                  type="button"
                  disabled={index === activity.steps.length - 1}
                  onClick={() => moveStep(index, 1)}
                  aria-label={`Pindahkan langkah ${index + 1} ke bawah`}
                  className={buttonClass}
                >
                  Turun
                </button>

                <button
                  type="button"
                  disabled={activity.steps.length === 1}
                  onClick={() => {
                    if (!window.confirm("Hapus langkah ini?")) return;

                    onChange({
                      ...activity,
                      steps: activity.steps.filter(
                        (item) => item.id !== step.id,
                      ),
                    });
                  }}
                  aria-label={`Hapus langkah ${index + 1}`}
                  className={buttonClass}
                >
                  Hapus
                </button>
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      <button
        type="button"
        disabled={activity.steps.length >= 20}
        onClick={() =>
          onChange({
            ...activity,
            steps: [...activity.steps, createEmptyStep()],
          })
        }
        className={`${buttonClass} mt-6`}
      >
        Tambah Langkah ({activity.steps.length}/20)
      </button>

      {incomplete && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-800">
          Lengkapi judul aktivitas, judul langkah, dan instruksi utama.
        </p>
      )}

      <p className="mt-6 text-sm text-ink/75">
        Periksa urutan, angka, dan kesesuaian instruksi sebelum digunakan.
      </p>
    </section>
  );
}