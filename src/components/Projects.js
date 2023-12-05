"use client"
import React, { useContext, useEffect, useState } from 'react'
import ProjectCard from './ProjectCard'
import UserContext from '@/context/store'
import { toast } from 'react-toastify'
import LoadingUi from './LoadingUi'

export default function Projects() {

    const [project, setProject] = useState([])
    const [loading, setLoading] = useState(true)
    const {updateUserData} = useContext(UserContext)

    const getProfile = async()=>{
        setLoading(true)
        const fetchData = await fetch("http://localhost:3000/api/profile",{
            method: "GET",
            headers: {
                "content-type": "appliction/json; charset=UTF-8",
            }
        })
        const data = await fetchData.json()
        if(data.success){
            setProject(data.data.project)
            updateUserData({name: data.data.name, id: data.data._id, email: data.data.email})
        } else{
            toast.error(data.message.toUpperCase())
        }
        setLoading(false)
    }

    useEffect(()=>{
        getProfile()
    },[])


    return (
        <div
            className="relative flex flex-col px-4 pt-24 pb-12 font-sans text-gray-700 sm:px-6 lg:px-8"
        >
            {(loading)?<LoadingUi/>:""}
            <div className="flex-1 space-y-8">
                
                {
                    project.map((element, index)=>{
                        return <ProjectCard index={index+1} key={index} data={element}/>
                    })
                }
                
            </div>
        </div>
    )
}
