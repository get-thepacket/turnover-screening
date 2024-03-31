import { TRPCError } from "@trpc/server";
import { db } from "../../db";
import { type categoryUpdateType } from "../../validation/category-schema";
import { type Context } from "../trpc";
import type { Category } from "@prisma/client";

export const getCategories = async ({ ctx }: { ctx: Context }) => {
  const user = ctx.user;
  const categories = await db.category.findMany({
    where: {
      isDeleted: false,
    },
  });

  const profileCategoryMap = await db.profileCategoryMap.findFirst({
    where: {
      profileId: user?.id,
    },
  });

  const mappedCategories: (Category & { isSelected?: boolean })[] = categories;

  for (const mappedCategory of mappedCategories) {
    if (profileCategoryMap?.categoryIds.includes(mappedCategory.id)) {
      mappedCategory.isSelected = true;
    } else {
      mappedCategory.isSelected = false;
    }
  }

  return mappedCategories;
};

export const updateCategories = async ({
  input,
  ctx,
}: {
  input: categoryUpdateType;
  ctx: Context;
}) => {
  const { ids } = input;
  const user = ctx.user;

  try {
    await db.profileCategoryMap.updateMany({
      where: {
        profileId: user ? user.id : 0,
      },
      data: {
        categoryIds: ids,
      },
    });

    return {
      success: true,
      data: {}
    };
  } catch (error: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    });
  }
};
