import { useNavigate, useParams } from "react-router";
import ActivityLoader from "../components/ActivityLoader.jsx";
import ActivityBuilderPage from "./ActivityBuilderPage.jsx";

export default function ActivityEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <ActivityLoader key={id} id={id}>
      {(activity) => (
        <ActivityBuilderPage
          key={activity.id}
          initialActivity={activity}
          onSaved={(saved) =>
            navigate(
              `/activities/${encodeURIComponent(saved.id)}`,
              { replace: true, state: { saved: true } },
            )
          }
        />
      )}
    </ActivityLoader>
  );
}