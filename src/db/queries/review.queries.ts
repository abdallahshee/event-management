import { CreateReviewFn, GetReviewsByEventIdFn as GetReviewsByEventIdFn } from "#/server/functions/reveiew.functions"
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateReviewRequest, GetEventReviewsRequest } from "../validations/review.validation"

// CreateReviewFn,
export const CreateReviewMutationOption = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: CreateReviewRequest) => CreateReviewFn({ data }),
        onSuccess: async (res, variables) => await queryClient
           .invalidateQueries({ queryKey: GetReviewsByEventQueryOption({eventId:variables.eventId}).queryKey ,exact:true}) 
          })
}

// GetReviewsByEventFn
export const GetReviewsByEventQueryOption = (data: GetEventReviewsRequest) => queryOptions({
    queryKey:['reviews',data],
    queryFn:async()=>GetReviewsByEventIdFn({data})
})

