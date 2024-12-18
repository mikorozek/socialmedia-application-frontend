import { User, Session, CallbacksOptions, AuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt"
import { BACKEND_URL } from "@/src/config/api";
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { 
                    label: "Email", 
                    type: "email" 
                },
                password: { 
                    label: "Password", 
                    type: "password" 
                }
            },
            async authorize(
                credentials: {
                    email: string,
                    password: string
                } | undefined
            ): Promise<User | null> {
                if (!credentials) return null;

                try {
                    const response = await fetch(`${BACKEND_URL}/api/verify/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        })
                    });
                    
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText);
                    }

                    const data = await response.json();

                    return {
                        id: data.id,
                        name: data.username,
                        email: data.email,
                    };
                } catch (err) {
                    console.error("Login error:", err);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: Parameters<CallbacksOptions["jwt"]>[0]): Promise<JWT> {
            if (user) {
                token.id = user.id;
                console.log("JWT token updated:", token);
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: JWT & { id?: number } }): Promise<Session> {
            if (session.user) {
                session.user.id = token.id;
                console.log("Session updated:", session);
            }
            return session;
        }
    },

    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET
}

