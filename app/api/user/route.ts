import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const user = await currentUser();
    //if user exits

   const users = await db.select().from(usersTable).where(eq(usersTable.email,user?.primaryEmailAddress?.emailAddress as string))

    //if not create new user in db
    if(users?.length === 0){
        await db.insert(usersTable).values({
            email: user?.primaryEmailAddress?.emailAddress as string,
            name: user?.firstName as string,
        })
        return NextResponse.json({message: 'User created'}, {status: 201})
    }
    return NextResponse.json({message: 'User exists'}, {status: 200})
}