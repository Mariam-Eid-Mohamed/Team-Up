import {
  groupNotifications,
  formatNotifTime,
  type NotificationItem,
} from "@/utilis/notifications";

describe("notifications utilities", () => {
  test("groupNotifications splits notifications by type", () => {
    const base: Omit<NotificationItem, "type"> = {
      _id: "1",
      userId: {
        _id: "u1",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
      },
      referenceId: "ref",
      message: "msg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const all: NotificationItem[] = [
      { ...base, _id: "inv", type: "CLASS_INVITATION" },
      { ...base, _id: "msg", type: "MESSAGE" },
      { ...base, _id: "ann", type: "ANNOUNCEMENT" },
      { ...base, _id: "ist", type: "INVITATION_STATUS" },
      { ...base, _id: "cw", type: "COURSEWORK" },
    ];

    const grouped = groupNotifications(all);

    expect(grouped.invitations.map((n) => n._id)).toEqual(["inv"]);
    expect(grouped.messages.map((n) => n._id)).toEqual(["msg"]);
    expect(grouped.announcements.map((n) => n._id)).toEqual(["ann"]);
    expect(grouped.invitationStatus.map((n) => n._id)).toEqual(["ist"]);
    expect(grouped.coursework.map((n) => n._id)).toEqual(["cw"]);
  });

  test("formatNotifTime returns a human readable string", () => {
    const iso = "2024-01-01T10:00:00.000Z";
    const formatted = formatNotifTime(iso);

    expect(typeof formatted).toBe("string");
    expect(formatted.length).toBeGreaterThan(0);
  });
});

