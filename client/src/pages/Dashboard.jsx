import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import DashUsers from '../components/DashUsers'
import DashboardComp from '../components/DashboardComp'
import DashCalendar from '../components/DashCalendar/DashCalendar'
import DashSelection from '../components/DashSelection'
import DashManifests from '../components/DashManifest/DashManifest'

export default function Dashboard() {
  const location = useLocation()

  const [tab, setTab] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])

  return <div className='min-h-screen flex flex-col md:flex-row'>
    <div className='md:w-56'>
      {/* Sidebar */}
      <DashSidebar />
    </div>
    {/* Profile */}
    {tab === 'profile' && <DashProfile />}
    {/* Users */}
    {tab === 'users' && <DashUsers />}
    {/* Manifests */}
    {tab === 'manifests' && <DashManifests />}
    {/* Selection */}
    {tab === 'selection' && <DashSelection />}
    {/* Calendar */}
    {tab === 'calendar' && <DashCalendar />}
    {/* Dashboard Comp */}
    {tab === 'dash' && <DashboardComp />}
  </div>
}
