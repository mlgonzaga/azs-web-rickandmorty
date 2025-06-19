import Header from '@/components/Header'
import EpisodesSection from '@/components/EpisodesSection'

export default function Home() {
  return (
    <div className='flex flex-col w-full min-h-screen bg-black'>
      <Header />
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-5">
        <EpisodesSection />
      </div>
    </div>
  )
}
