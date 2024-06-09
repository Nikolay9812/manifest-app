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
  const [formData, setFormData] = useState({
    stantion: '',
    plate: '',
    tor: '',
    secondUserId: '',
    date: '',
    kmStart: '',
    kmEnd: '',
    startTime: '',
    departure: '',
    firstDelivery: '',
    lastDelivery: '',
    returnTime: '',
    endTime: '',
    packages: '',
    returnedPackages: ''
  });
  
  const [stantions, setStantions] = useState([]);
  const [plates, setPlates] = useState([]);
  const [tors, setTors] = useState([]);
  const [users, setUsers] = useState([])


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
      fetchUsers()
      fetchStantions()
      fetchPlates()
      fetchTors()
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
            {stantions.map(stantion => (
              <option key={stantion._id} value={stantion.name}>{stantion.name}</option>
            ))}
          </Select>
          <Select
            onChange={(e) =>
              setFormData({ ...formData, plate: e.target.value })}
            value={formData.plate}
          >
            <option value="uncategorized">Select a plate</option>
            {plates.map(plate => (
              <option key={plate._id} value={plate.name}>{plate.name}</option>
            ))}
          </Select>
          <Select
            onChange={(e) =>
              setFormData({ ...formData, tor: e.target.value })}
            value={formData.tor}
          >
            <option value="uncategorized">Select a tor</option>
            {tors.map(tor => (
              <option key={tor._id} value={tor.name}>{tor.name}</option>
            ))}
          </Select>
          <Select
            onChange={(e) => setFormData({ ...formData, secondUserId: e.target.value })} value={formData.secondUserId}
          >
            <option value="uncategorized">Select second driver</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.username}</option>
            ))}
          </Select>
        </div>
        <i>Date</i>
        <TextInput
          type='text'
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })}
          value={formData.date.substring(0, 10)}
        />
        <i>Starting kilometers</i>
        <TextInput
          type='number'
          onChange={(e) =>
            setFormData({ ...formData, kmStart: e.target.value })}
          value={formData.kmStart}
        />
        <i>Ending kilometers</i>
        <TextInput
          type='number'
          onChange={(e) =>
            setFormData({ ...formData, kmEnd: e.target.value })}
          value={formData.kmEnd}
        />
        <i>Handover time handled</i>
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, startTime: e.target.value })}
          value={formData.startTime}
        />
        <i>Departure time stantion</i>
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, departure: e.target.value })}
          value={formData.departure}
        />
        <i>Time of first delivery</i>
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, firstDelivery: e.target.value })}
          value={formData.firstDelivery}
        />
        <i>Time of last delivery</i>
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, lastDelivery: e.target.value })}
          value={formData.lastDelivery}
        />
        <i>Return time stantion</i>
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, returnTime: e.target.value })}
          value={formData.returnTime}
        />
        <i>Time of complete debrief</i>
        <TextInput
          type='time'
          onChange={(e) =>
            setFormData({ ...formData, endTime: e.target.value })}
          value={formData.endTime}
        />
        <i>Packages</i>
        <TextInput
          type='number'
          onChange={(e) =>
            setFormData({ ...formData, packages: e.target.value })}
          value={formData.packages}
        />
        <i>Returned packages</i>
        <TextInput
          type='number'
          onChange={(e) =>
            setFormData({ ...formData, returnedPackages: e.target.value })}
          value={formData.returnedPackages}
        />
        <Button
          type='submit'
          gradientDuoTone='greenToBlue'
        >
          Save
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
