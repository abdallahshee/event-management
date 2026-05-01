// CreateEventFn
// GetEventsFn
// GetEventByIdFn

import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateEventRequest } from "../validations/event.validation"
import { CreateEventFn, GetEventByIdFn, GetEventsFn } from "#/server/functions/event.functions"
import type { PaginatorRequest } from "../utils"

export const CreateEventMutationOption=()=>{
    const queryClient=useQueryClient() 
    return useMutation({
        mutationFn:async(data:CreateEventRequest)=>await CreateEventFn({data}),
        onSuccess:async()=>await queryClient.invalidateQueries({queryKey:GetEventsQueryOption({}).queryKey}) 
    })
}

export const GetEventsQueryOption=(data:PaginatorRequest)=>queryOptions({
    queryKey:['events',data],
    queryFn:async()=>GetEventsFn({data})
})


export const GetEventByIdQueryOption=(data:{eventId:string})=>queryOptions({
    queryKey:['events',data],
    queryFn:async()=>GetEventByIdFn({data})
})