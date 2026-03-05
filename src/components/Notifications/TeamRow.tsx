import { formatNotifTime, type NotificationItem } from "@/utilis/notifications";

export default function TeamRow({
  n,
  onApprove,
  onReject,
}: {
  n: NotificationItem;
  onApprove: () => void;
  onReject: () => void;
}) {
  const status = (n as any).status?.toLowerCase(); // e.g., 'pending', 'approved', 'rejected'
  const actionType = (n as any).actionType; // e.g., 'request' (student asked) or 'invite' (invited by peer)

  return (
    <div className="px-4 py-4 border-b border-gray-50 last:border-0 transition hover:bg-gray-50/50">
      <div className="min-w-0 flex-1">
        <p className="text-[13px] text-gray-800 leading-snug">
          {(n as any).message}
        </p>
        <p className="text-[10px] text-gray-400 mt-1">
          {formatNotifTime((n as any).createdAt)}
        </p>

        {/* 1. Actionable State (Buttons) */}
        {status === "pending" && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={onApprove}
              className="flex-1 text-[12px] font-medium bg-[#318080] text-white rounded-md py-1.5 hover:bg-[#266363] transition"
            >
              {actionType === "request" ? "Approve" : "Join"}
            </button>
            <button
              onClick={onReject}
              className="flex-1 text-[12px] font-medium border border-[#318080] text-[#318080] rounded-md py-1.5 hover:bg-gray-50 transition"
            >
              Reject
            </button>
          </div>
        )}

        {/* 2. Success State (Green Bar) */}
        {(status === "approved" || status === "accepted") && (
          <div className="mt-2 flex items-center gap-2 bg-green-50 px-2 py-1 rounded border border-green-100">
            <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center text-[8px] text-white italic">
              ✓
            </div>
            <span className="text-[10px] text-green-700 font-medium">
              Invitation accepted
            </span>
          </div>
        )}

        {/* 3. Rejected State (Red Bar) */}
        {(status === "rejected" || status === "declined") && (
          <div className="mt-2 flex items-center gap-2 bg-red-50 px-2 py-1 rounded border border-red-100">
            <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white">
              ✕
            </div>
            <span className="text-[10px] text-red-700 font-medium">
              Invitation declined
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
