import React, { useState } from 'react'
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

export default function CreateManifest() {
  const [formData, setFormData] = useState({})
  const [publishError, setPublishError] = useState(null)

  const { currentUser } = useSelector((state) => state.user)

  const navigate = useNavigate()

  const calculateWorkingHours = () => {
    // Recalculate workingHours
    const start = new Date(`01/01/2000 ${formData.startTime}`);
    const end = new Date(`01/01/2000 ${formData.endTime}`);
    let workingHours = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours

    // Subtract 30 minutes for the break
    workingHours -= 0.5; // Subtract 30 minutes

    // Add 15 minutes if working hours exceed 8 hours and 30 minutes
    if (workingHours > 8.5) { // More than 8 hours and 30 minutes
      workingHours -= 0.25; // Subtract additional 15 minutes
    }

    // Convert workingHours to hh:mm format
    const hours = Math.floor(workingHours);
    const minutes = Math.round((workingHours - hours) * 60);

    // Pad single digit hours and minutes with leading zeros
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${formattedHours}:${formattedMinutes}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Recalculate totalKm
    const totalKm = formData.kmEnd - formData.kmStart;

    // Calculate working hours in hh:mm format
    const workingHours = calculateWorkingHours();

    // Include recalculated fields in formData
    const updatedFormData = {
      ...formData,
      driverNamer: currentUser.username,
      totalKm,
      workingHours,
    };


    try {
      const res = await fetch('/api/manifest/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFormData),
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
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a Manifest</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <Select
            onChange={(e) =>
              setFormData({ ...formData, stantion: e.target.value })}
          >
            <option value="uncategorized">Select a stantion</option>
            <option value="DBW1">DBW1</option>
            <option value="DHE6">DHE6</option>
            <option value="HBW3">HBW3</option>
          </Select>
          <Select
            onChange={(e) =>
              setFormData({ ...formData, plate: e.target.value })}
          >
            <option value="uncategorized">Select a plate</option>
            <option value="AZ ZP 13">AZ ZP 13</option>
            <option value="AZ ZP 33">AZ ZP 33</option>
            <option value="F ZP 31">F ZP 31</option>
          </Select>
          <Select
            onChange={(e) =>
              setFormData({ ...formData, tor: e.target.value })}
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
        />
        <TextInput
          type='number'
          onChange={(e) =>
            setFormData({ ...formData, kmEnd: e.target.value })}
        />
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, startTime: e.target.value })}
        />
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, departure: e.target.value })}
        />
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, firstDelivery: e.target.value })}
        />
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, lastDelivery: e.target.value })}
        />
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, endTime: e.target.value })}
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
