"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from "react-toastify"

export default function Page() {

    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [sendOtp, setSendOtp] = useState(false)
    const [loading, setLoading] = useState(false)
    const routes = useRouter()

    const sendOtpHandler = async (e) => {
        e.preventDefault();
        setLoading(true)
        const fetchData = await fetch("http://localhost:3000/api/profile/sendOtp", {
            method: "PUT",
            headers: {
                "content-type": "appliction/json; charset=UTF-8",
            },
            body: JSON.stringify({
                email: email,
            })
        })
        const data = await fetchData.json()
        if (data.success) {
            toast.success("Otp Sent On your email".toUpperCase())
            setSendOtp(true)
        } else {
            toast.error(data.message.toUpperCase())
        }
        setLoading(false)
    }

    const changePasswordHandler = async (e) => {
        e.preventDefault();
        setLoading(true)
        const fetchData = await fetch("http://localhost:3000/api/profile/changePassword", {
            method: "PUT",
            headers: {
                "content-type": "appliction/json; charset=UTF-8",
            },
            body: JSON.stringify({
                otp: Number.parseInt(otp),
                password: password
            })
        })
        const data = await fetchData.json()
        if (data.success) {
            toast.success("password changed".toUpperCase())
            routes.push("/auth/login")
        } else {
            toast.error(data.message.toUpperCase())
        }
        setLoading(false)
    }

    const changeHandler = (e) => {
        const id = e.target.id
        if (id === "email") {
            setEmail(e.target.value)
        } else if (id === "otp") {
            setOtp(e.target.value)
        } else if (id === "password") {
            setPassword(e.target.value)
        }
    }


    return (
        <div id="content" role="main" className="w-full  max-w-md mx-auto p-6">
            <div className="mt-20 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Forgot password?</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Remember your password?
                            <Link className="text-blue-600 decoration-2 hover:underline font-medium" href="/auth/login">
                                Login here
                            </Link>
                        </p>
                    </div>

                    <div className="mt-5">
                        {(sendOtp) ?
                            <form onSubmit={changePasswordHandler}>
                                <div className="grid gap-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-bold ml-1 dark:text-white">Enter OTP</label>
                                        <div className="relative">
                                            <input type="number" id="otp" name="email" className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm mb-3" required onChange={changeHandler}
                                                value={otp} />
                                        </div>
                                        <label htmlFor="email" className="block text-sm font-bold ml-1 dark:text-white">New Password</label>
                                        <div className="relative">
                                            <input type="text" id="password" name="password" className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm" required onChange={changeHandler} value={password} />
                                        </div>
                                    </div>
                                    <button type="submit" className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" disabled={loading}>
                                        {
                                            (loading) ?
                                                <svg className=" animate-ping h-6 w-6 text-red-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M18.9 7a8 8 0 0 1 1.1 5v1a6 6 0 0 0 .8 3" />  <path d="M8 11a4 4 0 0 1 8 0v1a10 10 0 0 0 2 6" />  <path d="M12 11v2a14 14 0 0 0 2.5 8" />  <path d="M8 15a18 18 0 0 0 1.8 6" />  <path d="M4.9 19a22 22 0 0 1 -.9 -7v-1a8 8 0 0 1 12 -6.95" /></svg>
                                                :
                                                "CHANGE PASSWORD"
                                        }
                                    </button>
                                    <div className='text-gray-500 hover:text-blue-500 font-bold text-md'>
                                        Resend Otp
                                    </div>
                                </div>
                            </form>
                            :
                            <form onSubmit={sendOtpHandler}>
                                <div className="grid gap-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-bold ml-1 mb-2 dark:text-white">Email address</label>
                                        <div className="relative">
                                            <input type="email" id="email" name="email" className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm" required onChange={changeHandler}
                                                value={email} />
                                        </div>
                                    </div>
                                    <button type="submit" className="h-18 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" disabled={loading}>
                                        {
                                            (loading) ?
                                                <svg className="animate-ping h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                </svg>

                                                :
                                                "SEND OTP"
                                        }
                                    </button>
                                </div>
                            </form>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
