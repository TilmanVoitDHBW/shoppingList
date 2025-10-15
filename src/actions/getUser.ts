"use server"

import {user} from "@/db/schema"
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";


export async function getUser() {
    const session = await auth.api.getSession({
            headers: await headers(),
        });
    
        // Very simple auth check with redirect if not authenticated.
        if (!session) {
            throw new Error("User not authenticated");
        }
        console.log("Session: " + session.user.id)
    const currentUser = await db
                                .select({name:user.name, email: user.email, avatar: user.image})
                                .from(user).where(eq(user.id, session.user.id))
                                .limit(1)
    return currentUser[0]
    }