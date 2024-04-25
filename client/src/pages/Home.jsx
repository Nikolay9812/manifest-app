import { Button } from 'flowbite-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function Home() {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-cente'>
        {currentUser && (
          <Link to={'/create-manifest'}>
            <Button
              type='submit'
              gradientDuoTone='greenToBlue'
              className='w-full'>
              Create a Manifest
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
