"use client"
import SignupImg from '@/components/SignupImg'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { useState } from 'react'
import {toast} from "react-toastify"
import { useRouter } from 'next/navigation'
import LoadingUi from '@/components/LoadingUi'

export default function Page() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setloading] = useState(false)
    const routes = useRouter()


    const changeHandler = (e) =>{
        const id = e.target.id
        if(id==="email"){
            setEmail(e.target.value)
        }else if(id==="password"){
            setPassword(e.target.value)
        }
    }

    const submithandler = async(e) =>{
        e.preventDefault();
        setloading(true)
        const fetchData = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "content-type": "appliction/json; charset=UTF-8",
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        const data = await fetchData.json()
        if(data.success){
            toast.success("Login successfully".toUpperCase())
            routes.push("/")
        }else{
            toast.error(data.message.toUpperCase())
        }
        setloading(false)
    } 

    return (
        <div className="min-w-screen flex items-center justify-center px-5 py-5">
            {(loading)?<LoadingUi/>:""}
            <div className="bg-gray-100 text-gray-500 rounded-3xl shadow-2xl w-full overflow-hidden" style={{ maxWidth: "1000px" }}>
                <div className="md:flex w-full">
                    <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
                        <div className="text-center mb-12">
                            <h1 className="font-bold text-3xl text-gray-900">Log In Account</h1>
                            <p>Enter your information to login</p>
                        </div>
                        <form onSubmit={submithandler}>
                            <div className="flex -mx-3">
                                <div className="w-full px-3 mb-12">
                                    <label htmlFor="" className="text-xs font-semibold px-1">Email</label>
                                    <div className="flex">
                                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                            <svg className="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />  <polyline points="22,6 12,13 2,6" /></svg>
                                        </div>
                                        <input id="email" type="email" className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="johnsmith@example.com" value={email} onChange={changeHandler} required />
                                    </div>
                                </div>
                            </div>
                            <div className="flex -mx-3">
                                <div className="w-full px-3 mb-12">
                                    <label htmlFor="" className="text-xs font-semibold px-1">Password</label>
                                    <div className="flex">
                                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>

                                        </div>
                                        <input id="password" type="password" className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="************" value={password} onChange={changeHandler} required />
                                    </div>
                                </div>
                            </div>
                            <div className="flex -mx-3">
                                <div className="w-full px-3 mb-5">
                                    <button type="submit" className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">LOGIN NOW</button>
                                </div>
                            </div>
                            <div className="flex justify-between -mx-3">
                                <div>
                                    I have No Account, <Link className='text-blue-500 underline' href={"/auth/signup"}>Sing up</Link>
                                </div>
                                <div className='me-10 underline'>
                                    <Link href={"/auth/resetPassword"}>
                                        Forget Password
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                    <SignupImg />
                </div>
            </div>
        </div>
    )
}
