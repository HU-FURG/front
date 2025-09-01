/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { OccupationResposta } from "@renderer/services/DashboardRequest";
import { TrendingUp, Users, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "light";
}

function StatCard({ label, value, icon, variant = "primary" }: StatCardProps) {
  const base =
    "rounded-xl p-3 shadow transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl";

  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
    secondary: "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white",
    light: "bg-white text-gray-900",
  };

  return (
    <div className={`${base} ${variants[variant]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-sm font-medium ${
              variant === "light" ? "text-gray-500" : "text-emerald-100"
            }`}
          >
            {label}
          </p>
          <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
        {icon && (
          <div
            
            className={`p-1 rounded-full ${
              variant === "light" ? "bg-emerald-100" : "bg-white/20"
            }`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface OverviewCardProps {
  totalSalas: number;
  ocupadas: number;
  tempoMedio: string;
  weekData: OccupationResposta[];
}

export function OverviewCard({
  totalSalas,
  ocupadas,
  tempoMedio,
  weekData,
}: OverviewCardProps) {
  return (
    <div className="w-full p-3 max-w-[800px]">
      <div className="grid grid-cols-1  gap-6 items-center">
        {/* Indicadores */}
        <div>
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 lg:m-auto">
          <StatCard
            label="Salas Totais"
            value={totalSalas}
            icon={<TrendingUp className="h-6 w-6"/>}
            variant="primary"
          />
          <StatCard
            label="Ocupadas"
            value={ocupadas}
            icon={<Users className="h-6 w-6" />}
            variant="secondary"
          />
          <StatCard
            label="Tempo Médio"
            value={tempoMedio}
            icon={<Clock className="h-6 w-6 text-emerald-600" />}
            variant="light" />
        </div>
        
        </div>

        {/* Gráfico ou Mensagem */}
        <div className="w-full mx-auto h-[300px] max-w-[800px] bg-card rounded-xl p-6 shadow transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center">
          {weekData.length > 0 ? (
            <ResponsiveContainer>
              <LineChart
                data={weekData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <XAxis
                  dataKey="dia"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  dy={10}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  width={40}
                />
                <Line
                  type="monotone"
                  dataKey="ocupacaoPercentual"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                  activeDot={{
                    r: 6,
                    fill: "#10b981",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-lg font-medium">
              Nenhuma reserva nesta semana
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
