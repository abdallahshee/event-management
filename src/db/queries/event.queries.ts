// CreateEventFn
// GetEventsFn
// GetEventByIdFn

import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateEventRequest, UpdateEventRequest } from "../validations/event.validation"
import { CreateEventFn, GetEventByIdFn, GetEventsFn, UpdateEventFn } from "#/server/functions/event.functions"
import type { PaginatorRequest } from "../utils"

export const CreateEventMutationOption = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: CreateEventRequest) => await CreateEventFn({ data }),
        onSuccess: async () => await queryClient
        .invalidateQueries({ queryKey: GetEventsQueryOption({}).queryKey,exact:true  })
    })
}

export const GetEventsQueryOption = (data: PaginatorRequest) => queryOptions({
    queryKey: ['events', data],
    queryFn: async () => GetEventsFn({ data })
})


export const GetEventByIdQueryOption = (data: { eventId: string }) => queryOptions({
    queryKey: ['events', data],
    queryFn: async () => GetEventByIdFn({ data })
})

export const UpdateEventQueryOption = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: UpdateEventRequest) => UpdateEventFn({ data }),
        onSuccess:async(data, variables)=>{
         queryClient.setQueryData(GetEventByIdQueryOption({eventId:variables.eventId}).queryKey, data)
             await queryClient
             .invalidateQueries({queryKey:GetEventsQueryOption({}).queryKey,exact:true })
        }
       
    })
}