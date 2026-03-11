"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from 'recharts';
import { expenseBreakdownData } from '@/lib/data/chartData';

function renderActiveShape(props) {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <text x={cx} y={cy - 8} textAnchor="middle" className="text-xs" fill="var(--color-text-heading)" fontWeight={600}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" className="text-[11px]" fill="var(--color-text-muted)">
        {`${value}%`}
      </text>
    </g>
  );
}

export default function ExpenseBreakdownChart() {
  const [activeIndex, setActiveIndex] = useState(-1);
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

  const onPieEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);

  const onPieLeave = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  return (
    <section ref={ref} aria-label="Expense breakdown chart">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text-heading">Card Statistics</h3>
        <button className="text-xs text-text-secondary hover:text-primary transition-colors duration-150 px-2 py-1 rounded border border-border hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
          See all
        </button>
      </div>

      {/* Donut */}
      <div className="h-[180px]">
        {isVisible && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseBreakdownData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                dataKey="value"
                activeIndex={activeIndex >= 0 ? activeIndex : undefined}
                activeShape={renderActiveShape}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                animationDuration={600}
                animationEasing="ease-out"
              >
                {expenseBreakdownData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={activeIndex >= 0 && activeIndex !== index ? 0.4 : 1}
                    style={{ transition: 'opacity 200ms ease' }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2.5 mt-3">
        {expenseBreakdownData.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between cursor-default"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(-1)}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span
                className={`text-sm transition-colors duration-200 ${
                  activeIndex >= 0 && activeIndex !== index
                    ? 'text-text-muted'
                    : 'text-text-body'
                }`}
              >
                {item.name}
              </span>
            </div>
            <span
              className={`text-sm font-medium transition-colors duration-200 ${
                activeIndex >= 0 && activeIndex !== index
                  ? 'text-text-muted'
                  : 'text-text-heading'
              }`}
            >
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}