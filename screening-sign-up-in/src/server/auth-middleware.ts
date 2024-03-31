import { cookies } from "next/headers"
import { env } from "../env";
import jwt from "jsonwebtoken";
import { db } from "./db";
import { TRPCError } from "@trpc/server";

export const verifyUser = async () => {
    const cookieStore = cookies();
    try {
        const token = cookieStore.get("token") ? cookieStore.get("token")?.value : null;

        const userAuthInfo = {
            user: null
        };

        if (!token) {
            return userAuthInfo
        }

        const secret = env.JWT_SECRET;
        const decoded = jwt.verify(token, secret) as { sub: string };

        if (!decoded) {
            return userAuthInfo;
        }

        const profile  = await db.profile.findFirst({ where: { id: Number(decoded.sub) }});
        
        if (!profile) {
            return userAuthInfo;
        }

        const { passwordHash, ...userWithoutPassword} = profile;
        return {
            user: userWithoutPassword
        }
    } catch(error: any) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message
        });
    }

}