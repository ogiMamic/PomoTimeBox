import Timebox from '@/components/timebox'
import { Toaster } from 'sonner'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <Timebox />
      <Toaster />
    </main>
  )
}