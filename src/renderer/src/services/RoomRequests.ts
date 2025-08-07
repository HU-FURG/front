/* eslint-disable prettier/prettier */

import { api } from './api'
import { Room } from '@renderer/types/RoomType'

// Buscar todas as salas (sem filtro)
export const getAllRooms = async (): Promise<Room[]> => {
  console.log('getAllRooms')
  const response = await api.get<Room[]>('/rooms')
  return response.data
}

// Buscar salas com filtros e paginação
export const searchRooms = async (filters: {
  number?: string
  tipo?: string
  bloco?: string
  page?: number
  active?: boolean
}): Promise<{
  data: Room[]
  total: number
  currentPage: number
  totalPages: number
}> => {
  const params = new URLSearchParams()

  if (filters.number) params.append('number', filters.number)
  if (filters.tipo) params.append('tipo', filters.tipo)
  if (filters.bloco) params.append('bloco', filters.bloco)
  if (filters.page !== undefined) params.append('page', filters.page.toString())
  if (filters.active !== undefined) params.append('active', filters.active.toString())

  const response = await api.get(`/rooms?${params.toString()}`)
  return response.data
}

// Criar nova sala
export const createRoom = async (room: {
  number: string
  description?: string
  tipo?: string
  bloco: string
}): Promise<Room> => {
  const response = await api.post<Room>('/room', room)
  return response.data
}


export const editRoom = async (id: number, updatedRoom: {
  description?: string
  tipo?: string
  active?: boolean
}): Promise<Room> => {
  console.log('edite')
  const response = await api.put<Room>(`/room/${id}`,{
    id,
    ...updatedRoom,
  })
  return response.data
}

// Deletar sala
export const deleteRooms = async (ids: number[]): Promise<void> => {
  await api.post('/rooms/delete', { ids });
};