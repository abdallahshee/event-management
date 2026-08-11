'use server'

import { db } from "#/db";
import { waitlist } from "#/db/schema";
import { and, asc, count, desc, eq, gt, sql } from "drizzle-orm";
import { EventWaitlistSchema, RemoveAddWaitlistSchema, UserWaitlistSchema, type EventWaitlistRequest, type RemoveAddWaitlistRequest, type UserWaitlistRequest } from "#/db/validations/waitlist.validation";



type PaginatedMeta = {
  total:      number
  page:       number
  limit:      number
  totalPages: number
}

// ── Helper ───────────────────────────────────────────────
function getPaginationOffset(page: number, limit: number) {
  return (page - 1) * limit
}

// ── Get event waitlist (paginated) ───────────────────────
export async function getEventWaitlistFn(data: EventWaitlistRequest) {
  try {
    const parsed = EventWaitlistSchema.parse(data)
    const { eventId, page = 1, limit = 10 } = parsed
    const offset = getPaginationOffset(page, limit)

    const [eventWaitlist, totalCount] = await Promise.all([
      db.query.waitlist.findMany({
        where:   eq(waitlist.eventId, eventId),
        orderBy: asc(waitlist.position),
        columns: { createdAt: false },
        limit,
        offset,
        with: {
          user: {
            columns: {
              firstName: true,
              lastName:  true,
              email:     true,
              avatarUrl: true,
            }
          },
        }
      }),
      db.select({ count: count() })
        .from(waitlist)
        .where(eq(waitlist.eventId, eventId))
    ])

    const meta: PaginatedMeta = {
      total:      totalCount[0].count,
      page,
      limit,
      totalPages: Math.ceil(totalCount[0].count / limit),
    }

    return { data: eventWaitlist, meta }
  } catch (err) {
    console.error('Error from getEventWaitlistFn:', err)
    throw err
  }
}

// ── Get user waitlist (paginated) ────────────────────────
export async function getUserWaitlistFn(data: UserWaitlistRequest) {
  try {
    const parsed = UserWaitlistSchema.parse(data)
    const { userId, page = 1, limit = 10 } = parsed
    const offset = getPaginationOffset(page, limit)

    const [userWaitlist, totalCount] = await Promise.all([
      db.query.waitlist.findMany({
        where:   eq(waitlist.userId, userId),
        orderBy: asc(waitlist.position),
        columns: { createdAt: false },
        limit,
        offset,
        with: {
          event: {
            columns: {
              title:    true,
              startsAt: true,
              endsAt:   true,
              category: true,
            },
            with: {
              location: {
                columns: { name: true }
              }
            },
          },
        }
      }),
      db.select({ count: count() })
        .from(waitlist)
        .where(eq(waitlist.userId, userId))
    ])

    const meta: PaginatedMeta = {
      total:      totalCount[0].count,
      page,
      limit,
      totalPages: Math.ceil(totalCount[0].count / limit),
    }

    return { data: userWaitlist, meta }
  } catch (err) {
    console.error('Error from getUserWaitlistFn:', err)
    throw err
  }
}

// ── Add to waitlist ──────────────────────────────────────
export async function addToWaitlistFn(data: RemoveAddWaitlistRequest) {
  try {
    const parsed = RemoveAddWaitlistSchema.parse(data)
    const existing = await db.query.waitlist.findFirst({
      where: and(
        eq(waitlist.eventId, parsed.eventId),
        eq(waitlist.userId,  parsed.userId),
      )
    })

    if (existing) throw new Error('You are already on the waitlist for this event')

    const lastEntry = await db.query.waitlist.findFirst({
      where:   eq(waitlist.eventId, parsed.eventId),
      orderBy: desc(waitlist.position),
      columns: { position: true },
    })

    const nextPosition = (lastEntry?.position ?? 0) + 1

    const newEntry = await db.insert(waitlist).values({
      eventId:  parsed.eventId,
      userId:   parsed.userId,
      position: nextPosition,
      notified: false,
    }).returning()

    return newEntry[0]
  } catch (err) {
    console.error('Error from addToWaitlistFn:', err)
    throw err
  }
}

// ── Remove from waitlist ─────────────────────────────────
export async function removeFromWaitlistFn(data: RemoveAddWaitlistRequest) {
  try {
    const parsed = RemoveAddWaitlistSchema.parse(data)
    const entry = await db.query.waitlist.findFirst({
      where: and(
        eq(waitlist.eventId, parsed.eventId),
        eq(waitlist.userId,  parsed.userId),
      ),
      columns: { id: true, position: true },
    })

    if (!entry) throw new Error('You are not on the waitlist for this event')

    await db.delete(waitlist)
      .where(
        and(
          eq(waitlist.eventId, parsed.eventId),
          eq(waitlist.userId,  parsed.userId),
        )
      )

    await db.update(waitlist)
      .set({ position: sql`${waitlist.position} - 1` })
      .where(
        and(
          eq(waitlist.eventId,  parsed.eventId),
          gt(waitlist.position, entry.position),
        )
      )

    return { success: true }
  } catch (err) {
    console.error('Error from removeFromWaitlistFn:', err)
    throw err
  }
}
