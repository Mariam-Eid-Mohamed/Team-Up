import Api from "../Api";

const API_BASE = "/teams";

// Send a join request to the leader of an unlocked team for a specific coursework
export const sendJoinRequest = async (teamId: string, token: string) => {
    return Api.post(
        `${API_BASE}/${teamId}/join-requests`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};
