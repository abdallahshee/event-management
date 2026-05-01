import z from "zod"
export const PaginatorSchema=z.object({
    page:z.number().optional(),
    limit:z.number().optional()
})