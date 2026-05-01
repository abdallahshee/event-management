import { CreateReviewFn, GetReviewsByEventIdFn as GetReviewsByEventIdFn } from "#/server/functions/reveiew.functions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateReviewRequest, GetEventReviewsRequest } from "../validations/review.validation"

// CreateReviewFn,
export const CreateReviewMutationOption = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: CreateReviewRequest) => CreateReviewFn({ data }),
        onSuccess: async () => await queryClient
            .invalidateQueries({})
    })
}

// GetReviewsByEventFn
export const GetReviewsByEventQueryOption = (data: GetEventReviewsRequest) => {
    return useMutation({
        mutationFn: async () => GetReviewsByEventIdFn({ data })
    })
}
