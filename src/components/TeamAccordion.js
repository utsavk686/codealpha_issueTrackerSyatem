/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { toast } from 'react-toastify'

export default function TeamAccordion(props) {

    const removeMemberHandler = async (memberEmail) => {
        props.setLoading(true)
        const fetchData = await fetch(`http://localhost:3000/api/project/${props.projectId}/member`, {
            method: "DELETE",
            headers: {
                "content-type": "appliction/json; charset=UTF-8",
            },
            body: JSON.stringify({
                memberEmail: memberEmail
            })
        })
        const data = await fetchData.json()
        if (data.success) {
            toast.success("Add member".toUpperCase())
        } else {
            toast.error(data.message.toUpperCase())
        }
        props.setChange(!props.change)
        props.setLoading(false)
    }

    return (

        <ul className="flex flex-col gap-2 max-w-[600px] mx-auto mt-15">
            <li>
                <details className="group">
                    <summary
                        className="flex items-center justify-between gap-2 p-2 font-medium marker:content-none hover:cursor-pointer bg-gray-200">
                        <span className="flex gap-2">
                            <span>
                                {props.member.length} Member
                            </span>
                        </span>
                        <svg className="w-5 h-5 text-gray-500 transition group-open:rotate-90" xmlns="http://www.w3.org/2000/svg"
                            width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z">
                            </path>
                        </svg>
                    </summary>
                    <article className="px-4 py-4 pb-4 bg-gray-100">
                        <ul className="flex flex-col gap-4 pl-2 mt-4">
                            {
                                (props.member.length === 0) ?
                                    <li className="flex gap-2">
                                        No team member
                                    </li>
                                    :
                                    props.member.map((element, index) => {
                                        return <li key={index} className='text-left flex justify-between'>
                                            <p className=''>
                                                {`${element.name} (${element.email})`}
                                            </p>
                                            {
                                                (props.userId.toString() === props.projectManager) ?
                                                    <button className='text-right bg-blue-500 hover:bg-red-700 text-white font-bold px-4 rounded me-6' onClick={()=>{
                                                        removeMemberHandler(element.email)
                                                    }}>Remove member</button>
                                                    : ""
                                            }
                                        </li>
                                    })
                            }
                        </ul>
                    </article>
                </details>
            </li>
        </ul >

    )
}
