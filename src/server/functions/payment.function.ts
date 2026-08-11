'use server'

import { db } from "#/db";
import { payment } from "#/db/schema";
import { CreatePaymentSchema, GetEventPaymentsSchema, GetPaymentsSchema, GetUserPaymentsSchema, type CreatePaymentRequest, type GetEventPaymentsRequest, type GetPaymentsRequest, type GetUserPaymentsRequest } from "#/db/validations/payment.validation";
import { and, asc, eq } from "drizzle-orm";

// CreatePaymentFn,
// GetPaymentsFn,
// GetPaymentByReferenceFn,
// GetUserPaymentsFn


// Create Payment
export async function CreatePaymentFn(data: CreatePaymentRequest) {
    try {
        const parsed = CreatePaymentSchema.parse(data)
        const [thePaynent] = await db.insert(payment).values({ ...parsed }).returning()
        return thePaynent
    } catch (err) {
        console.log('Error from CreatePaymentFn ', err)
        throw err
    }
}

// Get the Payments
export async function GetPaymentsFn(data: GetPaymentsRequest) {
    try {
        const parsed = GetPaymentsSchema.parse(data)
        const page = parsed.page ?? 1
        const limit = parsed.limit ?? 10
        const offset = (page - 1) * limit
        const whereClause = !parsed.provider ? undefined : eq(payment.provider, parsed.provider)
        const [payments, total] = await Promise.all([
            db.query.payment.findMany({ with: { event: { columns: { title: true } } }, where: whereClause, limit, offset, orderBy: asc(payment.createdAt) }),
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
}
// Get Payment By Reference Number
export async function GetPaymentByReferenceFn(data: { reference: string }) {
    try {
        const thePayment = db.query.payment
            .findFirst({
                with: { event: { columns: { title: true } } },
                where: eq(payment.referenceNumber, data.reference)
            })
        return thePayment
    } catch (err) {
        console.log('Error from GetPaymentByReferenceFn ', err)
        throw err
    }
}

// Get payments for A user
export async function GetUserPaymentsFn(data: GetUserPaymentsRequest) {
    try {
        const parsed = GetUserPaymentsSchema.parse(data)
        const page = parsed.page ?? 1
        const limit = parsed.limit ?? 10
        const offset = (page - 1) * limit
        const whereClause = !parsed.provider
            ? eq(payment.userId, parsed.userId)
            : and(eq(payment.userId, parsed.userId), eq(payment.provider, parsed.provider))

        const [userPayments, total] = await Promise.all([
            db.query.payment
                .findMany({
                    with: { event: { columns: { title: true } } },
                    where: whereClause, limit, offset, orderBy: asc(payment.createdAt)
                }),
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
}

export async function GetEventPaymentsFn(data: GetEventPaymentsRequest) {
    try {
        const parsed = GetEventPaymentsSchema.parse(data)
        const page = parsed.page ?? 1
        const limit = parsed.limit ?? 10
        const offset = (page - 1) * limit
        const whereClause = !parsed.provider
            ? eq(payment.eventId, parsed.eventId)
            : and(eq(payment.eventId, parsed.eventId), eq(payment.provider, parsed.provider))

        const [payments, total] = await Promise.all([
            db.query.payment.findMany({
                with: { event: { columns: { title: true } } },
                where: whereClause, limit, offset, orderBy: asc(payment.createdAt)
            }),
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
}
