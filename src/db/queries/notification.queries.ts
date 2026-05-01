// CreateNotificationFn,
// GetNotificationsFn,
// GetNotificationByIdFn
// GetUserNotificationsFn

import { CreateNotificationFn, GetNotificationByIdFn, GetNotificationsFn, GetUserNotificationsFn } from "#/server/functions/notification.functions"
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateNotificationRequest, GetNotificationByIdRequest, GetNotificationsRequest, GetUserNotificationsRequest } from "../validations/notification.validation"


export const CreateNotificationMutationOption=(data:CreateNotificationRequest)=>{
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn:async()=>CreateNotificationFn({data}),
        onSuccess:async()=>queryClient
        .invalidateQueries({queryKey:GetNotificationsQueryOption({paginator:{}}).queryKey})
    })
}

export const GetNotificationsQueryOption=(data:GetNotificationsRequest)=>queryOptions({
    queryKey:['notifications',data],
    queryFn:async()=>GetNotificationsFn({data})
})

export const GetNotificationByIdQueryOption=(data:GetNotificationByIdRequest)=>queryOptions({
    queryKey:['notifications',data],
    queryFn:async()=>GetNotificationByIdFn({data})
})

export const GetUserNotificationQueryOption=(data:GetUserNotificationsRequest)=>queryOptions({
    queryKey:['notifications',data],
    queryFn:async()=>GetUserNotificationsFn({data})
})