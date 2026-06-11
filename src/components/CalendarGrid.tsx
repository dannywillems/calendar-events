import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalEvent, FacetKey } from '../lib/types';
import {
  WEEKDAY_LABELS,
  addDays,
  mondayIndex,
  monthLabel,
  sameDay,
  startOfDay,
  today,
} from '../lib/date';
import { colorFor, type ColorMap } from '../lib/colors';
import { colorValue } from '../lib/filters';

interface CalendarGridProps {
  events: CalEvent[];
  year: number;
  month: number;
  colorFacet: FacetKey;
  colorMap: ColorMap;
  onSelect: (event: CalEvent) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

// Vertical layout constants, in pixels.
const HEADER = 26; // space reserved for the day number
const BAR_H = 20;
const BAR_GAP = 4;
const BOTTOM_PAD = 6;
const MIN_WEEK = 96;

function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

interface Placed {
  event: CalEvent;
  startCol: number;
  endCol: number;
  lane: number;
  roundLeft: boolean;
  roundRight: boolean;
}

// Assign each week's events to lanes so they never overlap horizontally.
function layoutWeek(
  events: CalEvent[],
  weekStart: Date,
): {
  placed: Placed[];
  lanes: number;
} {
  const weekEnd = addDays(weekStart, 6);
  const inWeek = events
    .filter((e) => e.start <= weekEnd && e.end >= weekStart)
    .sort(
      (a, b) =>
        a.start.getTime() - b.start.getTime() ||
        b.end.getTime() - a.end.getTime(),
    );

  const laneEnds: number[] = []; // last used column per lane
  const placed: Placed[] = [];

  for (const event of inWeek) {
    const startOffset = daysBetween(weekStart, event.start);
    const endOffset = daysBetween(weekStart, event.end);
    const startCol = Math.max(0, startOffset);
    const endCol = Math.min(6, endOffset);

    let lane = laneEnds.findIndex((end) => end < startCol);
    if (lane === -1) {
      lane = laneEnds.length;
    }
    laneEnds[lane] = endCol;

    placed.push({
      event,
      startCol,
      endCol,
      lane,
      roundLeft: startOffset >= 0,
      roundRight: endOffset <= 6,
    });
  }

  return { placed, lanes: laneEnds.length };
}

export default function CalendarGrid({
  events,
  year,
  month,
  colorFacet,
  colorMap,
  onSelect,
  onPrev,
  onNext,
  onToday,
}: CalendarGridProps) {
  const now = today();
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const gridStart = addDays(firstOfMonth, -mondayIndex(firstOfMonth));
  const gridEnd = addDays(lastOfMonth, 6 - mondayIndex(lastOfMonth));
  const weekCount = Math.round(daysBetween(gridStart, gridEnd) / 7) + 1;

  const navButton =
    'rounded-md p-1.5 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700';

  return (
    <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200 p-3 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {monthLabel(year, month)}
        </h2>
        <div className="flex items-center gap-1">
          <button onClick={onToday} className={`${navButton} px-3 text-sm`}>
            Today
          </button>
          <button
            onClick={onPrev}
            aria-label="Previous month"
            className={navButton}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={onNext}
            aria-label="Next month"
            className={navButton}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-200 text-center text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-2">
            {label}
          </div>
        ))}
      </div>

      <div>
        {Array.from({ length: weekCount }, (_, w) => {
          const weekStart = addDays(gridStart, w * 7);
          const { placed, lanes } = layoutWeek(events, weekStart);
          const weekHeight = Math.max(
            MIN_WEEK,
            HEADER + lanes * (BAR_H + BAR_GAP) + BOTTOM_PAD,
          );
          const days = Array.from({ length: 7 }, (_, d) =>
            addDays(weekStart, d),
          );

          return (
            <div
              key={w}
              className="relative"
              style={{ height: `${weekHeight}px` }}
            >
              <div className="absolute inset-0 grid grid-cols-7">
                {days.map((day) => {
                  const outside = day.getMonth() !== month;
                  const isToday = sameDay(day, now);
                  return (
                    <div
                      key={day.getTime()}
                      className={`border-b border-r border-slate-100 p-1 dark:border-slate-700/60 ${
                        outside ? 'bg-slate-50 dark:bg-slate-800/40' : ''
                      }`}
                    >
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                          isToday
                            ? 'bg-sky-600 font-semibold text-white'
                            : outside
                              ? 'text-slate-300 dark:text-slate-600'
                              : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {day.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {placed.map(
                ({ event, startCol, endCol, lane, roundLeft, roundRight }) => {
                  const color = colorFor(
                    colorMap,
                    colorValue(event, colorFacet),
                  );
                  const isPast = event.end < startOfDay(now);
                  const left = (startCol / 7) * 100;
                  const width = ((endCol - startCol + 1) / 7) * 100;
                  const top = HEADER + lane * (BAR_H + BAR_GAP);
                  return (
                    <div
                      key={event.id}
                      className="absolute"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        top: `${top}px`,
                        height: `${BAR_H}px`,
                      }}
                    >
                      <button
                        type="button"
                        title={
                          event.about
                            ? `${event.name} - ${event.about}`
                            : event.name
                        }
                        onClick={() => onSelect(event)}
                        className={`mx-0.5 flex h-full w-[calc(100%-0.25rem)] items-center overflow-hidden whitespace-nowrap px-1.5 text-xs leading-none ${color.bar} ${
                          roundLeft ? 'rounded-l-md' : ''
                        } ${roundRight ? 'rounded-r-md' : ''} ${
                          isPast ? 'opacity-60' : ''
                        }`}
                      >
                        <span className="truncate">{event.name}</span>
                      </button>
                    </div>
                  );
                },
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
