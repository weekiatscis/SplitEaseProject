"use client";

import SummaryCard from './SummaryCard';
import { summaryCards } from '@/lib/data/summaryCards';
import { Button } from '@/components/ui/button';

export default function SummaryCardCarousel() {
  return (
    <section aria-label="Balance summary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text-heading">My Cards</h3>
        <Button variant="outline" size="sm">
          View all &rarr;
        </Button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {summaryCards.map((card) => (
          <div key={card.id} className="w-[280px] shrink-0">
            <SummaryCard {...card} />
          </div>
        ))}
      </div>
    </section>
  );
}
