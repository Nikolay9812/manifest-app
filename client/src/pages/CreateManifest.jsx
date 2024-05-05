import React, { useEffect, useState } from 'react'
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { formatTime } from '../utils';

export default function CreateManifest() {
  const [formData, setFormData] = useState({})
  const [publishError, setPublishError] = useState(null)
  const [stantions, setStantions] = useState([]);
  const [plates, setPlates] = useState([]);
  const [tors, setTors] = useState([]);
  const [users, setUsers] = useState([])

  const { currentUser } = useSelector((state) => state.user)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const startTime = formatTime(formData.startTime);
    const endTime = formatTime(formData.endTime);

    const updatedFormData = {
      ...formData,
      startTime,
      endTime,
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

  useEffect(() => {
    const fetchStantions = async () => {
      try {
        const res = await fetch(`/api/stantion/getstantions`)
        const data = await res.json()
        if (res.ok) {
          setStantions(data)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    const fetchPlates = async () => {
      try {
        const res = await fetch(`/api/plate/getplates`)
        const data = await res.json()
        if (res.ok) {
          setPlates(data)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    const fetchTors = async () => {
      try {
        const res = await fetch(`/api/tor/gettors`)
        const data = await res.json()
        if (res.ok) {
          setTors(data)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`)
        const data = await res.json()
        if (res.ok) {
          setUsers(data.users)
        }
      } catch (error) {
        console.log(error.message)
      }
    }

      fetchStantions()
      fetchPlates()
      fetchTors()
      fetchUsers()
    
  }, [currentUser._id])

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
            {stantions.map(stantion => (
              <option key={stantion._id} value={stantion.name}>{stantion.name}</option>
            ))}
          </Select>
          <Select
            onChange={(e) =>
              setFormData({ ...formData, plate: e.target.value })}
          >
            <option value="uncategorized">Select a plate</option>
            {plates.map(plate => (
              <option key={plate._id} value={plate.name}>{plate.name}</option>
            ))}
          </Select>
          <Select
            onChange={(e) => setFormData({ ...formData, tor: e.target.value })}
          >
            <option value="uncategorized">Select a tor</option>
            {tors.map(tor => (
              <option key={tor._id} value={tor.name}>{tor.name}</option>
            ))}
          </Select>
          <Select
            onChange={(e) => setFormData({ ...formData, secondUserId: e.target.value })}
          >
            <option value="uncategorized">Select second driver</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.username}</option>
            ))}
          </Select>
        </div>
        <i>Starting kilometers</i>
        <TextInput
          type='number'
          onChange={(e) =>
            setFormData({ ...formData, kmStart: e.target.value })}
        />
        <i>Ending kilometers</i>
        <TextInput
          type='number'
          onChange={(e) =>
            setFormData({ ...formData, kmEnd: e.target.value })}
        />
        <i>Handover time handled</i>
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, startTime: e.target.value })}
        />
        <i>Departure time stantion</i>
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, departure: e.target.value })}
        />
        <i>Time of first delivery</i>
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, firstDelivery: e.target.value })}
        />
        <i>Time of last delivery</i>
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, lastDelivery: e.target.value })}
        />
        <i>Return time stantion</i>
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, returnTime: e.target.value })}
        />
        <i>Time of complete debrief</i>
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, endTime: e.target.value })}
        />
        <i>Packages</i>
        <TextInput
          type='number'
          onChange={(e) =>
            setFormData({ ...formData, packages: e.target.value })}
        />
        <i>Returned packages</i>
        <TextInput
          type='number'
          onChange={(e) =>
            setFormData({ ...formData, returnedPackages: e.target.value })}
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
