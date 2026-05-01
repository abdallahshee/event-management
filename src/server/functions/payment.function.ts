import { db } from "#/db";
import { payment } from "#/db/schema";
import { CreatePaymentSchema, GetPaymentsSchema, GetUserPaymentsSchema } from "#/db/validations/payment.validation";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";

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
            let payments;
            if (!data.provider) {
                payments = await db.query.payment.findMany({
                    with: {

                    }
                })
            } else {
                payments = await db.query.payment.findMany({ where: eq(payment.provider, data.provider) })
            }
            return payments
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
            const thePayment = db.query.payment.findFirst({ where: eq(payment.referenceNumber, data.reference) })
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
            let userPayments;
            if (!data.provider) {
                userPayments = await db.query.payment.findMany({ where: eq(payment.userId, data.userId) })
            } else {
                userPayments = await db.query.payment
                    .findMany({ where: and(eq(payment.userId, data.userId), eq(payment.provider, data.provider)) })
            }
            return userPayments
        } catch (err) {
            console.log('Error from GetUserPaymentsFn ', err)
            throw err
        }
    })