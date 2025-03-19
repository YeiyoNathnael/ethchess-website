import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import SignIn from './sign-in'
import { auth } from '@/auth'
import SignOut from './sign-out'


const Navbar = async() => {


    const session = await auth();
    
    return (
    <header>
    <nav className="flex justify-between items-center px-4 h-16 bg-white">
        <Link href = "/"className="btn-neutral text-xl m-5">
          <Image src="/ETHCHESS.svg" alt="ETHCHESS-logo" width={150} height={150} />
        </Link>
        <div className="flex items-center gap-5">

          {session && session?.user ?(
        <>
        <span className='btn btn-ghost text-xl text-black hover:text-blue-500 '>{session?.user?.name || 'Guest'}</span>
        <SignOut />
        </>
          ) :
          (<SignIn />)
          }
          
          <Link href="/about" className="btn btn-ghost text-xl text-black hover:text-blue-500">About</Link>
          <Link href="/contact" className="btn btn-ghost text-xl text-black hover:text-blue-500">Contact</Link>
        </div>
      
    </nav>
    </header>
  )
}

export default Navbar;