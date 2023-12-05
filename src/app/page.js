import Projects from "@/components/Projects"
import "./globals.css"
import Link from 'next/link'

export default function Home() {
  return (
    <div className='mt-3'>
      <div className="fixed top-17 z-40 w-screen">
        <center>
          <div className='w-96 bg-yellow-400 rounded-2xl border-4 border-red-500 font-black'>
            <Link href={"/addProject"}>
              <div className='flex justify-center p-5'>
                <p className='text-3xl text-red-600'>
                  ADD PROJECT
                </p>
                <svg className="h-8 w-8 text-red-600 font-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </Link>
          </div>
        </center>
      </div>
      <div>
        <Projects/>
      </div>
    </div>
  )
}
