"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function deleteCurrentUser() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const client = await clerkClient();
        await client.users.deleteUser(userId);
        return { success: true };
    } catch (error) {
        console.error("Error deleting user from Clerk via Admin API:", error);
        throw new Error("Failed to delete user account.");
    }
}
