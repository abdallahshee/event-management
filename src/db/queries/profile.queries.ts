import { getCurrentUserAndRoleFn } from "#/server/functions/profile.functions";
import { queryOptions } from "@tanstack/react-query";

export const getCurrentUserAndRoleQueryOption=()=>queryOptions({
    queryKey:['currentUser'],
    queryFn:async()=>getCurrentUserAndRoleFn()
})