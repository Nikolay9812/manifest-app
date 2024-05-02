import React from 'react'

export default function GridItem({ title, children }) {
    return (
        <div className="flex flex-col items-center justify-center p-4 border border-slate-700 bg-slate-700/50 rounded-xl h-[400px]">
            <h3 className='text-2xl font-semibold text-white mb-4'>{title}</h3>
            {children}
        </div>

    )
}