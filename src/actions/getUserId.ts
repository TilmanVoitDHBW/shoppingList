"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export async function getUserId() {
  const session = await auth.api.getSession({
            headers: await headers(),
        });
    
        // Very simple auth check with redirect if not authenticated.
        if (!session) {
            throw new Error("User not authenticated");
        }
        console.log("Session: " + session.user.id)
        return session.user.id
    }