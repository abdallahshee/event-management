// Invite user
// List Users
// Update user by ID


import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../middleware";

export const getCurrentUserAndRoleFn = createServerFn()
    .middleware([authMiddleware])
    .handler(async ({ context }) => {
        try {
            const { user } = context
            if (!user) return null
            const isAdmin = user.user_metadata.role === "admin"
            return { user, isAdmin}
        } catch (err) {
            console.error('Error from getCurrentUserAndRoleFn:', err)
            throw err
        }
    })