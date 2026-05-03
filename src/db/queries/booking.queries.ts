// CreateBookingFn,
// GetBookingsFn,
// GetBookingByIdFn,
// GetUserBookingsFn,

import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateBookingRequest, GetUserBookingsRequest } from "../validations/booking.validation"
import { CreateBookingFn, GetBookingByIdFn, GetBookingsFn, GetUserBookingsFn } from "#/server/functions/booking.functions"
import type { PaginatorRequest } from "../utils"
// Creating a booking
export const CreateBookingMutationOption = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: CreateBookingRequest) => await CreateBookingFn({ data }),
        onSuccess: async () => await queryClient
        .invalidateQueries({ queryKey: GetBookingsQueryOption({}).queryKey ,exact:true})
    })
}

// Get Bookings
export const GetBookingsQueryOption = (data: PaginatorRequest) => queryOptions({
    queryKey: ['bookings', data],
    queryFn: async () => await GetBookingsFn({ data })
})

export const GetBookingByIdQueryOption = (data: { bookingId: string }) => queryOptions({
    queryKey: ['bookings', data],
    queryFn: async () => GetBookingByIdFn({ data })
})

export const GetUserBookingsQueryOption = (data: GetUserBookingsRequest) => queryOptions({
    queryKey: ['bookings', data],
    queryFn: async () => GetUserBookingsFn({ data })
})