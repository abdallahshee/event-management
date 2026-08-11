'use server'

import { db } from "#/db";
import { notification } from "#/db/schema";
import { CreateNotificationSchema, GetNotificationByIdSchema, GetUserNotificationsSchema, GetNotificationsSchema, type CreateNotificationRequest, type GetNotificationByIdRequest, type GetUserNotificationsRequest, type GetNotificationsRequest } from "#/db/validations/notification.validation";
import { and, eq } from "drizzle-orm";

// CreateNotificationFn,
// GetNotificationsFn,
// GetNotificationByIdFn
// GetUserNotificationsFn


// Creating a Notification
export async function CreateNotificationFn(data: CreateNotificationRequest) {
    try {
        const parsed = CreateNotificationSchema.parse(data)
        const [theNotification] = await db.insert(notification).values({ ...parsed }).returning()
        return theNotification
    } catch (err) {
        console.log('Error from CreateNotificationFn ', err)
        throw err
    }
}

// Getting many Notifications
export async function GetNotificationsFn(data: GetNotificationsRequest) {
    try {
        const parsed = GetNotificationsSchema.parse(data)
        const page = parsed.page ?? 1
        const limit = parsed.limit ?? 10
        const offset = (page - 1) * limit

        const whereClause = !parsed.type ? undefined : eq(notification.type, parsed.type)

        const [theNots, total] = await Promise.all([
            db.query.notification.findMany({ where: whereClause, limit, offset }),
            db.$count(notification, whereClause)
        ])
        return {
            data: theNots,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
        }
    } catch (err) {
        console.log('Error from GetNotificationsFn ', err)
        throw err
    }
}
// Getting a Notification By id
export async function GetNotificationByIdFn(data: GetNotificationByIdRequest) {
    try {
        const parsed = GetNotificationByIdSchema.parse(data)
        let TheNot;
        if (!parsed.type) {
            TheNot = await db.query.notification.findFirst({ where: eq(notification.id, parsed.notificationId) })
        } else {
            TheNot = await db.query.notification
                .findFirst({ where: and(eq(notification.id, parsed.notificationId), eq(notification.type, parsed.type)) })
        }
        return TheNot
    } catch (err) {
        console.log('Error from GetNotificationByIdFn ', err)
        throw err
    }
}

// Getting User Notifications
export async function GetUserNotificationsFn(data: GetUserNotificationsRequest) {
    try {
        const parsed = GetUserNotificationsSchema.parse(data)
        const page = parsed.page ?? 1
        const limit = parsed.limit ?? 10
        const offset = (page - 1) * limit

        const whereClause = !parsed.type
            ? eq(notification.userId, parsed.userId)
            : and(eq(notification.userId, parsed.userId), eq(notification.type, parsed.type))

        const [UserNots, total] = await Promise.all([
            db.query.notification.findMany({ where: whereClause, limit, offset }),
            db.$count(notification, whereClause)
        ])
        return {
            data: UserNots,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
        }
    } catch (err) {
        console.log('Error from GetUserNotificationFn ', err)
        throw err
    }
}
