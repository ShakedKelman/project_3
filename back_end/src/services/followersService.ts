
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
