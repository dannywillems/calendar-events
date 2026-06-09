import { ExternalLink, MapPin, X } from 'lucide-react';
import type { CalEvent } from '../lib/types';
import { formatRange } from '../lib/date';

interface EventDetailProps {
  event: CalEvent;
  onClose: () => void;
}

function Tag({ label }: { label: string }) {
  return (
    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-200">
      {label}
    </span>
  );
}

// Modal overlay with the full details of a single event.
export default function EventDetail({ event, onClose }: EventDetailProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {event.name}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          {formatRange(event.start, event.end)}
        </p>

        {event.location && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
            <MapPin className="h-4 w-4 shrink-0" />
            {event.location}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {event.kind && <Tag label={event.kind} />}
          {event.status && <Tag label={event.status} />}
          {event.field.map((f) => (
            <Tag key={f} label={f} />
          ))}
        </div>

        {event.notes && (
          <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">
            {event.notes}
          </p>
        )}

        {event.url && (
          <a
            href={event.url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:underline dark:text-sky-400"
          >
            Visit website
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}
