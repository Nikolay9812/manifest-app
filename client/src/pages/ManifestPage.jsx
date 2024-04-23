import { Button, Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ManifestPage() {
  const [loading, setLodaing] = useState(true)
  const [error, setError] = useState(false)
  const [manifest, setManifest] = useState(null)
  const [recentManifests, setRecentManifests] = useState(null)

  const { manifestSlug } = useParams()
  console.log(manifest);
  console.log(recentManifests);
  console.log(manifestSlug);

  useEffect(() => {
    const fetchManifest = async () => {
      try {
        setLodaing(true)
        const res = await fetch(`/api/manifest/getmanifests?slug=${manifestSlug}`)
        const data = await res.json()
        console.log(data);
        if (!res.ok) {
          setError(true)
          setLodaing(false)
          return
        }
        if (res.ok) {
          setManifest(data.manifests[0])
          setLodaing(false)
          setError(false)
        }
      } catch (error) {
        setError(true)
        setLodaing(false)
      }
    }
    fetchManifest()
  }, [manifestSlug])

  useEffect(() => {
    try {
      const fetchRecentManifests = async () => {
        const res = await fetch(`/api/manifest/getmanifests?limit=3`)
        const data = await res.json()
        if (res.ok) {
          setRecentManifests(data.manifests)
        }
      }
      fetchRecentManifests()
    } catch (error) {
      console.log(error.message);
    }
  }, [])

  if (loading) return (
    <div className="flex justify-center item-center min-h-screen">
      <Spinner size='xl' />
    </div>
  )
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{manifest && manifest.title}</h1>
      <Link to={`search?category=${manifest && manifest.stantion}`} className='self-center mt-5'>
        <Button color='gray' pill size='xs'>
          {manifest && manifest.stantion}
        </Button>
      </Link>
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{manifest && new Date(manifest.createdAt).toLocaleDateString()}</span>
        <span className='italic'>{manifest.plate}</span>
        <span className='italic'>{manifest.tor}</span>
      </div>
      <div className="flex justify-center items-center">
        <div className='w-full'>{manifest.departure}</div>
        <div className='w-full'>{manifest.startTime}</div>
        <div className='w-full'>{manifest.firstDelivery}</div>
        <div className='w-full'>{manifest.lastDelivery}</div>
        <div className='w-full'>{manifest.endTime}</div>
        <div className='w-full'>{manifest.workingHours}</div>
      </div>
      <div className="mt-5">
        <div className="">Start Km  { manifest.kmStart}</div>
        <div className="">End Km { manifest.kmEnd}</div>
        <div className="">Total Km { manifest.totalKm}</div>
      </div>

    </main>
  )
}
