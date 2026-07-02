/**
 * Interface para retorno de coordenadas
 */
export interface Coordinates {
  latitude: number
  longitude: number
}

/**
 * Obtém a localização do usuário via Geolocation API
 * @param options - Opções da Geolocation API
 * @returns Promise com coordenadas ou erro
 */
export const getCoordinates = (
  options: PositionOptions = {
    timeout: 10000,
    enableHighAccuracy: true,
  }
): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não é suportada neste navegador'))
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        resolve({ latitude, longitude })
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(
              new Error(
                'Permissão de localização negada. Você pode continuar o cadastro, mas não será possível buscar prestadores próximos.'
              )
            )
            break
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Localização indisponível. Tente novamente.'))
            break
          case error.TIMEOUT:
            reject(new Error('Timeout ao obter localização. Tente novamente.'))
            break
          default:
            reject(new Error('Erro desconhecido ao obter localização'))
        }
      },
      options
    )
  })
}

/**
 * Valida se as coordenadas estão dentro de um intervalo válido
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns boolean - true se válidas
 */
export const validateCoordinates = (lat?: number, lon?: number): boolean => {
  if (lat === undefined || lon === undefined) return true // Opcional
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
