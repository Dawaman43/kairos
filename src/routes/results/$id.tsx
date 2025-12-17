import ResultsDetail from '@/components/ResultsDetail';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/results/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return <ResultsDetail id={id} />;
}
