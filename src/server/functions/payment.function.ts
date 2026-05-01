import { db } from "#/db";
import { payment } from "#/db/schema";
import { CreatePaymentSchema, GetEventPaymentsSchema, GetPaymentsSchema, GetUserPaymentsSchema } from "#/db/validations/payment.validation";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq } from "drizzle-orm";

// CreatePaymentFn,
// GetPaymentsFn,
// GetPaymentByReferenceFn,
// GetUserPaymentsFn


// Create Payment
export const CreatePaymentFn = createServerFn({ method: 'POST' })
    .middleware([])
    .inputValidator(CreatePaymentSchema)
    .handler(async ({ data }) => {
        try {
            const [thePaynent] = await db.insert(payment).values({ ...data }).returning()
            return thePaynent
        } catch (err) {
            console.log('Error from CreatePaymentFn ', err)
            throw err
        }
    })

// Get the Payments
export const GetPaymentsFn = createServerFn({ method: 'GET' })
    .middleware([])
    .inputValidator(GetPaymentsSchema)
    .handler(async ({ data }) => {
        try {
            const page = data.paginator.page ?? 1
            const limit = data.paginator.limit ?? 10
            const offset = (page - 1) * limit

            const whereClause = !data.provider ? undefined : eq(payment.provider, data.provider)

            const [payments, total] = await Promise.all([
                db.query.payment.findMany({with:{event:true}, where: whereClause, limit, offset,orderBy:asc(payment.createdAt) }),
                db.$count(payment, whereClause)
            ])
            return {
                data: payments,
                meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
            }
        } catch (err) {
            console.log('Error from GetPaymentsFn ', err)
            throw err
        }
    })
// Get Payment By Reference Number
export const GetPaymentByReferenceFn = createServerFn({ method: 'GET' })
    .middleware([])
    .inputValidator((data: { reference: string }) => data)
    .handler(async ({ data }) => {
        try {
            const thePayment = db.query.payment.findFirst({with:{event:true}, where: eq(payment.referenceNumber, data.reference) })
            return thePayment
        } catch (err) {
            console.log('Error from GetPaymentByReferenceFn ', err)
            throw err
        }
    })

// Get payments for A user
export const GetUserPaymentsFn = createServerFn({ method: 'GET' })
    .middleware([])
    .inputValidator(GetUserPaymentsSchema)
    .handler(async ({ data }) => {
        try {
            const page = data.paginator.page ?? 1
            const limit = data.paginator.limit ?? 10
            const offset = (page - 1) * limit

            const whereClause = !data.provider
                ? eq(payment.userId, data.userId)
                : and(eq(payment.userId, data.userId), eq(payment.provider, data.provider))

            const [userPayments, total] = await Promise.all([
                db.query.payment.findMany({with:{event:true}, where: whereClause, limit, offset,orderBy:asc(payment.createdAt) }),
                db.$count(payment, whereClause)
            ])
            return {
                data: userPayments,
                meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
            }
        } catch (err) {
            console.log('Error from GetUserPaymentsFn ', err)
            throw err
        }
    })

export const GetEventPaymentsFn = createServerFn({ method: "GET" })
    .middleware([])
    .inputValidator(GetEventPaymentsSchema)
    .handler(async ({ data }) => {
        try {
            const page = data.paginator.page ?? 1
            const limit = data.paginator.limit ?? 10
            const offset = (page - 1) * limit

            const whereClause = !data.provider
                ? eq(payment.eventId, data.eventId)
                : and(eq(payment.eventId, data.eventId), eq(payment.provider, data.provider))

            const [payments, total] = await Promise.all([
                db.query.payment.findMany({with:{event:true}, where: whereClause, limit, offset,orderBy:asc(payment.createdAt) }),
                db.$count(payment, whereClause)
            ])
            return {
                data: payments,
                meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
            }
        } catch (err) {
            console.log('Error from GetEventPaymentsFn ', err)
            throw err
        }
    })