import { type TypeOf, number, object } from "zod";

export const categoryUpdateSchema = object({
    ids: number().array()
})

export type categoryUpdateType = TypeOf<typeof categoryUpdateSchema>;