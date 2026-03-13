import {
  formatNotifTime,
  type NotificationItem,
  isTeamActionable,
  isTeamRequestAccepted,
  isTeamRequestRejected,
  isTeamInvitationStatus,
  getTeamPrimaryActionLabel,
  getTeamSuccessText,
  getTeamRejectedText,
} from "@/utilis/notifications";

function parseMessage(message: string) {
  const lines = message
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    title: lines[0] || "",
    details: lines.slice(1),
  };
}

export default function TeamRow({
  n,
  onApprove,
  onReject,
}: {
  n: NotificationItem;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isActionable = isTeamActionable(n);

  const showAccepted =
    !isActionable &&
    (isTeamRequestAccepted(n) ||
      (isTeamInvitationStatus(n) &&
        n.message.toLowerCase().includes("accepted")));

  const showRejected =
    !isActionable &&
    (isTeamRequestRejected(n) ||
      (isTeamInvitationStatus(n) &&
        n.message.toLowerCase().includes("declined")) ||
      (isTeamInvitationStatus(n) &&
        n.message.toLowerCase().includes("rejected")));

  const { title, details } = parseMessage(n.message);

  return (
    <div className="px-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition">
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-gray-800 leading-snug">
          {title}
        </p>

        {details.length > 0 && (
          <div className="mt-1 space-y-0.5">
            {details.map((line, index) => (
              <p key={index} className="text-[12px] text-gray-500 leading-snug">
                {line}
              </p>
            ))}
          </div>
        )}

        <p className="text-[10px] text-gray-400 mt-2">
          {formatNotifTime(n.createdAt)}
        </p>

        {isActionable && (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onApprove();
              }}
              className="flex-1 text-[12px] font-medium bg-[#318080] text-white rounded-md py-1.5 hover:bg-[#266363] transition"
            >
              {getTeamPrimaryActionLabel(n)}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onReject();
              }}
              className="flex-1 text-[12px] font-medium border border-[#318080] text-[#318080] rounded-md py-1.5 hover:bg-gray-50 transition"
            >
              Reject
            </button>
          </div>
        )}

        {showAccepted && (
          <div className="mt-3 flex items-center gap-2 bg-green-50 px-2 py-1.5 rounded border border-green-100">
            <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center text-[8px] text-white">
              ✓
            </div>
            <span className="text-[10px] text-green-700 font-medium">
              {getTeamSuccessText(n)}
            </span>
          </div>
        )}

        {showRejected && (
          <div className="mt-3 flex items-center gap-2 bg-red-50 px-2 py-1.5 rounded border border-red-100">
            <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white">
              ✕
            </div>
            <span className="text-[10px] text-red-700 font-medium">
              {getTeamRejectedText(n)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
