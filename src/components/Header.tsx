export default function Header() {
  return (
    <div className='flex w-full flex-col gap-3 bg-gradient-to-r from-black via-black to-green-600 text-center text-white pb-3 px-2 min-h-[220px]'>
      <div className='mx-auto flex items-center gap-15 pt-5'>
        <div className='h-30 w-30 rounded-full border-4 border-green-400 shadow-[0_0_20px_5px_rgba(0,255,128,0.7)]'>
          <img src="https://www.pngplay.com/wp-content/uploads/13/Rick-And-Monty-Background-PNG.png" alt="Rick and Morty Logo" className="w-full h-full rounded-full" />
        </div>
        <h2 className='font-bold text-base sm:text-lg font-luckiest drop-shadow-[0_2px_8px_rgba(0,255,128,0.7)]'>Rick & Morty Episode Manager</h2>
      </div>

      <h1 className='text-3xl sm:text-5xl font-bold font-luckiest animate-pulse text-green-300 drop-shadow-[0_2px_16px_rgba(0,255,128,0.8)]'>Episode Collection</h1>

      <p className='text-sm sm:text-lg'>
        Explore all episodes of Rick and Morty. Mark your favorites, track what you've watched,
        and discover the characters in each episode.
      </p>
    </div>
  )
}
