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
            let theNots;
            if (!data.type) {
                theNots = await db.query.notification.findMany()
            } else {
                theNots = await db.query.notification.findMany({ where: eq(notification.type, data.type) })
            }
            return theNots
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
            let UserNots;
            if (!data.type) {
                UserNots = await db.query.notification.findMany({ where: eq(notification.userId, data.userId) })
            } else {
                UserNots = await db.query.notification
                    .findMany({ where: and(eq(notification.userId, data.userId), eq(notification.type, data.type)) })
            }
            return UserNots
        } catch (err) {
            console.log('Error from GetUserNotificationFn ', err)
            throw err
        }
    })
