import ResultsDetail from '@/components/ResultsDetail';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/results/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  if (!id) return <div className="flex items-center justify-center h-svh bg-[#010101] text-zinc-100">Invalid ID</div>;

  return <ResultsDetail movieId={id} />;
}
