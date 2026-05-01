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

export const UpdateLocationMutationOption=()=>{
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn:async(data:UpdateLocationRequest)=>UpdateLocationFn({data}),
        onSuccess:async(data,variables)=>{
        queryClient
        .setQueryData(GetLocationByIdQueryOption({locationId:variables.locationId}).queryKey,data)
        await queryClient.invalidateQueries({
                queryKey: GetLocationsQueryOption({}).queryKey,
                exact: true
            })
    }
    })
}