/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Calendar, MapPin } from "lucide-react";

interface Reserva {
  id: number;
  sala: string;
  tipo: string;
  bloco: string;
  horario: string;
}

const reservas: Reserva[] = [
  { id: 1, sala: "Sala 101", tipo: "Sala de Aula", bloco: "Bloco A", horario: "08:00 - 10:00" },
  { id: 2, sala: "Sala 202", tipo: "Laboratório", bloco: "Bloco B", horario: "10:30 - 12:00" },
  { id: 3, sala: "Sala 303", tipo: "Auditório", bloco: "Bloco C", horario: "14:00 - 16:00" },
  { id: 4, sala: "Sala 104", tipo: "Sala de Aula", bloco: "Bloco A", horario: "16:30 - 18:00" },
];

export function ReservasDeHoje() {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 sm:max-w-[370px] lg:max-w-[450px] w-full mx-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Reservas de Hoje</h2>
        <a
          href="/reservas"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <Calendar className="w-4 h-4" />
          Ver Todas
        </a>
      </div>

      {/* Lista de Reservas */}
      <div className="space-y-2">
        {reservas.map((reserva) => (
          <div
            key={reserva.id}
            className="flex items-center w-full w-max-[330px] justify-between p-2 rounded-lg bg-emerald-100 hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{reserva.sala}</h3>
                <p className="text-sm text-gray-700">
                  {reserva.tipo} • {reserva.bloco}
                </p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-800">{reserva.horario}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
