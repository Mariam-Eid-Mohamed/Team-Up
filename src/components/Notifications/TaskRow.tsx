import type { NotificationItem } from "@/utilis/notifications";
import { formatNotifTime } from "@/utilis/notifications";

function CourseBadge({
  code,
  color,
}: {
  code?: string | null;
  color?: string | null;
}) {
  const safeCode = code?.trim() || "—";
  const safeColor = color?.trim() || "#94a3b8";
  return (
    <span
      className="inline-flex items-center justify-center text-[10px] font-bold text-white px-2 py-1 rounded"
      style={{ backgroundColor: safeColor }}
      title={safeCode}
    >
      {safeCode}
    </span>
  );
}

export default function TaskRow({ n }: { n: NotificationItem }) {
  const courseCode = (n as any).courseCode as string | null | undefined;
  const classColor = (n as any).classColor as string | null | undefined;

  const [headerLine, ...rest] = ((n as any).message as string).split("\n\n");
  const bodyLine = rest.join("\n\n");

  return (
    <div className="px-3 py-3 hover:bg-gray-50 transition cursor-pointer">
      <div className="flex items-start gap-3">
        <CourseBadge code={courseCode} color={classColor} />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-gray-500 leading-4">
            {headerLine}
          </p>
          <p className="text-xs text-gray-700 leading-4 break-words mt-0.5">
            {bodyLine || headerLine}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            {formatNotifTime((n as any).createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
