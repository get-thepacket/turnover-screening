import { TRPCError } from "@trpc/server";
import { db } from "../../db";
import { type profileSignInType, type profileSignUpType } from "../../validation/profile-schema"
import bcrypt from "bcryptjs";
import { env } from "../../../env";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const profileSignUpHandler = async (
    {input} : {input: profileSignUpType}
) => {
    try {
        const hashedPassword = await bcrypt.hash(input.password, env.PASSWORD_SALT);

        const profile = await db.profile.create({
            data: {
                name: input.name,
                email: input.email,
                passwordHash: hashedPassword
            }
        });

        const { passwordHash, ...profileWithoutPassword } = profile;
        return {
            success: true,
            data: {user: profileWithoutPassword}
        };

    } catch (error: any) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message
        })
    } 
}

export const profileSignInHandler = async ({input}: {input: profileSignInType}) => {
    try {

        const passwordHash = await bcrypt.hash(input.password, env.PASSWORD_SALT);

        const user = await db.profile.findUnique({ where: {
            email: input.email,
            passwordHash
        }});

        if (!user) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid email or password"
            });
        }

        const secret = env.JWT_SECRET;
        const token = jwt.sign({ sub: user.id }, secret, { expiresIn: 3600 });
        const cookieOptions = {
            httpOnly: true,
            path: '/',
            secure: env.NODE_ENV !== "development",
            maxAge: 3600
        };

        cookies().set("token", token, cookieOptions);

        return {
            success: true,
            token
        }

        

    } catch(error: any) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message
        })
    } 
}

export const logoutHandler = async () => {
    try {
        cookies().set("token", "", { maxAge: -1 });
        return { success: true };
    } catch(error: any) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message
        })
    }
}