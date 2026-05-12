// CreateBookingFn,
// GetBookingsFn,
// GetBookingByIdFn,
// GetUserBookingsFn,

import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"

import type { PaginatorRequest } from "../utils"
import { CreateTicketFn, GetTicketByIdFn, GetTicketsFn, GetUserTicketsFn } from "#/server/functions/ticket.functions"
import type { CreateTicketRequest, GetUserTicketsRequest } from "../validations/ticket.validation"
// Creating a booking
export const CreateBookingMutationOption = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: CreateTicketRequest) => await CreateTicketFn({ data }),
        onSuccess: async () => await queryClient
        .invalidateQueries({ queryKey: GetTicketsQueryOption({}).queryKey ,exact:true})
    })
}

// Get Bookings
export const GetTicketsQueryOption = (data: PaginatorRequest) => queryOptions({
    queryKey: ['tickets', data],
    queryFn: async () => await GetTicketsFn({ data })
})

export const GetTicketByIdQueryOption = (data: { bookingId: string }) => queryOptions({
    queryKey: ['tickets', data],
    queryFn: async () => GetTicketByIdFn({ data })
})

export const GetUserTicketsQueryOption = (data: GetUserTicketsRequest) => queryOptions({
    queryKey: ['tickets', data],
    queryFn: async () => GetUserTicketsFn({ data })
})