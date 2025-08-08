import { Header } from './Header'
import { Footer } from './Footer'

interface BaseLayoutProps {
  children: React.ReactNode
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
} 