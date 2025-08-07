/* eslint-disable prettier/prettier */

export interface Room {
  id?: number
  number: string
  description: string
  tipo: string
  bloco: string
  active: boolean
}

export const tiposSala: string[] = [
    "Comum",
    "Reunião",
    "Estrutura Especfica1",
    "Estrutura Especfica2",
    "Estrutura Especfica3",
];

export const blocosSala: string[] = [
    "Bloco A",
    "Bloco B",
    "Bloco C",
    "Bloco D",
  ];

// 
export interface Periodo {
  data: string
  horaInicio: string
  horaFim: string
}


export type Sala = {
  id: string
  nome: string
  tipo: string
  bloco: string
  status: "active" | "inactive"
}

export type HorarioBusca = {
  data: string
  horaInicio: string
  horaFim: string
}