import {
  Book,
  BookOpen,
  CircleCheck,
  ClipboardCheck,
  Eye,
  FileText,
  Image as ImageIcon,
  ListChecks,
  Palette,
  Pencil,
  Scissors,
} from "lucide-react";

const icons = {
  book: Book,
  "book-open": BookOpen,
  pencil: Pencil,
  palette: Palette,
  eye: Eye,
  scissors: Scissors,
  "check-circle": CircleCheck,
  "clipboard-check": ClipboardCheck,
  "file-text": FileText,
  image: ImageIcon,
  "list-checks": ListChecks,
};

export default function ActivityCard({ step, number }) {
  const Icon = icons[step.icon] ?? BookOpen;

  return (
    <article className="rounded-2xl border border-forest/20 bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sunshine font-bold">
          {number}
        </span>
        <h3 className="text-lg font-bold">{step.title}</h3>
      </div>

      <Icon
        aria-hidden="true"
        size={52}
        strokeWidth={1.7}
        className="my-5 text-forest"
      />

      <p className="text-xl leading-relaxed wrap-anywhere">
        {step.instruction}
      </p>

      {step.helpText && (
        <p className="mt-4 border-t border-forest/15 pt-4 text-sm leading-relaxed wrap-anywhere">
          <span className="font-semibold">Bantuan: </span>
          {step.helpText}
        </p>
      )}
    </article>
  );
}