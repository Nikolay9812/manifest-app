import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import DashUsers from '../components/DashUsers'
import DashboardComp from '../components/DashboardComp'
import DashManifests from '../components/DashManifests'
import DashUserManifests from '../components/DashUserManifests'
import DashMonthTotals from '../components/DashMonthTotals'
import DashTable from '../components/DashTable'
import DashSelection from '../components/DashSelection'

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
    {/* Tabe*/}
    {tab === 'table' && <DashTable />}
    {/* Users */}
    {tab === 'users' && <DashUsers />}
    {/* Manifests */}
    {tab === 'manifests' && <DashManifests />}
    {/* Manifests */}
    {tab === 'manifestsUser' && <DashUserManifests />}
    {/* MonthTotals */}
    {tab === 'monthtotals' && <DashMonthTotals />}
    {/* Selection */}
    {tab === 'selection' && <DashSelection />}
    {/* Dashboard Comp */}
    {tab === 'dash' && <DashboardComp />}
  </div>
}
