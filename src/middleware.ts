import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export const middleware = withAuth(
  function middleware(req: NextRequest & { nextauth: any }) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // If no token, allow (will be caught by withAuth)
    if (!token) {
      return NextResponse.next();
    }

    const accountType = token.accountType as string;
    const role = token.role as string;

    // Admin can access everything
    if (role === "ADMIN" || accountType === "ADMIN") {
      return NextResponse.next();
    }

    // Route protection based on accountType
    const routeProtection: Record<string, string[]> = {
      "/dashboard": ["BUYER"],
      "/dashboard/vendor/marketplace": ["MARKETPLACE_VENDOR"],
      "/dashboard/vendor/ecommerce": ["ECOMMERCE_VENDOR"],
      "/dashboard/restaurant": ["RESTAURANT"],
      "/dashboard/dispatch": ["DISPATCH_PARTNER"],
      "/dashboard/driver": ["DRIVER"],
      "/admin": ["ADMIN"],
    };

    // Check if current route requires specific account type
    for (const [route, allowedTypes] of Object.entries(routeProtection)) {
      if (pathname.startsWith(route)) {
        if (!allowedTypes.includes(accountType)) {
          // Redirect to correct dashboard based on account type
          const dashboardMap: Record<string, string> = {
            BUYER: "/dashboard",
            MARKETPLACE_VENDOR: "/dashboard/vendor/marketplace",
            ECOMMERCE_VENDOR: "/dashboard/vendor/ecommerce",
            RESTAURANT: "/dashboard/restaurant",
            DISPATCH_PARTNER: "/dashboard/dispatch",
            DRIVER: "/dashboard/driver",
            ADMIN: "/admin",
          };

          const correctDashboard = dashboardMap[accountType] || "/dashboard";
          return NextResponse.redirect(new URL(correctDashboard, req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
