'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { buildHeatmapGrid, intensityLevel } from '@/lib/heatmap';

const LEVEL_CLASSES: Record<number, string> = {
  0: 'bg-heatmap-0',
  1: 'bg-heatmap-1',
  2: 'bg-heatmap-2',
  3: 'bg-heatmap-3',
  4: 'bg-heatmap-4',
};

const CELL_PX = 11;
const CELL_GAP_PX = 3;
const DAY_LABELS_PX = 28;
const GRID_GAP_PX = 8;
const MIN_WEEKS = 8;

function monthLabelsForWeeks(weeks: ReturnType<typeof buildHeatmapGrid>) {
  const monthPerWeek = weeks.map((week) =>
    format(parseISO(week[0].date), 'MMM'),
  );

  return monthPerWeek.map((month, i) => {
    const firstDay = parseISO(weeks[i][0].date);
    const isFirstFullWeekOfMonth = firstDay.getDate() <= 7;
    const isNewMonth = i === 0 || month !== monthPerWeek[i - 1];
    return isFirstFullWeekOfMonth && isNewMonth ? month : '';
  });
}

function weeksThatFit(containerWidth: number, totalWeeks: number) {
  const weekColumnWidth = CELL_PX + CELL_GAP_PX;
  const available = containerWidth - DAY_LABELS_PX - GRID_GAP_PX;
  const fitCount = Math.floor(available / weekColumnWidth);
  return Math.min(totalWeeks, Math.max(MIN_WEEKS, fitCount));
}

export function ContributionHeatmap({
  counts,
  weeksBack = 53,
}: {
  counts: Record<string, number>;
  weeksBack?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const allWeeks = useMemo(
    () => buildHeatmapGrid(counts, weeksBack),
    [counts, weeksBack],
  );
  const [visibleWeekCount, setVisibleWeekCount] = useState(
    Math.min(allWeeks.length, 26),
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateVisibleWeeks = () => {
      setVisibleWeekCount(weeksThatFit(container.clientWidth, allWeeks.length));
    };

    updateVisibleWeeks();

    const observer = new ResizeObserver(updateVisibleWeeks);
    observer.observe(container);
    return () => observer.disconnect();
  }, [allWeeks.length]);

  const weeks = allWeeks.slice(-visibleWeekCount);
  const monthLabels = monthLabelsForWeeks(weeks);
  const max = Math.max(1, ...Object.values(counts));
  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  const isTrimmed = visibleWeekCount < allWeeks.length;

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex justify-end pb-2">
        <div className="inline-flex gap-2">
          <div className="text-muted flex shrink-0 flex-col gap-[3px] pt-5 text-xs">
            {dayLabels.map((label, i) => (
              <div key={i} className="h-[11px] leading-[11px]">
                {label}
              </div>
            ))}
          </div>
          <div className="flex shrink-0 flex-col">
            <div
              className="text-muted mb-1 flex text-xs"
              style={{ gap: `${CELL_GAP_PX}px` }}
            >
              {monthLabels.map((label, i) => (
                <div
                  key={i}
                  className="w-[11px] shrink-0 text-left whitespace-nowrap"
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      title={`${day.date}: ${day.count} habit${day.count === 1 ? '' : 's'} completed`}
                      className={`h-[11px] w-[11px] rounded-sm ${LEVEL_CLASSES[intensityLevel(day.count, max)]}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isTrimmed && (
        <p className="text-muted text-right text-xs">
          Showing last {visibleWeekCount} weeks - today is on the right
        </p>
      )}
    </div>
  );
}
