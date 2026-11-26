import { useState } from "react";
import ActivityCard from "../components/ActivityCard.jsx";
import {
  createInitialFormData,
  getFormConfig,
} from "../features/activities/formConfigs.js";
import { generateActivity } from "../features/activities/generators.js";
import { LIMITS } from "../features/activities/models.js";
import { validateBuilderInput } from "../features/activities/validators.js";
import { ACTIVITY_TYPES } from "../features/activities/activityTypes.js";
import StepListEditor from "../components/StepListEditor.jsx";
import { activityRepository } from "../features/activities/activityRepository.js";

const inputClass =
  "mt-2 block min-h-12 w-full rounded-xl border border-forest/30 bg-white px-4 py-3";

export default function ActivityBuilderPage({  
  initialActivity = null,
  onSaved,
}) {

  const [type, setType] = useState(
    () => initialActivity?.type ?? "book",
  );
  const fields = getFormConfig(type);
  const selectedType = ACTIVITY_TYPES.find((item) => item.id === type);

  const [title, setTitle] = useState(
    () => initialActivity?.title ?? "",
  );
  const [formData, setFormData] = useState(() =>
    initialActivity
      ? { ...initialActivity.formData }
      : createInitialFormData("book"),
  );

  const [errors, setErrors] = useState({});
  const [activity, setActivity] = useState(() =>
    initialActivity ? structuredClone(initialActivity) : null,
  );
  const [isStale, setIsStale] = useState(false);

  const [savedId, setSavedId] = useState(
    () => initialActivity?.id ?? null,
  );
  const [saveFeedback, setSaveFeedback] = useState(null);

  function clearError(name) {
    setErrors((current) => ({
      ...current,
      [name]: undefined,
      general: undefined,
    }));
  }

  function updateField(event) {
    setSaveFeedback(null);
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    clearError(name);
    setIsStale(true);
  }

  function handleGenerate(event) {
    setSaveFeedback(null);
    event.preventDefault();

    const result = validateBuilderInput(type, title, formData);

    if (!result.valid) {
      setErrors(result.errors);
      const firstField = Object.keys(result.errors)[0];
      event.currentTarget.elements.namedItem(firstField)?.focus();
      return;
    }

    if (
      activity &&
      !window.confirm(
        "Perbarui kartu dari formulir? Semua perubahan manual pada kartu akan diganti.",
      )
    ) {
      return;
    }

    try {
      const generated = generateActivity(result.data);
      setActivity(generated);
      setTitle(generated.title);
      setFormData(generated.formData);
      setErrors({});
      setIsStale(false);
    } catch (error) {
      setErrors(
        error.fieldErrors ?? {
          general: "Kartu belum berhasil dibuat. Silakan coba lagi.",
        },
      );
    }
  }

  function changeType(nextType) {
  if (nextType === type) return;

  const initial = createInitialFormData(type);
  const hasChanges =
    activity ||
    title.trim() ||
    Object.entries(formData).some(
      ([key, value]) => value !== initial[key],
    );

  if (
    hasChanges &&
    !window.confirm(
      "Ganti jenis aktivitas? Isian dan kartu saat ini akan dihapus.",
    )
  ) {
    return;
  }

  setSavedId(initialActivity?.id ?? null);
  setSaveFeedback(null);

  setType(nextType);
  setTitle("");
  setFormData(createInitialFormData(nextType));
  setActivity(null);
  setErrors({});
  setIsStale(false);
}

function updateSteps(steps) {
  setSaveFeedback(null);
  setActivity((current) => ({
    ...current,
    steps,
    updatedAt: new Date().toISOString(),
  }));
}

function handleSave() {
  setSaveFeedback(null);

  if (!activity) return;

  const form = validateBuilderInput(type, title, formData);

  if (!form.valid) {
    setErrors(form.errors);
    setSaveFeedback({
      type: "error",
      message: "Periksa isian formulir sebelum menyimpan.",
    });
    return;
  }

  if (
    isStale &&
    !window.confirm(
      "Formulir berubah sejak kartu dibuat. Simpan kartu persis seperti di editor, tanpa membuat ulang?",
    )
  ) {
    return;
  }

  const input = {
    ...form.data,
    steps: activity.steps,
  };

  try {
    const saved = savedId
      ? activityRepository.updateActivity(savedId, input)
      : activityRepository.createActivity(input);

    setActivity(saved);
    setSavedId(saved.id);
    setSaveFeedback({
      type: "success",
      message: "Aktivitas berhasil disimpan di browser ini.",
    });
    onSaved?.(saved);
  } catch (error) {
    setSaveFeedback({
      type: "error",
      message: error.message || "Aktivitas belum berhasil disimpan.",
    });
  }
}

  return (
    <section className="py-10">
      <p className="text-sm font-semibold text-forest">
        {selectedType.label}
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        {initialActivity ? "Edit aktivitas" : "Buat kartu aktivitas"}
      </h1>

      <p className="mt-4 max-w-2xl leading-relaxed text-ink/80">
        {selectedType.description} Jangan sertakan informasi pribadi anak.
      </p>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">

        <fieldset className="mt-8">
          <legend className="font-semibold">Jenis aktivitas</legend>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {ACTIVITY_TYPES.map((item) => (
              <label
                key={item.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                  type === item.id
                    ? "border-forest bg-white"
                    : "border-forest/20"
                }`}
              >
                <input
                  type="radio"
                  name="activityType"
                  value={item.id}
                  checked={type === item.id}
                  onChange={() => changeType(item.id)}
                  className="mt-1 size-5 shrink-0 accent-forest"
                />

                <span>
                  <span className="block font-semibold">{item.label}</span>
                  <span className="mt-1 block text-sm leading-relaxed">
                    {item.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <form
          noValidate
          onSubmit={handleGenerate}
          className="space-y-5 rounded-2xl border border-forest/15 bg-white p-6"
        >
          <div>
            <label htmlFor="title" className="font-semibold">
              Judul aktivitas
            </label>
            <input
              id="title"
              name="title"
              required
              maxLength={LIMITS.activityTitle}
              value={title}
              onChange={(event) => {
                const nextTitle = event.target.value;
              
                setTitle(nextTitle);
                setActivity((current) =>
                  current ? { ...current, title: nextTitle } : current,
                );
                clearError("title");
                setSaveFeedback(null);
              }}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "title-error" : undefined}
              className={inputClass}
              placeholder="Contoh: Latihan Matematika"
            />
            {errors.title && (
              <p id="title-error" className="mt-2 text-sm text-red-800">
                {errors.title}
              </p>
            )}
          </div>

          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="font-semibold">
                {field.label}
                {!field.required && " (opsional)"}
              </label>

              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  value={formData[field.name]}
                  onChange={updateField}
                  aria-invalid={Boolean(errors[field.name])}
                  aria-describedby={
                    errors[field.name] ? `${field.name}-error` : undefined
                  }
                  className={inputClass}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  required={field.required}
                  maxLength={field.maxLength}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={updateField}
                  aria-invalid={Boolean(errors[field.name])}
                  aria-describedby={
                    errors[field.name] ? `${field.name}-error` : undefined
                  }
                  className={inputClass}
                />
              )}

              {errors[field.name] && (
                <p
                  id={`${field.name}-error`}
                  className="mt-2 text-sm text-red-800"
                >
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="min-h-12 rounded-xl bg-forest px-6 py-3 font-semibold text-white hover:bg-forest/90"
          >
            {activity ? "Perbarui dari Form" : "Buat Kartu Visual"}
          </button>

          {Object.values(errors).some(Boolean) && (
            <p role="alert" className="text-sm text-red-800">
              {errors.general ?? "Periksa isian yang ditandai."}
            </p>
          )}
        </form>

        <section aria-labelledby="preview-title" className="min-w-0">
          <h2 id="preview-title" className="text-xl font-bold">
            Pratinjau kartu
          </h2>

          <p role="status" className="mt-3 text-sm leading-relaxed">
            {!activity
              ? "Isi formulir lalu pilih Buat Kartu Visual."
              : isStale
                ? "Formulir berubah. Pilih Perbarui dari Form jika ingin mengganti kartu berdasarkan isian terbaru."
                : `${activity.steps.length} kartu berhasil dibuat. Periksa isinya sebelum digunakan.`}
          </p>

          {activity && (
            <>

              <p className="mt-4 font-semibold wrap-anywhere">
                {activity.title}
              </p>

              <StepListEditor
                steps={activity.steps}
                onChange={updateSteps}
              />

              <div className="mt-6 border-t border-forest/20 pt-6">
                <button
                  type="button"
                  onClick={handleSave}
                  className="min-h-12 rounded-xl bg-forest px-6 py-3 font-semibold text-white hover:bg-forest/90"
                >
                  {savedId ? "Simpan Perubahan" : "Simpan Aktivitas"}
                </button>

                {saveFeedback && (
                  <p
                    role={saveFeedback.type === "error" ? "alert" : "status"}
                    className={`mt-4 rounded-xl p-4 ${
                      saveFeedback.type === "error"
                        ? "bg-red-50 text-red-800"
                        : "bg-white text-forest"
                    }`}
                  >
                    {saveFeedback.message}
                  </p>
                )}

                <p className="mt-4 text-sm leading-relaxed text-ink/75">
                  Aktivitas tersimpan di browser ini. Data tidak otomatis tersinkron
                  antarperangkat dan dapat hilang jika data situs dihapus.
                </p>
              </div>

            </>
          )}
        </section>
      </div>
    </section>
  );
}