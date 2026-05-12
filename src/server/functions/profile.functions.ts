// Invite user
// List Users
// Update user by ID


import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../middleware";
import type { Role } from "#/db/validations/profile.validation";

export const getCurrentUserAndRoleFn = createServerFn()
    .middleware([authMiddleware])
    .handler(async ({ context }) => {
        try {
            const { user } = context
            if (!user) return null
            const role:Role = user.user_metadata.role
            return { user, role}
        } catch (err) {
            console.error('Error from getCurrentUserAndRoleFn:', err)
            throw err
        }
    })