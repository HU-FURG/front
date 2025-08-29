/* eslint-disable prettier/prettier */
import { OverviewCard } from "@renderer/components/OverviewCard";
import { ReservasDeHoje } from "@renderer/components/RoomCarousel";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data
const mockWeekData = [
  { dia: "Seg", ocupacao: 66 },
  { dia: "Ter", ocupacao: 82 },
  { dia: "Qua", ocupacao: 53 },
  { dia: "Qui", ocupacao: 70 },
  { dia: "Sex", ocupacao: 79 },
  { dia: "Sáb", ocupacao: 38 },
  { dia: "Dom", ocupacao: 25 },
];

// const mockReservadas: Room[] = [
//   { id: 1, number: "101", bloco: "A", tipo: "Sala de Aula", active: true, description: "" },
//   { id: 2, number: "202", bloco: "B", tipo: "Laboratório", active: true, description: "" },
//   { id: 3, number: "303", bloco: "C", tipo: "Auditório", active: true, description: "" },
//   { id: 4, number: "404", bloco: "D", tipo: "Reunião", active: true, description: "" },
//   { id: 5, number: "505", bloco: "E", tipo: "Sala Especial", active: true, description: "" },
// ];

export default function Home(): React.JSX.Element {
  // const [salasReservadas, setSalasReservadas] = useState<Room[]>([]);
  const totalSalas = 20;
  const ocupadas = 12;
  const tempoMedio = "2h 15min";

  // useEffect(() => {
  //   // Simula chamada à API
  //   setSalasReservadas(mockReservadas);
  // }, []);

  return (
    <div className="flex flex-col items-center mx-auto gap-4 sm:gap-1 sm:p-0 lg:gap-5 p-4 h-full overflow-y-scroll  max-w-[1000px]">

      <div className="title w-full text-center">
        <h1 className="text-[25px] font-semibold text-foreground">Visão Geral de Uso</h1>
        <p className="text-sm text-foreground opacity-80">
            {format(new Date(), 'PPPP', { locale: ptBR })}
        </p>
      </div>
      
      <OverviewCard
        totalSalas={totalSalas}
        ocupadas={ocupadas}
        tempoMedio={tempoMedio}
        weekData={mockWeekData}
      />
      <div className="flex w-full justify-center max-w-[800px] mb-6">
        <ReservasDeHoje  />
        <ReservasDeHoje  />
      </div>
      
      
    </div>
  );
}