import React from 'react'
import { Link } from 'react-router-dom'

export default function ManifestCard({ manifest }) {
    return (
        <div className='group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all'>
            <Link to={`/manifest/${manifest.slug}`}>
                <img src='https://img.freepik.com/free-vector/graphic-design-idea-concept_23-2148106484.jpg?t=st=1714724289~exp=1714727889~hmac=106d46e736d620796c22e4f4edb4eeafdc4ccb3e961fc0169bc49c8055c190dc&w=740' alt="manifest cover"
                    className='h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20' />
                <div className="p-3 flex flex-col gap-2">
                    <p className='text-lg font-semibold line-clamp-2'>{manifest.driverName}</p>
                    <div className="flex flex-wrap gap-4">
                        <span className='italic text-sm'>{manifest.plate}</span>
                    <span className='italic text-sm'>{manifest.stantion}</span>
                    <span className='italic text-sm'>{manifest.tor}</span>
                    <span className='italic text-sm'>{new Date(manifest.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Link to={`/manifest/${manifest.slug}`}
                        className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'>
                            Read article
                    </Link>
                </div>
            </Link>
        </div>
    )
}
