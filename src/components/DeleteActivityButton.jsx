import { useState } from "react";
import { activityRepository } from "../features/activities/activityRepository.js";

export default function DeleteActivityButton({ activity, onDeleted }) {
  const [error, setError] = useState("");

  function handleDelete() {
    if (!window.confirm(`Hapus aktivitas "${activity.title}"?`)) return;

    setError("");
    let deleted;

    try {
      deleted = activityRepository.deleteActivity(activity.id);
    } catch (error) {
      setError(error.message || "Aktivitas belum berhasil dihapus.");
      return;
    }

    onDeleted(deleted);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        aria-label={`Hapus aktivitas ${activity.title}`}
        className="min-h-11 rounded-lg border border-red-200 px-4 py-2 font-semibold text-red-800 hover:bg-red-50"
      >
        Hapus
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}