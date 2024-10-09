import { AuthOptions, NextAuthOptions, User } from "next-auth";
import  CredentialsProvider from "next-auth/providers/credentials";
import { store, AppDispatch } from "@/core/application/store";
import { jwtDecode } from "jwt-decode";
import { authApi } from "../api/auth.api";

interface BackendLoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
        refresh_token: string;
    };
    errors: string[];
}

// Extend the NextAuth User type to include additional fields
interface ExtendedUser extends User {
    firstname?: string;
    lastname?: string;
    phone?: string;
    bio?: string;
    profile?: string;
    cover?: string;
    created_at?: string;
    token: string;
    refreshToken: string;
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
        accessToken: string;
        refreshToken: string; 
    }

    // interface ExtendedUser extends User {}

    interface JWT {
        user: ExtendedUser;
        accessToken: string;
        refreshToken: string;
    }
}

export const authConfig : AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "johndoe@gmail.com" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials, req) : Promise<ExtendedUser | null> => {
                
                try {
                    if(!credentials?.email || !credentials?.password) {
                        throw new Error("L'adresse mail et le mot de passe sont requis")
                    }
                    const result = await store.dispatch(
                        authApi.endpoints.login.initiate({ email: credentials.email, password: credentials.password })
                    ).unwrap()

                    const responseData = result as BackendLoginResponse;
                    console.log("response Data", responseData)
                    if (result.success) {
                        const { user, token, refresh_token } = responseData.data;
                        return { ...user, token, refreshToken: refresh_token };
                    }

                    return null;

                } catch (result : any) {
                    console.log("error results : " + JSON.stringify(result));
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.user = user;
                token.accessToken = (user as ExtendedUser).token;
                token.refreshToken = (user as ExtendedUser).refreshToken;
            }
            if (trigger === "update" && session?.user) {
                token.user = session.user;
              }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as ExtendedUser;
            session.accessToken = token.accessToken as string;
            session.refreshToken = token.refreshToken as string;
            return session;
        },
    },

    secret: process.env.JWT_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 2 * 24 * 60 * 60,
    },
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error",
    }
} satisfies NextAuthOptions

