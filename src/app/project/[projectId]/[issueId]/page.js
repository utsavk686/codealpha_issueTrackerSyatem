"use client"
import IssueList from '@/components/IssueList'
import LoadingUi from '@/components/LoadingUi'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Page({ params }) {

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [change, setChange] = useState(false)
  const [issueData, setIssueData] = useState('')
  const [user, setUserData] = useState('')
  const [isProjectMan, setisProjectMan] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [formData, setFormData] = useState({
    message: "",
    issueType: "",
    priority: ""
  })

  const getIssueData = async () => {
    setLoading(true)
    const fetchData = await fetch(`http://localhost:3000/api/project/${params.projectId}/issue/${params.issueId}`, {
      method: "GET",
      headers: {
        "content-type": "appliction/json; charset=UTF-8",
      }
    })
    const data = await fetchData.json()
    console.log(data)
    if (data.success) {
      setIssueData(data.issue)
      setUserData(data.user.id)
      setFormData({
        message: data.issue.message,
        issueType: data.issue.issuesType,
        priority: data.issue.priority
      })
      setisProjectMan(data.user.id === data.projectManger.id)
    } else {
      toast.error(data.message.toUpperCase())
    }
    setLoading(false)
  }

  const deleteHandler = async () => {
    const fetchData = await fetch(`http://localhost:3000/api/project/${params.projectId}/issue/${params.issueId}`, {
      method: "DELETE",
      headers: {
        "content-type": "appliction/json; charset=UTF-8",
      }
    })
    const data = await fetchData.json()
    if (data.success) {
      router.push(`/project/${params.projectId}`)
      toast.success("issue delete".toUpperCase())
    } else {
      toast.error(data.message.toUpperCase())
    }
  }

  const resolveHandler = async () => {
    setLoading(true)
    if (!issueData.isResolve) {
      const fetchData = await fetch(`http://localhost:3000/api/project/${params.projectId}/issue/${params.issueId}/resolved`, {
        method: "PUT",
        headers: {
          "content-type": "appliction/json; charset=UTF-8",
        }
      })
      const data = await fetchData.json()
      if (data.success) {
        toast.success("issue resolved".toUpperCase())
        setChange(!change)
      } else {
        toast.error(data.message.toUpperCase())
      }
    } else {
      const fetchData = await fetch(`http://localhost:3000/api/project/${params.projectId}/issue/${params.issueId}/resolved`, {
        method: "DELETE",
        headers: {
          "content-type": "appliction/json; charset=UTF-8",
        }
      })
      const data = await fetchData.json()
      if (data.success) {
        toast.success("issue unresolve".toUpperCase())
        setChange(!change)
      } else {
        toast.error(data.message.toUpperCase())
      }
    }
    setLoading(false)
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true)
    const fetchData = await fetch(`http://localhost:3000/api/project/${params.projectId}/issue/${params.issueId}`, {
      method: "PUT",
      headers: {
        "content-type": "appliction/json; charset=UTF-8",
      },
      body: JSON.stringify({
        message: formData.message,
        issuesType: formData.issueType,
        priority: formData.priority
      })
    })
    const data = await fetchData.json()
    if (data.success) {
      toast.success("Issue refuse".toUpperCase())
      setIsUpdate(!isUpdate)
      setChange(change)
    } else {
      toast.error(data.message.toUpperCase())
    }
    setLoading(false)
  }

  useEffect(() => {
    getIssueData()
  }, [change])

  return (
    (!issueData) ?
      <center>
        <p className='text-2xl text-gray-500 font-bold'>
          Fetch Data
        </p>
      </center>
      :
      <div>
        {(loading) ? <LoadingUi /> : ""}
        <center className='mt-10 w-screen'>
          {
            (isUpdate) ?
              <div className='w-full md:w-1/2 text-left my-4'>
                <form onSubmit={submitHandler} className="space-y-2">
                  <div className='text-left text-black'>
                    <label htmlFor="name" className="text-md font-bold px-4">Message</label>
                    <textarea id="message" rows="3" type="text" placeholder="Enter message" className="w-full p-3 rounded" onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value })
                    }} value={formData.message} required></textarea>
                  </div>
                  <div className='flex justify-between'>
                    <div className='text-left text-black'>
                      <label htmlFor="issueType" className="text-md font-bold px-4">Issue type</label>
                      <input id="issueType" type="text" className="w-full p-3 rounded " onChange={(e) => {
                        setFormData({ ...formData, issueType: e.target.value })
                      }} value={formData.issueType} required />

                    </div>
                    <div className='order-last text-left text-black ms-2'>
                      <label htmlFor="priority" className="text-md font-bold px-4">Priority</label>
                      <select id="priority" className="w-full p-3 rounded " required onChange={(e) => {
                        setFormData({ ...formData, priority: e.target.value })
                      }} value={formData.priority}>
                        <option selected className='bg-blue-500' defaultValue="Low">Low</option>
                        <option className='bg-yellow-500' value="Medium">Medium</option>
                        <option className='bg-red-500' value="High">High</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="text-center w-full mt-4 p-3 text-sm font-bold tracki uppercase rounded dark:bg-violet-400 dark:text-gray-900" disabled={loading}>
                    Update Issue
                  </button>
                </form>
              </div>
              :
              <div className='w-full md:w-1/2 bg-white text-left text-lg px-8 py-4 rounded-lg mb-4'>
                <p>Message: {issueData.message}</p>
                <p>Issues Type: {issueData.issuesType}</p>
                <p>priority: {issueData.priority}</p>
                <p className={`font-bold ${(issueData.isResolve)?"text-green-500":"text-red-500"}`}>Resolve: {(issueData.isResolve) ? "True" : "False"}</p>
                <p>By: {issueData.issueAuther.name} ({issueData.issueAuther.email})</p>
              </div>
          }
          <div className='w-full md:w-1/2 text-left my-3'>
            {
              (isProjectMan || user === issueData.issueAuther._id) ?
                <div className='w-full flex justify-between px-10'>
                  <button onClick={deleteHandler} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                    Delete issue
                  </button>
                  {
                    (isProjectMan) ?
                      <button onClick={resolveHandler} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                        Resolve issue
                      </button>
                      : ""
                  }
                  <button onClick={() => { setIsUpdate(!isUpdate) }} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                    {
                      (isUpdate) ?
                        "Not Update" : "Update issue"
                    }
                  </button>
                </div>
                : ""
            }
          </div>
        </center>
      </div>
  )
}
