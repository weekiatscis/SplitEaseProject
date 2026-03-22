"use client";

import { useState, useEffect, useRef } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendUpIcon, ShareNetworkIcon } from '@phosphor-icons/react';
import { spendingTrendsData } from '@/lib/data/chartData';
import { formatCurrency } from '@/lib/utils/formatCurrency';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-bg-card border border-border rounded-lg px-3 py-2 shadow-md">
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-medium px-1.5 py-0.5 rounded">
          <ShareNetworkIcon size={10} />
          Share
        </span>
      </div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-sm font-bold text-text-heading">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export default function SpendingTrendsChart() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Spending trends chart"
      className="bg-bg-card rounded-xl border border-border shadow-sm p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-text-heading">Charge Cards Chart</h3>
        <select className="text-xs text-text-secondary bg-transparent border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 cursor-pointer">
          <option>Monthly</option>
          <option>Weekly</option>
        </select>
      </div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-secondary">Card Balance By time changing</p>
        <span className="flex items-center gap-1 text-xs font-medium text-success">
          <TrendUpIcon size={13} />
          +23.65%
        </span>
      </div>

      {/* Chart */}
      <div className="h-[220px]">
        {isVisible && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spendingTrendsData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A6CF7" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#4A6CF7" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-light)" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                tickFormatter={(v) => `${v / 1000}k`}
                domain={[0, 500]}
                ticks={[0, 125, 250, 375, 500]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#4A6CF7"
                strokeWidth={2.5}
                fill="url(#areaFill)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: '#4A6CF7',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
                animationDuration={600}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}