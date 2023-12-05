/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useState } from 'react'
import { toast } from 'react-toastify'

export default function AddIssueForm(props) {

    const [message, setMessage] = useState("")
    const [issueType, setIssueType] = useState("")
    const [priority, setPriority] = useState("Low")
    const [loading, setLoading] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (!message || !issueType || !priority) {
            setLoading(false)
            toast.info("Enter all input".toUpperCase())
            return
        }
        const fetchData = await fetch(`http://localhost:3000/api/project/${props.projectId}/addIssue`, {
            method: "PUT",
            headers: {
                "content-type": "appliction/json; charset=UTF-8",
            },
            body: JSON.stringify({
                message: message,
                issuesType: issueType,
                priority: priority
            })
        })
        const data = await fetchData.json()
        if (data.success) {
            toast.success("Issue added".toUpperCase())
        } else {
            toast.error(data.message.toUpperCase())
            setIssueType("")
            setMessage("")
        }
        props.setChange(!props.change)
        setLoading(false)
    }

    const changeHandler = (e) => {
        const id = e.target.id
        if (id === "message") {
            setMessage(e.target.value)
        } else if (id === "issueType") {
            setIssueType(e.target.value)
        } else if (id === "priority") {
            setPriority(e.target.value)
        }
    }

    return (
        <div className="grid max-w-[600px] mx-auto rounded-lg dark:text-gray-100">
            <form onSubmit={submitHandler} className="space-y-2">
                <div className='text-left text-black'>
                    <label htmlFor="name" className="text-md font-bold px-4">Message</label>
                    <textarea id="message" rows="3" type="text" placeholder="Enter message" className="w-full p-3 rounded" onChange={changeHandler} value={message} required></textarea>
                </div>
                <div className='flex justify-between'>
                    <div className='text-left text-black'>
                        <label htmlFor="issueType" className="text-md font-bold px-4">Issue type</label>
                        <input id="issueType" type="text" className="w-full p-3 rounded " onChange={changeHandler} value={issueType} required />

                    </div>
                    <div className='order-last text-left text-black ms-2'>
                        <label htmlFor="priority" className="text-md font-bold px-4">Priority</label>
                        <select id="priority" className="w-full p-3 rounded " required onChange={changeHandler}>
                            <option selected className='bg-blue-500' defaultValue="Low">Low</option>
                            <option className='bg-yellow-500' value="Medium">Medium</option>
                            <option className='bg-red-500' value="High">High</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="text-center w-full mt-4 p-3 text-sm font-bold tracki uppercase rounded dark:bg-violet-400 dark:text-gray-900" disabled={loading}>
                    {
                        (loading) ?
                        <center>
                            <svg className="animate-ping h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />  <line x1="12" y1="8" x2="12" y2="12" />  <line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        </center>
                            :
                            "Add Issue"
                    }
                </button>
            </form>
        </div>
    )
}
