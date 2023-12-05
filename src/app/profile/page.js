"use client"
import LoadingUi from '@/components/LoadingUi'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Page() {

    const [loading, setLoading] = useState(false)
    const [getData, setGetData] = useState("")


    const nameChangeHandler = async() =>{
        const newName = prompt("Enter New Name: ")
        if(!newName || newName.length < 3){
            toast.info("Name at least 3 char".toUpperCase())
            return
        }
        setLoading(true)
        const fetchData = await fetch(`http://localhost:3000/api/profile/changeName`, {
            method: "PUT",
            headers: {
                "content-type": "appliction/json; charset=UTF-8",
            },
            body: JSON.stringify({name: newName})
        })
        const data = await fetchData.json()
        if (data.success) {
            setGetData({...getData, name: newName})
        } else {
            toast.error(data.message.toUpperCase())
        }
        setLoading(false)
    }

    const getUserdata = async () => {
        setLoading(true)
        const fetchData = await fetch(`http://localhost:3000/api/profile`, {
            method: "GET",
            headers: {
                "content-type": "appliction/json; charset=UTF-8",
            }
        })
        const data = await fetchData.json()
        if (data.success) {
            setGetData(data.data)
        } else {
            toast.error(data.message.toUpperCase())
        }
        setLoading(false)
    }

    useEffect(() => {
        getUserdata()
    }, [])

    return (
        (loading) ?
            <LoadingUi />
            :
            <center className='h-screen mt-20'>
                <p className='text-2xl text-center font-bold'>{getData.name}</p>
                <p className='text-lg font-bold text-center'>{getData.email}</p>
                <p className='font-bold text-center'>Total project: {getData.project?.length}</p>
                <button onClick={nameChangeHandler} className="text-center mt-4 p-3 text-sm font-bold tracki uppercase rounded dark:bg-violet-400 dark:text-gray-900">
                    Change Name
                </button>
            </center>
    )
}
