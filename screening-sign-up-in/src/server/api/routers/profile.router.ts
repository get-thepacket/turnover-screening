import { profileSignInSchema, profileSignUpSchema, type profileSignInType, type profileSignUpType } from "../../validation/profile-schema";
import { logoutHandler, profileSignInHandler, profileSignUpHandler } from "../service/profile.service";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
    signIn: publicProcedure.input(profileSignInSchema).mutation(({input}: {input: profileSignInType}) => profileSignInHandler({input})),
    signUp: publicProcedure.input(profileSignUpSchema).mutation(({input}: {input: profileSignUpType}) => profileSignUpHandler({input})),
    signOut: protectedProcedure.mutation(() => logoutHandler())
});