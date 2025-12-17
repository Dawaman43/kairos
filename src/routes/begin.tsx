import BeginPage from '@/components/Begin'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/begin')({
  component: BeginPage,
})

