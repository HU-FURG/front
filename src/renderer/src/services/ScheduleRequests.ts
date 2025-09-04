/* eslint-disable prettier/prettier */

import { api } from './api'
import { RoomPeriod } from '@renderer/types/RoomType'

export type HorarioBusca = {
  data: string
  horaInicio: string
  horaFim: string
}

type Sala = {
  id: string
  nome: string
  tipo: string
  bloco: string
  status: "active" | "inactive"
}

// Buscar salas disponíveis para os horários informados
export const buscarSalasDisponiveisPorHorario = async (
  horarios: HorarioBusca[]
): Promise<Sala[]> => {
  const response = await api.post<Sala[]>('/buscarhorario', { horarios })
  return response.data
}

export const handleConfirmAgendamento = async (agendamento: {
  salaId: string
  responsavel: string
  horarios: {
    data: string
    horaInicio: string
    horaFim: string
  }[]
}): Promise<void> => {
  try {
    const response = await api.post('/agendar', agendamento)
    console.log('Agendamento realizado com sucesso:', response.data)
    // Aqui você pode adicionar um alerta ou atualizar estado, se necessário
  } catch (error) {
    console.error('Erro ao agendar sala:', error)
    // Adicione um toast ou mensagem de erro, se quiser
  }
}

// Listar agendamentos com filtros e paginação
export const listScheduling = async (filters: {
  bloco?: string
  number?: string
  tipo?: string
  date?: string
  page?: number
}): Promise<{
  data: RoomPeriod[]
  total: number
  currentPage: number
  totalPages: number
}> => {
  const params = new URLSearchParams()
  if (filters.bloco) params.append('bloco', filters.bloco)
  if (filters.number) params.append('number', filters.number)
  if (filters.tipo) params.append('tipo', filters.tipo)
  if (filters.date) params.append('date', filters.date)
  if (filters.page !== undefined) params.append('page', filters.page.toString())

  const response = await api.get(`/scheduling?${params.toString()}`)
  return response.data
}

// Cancelar agendamento
export const deleteScheduling = async (id: number): Promise<void> => {
  await api.delete(`/scheduling/${id}`)
}

// // Atualizar agendamento existente 
// export const updateScheduling = async (id: number, data: RoomPeriodUpdate): Promise<RoomPeriod> => {
//   const response = await api.put(`/scheduling/${id}`, data)
//   return response.data
// }


