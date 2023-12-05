"use client"
import LoadingUi from '@/components/LoadingUi'
import React, { useState } from 'react'
import {toast} from "react-toastify"

export default function Page() {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [link, setLink] = useState("")
    const [loading, setLoading] = useState(false)


    const changeHandler = (e)=>{
        const id = e.target.id
        if(id==="title"){
            setTitle(e.target.value)
        } else if(id==="description"){
            setDescription(e.target.value)
        } else if(id==="link"){
            setLink(e.target.value)
        }
    }

    const submitHandler = async(e) =>{
        e.preventDefault();
        if(!title || !description){
            toast.info("Enter project informetion".toUpperCase())
        }
        setLoading(true)
        const fetchData = await fetch("http://localhost:3000/api/appProject", {
            method: "POST",
            headers: {
                "content-type": "appliction/json; charset=UTF-8",
            },
            body: JSON.stringify({
                title: title,
                description: description,
                link: link
            })
        })
        const data = await fetchData.json()
        if(data.success){
            toast.success("project Created".toUpperCase())
            setTitle("")
            setDescription("")
            setLink("")
        }else{
            toast.message(data.message.toUpperCase())
        }
        setLoading(false)
    }

    return (
        <div className="mt-12">
            {(loading)?<LoadingUi/>:""}
            <div className="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
                <div className="flex rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2 bg-white sm:mx-0" style={{ height: "500px" }}>
                    <div className="flex flex-col w-full md:w-1/2 py-4">
                        <div className="flex flex-col flex-1 justify-center mb-5">
                            <div className="p-4">
                                <h1 className="text-4xl text-center font-thin">Create New Project</h1>
                            </div>
                            <div className="w-full">
                                <form onSubmit={submitHandler} className="form-horizontal w-3/4 mx-auto" >
                                    <div className="flex flex-col mt-4">
                                        <label htmlFor='title'>Title: </label>
                                        <input id="title" type="text" className="flex-grow py-1 px-2 border rounded border-grey-400" name="title" placeholder="Enter title" value={title} onChange={changeHandler} required />
                                    </div>
                                    <div className="flex flex-col mt-4">
                                        <label htmlFor='discription'>Description: </label>
                                        <textarea id="description" type="text" className="flex-grow py-1 px-2 rounded border border-grey-400" rows="3" name="password" required placeholder="Enter Description" value={description} onChange={changeHandler} ></textarea>
                                    </div>
                                    <div className="flex flex-col mt-4">
                                        <label htmlFor='link'>Project link: </label>
                                        <input id="link" type="text" className="flex-grow py-1 px-2 rounded border border-grey-400" name="link" placeholder="Enter link (optional)" value={link} onChange={changeHandler} />
                                    </div>
                                    <div className="flex flex-col mt-8">
                                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded">
                                            Add Project
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block md:w-1/2 rounded-r-lg" style={{ background: "url('https://images.unsplash.com/photo-1515965885361-f1e0095517ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80')", backgroundSize: "cover", backgroundPosition: "center center" }}></div>
                </div>
            </div>
        </div>
    )
}
