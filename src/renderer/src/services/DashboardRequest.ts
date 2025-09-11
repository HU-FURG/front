/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api'

// variavel 
export const OCCUPATION_CACHE_KEY = 'occupationCache';

// Tipos esperados da API
export type PeriodoRequest = {
  inicio: string // "2025-08-01"
  fim: string    // "2025-08-07"
}

export type OccupationResposta = {
  dia: string
  ocupacaoPercentual: number
  salasOcupadas: number
}[]

export type TempoMedioResposta = {
  salasUsadas: number
  totalSalas: number
  tempoMedio: string
}

// ----------------------
// TAXA DE OCUPAÇÃO
// ----------------------
export const fetchOccupation = async (periodo: PeriodoRequest): Promise<OccupationResposta[]> => {
  try {
    const res = await api.post<OccupationResposta[]>('/occupation', periodo)
    return res.data
  } catch (error: any) {
    console.error('Erro ao buscar taxa de ocupação:', error.response?.data || error.message)
    throw error
  }
}

// ----------------------
// TEMPO MÉDIO DE USO
// ----------------------
export const fetchTempoMedioUso = async (
  periodo: PeriodoRequest
): Promise<TempoMedioResposta> => {
  try {
    const res = await api.post<TempoMedioResposta>('/tempoMedio', periodo)
    return res.data
  } catch (error: any) {
    console.error('Erro ao buscar tempo médio de uso:', error.response?.data || error.message)
    throw error
  }
}