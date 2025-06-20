import { useAppDispatch, useAppSelector } from '@/store'
import { setPageEpisodes, setLoading, setError, initializePage } from '@/store/slices/episodeSlice'
import { useEffect, useState } from 'react'
import { Skeleton } from './ui/skeleton'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Search, Heart, Eye, Play } from 'lucide-react'
import { setShowFavorites, setShowWatched } from '@/store/slices/episodeSlice'
import type { Episode } from '@/interfaces/episodes'
import PaginationComponent from './PaginationComponent'
import CardEpisode from './CardEpisode'
import { useGetEpisodesQuery } from '@/store/services/episodes-api'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from './ui/dialog'

import { useNavigate } from 'react-router-dom'
import { setCurrentPage as setCurrentPageGlobal } from '@/store/slices/pageSlice'
import { useFormatAirDate } from '@/hooks/useFormatAirDate'
import ErrorMessage from './ui/ErrorMessage'


export default function EpisodesSection() {
    const dispatch = useAppDispatch()
    const {
        episodeData = {},
        currentPageEpisodes = [],
        showFavorites = false,
        showWatched = false,
        pagination = { loadedPages: {}, currentPage: 1, totalPages: 1, totalEpisodes: 0, hasNextPage: false, hasPrevPage: false }
    } = useAppSelector((state) => state.episodes || {})
    const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null)
    const [localSearchTerm, setLocalSearchTerm] = useState('')
    const navigate = useNavigate();
    const formatAirDate = useFormatAirDate();




    const pageGlobal = useAppSelector((state) => state.page?.currentPage ?? 1)

    let initialPage = pageGlobal


    // Inicializar página do localStorage na primeira carga
    useEffect(() => {
        // Se a página inicial do parâmetro for diferente da do redux global, atualiza
        if (pageGlobal !== initialPage) {
            dispatch(setCurrentPageGlobal(initialPage));
        }
        // Só limpa se não houver episódios carregados para a página
        const pageEpisodeIds = pagination.loadedPages[initialPage];
        if (!pageEpisodeIds || pageEpisodeIds.length === 0) {
            dispatch(initializePage());
        }
    }, [dispatch, initialPage, pageGlobal]);

    // Reconstruir episódios da página atual se ela está em cache
    useEffect(() => {
        if (currentPageEpisodes.length === 0) {
            const pageEpisodeIds = pagination.loadedPages[pagination.currentPage]
            if (Array.isArray(pageEpisodeIds)) {
                // Se são IDs (vindos do localStorage), reconstruir episódios
                const reconstructedEpisodes = pageEpisodeIds
                    .map(id => episodeData[id])
                    .filter(Boolean) as Episode[]

                if (reconstructedEpisodes.length > 0) {
                    dispatch(setPageEpisodes({
                        episodes: reconstructedEpisodes,
                        info: {
                            count: pagination.totalEpisodes,
                            pages: pagination.totalPages,
                            next: pagination.hasNextPage ? pagination.currentPage + 1 : null,
                            prev: pagination.hasPrevPage ? pagination.currentPage - 1 : null
                        },
                        page: pagination.currentPage
                    }))
                }
            }
        }
    }, [pagination.currentPage, currentPageEpisodes.length, episodeData, pagination, dispatch])

    // Requisição API Graphql

    const { data, isLoading, error } = useGetEpisodesQuery(pageGlobal, {
        selectFromResult: ({ data, isLoading, error }) => {
            return {
                data: data || null,
                isLoading,
                error,
            }
        },
    })

    // Atualizar loading apenas se não for página em cache
    useEffect(() => {
        if (!isLoading) {
            dispatch(setLoading(isLoading))
        }
    }, [isLoading, dispatch])

    // Processar dados da API ou do localStorage
    useEffect(() => {
        // Primeiro tenta pegar do localStorage
        const localKey = `episodes_page_${pageGlobal}`;
        const stored = localStorage.getItem(localKey);
        if (stored) {
            try {
                const episodes = JSON.parse(stored);
                if (Array.isArray(episodes) && episodes.length > 0) {
                    dispatch(setPageEpisodes({
                        episodes,
                        info: {
                            count: pagination.totalEpisodes,
                            pages: pagination.totalPages,
                            next: pagination.hasNextPage ? pageGlobal + 1 : null,
                            prev: pagination.hasPrevPage ? pageGlobal - 1 : null
                        },
                        page: pageGlobal
                    }));
                    return; // Não processa a API
                }
            } catch { }
        }
        // Se não tem no localStorage, processa a resposta da API normalmente
        if (error) {
            dispatch(setError('An error occurred while fetching episodes'))
            return
        }
        if (data?.data?.episodes && !isLoading) {
            const payload = {
                episodes: data.data.episodes.results,
                info: data.data.episodes.info,
                page: pageGlobal
            }
            dispatch(setPageEpisodes(payload))
        }
    }, [data, error, dispatch, pageGlobal, isLoading])

    const handleSearch = (value: string) => {
        setLocalSearchTerm(value)
    }

    const handleShowFavorites = () => {
        dispatch(setShowFavorites(!showFavorites))
    }

    const handleShowWatched = () => {
        dispatch(setShowWatched(!showWatched))
    }



    const handlePageChange = (newPage: number) => {
        // Atualiza o parâmetro na URL
        navigate(`/?page=${newPage}`);
        dispatch(setCurrentPageGlobal(newPage));
    }

    // Filtrar episódios baseado no contexto
    const getFilteredEpisodes = () => {
        // Se há filtros ativos, usar todos os episódios em cache
        if (showFavorites || showWatched || localSearchTerm) {
            return Object.values(episodeData).filter((episode) => {
                const matchesSearch = episode.name.toLowerCase().includes(localSearchTerm.toLowerCase())
                const matchesFavorites = !showFavorites || episode.favorite
                const matchesWatched = !showWatched || episode.watched
                return matchesSearch && matchesFavorites && matchesWatched
            })
        }

        // Senão, usar apenas episódios da página atual
        return currentPageEpisodes
    }

    const filteredEpisodes = getFilteredEpisodes()

    // Componente para mensagem de estado vazio
    const EmptyState = ({ message, icon }: { message: string; icon: React.ReactNode }) => (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="text-gray-400 mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum episódio encontrado</h3>
            <p className="text-gray-500 max-w-md">{message}</p>
        </div>
    )

    // Determinar mensagem baseada nos filtros ativos
    const getEmptyStateMessage = () => {
        if (showFavorites && showWatched) {
            return "Você ainda não marcou nenhum episódio como favorito e visto."
        }
        if (showFavorites) {
            return "Você ainda não marcou nenhum episódio como favorito."
        }
        if (showWatched) {
            return "Você ainda não marcou nenhum episódio como visto."
        }
        if (localSearchTerm) {
            return `Nenhum episódio encontrado para "${localSearchTerm}". Tente buscar por outro termo.`
        }
        return "Nenhum episódio disponível no momento."
    }

    const getEmptyStateIcon = () => {
        if (showFavorites) return <Heart className="h-16 w-16" />
        if (showWatched) return <Eye className="h-16 w-16" />
        if (localSearchTerm) return <Search className="h-16 w-16" />
        return <Play className="h-16 w-16" />
    }

    // Loading apenas no primeiro carregamento
    if (isLoading && Object.keys(episodeData).length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search episodes..."
                            className="pl-10 w-full h-9 rounded-md border px-3 py-1"
                            value={localSearchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" disabled>
                            <Heart className="h-4 w-4 mr-2" />
                            Favorites
                        </Button>
                        <Button variant="outline" disabled>
                            <Eye className="h-4 w-4 mr-2" />
                            Watched
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="min-w-[280px] sm:w-full w-full rounded-2xl border">
                            <div className="p-6 space-y-4">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return <ErrorMessage message="Ocorreu um erro ao buscar episódios." />
    }

    return (
        <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Buscar episódio..."
                        value={localSearchTerm}
                        onChange={e => setLocalSearchTerm(e.target.value)}
                        className="w-full h-9 rounded-md border px-3 py-1"
                        style={{ paddingLeft: 40 }}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={showFavorites ? "default" : "outline"}
                        onClick={handleShowFavorites}
                        className="flex items-center gap-2"
                    >
                        <Heart className="h-4 w-4 mr-2" />
                        <span className="inline">Favorites</span>
                    </Button>
                    <Button
                        variant={showWatched ? "default" : "outline"}
                        onClick={handleShowWatched}
                        className="flex items-center gap-2"
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        <span className="inline">Watched</span>
                    </Button>
                </div>
            </div>

            {/* Episodes Info */}
            {!showFavorites && !showWatched && !localSearchTerm && (
                <div className="text-center text-gray-600">
                   
                    {isLoading && !isLoading && (
                        <p className="text-sm text-blue-600 mt-1">Carregando página {pagination.currentPage}...</p>
                    )}
                </div>
            )}

            {/* Episodes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEpisodes.map((episode) => (
                    <CardEpisode
                        key={episode.id}
                        episode={episode}
                        onShowDetails={() => setSelectedEpisode(episode)}
                    />
                ))}
            </div>

            {/* Empty State Message */}
            {filteredEpisodes.length === 0 && !isLoading && (
                <EmptyState message={getEmptyStateMessage()} icon={getEmptyStateIcon()} />
            )}

            {/* Pagination */}
            {!showFavorites && !showWatched && !localSearchTerm && (
                <div className='flex w-full justify-center items-center '>
                    <PaginationComponent
                        pagination={{
                            ...pagination,
                            currentPage: pageGlobal,
                            loadedPages: Object.fromEntries(
                                Object.entries(pagination.loadedPages).map(([page, ids]) => [
                                    page,
                                    ids.map(id => episodeData[id]).filter(Boolean) as Episode[]
                                ])
                            )
                        }}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* Episode Details Modal */}
            {selectedEpisode && (
                <Dialog open={!!selectedEpisode} onOpenChange={open => !open && setSelectedEpisode(null)}>
                    <DialogContent className="bg-white rounded-lg  max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <DialogHeader>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <DialogTitle className="text-2xl font-bold">{selectedEpisode.name}</DialogTitle>
                                        <DialogDescription>
                                            <p className="text-gray-600">{selectedEpisode.episode}</p>
                                            <p className="text-sm text-gray-500">Air Date: {formatAirDate(selectedEpisode.air_date)}</p>
                                        </DialogDescription>
                                    </div>

                                </div>
                            </DialogHeader>
                            <div className="break-all">
                                <h3 className="text-lg font-semibold mb-3">Characters ({selectedEpisode.characters.length})</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {selectedEpisode.characters.map((character) => (
                                        <div key={character.id} className="flex flex-col items-center gap-3 p-3 justify-center border rounded-lg">
                                            <img
                                                src={character.image}
                                                alt={character.name}
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <div className='break-all'>
                                                <p className="font-medium text-gray-600 break-all text-center" title={character.name}>{character.name}</p>
                                                <p className="text-sm text-gray-600 text-center">{character.species}</p>
                                                <div className="flex items-center justify-center gap-1 ">
                                                    <div className={`w-2 h-2 rounded-full ${character.status === 'Alive' ? 'bg-green-500' :
                                                        character.status === 'Dead' ? 'bg-red-500' : 'bg-gray-500'
                                                        }`}></div>
                                                    <span className="text-xs text-gray-500 text-center">{character.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}