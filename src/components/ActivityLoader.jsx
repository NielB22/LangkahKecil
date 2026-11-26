import { useState } from "react";
import { Link } from "react-router";
import { activityRepository } from "../features/activities/activityRepository.js";

export default function ActivityLoader({ id, children }) {
  function load() {
    try {
      return {
        activity: activityRepository.getActivity(id),
        error: null,
      };
    } catch (error) {
      return { activity: null, error: error.message };
    }
  }

  const [result, setResult] = useState(load);

  if (result.error || !result.activity) {
    return (
      <section className="py-10">
        <h1 className="text-3xl font-bold">
          {result.error
            ? "Aktivitas belum dapat dibuka"
            : "Aktivitas tidak ditemukan"}
        </h1>

        <p role="alert" className="mt-4 leading-relaxed">
          {result.error ??
            "Aktivitas mungkin sudah dihapus atau tersimpan di browser lain."}
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => setResult(load())}
            className="min-h-11 rounded-lg border border-forest/30 px-4 py-2"
          >
            Coba Lagi
          </button>

          <Link
            to="/activities"
            className="inline-flex min-h-11 items-center text-forest underline"
          >
            Kembali ke Aktivitas Saya
          </Link>
        </div>
      </section>
    );
  }

  return children(result.activity);
}