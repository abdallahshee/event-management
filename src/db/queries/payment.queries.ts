// CreatePaymentFn,
// GetPaymentsFn,
// GetPaymentByReferenceFn,
// GetUserPaymentsFn

import { CreatePaymentFn, GetPaymentByReferenceFn, GetPaymentsFn, GetUserPaymentsFn } from "#/server/functions/payment.function"
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreatePaymentRequest,  GetEventPaymentsRequest, GetPaymentsRequest, GetUserPaymentsRequest } from "../validations/payment.validation"

export const CreatePaymentMutationOption = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: CreatePaymentRequest) => CreatePaymentFn({ data }),
        onSuccess: async () => await queryClient
            .invalidateQueries({ queryKey: GetPaymentsQueryOption({ provider: "", paginator: {} }).queryKey,exact:true })
    })
}

export const GetPaymentsQueryOption = (data: GetPaymentsRequest) => queryOptions({
    queryKey: ['payments', data],
    queryFn: async () => GetPaymentsFn({ data })
})


export const GetPaymentByReferenceQueryOption = (data: { reference: string }) => queryOptions({
    queryKey: ['payments', data],
    queryFn: async () => GetPaymentByReferenceFn({ data })
})

export const GetUserPaymentsQueryOption = (data: GetUserPaymentsRequest) => queryOptions({
    queryKey: ['payments', data],
    queryFn: async () => GetUserPaymentsFn({ data })
})

export const GetEventPaymentsQueryOption=(data:GetEventPaymentsRequest)=>queryOptions({
    queryKey:['payments',data],
    queryFn:async()=>GetPaymentsFn({data})
})