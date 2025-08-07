/* eslint-disable prettier/prettier */
import { Periodo } from '@renderer/types/RoomType'

export function validarIntervalo(start: string, end: string): boolean {
  return start !== '' && end !== '' && start < end
}

export function existePeriodoIgual(lista: Periodo[], novo: Periodo): boolean {
  return lista.some(
    (p) => p.data === novo.data && p.horaInicio === novo.horaInicio && p.horaFim === novo.horaFim
  )
}

export function existeConflitoHorario(lista: Periodo[], novo: Periodo): boolean {
  return lista.some(
    (p) =>
      p.data === novo.data &&
      ((novo.horaInicio >= p.horaInicio && novo.horaInicio < p.horaFim) || // começa dentro de outro
        (novo.horaFim > p.horaInicio && novo.horaFim <= p.horaFim) || // termina dentro de outro
        (novo.horaInicio <= p.horaInicio && novo.horaFim >= p.horaFim)) // engloba outro
  )
}
