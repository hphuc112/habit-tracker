'use client';

import { format, parseISO } from 'date-fns';
import { buildHeatmapGrid, intensityLevel } from '@/lib/heatmap';

const LEVEL_CLASSES: Record<number, string> = {
  0: 'bg-gray-100 dark:bg-gray-800',
  1: 'bg-green-200 dark:bg-green-950',
  2: 'bg-green-400 dark:bg-green-800',
  3: 'bg-green-600 dark:bg-green-600',
  4: 'bg-green-800 dark:bg-green-400',
};

export function ContributionHeatmap({
  counts,
  weeksBack = 53,
}: {
  counts: Record<string, number>;
  weeksBack?: number;
}) {
  const weeks = buildHeatmapGrid(counts, weeksBack);
  const max = Math.max(1, ...Object.values(counts));
  const monthPerWeek = weeks.map((week) =>
    format(parseISO(week[0].date), 'MMM'),
  );
  const monthLabels = monthPerWeek.map((month, i) => {
    const firstDay = parseISO(weeks[i][0].date);
    const isFirstFullWeekOfMonth = firstDay.getDate() <= 7;
    const isNewMonth = i === 0 || month !== monthPerWeek[i - 1];
    return isFirstFullWeekOfMonth && isNewMonth ? month : '';
  });

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <div className="overflow-x-auto pb-2">
      <div className="inline-flex gap-2">
        <div className="flex flex-col gap-[3px] pt-5 text-xs text-gray-400">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-[11px] leading-[11px]">
              {label}
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          <div
            className="mb-1 flex text-xs text-gray-400"
            style={{ gap: '3px' }}
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
  );
}
