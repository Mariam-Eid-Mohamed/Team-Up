import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { getNotifications } from "@/Services/notification Endpoints/Endpoints";
import { getToken } from "@/utilis/token";
import type { NotificationItem } from "@/utilis/notifications";
import { groupNotifications, formatNotifTime } from "@/utilis/notifications";

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [all, setAll] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      if (res.data?.success && Array.isArray(res.data.data)) {
        setAll(res.data.data);
      } else {
        setAll([]);
      }
    } catch {
      setAll([]);
    } finally {
      setLoading(false);
    }
  };

  const grouped = useMemo(() => groupNotifications(all), [all]);

  const hasAny = all.length > 0;

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
        <div className="absolute right-[-40px] sm:right-0 mt-3 w-[290px] sm:w-[340px] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-[60]">
          {/* Invitations */}
          <SectionHeader title="Class invitations" />
          <div className="border-b border-gray-100">
            {loading ? (
              <LoadingRow />
            ) : grouped.invitations.length === 0 ? (
              <EmptyRow text="No class invitations" />
            ) : (
              grouped.invitations.map((n) => (
                <div key={n._id} className="p-3 hover:bg-gray-50">
                  <p className="text-xs text-gray-700">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {formatNotifTime(n.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Coursework */}
          <SectionHeader title="Coursework" />
          <div className="border-b border-gray-100">
            {loading ? (
              <LoadingRow />
            ) : grouped.coursework.length === 0 ? (
              <EmptyRow text="No coursework notifications" />
            ) : (
              grouped.coursework.map((n) => (
                <div
                  key={n._id}
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <p className="text-xs text-gray-700">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {formatNotifTime(n.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Announcements */}
          <SectionHeader title="Announcements" />
          <div className="border-b border-gray-100">
            {loading ? (
              <LoadingRow />
            ) : grouped.announcements.length === 0 ? (
              <EmptyRow text="No announcements" />
            ) : (
              grouped.announcements.map((n) => (
                <div
                  key={n._id}
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <p className="text-xs text-gray-700">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {formatNotifTime(n.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Collapsed placeholders */}
          <CollapsedRow title="Chat" />
          <CollapsedRow title="Teams" />
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50/80">
      <h3 className="font-bold text-[13px] text-gray-800">{title}</h3>
      <ChevronUp className="w-4 h-4 text-gray-400" />
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

function CollapsedRow({ title }: { title: string }) {
  return (
    <div className="px-3 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer border-b border-gray-100">
      <span className="font-bold text-[13px] text-gray-800">{title}</span>
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </div>
  );
}
