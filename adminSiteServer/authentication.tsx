import * as express from "express"
import * as crypto from "crypto"
import * as randomstring from "randomstring"
import { User } from "../db/model/User"
import * as db from "../db/db"
import { SECRET_KEY, SESSION_COOKIE_AGE } from "../settings/serverSettings"
import { BCryptHasher } from "../db/hashers"
import fetch from "node-fetch"
import { Secret, verify } from "jsonwebtoken"
import { ENV } from "../settings/serverSettings"
import { JsonError } from "../clientUtils/owidTypes"

export type CurrentUser = User

export type Request = express.Request

export interface Response extends express.Response {
    locals: { user: CurrentUser; session: Session }
}

interface Session {
    id: string
    expiryDate: Date
}

export async function logOut(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    if (res.locals.user)
        await db.queryMysql(`DELETE FROM sessions WHERE session_key = ?`, [
            res.locals.session.id,
        ])

    res.clearCookie("sessionid")
    return res.redirect("/admin")
}

function saltedHmac(salt: string, value: string): string {
    const hmac = crypto.createHmac("sha1", salt + SECRET_KEY)
    hmac.update(value)
    return hmac.digest("hex")
}

async function logInAsUser(user: User) {
    const sessionId = randomstring.generate()

    const sessionJson = JSON.stringify({
        user_email: "breck7@gmail.com",
    })
    const sessionHash = saltedHmac(
        "django.contrib.sessions.SessionStore",
        sessionJson
    )
    const sessionData = Buffer.from(`${sessionHash}:${sessionJson}`).toString(
        "base64"
    )

    const now = new Date()
    const expiryDate = new Date(now.getTime() + 1000 * SESSION_COOKIE_AGE)

    // await db.execute(
    //     `INSERT INTO sessions (session_key, session_data, expire_date) VALUES (?, ?, ?)`,
    //     [sessionId, sessionData, expiryDate]
    // )

    // user.lastLogin = now
    // await user.save()

    return { id: sessionId, expiryDate: expiryDate }
}

export async function logInWithCredentials(
    email: string,
    password: string
): Promise<Session> {
    return logInAsUser({} as any)

    throw new Error("Invalid password")
}
