import React from 'react';
import { Table } from 'flowbite-react';
import ManifestRow from './ManifestRow';

export default function ManifestTable({ manifests, onDeleteManifest, onApproveManifest,isAdmin }) {
    return (
        <Table hoverable className="shadow-md">
            <Table.Head>
                <Table.HeadCell>Employ username</Table.HeadCell>
                <Table.HeadCell>Date updated</Table.HeadCell>
                <Table.HeadCell>Manifest stantion</Table.HeadCell>
                <Table.HeadCell>Manifest plate</Table.HeadCell>
                <Table.HeadCell>Manifest Km</Table.HeadCell>
                <Table.HeadCell>Manifest hours</Table.HeadCell>
                {isAdmin && (
                    <>
                        <Table.HeadCell>Delete</Table.HeadCell>
                        <Table.HeadCell>
                            <span>Edit</span>
                        </Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                    </>
                )}
            </Table.Head>
            {manifests.map((manifest) => (
                <ManifestRow
                    key={manifest._id}
                    manifest={manifest}
                    onDeleteManifest={onDeleteManifest}
                    onApproveManifest={onApproveManifest}
                    isAdmin={isAdmin}
                />
            ))}
        </Table>
    );
}
