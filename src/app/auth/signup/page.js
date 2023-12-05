"use client"
import LoadingUi from '@/components/LoadingUi'
import SignupImg from '@/components/SignupImg'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from "react-toastify"

export default function Page() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const routes = useRouter()

    const changeHandler = (e) => {
        const id = e.target.id
        if (id === "name") {
            setName(e.target.value)
        } else if (id === "email") {
            setEmail(e.target.value)
        } else if (id === "password") {
            setPassword(e.target.value)
        } else if (id === "confirmPassword") {
            setConfirmPassword(e.target.value)
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true)
        console.log("call Api")
        const fetchData = await fetch("http://localhost:3000/api/auth/signin", {
            method: "POST",
            headers: {
                "content-type": "appliction/json; charset=UTF-8",
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        })
        const data = await fetchData.json()
        console.log(data)
        if (data.success) {
            toast.success("Account created".toUpperCase())
            routes.push("/auth/login")
        } else {
            toast.error(data.message.toUpperCase())
        }
        setLoading(false)
    }

    return (
        <div className="min-w-screen flex items-center justify-center px-5 py-5">
                {(loading) ? <LoadingUi /> : ""}
            <div className="bg-gray-100 text-gray-500 rounded-3xl shadow-2xl w-full overflow-hidden" style={{ maxWidth: "1000px" }}>
                <div className="md:flex w-full">
                    <SignupImg />
                    <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
                        <div className="text-center mb-5">
                            <h1 className="font-bold text-3xl text-gray-900">REGISTER</h1>
                            <p>Enter your information to register</p>
                        </div>
                        <form onSubmit={submitHandler}>
                            <div className="flex -mx-3">
                                <div className="w-full px-3 mb-5">
                                    <label htmlFor="name" className="text-xs font-semibold px-1">Name</label>
                                    <div className="flex">
                                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                            <svg className={`h-6 w-6 ${(name.length > 3) ? "text-green-500" : "text-red-500"}`} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="12" cy="7" r="4" />  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>
                                        </div>
                                        <input type="text" className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="John" id="name" onChange={changeHandler} value={name} required />
                                    </div>
                                </div>
                            </div>
                            <div className="flex -mx-3">
                                <div className="w-full px-3 mb-5">
                                    <label htmlFor="email" className="text-xs font-semibold px-1">Email</label>
                                    <div className="flex">
                                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                            <svg className={`h-6 w-6 ${email.includes("@") && (email.includes(".")) ? "text-green-500" : "text-red-500"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />  <polyline points="22,6 12,13 2,6" /></svg>
                                        </div>
                                        <input type="email" className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="johnsmith@example.com" id="email" onChange={changeHandler} value={email} required />
                                    </div>
                                </div>
                            </div>
                            <div className="flex -mx-3">
                                <div className="w-full px-3 mb-5">
                                    <label htmlFor="password" className="text-xs font-semibold px-1">Password</label>
                                    <div className="flex">
                                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                            <svg className={`h-6 w-6 ${(password.length > 5) ? "text-green-500" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>

                                        </div>
                                        <input type={(showPassword) ? "text" : "password"} className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="************" id="password" onChange={changeHandler} value={password} required />
                                        <div className="w-10 z-10 pl-1 text-center flex items-center justify-center">
                                            <span className='' onClick={() => {
                                                setShowPassword(!showPassword)
                                            }}>
                                                {
                                                    (showPassword) ?
                                                        <svg className="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />  <line x1="1" y1="1" x2="23" y2="23" /></svg>
                                                        :
                                                        <svg className="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />  <circle cx="12" cy="12" r="3" /></svg>
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex -mx-3">
                                <div className="w-full px-3 mb-1">
                                    <label htmlFor="confirmPassword" className="text-xs font-semibold px-1">Confirm Password</label>
                                    <div className="flex">
                                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                            <svg className={`h-6 w-6 ${(password === confirmPassword && confirmPassword.length > 5) ? "text-green-500" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>

                                        </div>
                                        <input type="password" className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="************"
                                            id="confirmPassword" onChange={changeHandler} value={confirmPassword} required />
                                    </div>
                                </div>
                            </div>
                            <div className="flex -mx-3 mt-5">
                                <div className="w-full px-3">
                                    <button type="submit" className={`block w-full max-w-xs mx-auto ${(((password === confirmPassword) && (password.length > 5) && (email.includes("@")) && (email.includes(".")) && (name.length > 3))) ? 'bg-indigo-500 text-white' : 'bg-indigo-200 text-black'} rounded-lg px-3 py-3 font-semibold`} disabled={!((password === confirmPassword) && (password.length > 5) && (email.includes("@")) && (email.includes(".")) && (name.length > 3))}>REGISTER NOW</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
