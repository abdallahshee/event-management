'use server'

// Invite user
// List Users
// Update user by ID

import { getAuthUser } from "#/server/auth"
import type { Role } from "#/db/validations/profile.validation"

export async function getCurrentUserAndRoleFn() {
  try {
    const user = await getAuthUser()
    if (!user) return null
    const role: Role = user.user_metadata.role
    return { user, role }
  } catch (err) {
    console.error('Error from getCurrentUserAndRoleFn:', err)
    throw err
  }
}
