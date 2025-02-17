import { TokenClassificationPipeline } from '@xenova/transformers'
import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
    newUser: '/signup'
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnLoginPage = nextUrl.pathname.startsWith('/login')
      const isOnSignupPage = nextUrl.pathname.startsWith('/signup')

      if (isLoggedIn) {
        if (isOnLoginPage || isOnSignupPage) {
          return Response.redirect(new URL('/', nextUrl))
        }
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, id: user.userId, name: user.userName, orgIds: user.orgIds, deviceHash: user.deviceHash, role:user.role, email:user.email}
      
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        const { id } = token as { id: string }
        const { email } = token as { email: string }
        const { orgIds } = token as { orgIds: any}
        const {deviceHash} = token as { deviceHash: string}
        const {role} = token as {role: string}
        const { user } = session
        session = { ...session, user: { ...user, id , orgIds, deviceHash, role, email} }
      }
      return session
    }
  },
  providers: []
} satisfies NextAuthConfig
