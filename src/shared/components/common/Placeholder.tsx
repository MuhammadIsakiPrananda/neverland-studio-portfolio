/**
 * Placeholder component for under construction pages
 */
interface PlaceholderProps {
  title: string;
  description?: string;
}

export const Placeholder = ({
  title,
  description = "This page is under construction.",
}: PlaceholderProps) => (
  <div className="flex min-h-screen items-center justify-center p-6">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
      <p className="text-slate-400">{description}</p>
    </div>
  </div>
);
