import { useState } from "react";
import { Link } from "react-router";
import DeleteActivityButton from "../components/DeleteActivityButton.jsx";
import { activityRepository } from "../features/activities/activityRepository.js";
import { ACTIVITY_TYPES } from "../features/activities/activityTypes.js";

function loadActivities() {
  try {
    return {
      activities: activityRepository.listActivities(),
      error: null,
    };
  } catch (error) {
    return { activities: [], error: error.message };
  }
}

export default function ActivitiesPage() {
  const [result, setResult] = useState(loadActivities);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  const filtered = result.activities.filter((activity) =>
    activity.title
      .toLocaleLowerCase("id-ID")
      .includes(query.trim().toLocaleLowerCase("id-ID")),
  );

  function afterDelete(deleted) {
    setResult(loadActivities());
    setNotice(
      deleted
        ? "Aktivitas dihapus."
        : "Aktivitas tersebut sudah tidak tersedia.",
    );
  }

  return (
    <section className="py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Aktivitas Saya</h1>
        <Link
          to="/activities/new"
          className="inline-flex min-h-12 items-center rounded-xl bg-forest px-5 py-3 font-semibold text-white"
        >
          Buat Aktivitas
        </Link>
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed">
        Aktivitas tersimpan di browser ini. Data tidak otomatis
        tersinkron antarperangkat dan dapat hilang jika data situs dihapus.
      </p>

      <p role="status" className="mt-4 text-forest">
        {notice}
      </p>

      {result.error ? (
        <div className="mt-6 rounded-xl bg-red-50 p-5">
          <p role="alert" className="text-red-800">
            {result.error}
          </p>
          <button
            type="button"
            onClick={() => setResult(loadActivities())}
            className="mt-4 min-h-11 rounded-lg border px-4 py-2"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <>
          <div className="mt-6">
            <label htmlFor="activity-search" className="font-semibold">
              Cari judul aktivitas
            </label>
            <input
              id="activity-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="mt-2 block min-h-12 w-full rounded-xl border border-forest/30 bg-white px-4 py-3"
            />
          </div>

          {result.activities.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-white p-8">
              <h2 className="text-xl font-bold">Belum ada aktivitas</h2>
              <p className="mt-3 leading-relaxed">
                Buat kartu kegiatan pertama, lalu simpan untuk
                digunakan kembali.
              </p>
              <Link
                to="/activities/new"
                className="mt-4 inline-flex min-h-11 items-center text-forest underline"
              >
                Buat aktivitas pertama
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <p role="status" className="mt-8">
              Tidak ada aktivitas yang cocok dengan pencarian.
            </p>
          ) : (
            <ul className="mt-8 grid gap-5 md:grid-cols-2">
              {filtered.map((activity) => {
                const path =
                  `/activities/${encodeURIComponent(activity.id)}`;
                const category = ACTIVITY_TYPES.find(
                  (item) => item.id === activity.type,
                );

                return (
                  <li
                    key={activity.id}
                    className="min-w-0 rounded-2xl border border-forest/20 bg-white p-6"
                  >
                    <p className="text-sm text-forest">
                      {category?.label}
                    </p>
                    <h2 className="mt-2 text-xl font-bold wrap-anywhere">
                      <Link to={path} className="hover:underline">
                        {activity.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-sm">
                      {activity.steps.length} kartu · Diperbarui{" "}
                      <time dateTime={activity.updatedAt}>
                        {new Date(activity.updatedAt).toLocaleString("id-ID")}
                      </time>
                    </p>

                    <div className="mt-5 flex flex-wrap items-start gap-3">
                      <Link
                        to={path}
                        className="inline-flex min-h-11 items-center rounded-lg bg-forest px-4 py-2 font-semibold text-white"
                      >
                        Buka
                      </Link>
                      <Link
                        to={`${path}/edit`}
                        className="inline-flex min-h-11 items-center rounded-lg border border-forest/30 px-4 py-2 font-semibold text-forest"
                      >
                        Edit
                      </Link>
                      <DeleteActivityButton
                        activity={activity}
                        onDeleted={afterDelete}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </section>
  );
}