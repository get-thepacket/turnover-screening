import { type categoryUpdateType } from "../../validation/category-schema";
import { getCategories, updateCategories } from "../service/category.service";
import { type Context, createTRPCRouter, protectedProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  "list-categories": protectedProcedure.query(({ ctx }) =>
    getCategories({ ctx }),
  ),
  "update-categories": protectedProcedure.mutation(
    ({ ctx, input }: { ctx: Context; input: categoryUpdateType }) =>
      updateCategories({ input, ctx }),
  ),
});
