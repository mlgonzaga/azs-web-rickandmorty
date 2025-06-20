import { format } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'

export function useFormatAirDate() {
  return (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd, MMMM yyyy', { locale: enUS })
    } catch {
      return dateString
    }
  }
} 