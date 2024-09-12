
// services/followersService.ts
import runQuery from "../db/dal";

// Function to get followers for a specific vacation
export async function getFollowersForVacation(vacationId: number): Promise<number[]> {
    const q = `
        SELECT userId FROM followers WHERE vacationId = ?
    `;
    const res = await runQuery(q, [vacationId]);

    // Extract user IDs from the result
    return res.map((row: any) => row.userId);
}



// Function to add a follower to a specific vacation
export async function addFollower(vacationId: number, userId: number): Promise<void> {
    // Check if the follower already exists
    const checkQuery = `
        SELECT COUNT(*) as count FROM followers WHERE vacationId = ? AND userId = ?
    `;
    const [result] = await runQuery(checkQuery, [vacationId, userId]);
    if (result.count > 0) {
        throw new Error("Follower already exists");
    }

    // Insert new follower
    const q = `
        INSERT INTO followers (vacationId, userId)
        VALUES (?, ?)
    `;
    await runQuery(q, [vacationId, userId]);
}
