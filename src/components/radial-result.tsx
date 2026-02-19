'use client';

import type { ReactNode } from 'react';
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

export type MetricKey =
  | 'melting_wattage'
  | 'refining_wattage'
  | 'wattage_tmp'
  | 'tot_result1';

export type ResultMetrics = Partial<Record<MetricKey, number | null>>;

type RadialResultProps = {
  result: ResultMetrics | null;
  selectedMetric: MetricKey;
  statusLabel?: string | null;
  objectiveTarget?: MetricKey | null;
  objectiveValue?: number | null;
  actions?: ReactNode;
};

const METRIC_LABELS: Record<MetricKey, string> = {
  tot_result1: '출강량',
  melting_wattage: '용해 전력',
  refining_wattage: '정련 전력',
  wattage_tmp: '전력 합계',
};

const METRIC_MAX: Record<MetricKey, number> = {
  tot_result1: 130,
  melting_wattage: 2000,
  refining_wattage: 2000,
  wattage_tmp: 3000,
};

const chartConfig = {
  value: {
    label: '지표 값',
  },
  result: {
    label: 'Result',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

const formatMetricValue = (_key: MetricKey, value: number) =>
  value.toLocaleString(undefined, { maximumFractionDigits: 3 });

const isFiniteMetricValue = (value: number | null | undefined): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export function MetricValueList({
  result,
  metrics,
}: {
  result: ResultMetrics | null;
  metrics: MetricKey[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 text-lg">
      {metrics.map((key) => (
        <div key={key} className="flex items-center justify-between rounded-md border px-4 py-3">
          <span className="text-muted-foreground">{METRIC_LABELS[key]}</span>
          <span className="text-xl font-semibold">
            {isFiniteMetricValue(result?.[key]) ? formatMetricValue(key, result[key]) : '--'}
          </span>
        </div>
      ))}
    </div>
  );
}

function RadialChart({
  value,
  label,
  max,
  displayValue,
}: {
  value: number | null;
  label: string;
  max: number;
  displayValue: string;
}) {
  const chartData = [{ name: 'result', value: value ?? 0, fill: 'var(--chart-2)' }];

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
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
        <RadialBar dataKey="value" background cornerRadius={10} max={max} />
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
                      {displayValue}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {label}
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

export default function RadialResult({
  result,
  selectedMetric,
  statusLabel,
  objectiveTarget,
  objectiveValue,
  actions,
}: RadialResultProps) {
  const selectedValue = result?.[selectedMetric];
  const value = isFiniteMetricValue(selectedValue) ? selectedValue : null;
  const max = METRIC_MAX[selectedMetric];
  const displayValue = value === null ? '--' : formatMetricValue(selectedMetric, value);

  return (
    <Card className="w-full flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>예측 결과</CardTitle>
        <CardDescription>선택한 지표를 중심으로 표시합니다.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="flex flex-col items-center gap-6">
          <div className="w-full">
            <RadialChart
              value={value}
              label={METRIC_LABELS[selectedMetric]}
              max={max}
              displayValue={displayValue}
            />
          </div>
          {actions ? <div className="w-full">{actions}</div> : null}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {value === null ? '대기 중' : (statusLabel ?? '예측 완료')}
        </div>
        {objectiveTarget && objectiveValue != null ? (
          <div className="text-muted-foreground leading-none">
            목표 지표: {METRIC_LABELS[objectiveTarget]} ={' '}
            {formatMetricValue(objectiveTarget, objectiveValue)}
          </div>
        ) : (
          <div className="text-muted-foreground leading-none">지표 값은 서버 계산 결과입니다.</div>
        )}
      </CardFooter>
    </Card>
  );
}
