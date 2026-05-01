// CreateLocationFn,
// GetLocationsFn,
// GetLocationByIdFn,
// UpdateLocationFn,

import { CreateLocationFn, GetLocationByIdFn, GetLocationsFn, UpdateLocationFn } from "#/server/functions/location.function"
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateLocationRequest, UpdateLocationRequest } from "../validations/location.validation"
import type { PaginatorRequest } from "../utils"

export const CreateLocationMutationOption=(data:CreateLocationRequest)=>{
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn:async()=>await CreateLocationFn({data}),
        onSuccess:async()=>await queryClient.invalidateQueries({queryKey:GetLocationsQueryOption({}).queryKey})
    })
}

export const GetLocationsQueryOption=(data:PaginatorRequest)=>queryOptions({
    queryKey:['locations',data],
    queryFn:async()=>GetLocationsFn({data})
})

export const GetLocationByIdQueryOption=(data:{locationId:string})=>queryOptions({
    queryKey:['locations',data],
    queryFn:async()=>GetLocationByIdFn({data})
})

export const UpdateLocationMutationOption=(data:UpdateLocationRequest)=>{
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn:async()=>UpdateLocationFn({data}),
        onSuccess:async(variables,data)=>queryClient
        .setQueriesData({queryKey:GetLocationByIdQueryOption({locationId:variables.id}).queryKey},data)
    })
}