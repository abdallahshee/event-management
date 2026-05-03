import { db } from "#/db";
import { notification } from "#/db/schema";
import { CreateNotificationSchema, GetNotificationByIdSchema, GetUserNotificationsSchema, GetNotificationsSchema } from "#/db/validations/notification.validation";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";

// CreateNotificationFn,
// GetNotificationsFn,
// GetNotificationByIdFn
// GetUserNotificationsFn


// Creating a Notification
export const CreateNotificationFn = createServerFn({ method: 'POST' })
    .middleware([])
    .inputValidator(CreateNotificationSchema)
    .handler(async ({ data }) => {
        try {
            const [theNotification] = await db.insert(notification).values({ ...data }).returning()
            return theNotification
        } catch (err) {
            console.log('Error from CreateNotificationFn ', err)
            throw err
        }
    })

// Getting many Notifications
export const GetNotificationsFn = createServerFn({ method: 'GET' })
    .middleware([])
    .inputValidator(GetNotificationsSchema)
    .handler(async ({ data }) => {
        try {
            const page = data.page ?? 1
            const limit = data.limit ?? 10
            const offset = (page - 1) * limit

            const whereClause = !data.type ? undefined : eq(notification.type, data.type)

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
    })
// Getting a Notification By id
export const GetNotificationByIdFn = createServerFn({ method: 'GET' })
    .middleware([])
    .inputValidator(GetNotificationByIdSchema)
    .handler(async ({ data }) => {
        try {
            let TheNot;
            if (!data.type) {
                TheNot = await db.query.notification.findFirst({ where: eq(notification.id, data.notificationId) })
            } else {
                TheNot = await db.query.notification
                    .findFirst({ where: and(eq(notification.id, data.notificationId), eq(notification.type, data.type)) })
            }
            return TheNot
        } catch (err) {
            console.log('Error from GetNotificationByIdFn ', err)
            throw err
        }
    })

// Getting User Notifications
export const GetUserNotificationsFn = createServerFn({ method: 'GET' })
    .middleware([])
    .inputValidator(GetUserNotificationsSchema)
    .handler(async ({ data }) => {
        try {
            const page = data.page ?? 1
            const limit = data.limit ?? 10
            const offset = (page - 1) * limit

            const whereClause = !data.type
                ? eq(notification.userId, data.userId)
                : and(eq(notification.userId, data.userId), eq(notification.type, data.type))

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
    })