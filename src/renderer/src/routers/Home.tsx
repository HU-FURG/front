/* eslint-disable prettier/prettier */
import { OverviewCard } from "@renderer/components/OverviewCard";
import { ReservasDeHoje } from "@renderer/components/RoomCarousel";
import { fetchOccupation, fetchTempoMedioUso, OccupationResposta } from "@renderer/services/DashboardRequest";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from "react";


export default function Home(): React.JSX.Element {
  //const [salasReservadas, setSalasReservadas] = useState<Room[]>([]);
  const [totalSalas, SetTotalSalas] = useState<number>(0);
  const [ocupadas, setOcupadas] = useState<number>(0);
  const [tempoMedio, setTempoMedio] = useState<string>('');
  const [mockWeekData, setMockWeekData] = useState<OccupationResposta[]>([])

  function getDate(semana: boolean): { inicio: string; fim: string } {
    const hoje = new Date()
    // Formatar como "YYYY-MM-DD"
    const format = (d: Date):string => d.toISOString().split("T")[0]
    let dia1, dia2;

    if (semana) {
      const diaSemana = hoje.getDay() // 0 = domingo, 1 = segunda, ..., 6 = sábado

      // Ajusta para começar na segunda
      const diffSegunda = diaSemana === 0 ? -6 : 1 - diaSemana
      dia1 = new Date(hoje) //segunda
      dia1.setDate(hoje.getDate() + diffSegunda)

      // Domingo da mesma semana
      dia2 = new Date(dia1) //domingo
      dia2.setDate(dia1.getDate() + 6)
    } else{
      dia1 = new Date(hoje)
      dia2 = new Date(hoje)
    }
  

    return {
      inicio: format(dia1),
      fim: format(dia2),
    }
    
  }

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      const periodo = getDate(true);
      const hoje = getDate(false);

      // tempo médio de uso
      const data = await fetchTempoMedioUso(hoje);
      setTempoMedio(data.tempoMedio);
      setOcupadas(data.salasUsadas);
      SetTotalSalas(data.totalSalas);

      // taxa de ocupação da semana
      const occupationData = await fetchOccupation(periodo);
      setMockWeekData(occupationData);
    };

    loadData();
  }, []);

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
        weekData={mockWeekData || []}
      />
      <div className="flex w-full justify-center max-w-[800px] mb-6">
        <ReservasDeHoje  />
        <ReservasDeHoje  />
      </div>
      
      
    </div>
  );
}