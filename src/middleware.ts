import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Définir les routes publiques
const publicRoutes = createRouteMatcher([
  '/',
  '/site',
  '/api/uploadthing',
  '/sign-in',
  '/sign-up',
])

// Définir les routes protégées
const protectedRoutes = createRouteMatcher([
  '/dashboard(.*)',
  '/forum(.*)',


])

export default clerkMiddleware((auth, req) => {
  const url = req.nextUrl
  const hostname = req.headers.get('host')

  // Rediriger l'URL racine vers "/site"
  if (url.pathname === '/') {
    return NextResponse.redirect(new URL('/site', req.url))
  }

  // Vérifiez si la route est publique
  if (publicRoutes(req)) {
    return NextResponse.next()
  }

  // Vérifiez si la route est protégée
  if (protectedRoutes(req)) {
    auth().protect()
  }

  // Logique supplémentaire après l'authentification
  const searchParams = url.searchParams.toString()
  const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`

  // Si un sous-domaine personnalisé existe
  const subdomainParts = hostname?.split('.')
  const customSubDomain = subdomainParts && subdomainParts.length > 2 ? subdomainParts[0] : null

  if (customSubDomain && customSubDomain !== 'www') {
    return NextResponse.rewrite(
      new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
    )
  }

  if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
    return NextResponse.redirect(new URL(`/agency/sign-in`, req.url))
  }

  if (
    url.pathname === '/site' && url.host === process.env.NEXT_PUBLIC_DOMAIN
  ) {
    return NextResponse.rewrite(new URL('/site', req.url))
  }

  if (
    url.pathname.startsWith('/agency') ||
    url.pathname.startsWith('/subaccount')
  ) {
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url))
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
