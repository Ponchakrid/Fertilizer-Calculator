'use client'

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface NPKBarChartProps {
  target: { n: number; p: number; k: number }
  soil: { n: number; p: number; k: number }
  needed: { n: number; p: number; k: number }
}

const chartConfig = {
  target: {
    label: 'ต้องการ',
    color: 'var(--chart-1)',
  },
  soil: {
    label: 'มีในดิน',
    color: 'var(--chart-2)',
  },
  needed: {
    label: 'ต้องเติม',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

export function NPKBarChart({ target, soil, needed }: NPKBarChartProps) {
  const data = [
    {
      nutrient: 'N (ไนโตรเจน)',
      target: target.n,
      soil: soil.n,
      needed: needed.n,
    },
    {
      nutrient: 'P (ฟอสฟอรัส)',
      target: target.p,
      soil: soil.p,
      needed: needed.p,
    },
    {
      nutrient: 'K (โพแทสเซียม)',
      target: target.k,
      soil: soil.k,
      needed: needed.k,
    },
  ]

  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical" barCategoryGap="20%">
          <XAxis type="number" unit=" กก." tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="nutrient"
            width={100}
            tick={{ fontSize: 12 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar
            dataKey="target"
            name="ต้องการ"
            fill="var(--chart-1)"
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="soil"
            name="มีในดิน"
            fill="var(--chart-2)"
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="needed"
            name="ต้องเติม"
            fill="var(--chart-3)"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

interface CostPieChartProps {
  data: { name: string; value: number; fill: string }[]
}

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

export function CostBreakdown({ data }: CostPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0
        return (
          <div key={item.name} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                {item.name}
              </span>
              <span className="font-mono font-semibold">
                {item.value.toLocaleString()} บาท
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
