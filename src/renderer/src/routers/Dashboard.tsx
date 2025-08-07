/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react'
import { Building, Clock4, BarChart2, Percent } from 'lucide-react'

// Simulação de dados (mock)
const mockSalas = [
  { id: 1, nome: 'Sala 101', horarios: ['08:00', '10:00', '14:00'] },
  { id: 2, nome: 'Sala 102', horarios: ['09:00', '15:00'] },
  { id: 3, nome: 'Sala 103', horarios: [] },
  { id: 4, nome: 'Sala 104', horarios: ['11:00', '14:00', '16:00'] },
]

const HORARIO_TOTAL_POR_SALA = 600 // 10h em minutos (07-12 e 14-19)

function getHoraAtual(): string {
  const agora = new Date()
  const horas = agora.getHours().toString().padStart(2, '0')
  const minutos = agora.getMinutes().toString().padStart(2, '0')
  return `${horas}:${minutos}`
}

function isHorarioComercial(hora: string): boolean {
  const [h] = hora.split(':').map(Number)
  return (h >= 7 && h < 12) || (h >= 14 && h < 19)
}

function calcularMinutosOcupados(horarios: string[]): number {
  return horarios.length * 60 // assume 1h por horário
}

function Dashboard(): React.JSX.Element {
  const [horaAtual, setHoraAtual] = useState(getHoraAtual())

  useEffect(() => {
    const timer = setInterval(() => setHoraAtual(getHoraAtual()), 60000)
    return () => clearInterval(timer)
  }, [])

  const salasEmUsoAgora = mockSalas.filter((sala) =>
    sala.horarios.includes(horaAtual)
  )

  const dentroDoHorarioComercial = isHorarioComercial(horaAtual)

  const totalSalas = mockSalas.length
  const totalSalasComUsoHoje = mockSalas.filter((s) => s.horarios.length > 0).length

  const totalMinutosPossiveis = totalSalas * HORARIO_TOTAL_POR_SALA
  const totalMinutosUsados = mockSalas.reduce(
    (acc, sala) => acc + calcularMinutosOcupados(sala.horarios),
    0
  )

  const porcentagemUsoTempo = ((totalMinutosUsados / totalMinutosPossiveis) * 100).toFixed(0)
  const porcentagemSalasComUso = ((totalSalasComUsoHoje / totalSalas) * 100).toFixed(0)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard de Salas</h1>

      {/* === MÉTRICAS PRINCIPAIS === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <InfoCard
          icon={<Clock4 className="text-blue-600" />}
          title="Hora Atual"
          value={horaAtual}
          description={dentroDoHorarioComercial ? 'Horário comercial' : 'Fora do horário'}
        />
        <InfoCard
          icon={<Building className="text-green-600" />}
          title="Salas em uso agora"
          value={`${salasEmUsoAgora.length}`}
          description="Baseado na hora atual"
        />
        <InfoCard
          icon={<BarChart2 className="text-purple-600" />}
          title="Uso médio hoje"
          value={`${porcentagemUsoTempo}%`}
          description="Tempo total de uso das salas"
        />
        <InfoCard
          icon={<Percent className="text-orange-600" />}
          title="Salas com uso hoje"
          value={`${totalSalasComUsoHoje} de ${totalSalas} (${porcentagemSalasComUso}%)`}
          description="Salas com pelo menos 1 agendamento"
        />
      </div>

      {/* === LISTA DE SALAS EM USO === */}
      <h2 className="text-xl font-semibold mb-4">Salas em uso agora</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {salasEmUsoAgora.length > 0 ? (
          salasEmUsoAgora.map((sala) => (
            <div
              key={sala.id}
              className="border border-gray-300 rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition"
            >
              <h2 className="text-lg font-bold text-gray-800">{sala.nome}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Horários ocupados:{' '}
                <span className="ml-1 font-medium text-black">
                  {sala.horarios.join(', ')}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full">Nenhuma sala em uso no momento.</p>
        )}
      </div>
    </div>
  )
}

function InfoCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon?: React.ReactNode
}) {
  return (
    <div className="p-4 rounded-xl border bg-white shadow hover:shadow-md transition flex flex-col gap-1">
      <div className="flex items-center gap-2">{icon}<h2 className="text-sm text-gray-500 font-medium">{title}</h2></div>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  )
}

export default Dashboard
