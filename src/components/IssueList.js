import Link from 'next/link'
import React from 'react'

export default function IssueList(props) {
    return (
        <div className="flex flex-col justify-center relative overflow-hidden py-4">
            <div className="max-w-2xl w-full mx-auto">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className={`relative px-7 py-6 ${(props.data.priority.toUpperCase()==="LOW")?"bg-white":((props.data.priority.toUpperCase()==="HIGH")?"bg-red-300":"bg-yellow-300")} ring-1 ring-gray-900/5 rounded-xl leading-none flex items-top justify-start space-x-6`}>
                        <div className="space-y-2 w-full">
                            <p className='text-left text-md font-bold'>{`By: ${props.data.issueAuther.name} (${props.data.issueAuther.email})`}</p>
                            <hr className='h-[2px] bg-black' />
                            <p className='text-left'>Id: {props.data._id}</p>
                            <p className='text-left'>Type: {props.data.issuesType}</p>
                            <p className='text-left'>{props.data.message}</p>
                            <Link href={`/project/${props.projectId}/${props.data._id}`}>
                                <button className="w-full mt-4 p-3 text-sm font-bold tracki uppercase rounded dark:bg-violet-400 dark:text-gray-900">Show issue</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
