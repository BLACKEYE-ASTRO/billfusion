"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", income: 42000, expense: 26000 },
  { month: "Feb", income: 46000, expense: 29000 },
  { month: "Mar", income: 44000, expense: 24000 },
  { month: "Apr", income: 51000, expense: 31000 },
  { month: "May", income: 48000, expense: 27000 },
  { month: "Jun", income: 56000, expense: 30000 },
  { month: "Jul", income: 52400, expense: 28640 },
];

export default function SpendingChart() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium">
            Cash flow
          </p>

          <p className="mt-1 text-xs text-white/30">
            Income vs expenses
          </p>
        </div>

        <select
          className="
            rounded-lg
            border border-white/[0.07]
            bg-white/[0.03]
            px-3 py-2
            text-xs text-white/50
            outline-none
          "
        >
          <option>Last 7 months</option>
          <option>This year</option>
        </select>

      </div>

      <div className="mt-6 h-[280px]">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={data}>

            <defs>

              <linearGradient
                id="income"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#00A67E"
                  stopOpacity={0.25}
                />

                <stop
                  offset="100%"
                  stopColor="#00A67E"
                  stopOpacity={0}
                />
              </linearGradient>

            </defs>

            <CartesianGrid
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "rgba(255,255,255,0.3)",
                fontSize: 11,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "rgba(255,255,255,0.3)",
                fontSize: 11,
              }}
            />

            <Tooltip
              contentStyle={{
                background: "#101412",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                color: "#fff",
              }}
            />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#00A67E"
              strokeWidth={2}
              fill="url(#income)"
            />

            <Area
              type="monotone"
              dataKey="expense"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={2}
              fill="transparent"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}