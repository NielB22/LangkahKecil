import { useState } from "react";
import ActivityCard from "./ActivityCard.jsx";
import { ICON_OPTIONS } from "../features/activities/activityTypes.js";
import { LIMITS } from "../features/activities/models.js";
import { validateSteps } from "../features/activities/validators.js";

const textFields = [
  {
    name: "title",
    label: "Judul langkah (opsional)",
    limit: LIMITS.stepTitle,
  },
  {
    name: "instruction",
    label: "Instruksi utama",
    limit: LIMITS.instruction,
  },
  {
    name: "helpText",
    label: "Bantuan tambahan (opsional)",
    limit: LIMITS.helpText,
  },
];

const inputClass =
  "mt-2 block w-full rounded-xl border border-forest/30 bg-white px-4 py-3";

const buttonClass =
  "min-h-11 rounded-lg border border-forest/30 px-4 py-2 font-semibold text-forest hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40";

export default function StepListEditor({ steps, onChange }) {
  const [notice, setNotice] = useState("");
  const validation = validateSteps(steps);

  function updateStep(id, field, value) {
    onChange(
      steps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step,
      ),
    );
  }

  function moveStep(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;

    const next = [...steps];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setNotice(`Langkah dipindahkan ke posisi ${target + 1}.`);
  }

  function removeStep(id, index) {
    if (steps.length <= LIMITS.minSteps) return;

    if (!window.confirm(`Hapus langkah ${index + 1}?`)) return;

    onChange(steps.filter((step) => step.id !== id));
    setNotice(`Langkah ${index + 1} dihapus.`);
  }

  function addStep() {
    if (steps.length >= LIMITS.maxSteps) return;

    onChange([
      ...steps,
      {
        id: crypto.randomUUID(),
        title: "",
        instruction: "",
        helpText: "",
        icon: "list-checks",
      },
    ]);

    setNotice("Kartu baru ditambahkan. Isi instruksi utamanya.");
  }

  return (
    <div className="mt-5">
      <p className="text-sm leading-relaxed">
        Buka “Edit isi kartu” untuk mengubah teks, bantuan, atau ikon.
      </p>

      <ol className="mt-4 space-y-6">
        {steps.map((step, index) => {
          const errors = validation.errors[index] ?? {};

          return (
            <li key={step.id}>
              <ActivityCard step={step} number={index + 1} />

              <details className="mt-2 rounded-xl border border-forest/20 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-forest">
                  Edit isi kartu {index + 1}
                </summary>

                <fieldset className="mt-5 space-y-4">
                  <legend className="sr-only">
                    Isi kartu {index + 1}
                  </legend>

                  {textFields.map((field) => {
                    const id = `${step.id}-${field.name}`;

                    return (
                      <div key={field.name}>
                        <label htmlFor={id} className="font-medium">
                          {field.label}
                        </label>

                        <textarea
                          id={id}
                          value={step[field.name]}
                          rows={field.name === "title" ? 1 : 2}
                          maxLength={field.limit}
                          required={field.name === "instruction"}
                          onChange={(event) =>
                            updateStep(
                              step.id,
                              field.name,
                              event.target.value,
                            )
                          }
                          aria-invalid={Boolean(errors[field.name])}
                          aria-describedby={
                            errors[field.name]
                              ? `${id}-error`
                              : undefined
                          }
                          className={inputClass}
                        />

                        {errors[field.name] && (
                          <p
                            id={`${id}-error`}
                            className="mt-2 text-sm text-red-800"
                          >
                            {errors[field.name]}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  <div>
                    <label
                      htmlFor={`${step.id}-icon`}
                      className="font-medium"
                    >
                      Ikon
                    </label>

                    <select
                      id={`${step.id}-icon`}
                      value={step.icon}
                      onChange={(event) =>
                        updateStep(step.id, "icon", event.target.value)
                      }
                      className={inputClass}
                    >
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon.id} value={icon.id}>
                          {icon.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </fieldset>
              </details>

              <div className="mt-3 flex flex-wrap gap-2">
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
                  disabled={index === steps.length - 1}
                  onClick={() => moveStep(index, 1)}
                  aria-label={`Pindahkan langkah ${index + 1} ke bawah`}
                  className={buttonClass}
                >
                  Turun
                </button>

                <button
                  type="button"
                  disabled={steps.length <= LIMITS.minSteps}
                  onClick={() => removeStep(step.id, index)}
                  aria-label={`Hapus langkah ${index + 1}`}
                  className={buttonClass}
                >
                  Hapus
                </button>
              </div>

              {Object.keys(errors).length > 0 && (
                <p className="mt-3 text-sm text-red-800">
                  Kartu ini perlu diperbaiki. Buka Edit isi kartu.
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        disabled={steps.length >= LIMITS.maxSteps}
        onClick={addStep}
        className={`${buttonClass} mt-6`}
      >
        Tambah Kartu ({steps.length}/{LIMITS.maxSteps})
      </button>

      {!validation.valid && (
        <p role="alert" className="mt-4 text-sm text-red-800">
          {validation.errors.general ??
            "Lengkapi instruksi utama pada kartu yang ditandai."}
        </p>
      )}

      <p role="status" className="mt-3 text-sm text-forest">
        {notice}
      </p>
    </div>
  );
}