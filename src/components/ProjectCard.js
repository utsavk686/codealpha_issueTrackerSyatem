import Link from 'next/link'
import React from 'react'

export default function ProjectCard(props) {
    return (
        <div
            style={{ top: `calc(1rem * ${props.index})` }}
            className="sticky w-full max-w-xl mx-auto space-y-4 bg-white border rounded-lg shadow-lg hover:border-2 hover:border-red-500 hover:bg-pink-200"
        >
            <Link href={`/project/${props.data._id}`}>
                <div className='px-6 py-8'>
                    <h2 className="space-y-1 text-2xl font-bold leading-none text-gray-900">
                        <span className="block text-sm text-blue-700"> #Project: {props.index}</span>
                        <span className="block text-sm text-black">ID: {props.data._id}</span>
                        <span className="block">{props.data.title}</span>
                    </h2>
                    <p>
                        {props.data.description}
                    </p>
                </div>
            </Link>
        </div>
    )
}
