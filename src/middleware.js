import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export function middleware(req) {

    const path = req.nextUrl.pathname
    console.log("Run Middleware", path)
    if(path.startsWith("/api")){
        console.log("server")
    }else if(path==="/" || path.startsWith("/project")|| path==="/addProject" || path ==="/profile" || path.startsWith("/auth")){
        console.log("browser")
        const token = cookies().get("token")
        if(path.startsWith("/auth")){
            if(token){
                return NextResponse.redirect(new URL("/", req.url))
            }else{
                console.log("login and sign up page")
            }
        }else{
            if(!token){
                return NextResponse.redirect(new URL("/auth/login", req.url))
            }else{
                console.log("account page")
            }
        }
    }

  }
   
  // See "Matching Paths" below to learn more
  export const config = {
    matcher: '/:path*',
  }