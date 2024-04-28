import React, { useEffect, useState } from 'react'
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { formatTime, formatTimeForInput } from '../utils';

export default function UpdateManifest() {
  const [formData, setFormData] = useState({})
  console.log(formData);
  
  const [publishError, setPublishError] = useState(null)

  const { manifestId } = useParams()

    const navigate = useNavigate()

  const { currentUser } = useSelector((state) => state.user)

    useEffect(() => {
        try {
            const fetchManifest = async () => {
                const res = await fetch(`/api/manifest/getmanifests?manifestId=${manifestId}`)
                const data = await res.json()

                if (!res.ok) {
                    console.log(data.message)
                    setPublishError(data.message)
                    return
                }
                if (res.ok) {
                  setPublishError(null)
                    setFormData({
                      ...data.manifests[0],
                      startTime: formatTimeForInput(data.manifests[0].startTime),
                      endTime: formatTimeForInput(data.manifests[0].endTime)
                    });
                }
            }
            fetchManifest()
        } catch (error) {
            console.log(error);
        }
    }, [manifestId])

    
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    const startTime = formatTime(formData.startTime);
    const endTime = formatTime(formData.endTime);

    // Include recalculated fields in formData
    const updatedFormData = {
      ...formData,
      startTime,
      endTime
    };

    try {
      const res = await fetch(`/api/manifest/updatemanifest/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFormData)
      })
      const data = await res.json()
      if (!res.ok) {
        setPublishError(data.message)
        return
      }
      if (res.ok) {
        setPublishError(null)
        navigate(`/manifest/${data.slug}`)
      }
    } catch (error) {
      setPublishError('Something went wrong')
    }
  }
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update a Manifest</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <Select
            onChange={(e) =>
              setFormData({ ...formData, stantion: e.target.value })}
            value={formData.stantion}
          >
            <option value="uncategorized">Select a stantion</option>
            <option value="DBW1">DBW1</option>
            <option value="DHE6">DHE6</option>
            <option value="HBW3">HBW3</option>
          </Select>
          <Select
            onChange={(e) =>
              setFormData({ ...formData, plate: e.target.value })}
              value={formData.plate}
          >
            <option value="uncategorized">Select a plate</option>
            <option value="AZ ZP 13">AZ ZP 13</option>
            <option value="AZ ZP 33">AZ ZP 33</option>
            <option value="F ZP 31">F ZP 31</option>
          </Select>
          <Select
            onChange={(e) =>
              setFormData({ ...formData, tor: e.target.value })}
              value={formData.tor}
          >
            <option value="uncategorized">Select a tor</option>
            <option value="ONE_1">ONE_1</option>
            <option value="CA_A3">CA_A3</option>
            <option value="ONE_9">ONE_9</option>
          </Select>
        </div>
        <TextInput
          type='number'
          onChange={(e) =>
            setFormData({ ...formData, kmStart: e.target.value })}
            value={formData.kmStart}
        />
        <TextInput
          type='number'
          onChange={(e) =>
            setFormData({ ...formData, kmEnd: e.target.value })}
            value={formData.kmEnd}
        />
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, startTime: e.target.value })}
            value={formData.startTime}
        />
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, departure: e.target.value })}
            value={formData.departure}
        />
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, firstDelivery: e.target.value })}
            value={formData.firstDelivery}
        />
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, lastDelivery: e.target.value })}
            value={formData.lastDelivery}
        />
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, endTime: e.target.value })}
            value={formData.endTime}
        />
        <Button
          type='submit'
          gradientDuoTone='greenToBlue'
        >
          Upload
        </Button>
        {
          publishError &&
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        }
      </form>
    </div>
  )
}
