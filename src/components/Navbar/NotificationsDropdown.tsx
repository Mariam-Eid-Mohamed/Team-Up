import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { getNotifications } from "@/Services/notification Endpoints/Endpoints";
import { getToken } from "@/utilis/token";
import type { NotificationItem } from "@/utilis/notifications";
import { formatNotifTime } from "@/utilis/notifications";
import { respondToInvitation } from "@/Services/class Endpoints/Endpoints";

type Grouped = {
  invitations: NotificationItem[];
  coursework: NotificationItem[];
  announcements: NotificationItem[];
  chat: NotificationItem[];
  teams: NotificationItem[];
};

function groupByType(items: NotificationItem[]): Grouped {
  const grouped: Grouped = {
    invitations: [],
    coursework: [],
    announcements: [],
    chat: [],
    teams: [],
  };

  for (const n of items) {
    const t = String((n as any).type || "").toUpperCase();

    if (t.includes("TEAM")) {
      grouped.teams.push(n);
    } else if (t.includes("INVIT")) {
      grouped.invitations.push(n);
    } else if (t === "COURSEWORK") {
      grouped.coursework.push(n);
    } else if (t === "ANNOUNCEMENT") {
      grouped.announcements.push(n);
    } else if (t === "CHAT") {
      grouped.chat.push(n);
    } else {
      grouped.coursework.push(n);
    }
  }

  return grouped;
}
type NotificationsDropdownProps = {
  onJoinedClass?: () => void;
};

export default function NotificationsDropdown({
  onJoinedClass,
}: NotificationsDropdownProps) {
  const [open, setOpen] = useState(false);
  const [all, setAll] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [expanded, setExpanded] = useState({
    invitations: true,
    coursework: true,
    announcements: true,
    chat: false,
    teams: false,
  });

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // fetch when open
  useEffect(() => {
    if (open) fetchNotifs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const fetchNotifs = async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      const res = await getNotifications(token);
      if (res.data?.success && Array.isArray(res.data.data))
        setAll(res.data.data);
      else setAll([]);
    } catch {
      setAll([]);
    } finally {
      setLoading(false);
    }
  };

  const grouped = useMemo(() => groupByType(all), [all]);
  const hasAny = all.length > 0;

  // OPTIONAL: actions for invitations (wire to your backend endpoints)
  const onAcceptInvite = async (n: NotificationItem) => {
    const token = getToken();
    if (!token) return;

    const invitationId = n.referenceId; // IMPORTANT: referenceId must be invitationId
    if (!invitationId) return;

    try {
      setLoading(true);
      await respondToInvitation(invitationId, "accept", token);

      // 1) refresh notifications so invitation disappears / moves
      await fetchNotifs();

      // 2) refresh classes list on homepage (so class appears immediately)
    } finally {
      setLoading(false);
    }
    await fetchNotifs();
    // 2) refresh classes list on homepage (so class appears immediately)

    onJoinedClass?.();
  };

  const onRejectInvite = async (n: NotificationItem) => {
    const token = getToken();
    if (!token) return;

    const invitationId = (n as any).referenceId; // IMPORTANT: referenceId must be invitationId
    if (!invitationId) return;

    try {
      setLoading(true);
      await respondToInvitation(invitationId, "decline", token);

      // 1) refresh notifications so invitation disappears / moves
      await fetchNotifs();
    } finally {
      setLoading(false);
    }
    await fetchNotifs();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="relative cursor-pointer p-1"
        onClick={() => setOpen((p) => !p)}
      >
        <Bell
          className={`w-5 h-5 transition-transform ${open ? "scale-110" : ""}`}
        />
        {hasAny && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
        )}
      </div>

      {open && (
        <div className="absolute right-[-40px] sm:right-0 mt-3 w-[300px] sm:w-[360px] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-[60]">
          <AccordionSection
            title="Class invitations"
            open={expanded.invitations}
            onToggle={() =>
              setExpanded((p) => ({ ...p, invitations: !p.invitations }))
            }
          >
            {loading ? (
              <LoadingRow />
            ) : grouped.invitations.length === 0 ? (
              <EmptyRow text="No class invitations" />
            ) : (
              grouped.invitations.map((n) => (
                <InviteRow
                  key={(n as any)._id}
                  n={n}
                  onAccept={() => onAcceptInvite(n)}
                  onReject={() => onRejectInvite(n)}
                />
              ))
            )}
          </AccordionSection>

          <AccordionSection
            title="Coursework"
            open={expanded.coursework}
            onToggle={() =>
              setExpanded((p) => ({ ...p, coursework: !p.coursework }))
            }
          >
            {loading ? (
              <LoadingRow />
            ) : grouped.coursework.length === 0 ? (
              <EmptyRow text="No coursework notifications" />
            ) : (
              grouped.coursework.map((n) => (
                <NotifRow key={(n as any)._id} n={n} />
              ))
            )}
          </AccordionSection>

          <AccordionSection
            title="Announcements"
            open={expanded.announcements}
            onToggle={() =>
              setExpanded((p) => ({ ...p, announcements: !p.announcements }))
            }
          >
            {loading ? (
              <LoadingRow />
            ) : grouped.announcements.length === 0 ? (
              <EmptyRow text="No announcements" />
            ) : (
              grouped.announcements.map((n) => (
                <NotifRow key={(n as any)._id} n={n} />
              ))
            )}
          </AccordionSection>

          {/* Collapsed placeholders */}
          <AccordionSection
            title="Chat"
            open={expanded.chat}
            onToggle={() => setExpanded((p) => ({ ...p, chat: !p.chat }))}
            disabled
          >
            <EmptyRow text="Coming soon" />
          </AccordionSection>

          {/* Find the Teams AccordionSection in your code and replace it with this: */}
          <AccordionSection
            title="Teams"
            open={expanded.teams}
            onToggle={() => setExpanded((p) => ({ ...p, teams: !p.teams }))}
          >
            {loading ? (
              <LoadingRow />
            ) : grouped.teams.length === 0 ? (
              <EmptyRow text="No team notifications" />
            ) : (
              <div className="max-h-[300px] overflow-y-auto">
                {grouped.teams.map((n) => (
                  <TeamRow
                    key={(n as any)._id}
                    n={n}
                    onApprove={() => onAcceptInvite(n)} // You can rename these handlers or create specific ones for teams
                    onReject={() => onRejectInvite(n)}
                  />
                ))}
              </div>
            )}
          </AccordionSection>
        </div>
      )}
    </div>
  );
}

function AccordionSection({
  title,
  open,
  onToggle,
  disabled,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-50/80 hover:bg-gray-50 transition"
      >
        <span className="font-bold text-[13px] text-gray-800">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && (
        <div className={`${disabled ? "opacity-70" : ""}`}>{children}</div>
      )}
    </div>
  );
}

function CourseBadge({
  code,
  color,
}: {
  code?: string | null;
  color?: string | null;
}) {
  const safeCode = code?.trim() || "—";
  const safeColor = color?.trim() || "#94a3b8"; // slate-400 fallback

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

function NotifRow({ n }: { n: NotificationItem }) {
  const courseCode = (n as any).courseCode as string | null | undefined;
  const classColor = (n as any).classColor as string | null | undefined;

  return (
    <div className="px-3 py-3 hover:bg-gray-50 transition cursor-pointer">
      <div className="flex items-start gap-3">
        <CourseBadge code={courseCode} color={classColor} />
        <div className="min-w-0">
          <p className="text-xs text-gray-700 leading-4 break-words">
            {(n as any).message}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            {formatNotifTime((n as any).createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

function InviteRow({
  n,
  onAccept,
  onReject,
}: {
  n: NotificationItem;
  onAccept: () => void;
  onReject: () => void;
}) {
  const courseCode = (n as any).courseCode as string | null | undefined;
  const classColor = (n as any).classColor as string | null | undefined;

  return (
    <div className="px-3 py-3 hover:bg-gray-50 transition">
      <div className="flex items-start gap-3">
        <CourseBadge code={courseCode} color={classColor} />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-700 leading-4 break-words">
            {(n as any).message}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            {formatNotifTime((n as any).createdAt)}
          </p>

          {/* buttons like your UIUX */}
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onAccept}
              className="flex-1 text-xs font-semibold border border-teal-500 text-teal-700 hover:bg-teal-50 rounded px-3 py-1"
            >
              Join
            </button>
            <button
              type="button"
              onClick={onReject}
              className="flex-1 text-xs font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 rounded px-3 py-1"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingRow() {
  return (
    <div className="p-4 flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div className="p-4 text-center">
      <p className="text-xs text-gray-500">{text}</p>
    </div>
  );
}
