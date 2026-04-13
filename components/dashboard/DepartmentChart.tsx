"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type DepartmentChartProps = {
  data: Array<{ name: string; total: number }>;
  barColor?: string;
  yAxisWidth?: number;
  tickFontSize?: number;
  maxLabelLength?: number;
};

function truncateLabel(label: string, maxLabelLength: number) {
  if (label.length <= maxLabelLength) {
    return label;
  }

  return `${label.slice(0, Math.max(0, maxLabelLength - 3))}...`;
}

export function DepartmentChart({
  data,
  barColor = "#1F6B2E",
  yAxisWidth = 120,
  tickFontSize = 12,
  maxLabelLength = 22
}: DepartmentChartProps) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <XAxis hide type="number" />
          <YAxis
            dataKey="name"
            type="category"
            width={yAxisWidth}
            tick={{ fill: "#5A5B57", fontSize: tickFontSize }}
            tickFormatter={(value) => truncateLabel(String(value), maxLabelLength)}
          />
          <Tooltip cursor={{ fill: "#FBEAED" }} />
          <Bar dataKey="total" fill={barColor} radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
