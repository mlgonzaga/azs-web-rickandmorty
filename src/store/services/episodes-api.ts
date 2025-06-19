import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Episode } from '@/interfaces/episodes'

const GET_EPISODES = `
  query GetEpisodes($page: Int) {
    episodes(page: $page) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        air_date
        episode
        characters {
          id
          name
          status
          species
          image
        }
      }
    }
  }
`

export const episodesApi = createApi({
  reducerPath: 'episodesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
    },
  }),
  tagTypes: ['Episodes'],
  endpoints: (builder) => ({
    getEpisodes: builder.query<{
      data: {
        episodes: {
          info: {
            count: number
            pages: number
            next: number | null
            prev: number | null
          }
          results: Episode[]
        }
      }
    }, number>({
      query: (page) => ({
        url: '',
        method: 'POST',
        body: {
          query: GET_EPISODES,
          variables: { page },
        },
      }),
      providesTags: (result, page) => 
        result?.data?.episodes?.results 
          ? [
              ...result.data.episodes.results.map(({ id }) => ({ type: 'Episodes' as const, id })),
              { type: 'Episodes', id: `page-${page}` }
            ]
          : [{ type: 'Episodes', id: `page-${page}` }],
    }),
  }),
})

export const { useGetEpisodesQuery } = episodesApi 