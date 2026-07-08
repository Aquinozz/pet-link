/**
 * Interface para retorno de coordenadas
 */
export interface Coordinates {
  latitude: number
  longitude: number
}

const LOCATION_STORAGE_KEY = 'petlink_user_location'
const CEP_STORAGE_KEY = 'petlink_user_cep'

const CITY_COORDINATES: Record<string, Coordinates> = {
  salvador: { latitude: -12.9699, longitude: -38.5067 },
  recife: { latitude: -8.0476, longitude: -34.8770 },
  fortaleza: { latitude: -3.7319, longitude: -38.5267 },
  joaopessoa: { latitude: -7.1195, longitude: -34.8450 },
  aracaju: { latitude: -10.9472, longitude: -37.0766 },
  maceio: { latitude: -9.6498, longitude: -35.7089 },
  natal: { latitude: -5.7945, longitude: -35.2110 },
  belem: { latitude: -1.4558, longitude: -48.4898 },
  brasilia: { latitude: -15.8267, longitude: -47.9218 },
  saopaulo: { latitude: -23.5505, longitude: -46.6333 },
  riodejaneiro: { latitude: -22.9068, longitude: -43.1729 },
  'belo horizonte': { latitude: -19.9167, longitude: -43.9345 },
  portoalegre: { latitude: -30.0346, longitude: -51.2177 },
  curitiba: { latitude: -25.4296, longitude: -49.2713 },
  campinas: { latitude: -22.9056, longitude: -47.0608 },
}

const PRESTADOR_COORDINATES: Record<string, Coordinates> = {
  'salvador:cajazeiras': { latitude: -12.9556, longitude: -38.5300 },
  'salvador:pituba': { latitude: -12.9822, longitude: -38.4730 },
  'salvador:barra': { latitude: -13.0051, longitude: -38.3471 },
  'salvador': { latitude: -12.9699, longitude: -38.5067 },
}

const geocodeCache = new Map<string, Coordinates | null>()

const geocodeAddress = async (query: string): Promise<Coordinates | null> => {
  const cacheKey = query.trim().toLowerCase()
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey) ?? null
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&countrycodes=br&accept-language=pt-BR&q=${encodeURIComponent(query)}`,
      { headers: { 'Accept-Language': 'pt-BR' } }
    )

    if (!response.ok) {
      throw new Error('Geocodificação indisponível')
    }

    const data = await response.json() as Array<{ lat?: string; lon?: string }>
    const firstResult = data[0]

    if (!firstResult?.lat || !firstResult?.lon) {
      geocodeCache.set(cacheKey, null)
      return null
    }

    const coords = {
      latitude: Number(Number(firstResult.lat).toFixed(6)),
      longitude: Number(Number(firstResult.lon).toFixed(6)),
    }

    geocodeCache.set(cacheKey, coords)
    return coords
  } catch {
    geocodeCache.set(cacheKey, null)
    return null
  }
}

export const getStoredCoordinates = (): Coordinates | null => {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(LOCATION_STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Coordinates
    if (!parsed || typeof parsed.latitude !== 'number' || typeof parsed.longitude !== 'number') {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export const saveCoordinates = (coords: Coordinates): void => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(coords))
}

export const clearStoredCoordinates = (): void => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(LOCATION_STORAGE_KEY)
}

export const getStoredCep = (): string | null => {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(CEP_STORAGE_KEY)
}

export const saveCep = (cep: string): void => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CEP_STORAGE_KEY, cep)
}

export const clearStoredCep = (): void => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(CEP_STORAGE_KEY)
}

export const calculateDistanceKm = (from: Coordinates, to: Coordinates): number => {
  const earthRadiusKm = 6371
  const dLat = (to.latitude - from.latitude) * (Math.PI / 180)
  const dLon = (to.longitude - from.longitude) * (Math.PI / 180)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(from.latitude * (Math.PI / 180)) * Math.cos(to.latitude * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Number((earthRadiusKm * c).toFixed(2))
}

export const getCoordinatesFromCep = async (cep: string): Promise<Coordinates> => {
  const normalizedCep = cep.replace(/\D/g, '')

  if (normalizedCep.length !== 8) {
    throw new Error('Informe um CEP com 8 dígitos para calcular a distância.')
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${normalizedCep}/json/`)
    const data = await response.json() as { erro?: boolean; localidade?: string; uf?: string; bairro?: string; logradouro?: string }

    if (!response.ok || data.erro) {
      throw new Error('CEP não encontrado. Tente outro CEP.')
    }

    const addressParts = [data.logradouro, data.bairro, data.localidade, data.uf].filter(Boolean) as string[]
    const queries = [
      addressParts.join(', '),
      [data.logradouro, data.bairro, data.localidade].filter(Boolean).join(', '),
      [data.bairro, data.localidade, data.uf].filter(Boolean).join(', '),
      [data.localidade, data.uf].filter(Boolean).join(', '),
      normalizedCep,
    ]

    for (const query of queries) {
      const geocoded = await geocodeAddress(query)
      if (geocoded) {
        return geocoded
      }
    }

    const cityKey = `${(data.localidade ?? '').toLowerCase()}`
    const cityWithStateKey = `${(data.uf ?? '').toLowerCase()}:${cityKey}`
    const fallback = CITY_COORDINATES[cityKey] ?? CITY_COORDINATES[cityWithStateKey] ?? CITY_COORDINATES.salvador

    if (!fallback) {
      throw new Error('Não foi possível localizar esse CEP para calcular a distância.')
    }

    return fallback
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }

    throw new Error('Erro ao buscar o CEP informado.')
  }
}

export const getCoordinatesFromPrestador = (prestador: { cidade?: string; bairro?: string }): Coordinates | null => {
  const cityKey = (prestador.cidade ?? '').toLowerCase()
  const bairroKey = (prestador.bairro ?? '').toLowerCase()
  const directKey = `${cityKey}:${bairroKey}`

  if (PRESTADOR_COORDINATES[directKey]) {
    return PRESTADOR_COORDINATES[directKey]
  }

  if (PRESTADOR_COORDINATES[cityKey]) {
    return PRESTADOR_COORDINATES[cityKey]
  }

  if (CITY_COORDINATES[cityKey]) {
    return CITY_COORDINATES[cityKey]
  }

  return null
}

/**
 * Valida se as coordenadas estão dentro de um intervalo válido
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns boolean - true se válidas
 */
export const validateCoordinates = (lat?: number, lon?: number): boolean => {
  if (lat === undefined || lon === undefined) return true
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
}

/**
 * Converte erro de geolocalização para mensagem amigável
 * @param error - Erro da geolocalização
 * @returns Mensagem de erro amigável
 */
export const getLocationErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'Erro ao obter localização. Tente novamente.'
}
