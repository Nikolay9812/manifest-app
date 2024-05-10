import React from 'react';
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { formatHours } from '../../utils';

export default function ManifestRow({ manifest, onDeleteManifest, onApproveManifest, isAdmin }) {
    return (
        <Table.Body className="divide-y">
            <Table.Row className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${manifest.status === 'inProgress' ? 'bg-yellow-100 dark:bg-yellow-900' : manifest.status === 'approved' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                <Table.Cell>
                    <Link to={`/manifest/${manifest.slug}`}>
                        <div className="relative w-10 h-10">
                            <div className="group">
                                <img src={manifest.profilePicture} alt="" className='absolute w-full h-full rounded-full z-10 border-2 dark:border-slate-500 border-slate-300 transition-scale duration-300 hover:scale-150 hover:z-50' />
                                <div className="absolute bottom-12 left-0 w-full dark:border-slate-500 border-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                                    <span className="text-xs text-gray-700 dark:text-gray-300 px-1">{manifest.username}</span>
                                </div>
                            </div>
                            {manifest.secondUserId && manifest.secondProfilePicture &&
                                <div className="group">
                                    <img src={manifest.secondProfilePicture} alt="" className='absolute w-full h-full rounded-full ml-4 border-2 dark:border-slate-600 border-slate-400 transition-scale duration-300 hover:scale-150 hover:z-50' />
                                    <div className="absolute bottom-12 left-[50px] w-full bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                                        <span className="text-xs text-gray-700 dark:text-gray-300 px-1">{manifest.secondUsername}</span>
                                    </div>
                                </div>
                            }
                        </div>
                    </Link>
                </Table.Cell>
                <Table.Cell>
                    {new Date(manifest.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                    <Link to={`/manifest/${manifest.slug}`}>
                        <h1>{manifest.stantion}</h1>
                        <p>{manifest.tor}</p>
                    </Link>
                </Table.Cell>
                <Table.Cell>
                    <Link className='font-medium text-gray-900 dark:text-white' to={`/manifest/${manifest.slug}`}>
                        {manifest.plate}
                    </Link>
                </Table.Cell>
                <Table.Cell>
                    <p>{manifest.kmStart}</p>
                    <p>{manifest.kmEnd}</p>
                    <p>{manifest.totalKm}</p>
                </Table.Cell>
                <Table.Cell>
                    <p>{new Date(manifest.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p>{new Date(manifest.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p>{formatHours(manifest.workingHours)}</p>
                </Table.Cell>
                {isAdmin && (
                    <>
                        <Table.Cell>
                            <span
                                onClick={() => onDeleteManifest(manifest._id)}
                                className='font-medium text-red-500 hover:underline cursor-pointer'>
                                Delete
                            </span>
                        </Table.Cell>
                        <Table.Cell>
                            <Link className='text-teal- hover:underline' to={`/update-manifest/${manifest._id}`}>
                                <span>
                                    Edit
                                </span>
                            </Link>
                        </Table.Cell>
                        <Table.Cell>
                            <span
                                onClick={() => onApproveManifest(manifest._id, manifest.status)}
                                className={`font-medium ${manifest.status === 'inProgress'
                                    ? 'text-yellow-500'
                                    : manifest.status === 'approved'
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                    } hover:underline cursor-pointer`}
                            >
                                {manifest.status === 'inProgress'
                                    ? 'Approve'
                                    : manifest.status === 'approved'
                                        ? 'Approved'
                                        : 'Disapprove'}
                            </span>
                        </Table.Cell>
                    </>
                )}
            </Table.Row>
        </Table.Body>
    );
}
