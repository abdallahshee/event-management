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
        onSuccess: async () => await queryClient.invalidateQueries({ queryKey: GetEventsQueryOption({}).queryKey })
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

export const UpdateEventQueryOption = (data: UpdateEventRequest) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => UpdateEventFn({ data }),
        onSuccess:async(variables, result)=>{
            
        //  queryClient.setQueriesData({queryKey:GetEventByIdQueryOption(variables).queryKey})
             await queryClient.invalidateQueries({queryKey:GetEventsQueryOption({}).queryKey})
        }
       
    })
}