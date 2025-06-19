import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Heart, Users, Calendar, Play } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { updateEpisode } from '@/store/slices/episodeSlice'
import { toast } from 'sonner'
import type { Episode } from '@/interfaces/episodes'
import { useAppSelector } from '@/store'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface EpisodeProps {
    episode: Episode
    onShowDetails?: () => void
}

export default function CardEpisode({ episode, onShowDetails }: EpisodeProps) {
    const dispatch = useDispatch()
    const [showCharactersModal, setShowCharactersModal] = useState(false)
    const episodeData = useAppSelector((state) => state.episodes.episodeData[episode.id])

    const isWatched = episodeData?.watched || false
    const isFavorite = episodeData?.favorite || false

    const handleToggleWatched = () => {
        dispatch(
            updateEpisode({
                id: episode.id,
                watched: !isWatched,
            })
        )
        if (!isWatched) {
            toast.success('Episode marked as watched')
        } else {
            toast.success('Episode removed from watched')
        }
    }

    const handleToggleFavorite = () => {
        dispatch(
            updateEpisode({
                id: episode.id,
                favorite: !isFavorite,
            })
        )
        if (!isFavorite) {
            toast.success('Episode added to favorites')
        } else {
            toast.success('Episode removed from favorites')
        }
    }

    const formatAirDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
        } catch {
            return dateString
        }
    }

    // Criar collage de imagens dos personagens principais
    const getEpisodeImage = () => {
        if (episode.characters.length === 0) {
            return '/episode-placeholder.svg'
        }

        // Criar um hash simples baseado no nome do episódio para seleção consistente
        const hash = episode.name.split('').reduce((acc, char) => {
            return acc + char.charCodeAt(0)
        }, 0)

        // Usar o hash para selecionar um personagem diferente
        const characterIndex = Math.abs(hash) % episode.characters.length
        const selectedCharacter = episode.characters[characterIndex]

        if (!selectedCharacter) {
            return '/episode-placeholder.svg'
        }

        return selectedCharacter.image
    }

    const episodeImage = getEpisodeImage()

    // Criar miniaturas dos personagens para o collage
    const characterThumbnails = episode.characters.slice(0, 4)
    const remainingCharacters = episode.characters.slice(4)

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'alive':
                return 'bg-green-500'
            case 'dead':
                return 'bg-red-500'
            case 'unknown':
                return 'bg-gray-500'
            default:
                return 'bg-gray-500'
        }
    }

    return (
        <>
            <Card className='min-w-[300px] sm:w-full w-full rounded-2xl hover:shadow-lg transition-shadow overflow-hidden flex flex-col'>
                {/* Episode Image */}
                <div className="relative group">
                    <img
                        src={episodeImage}
                        alt={`${episode.name} episode`}
                        className='w-full h-48 object-cover'
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <p className="text-white text-center px-4 font-medium">{episode.name}</p>
                    </div>

                    {/* Character thumbnails overlay */}
                    {characterThumbnails.length > 1 && (
                        <div className="absolute bottom-2 left-2 flex gap-1">
                            {characterThumbnails.slice(1, 4).map((character) => (
                                <img
                                    key={character.id}
                                    src={character.image}
                                    alt={character.name}
                                    className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                                    title={character.name}
                                />
                            ))}
                        </div>
                    )}

                    <div className="absolute top-2 right-2 flex gap-2">
                        {isFavorite && (
                            <div className="bg-red-500 rounded-full p-1">
                                <Heart className="h-4 w-4 text-white" />
                            </div>
                        )}
                        {isWatched && (
                            <div className="bg-green-500 rounded-full p-1">
                                <Eye className="h-4 w-4 text-white" />
                            </div>
                        )}
                    </div>
                </div>

                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Play className="h-5 w-5 text-green-500" />
                            <CardTitle className="text-lg">{episode.episode}</CardTitle>
                        </div>
                    </div>
                    <CardTitle className="text-xl font-bold line-clamp-2">{episode.name}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatAirDate(episode.air_date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{episode.characters.length} characters</span>
                        </div>
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-2">
                        {characterThumbnails.map((character) => (
                            <div key={character.id} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                                <img
                                    src={character.image}
                                    alt={character.name}
                                    className="w-6 h-6 rounded-full"
                                />
                                <span className="text-xs font-medium">{character.name}</span>
                            </div>
                        ))}
                        {remainingCharacters.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full px-3 py-1 h-auto text-xs"
                                onClick={() => setShowCharactersModal(true)}
                            >
                                +{remainingCharacters.length} more
                            </Button>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col justify-center gap-2 mt-auto w-full">
                    <Button
                        variant={isWatched ? "default" : "outline"}
                        size="sm"
                        onClick={handleToggleWatched}
                        className='w-2/3'
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        {isWatched ? "Watched" : "Mark as Watched"}
                    </Button>
                    <Button
                        variant={isFavorite ? "default" : "outline"}
                        size="sm"
                        onClick={handleToggleFavorite}
                        className='w-2/3'
                    >
                        <Heart className="h-4 w-4 mr-2" />
                        {isFavorite ? "Favorited" : "Favorite"}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onShowDetails}
                        className='w-2/3'

                    >
                        Details
                    </Button>
                </CardFooter>
            </Card>

            {/* Characters Modal */}
            <Dialog open={showCharactersModal} onOpenChange={setShowCharactersModal}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className='text-sm'>All Characters in &quot;{episode.name}&quot;</DialogTitle>
                        <DialogDescription>
                            {episode.characters.length} characters appear in this episode
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {episode.characters.map((character) => (
                            <div key={character.id} className="flex flex-col  items-center gap-3 p-3 border rounded-lg">
                                <img
                                    src={character.image}
                                    alt={character.name}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div className='p-3'>
                                    <p className="font-medium text-sm break-all">{character.name}</p>
                                    <p className="text-xs text-gray-600 break-all">{character.species}</p>
                                    <div className="flex items-center gap-1">
                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(character.status)}`}></div>
                                        <span className="text-xs text-gray-500">
                                            {character.status === "Alive" ? "Vivo" :
                                                character.status === "Dead" ? "Morto" :
                                                    "Sem Status"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
} 