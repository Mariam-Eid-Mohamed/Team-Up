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

// Create a new team for a specific coursework
export const createTeam = async (name: string, courseworkId: string, token: string) => {
    return Api.post(
        `${API_BASE}/create`,
        { name, courseworkId },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

// Get team details for a specific coursework and team
export const getTeamDetails = async (courseworkId: string, teamId: string, token: string) => {
    return Api.get(
        `${API_BASE}/courseworks/${courseworkId}/teams/${teamId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

// Lock a team (Leader only)
export const lockTeam = async (teamId: string, token: string) => {
    return Api.patch(
        `${API_BASE}/${teamId}/lock`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};
