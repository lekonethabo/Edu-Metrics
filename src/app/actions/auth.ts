"use server";

import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function loginUserAction(email: string, password: string) {
    try {
        if (!email || !password) {
            return { success: false, error: "auth/invalid-credential" };
        }

        const client = await clientPromise;
        const db = client.db();

        // 1. Look up the user by email in your MongoDB collection
        const user = await db.collection("users").findOne({ email: email.toLowerCase() });

        if (!user) {
            return { success: false, error: "auth/user-not-found" };
        }

        // 2. Verify the password matches the stored bcrypt hash
        const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

        if (!passwordIsValid) {
            return { success: false, error: "auth/invalid-credential" };
        }

        // 3. Return success and the user's role/context data
        return {
            success: true,
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                schoolId: user.schoolId || null,
                displayName: user.displayName || user.email.split("@")[0],
            }
        };

    } catch (error) {
        console.error("[SERVER ACTION AUTH ERROR]:", error);
        return { success: false, error: "server-error" };
    }
}