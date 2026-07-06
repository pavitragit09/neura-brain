"use client";

import type { ActivityEvent } from "./activity-detail-sheet";
import { ActivityItem } from "./activity-item";
import { formatDateTime, parseUTCDate } from "@/lib/date";

type ActivityTimelineProps = {
  events: ActivityEvent[];
  onSelectEvent: (event: ActivityEvent) => void;
};

export function ActivityTimeline({ events, onSelectEvent }: ActivityTimelineProps) {
  // Helper to group events by date
  const groupEventsByDate = (items: ActivityEvent[]) => {
    const groups: { [key: string]: ActivityEvent[] } = {};

    const todayStr = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    items.forEach((item) => {
      const itemDate = parseUTCDate(item.timestamp);
      const itemDateStr = itemDate.toDateString();

      let header = "";
      if (itemDateStr === todayStr) {
        header = "Today";
      } else if (itemDateStr === yesterdayStr) {
        header = "Yesterday";
      } else {
        // Return Day of Week or Date String
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const diffTime = Math.abs(new Date().getTime() - itemDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 7) {
          header = days[itemDate.getDay()];
        } else {
          header = formatDateTime(itemDate, { dateOnly: true, monthLong: true });
        }
      }

      if (!groups[header]) {
        groups[header] = [];
      }
      groups[header].push(item);
    });

    return groups;
  };

  const grouped = groupEventsByDate(events);
  const headers = Object.keys(grouped);

  return (
    <div className="relative pl-3.5 border-l border-border/20 ml-2 space-y-6">
      {headers.map((header) => (
        <div key={header} className="space-y-3 relative">
          {/* Section node marker */}
          <div className="absolute -left-[20.5px] top-1.5 flex size-3 items-center justify-center rounded-full bg-background border-2 border-border/40 select-none" />

          <h3 className="text-xs font-semibold tracking-wider text-muted-foreground/75 select-none uppercase px-1">
            {header}
          </h3>

          <div className="flex flex-col gap-2.5">
            {grouped[header].map((event) => (
              <ActivityItem
                key={event.id}
                event={event}
                onClick={() => onSelectEvent(event)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
