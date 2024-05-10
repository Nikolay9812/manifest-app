import React from 'react';
import { Modal, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function ManifestModal({ show, onClose, onDeleteManifest }) {
    return (
        <Modal show={show} onClose={onClose} popup size="md">
            <Modal.Header />
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this manifest?</h3>
                    <div className="flex justify-center gap-4">
                        <Button type='button' color='failure' onClick={onDeleteManifest}>Yes, I'm sure</Button>
                        <Button type='button' color='gray' onClick={onClose}>No, cancel</Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
