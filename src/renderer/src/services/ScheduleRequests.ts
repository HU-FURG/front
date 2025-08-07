/* eslint-disable prettier/prettier */

import { api } from './api'


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
  salaId: number
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