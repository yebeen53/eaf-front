'use client';

import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

type RadialResultProps = {
  value: number | null;
};

const chartConfig = {
  value: {
    label: '전력원단위',
  },
  result: {
    label: 'Result',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

const MAX_VALUE = 530;

export function RadialChart({ value }: RadialResultProps) {
  const chartData = [{ name: 'result', value: value ?? 0, fill: 'var(--chart-2)' }];

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
      <RadialBarChart
        data={chartData}
        startAngle={0}
        endAngle={250}
        innerRadius={80}
        outerRadius={110}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 74]}
        />
        <RadialBar dataKey="value" background cornerRadius={10} max={MAX_VALUE} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-4xl font-bold"
                    >
                      {value === null ? '--' : value.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      전력원단위
                    </tspan>
                  </text>
                );
              }
              return null;
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}

export default function RadialResult({ value }: RadialResultProps) {
  return (
    <Card className="w-full flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>전력원단위</CardTitle>
        <CardDescription>예측 결과</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <RadialChart value={value} />
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {value === null ? '예측 전' : '예측 완료'}
        </div>
        <div className="text-muted-foreground leading-none">슬라이더 값을 기준으로 예측합니다.</div>
      </CardFooter>
    </Card>
  );
}
