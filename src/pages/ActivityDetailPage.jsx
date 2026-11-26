import { Link, useLocation, useNavigate, useParams } from "react-router";
import ActivityCard from "../components/ActivityCard.jsx";
import ActivityLoader from "../components/ActivityLoader.jsx";
import DeleteActivityButton from "../components/DeleteActivityButton.jsx";
import { ACTIVITY_TYPES } from "../features/activities/activityTypes.js";

export default function ActivityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ActivityLoader key={id} id={id}>
      {(activity) => {
        const category = ACTIVITY_TYPES.find(
          (item) => item.id === activity.type,
        );
        const path = `/activities/${encodeURIComponent(activity.id)}`;

        return (
          <section className="py-10">
            <Link
              to="/activities"
              className="inline-flex min-h-11 items-center text-forest underline"
            >
              Kembali ke Aktivitas Saya
            </Link>

            {location.state?.saved && (
              <p
                role="status"
                className="mt-4 rounded-xl bg-white p-4 text-forest"
              >
                Aktivitas berhasil disimpan.
              </p>
            )}

            <p className="mt-6 text-sm font-semibold text-forest">
              {category?.label}
            </p>
            <h1 className="mt-2 text-3xl font-bold wrap-anywhere">
              {activity.title}
            </h1>
            <p className="mt-3">{activity.steps.length} kartu aktivitas</p>

            <div className="mt-6 flex flex-wrap items-start gap-3">
              <Link
                to={`${path}/edit`}
                className="inline-flex min-h-11 items-center rounded-lg bg-forest px-5 py-2 font-semibold text-white"
              >
                Edit Aktivitas
              </Link>
              <DeleteActivityButton
                activity={activity}
                onDeleted={() => navigate("/activities", { replace: true })}
              />
            </div>

            <ol className="mt-8 grid gap-5 md:grid-cols-2">
              {activity.steps.map((step, index) => (
                <li key={step.id} className="min-w-0">
                  <ActivityCard step={step} number={index + 1} />
                </li>
              ))}
            </ol>
          </section>
        );
      }}
    </ActivityLoader>
  );
}