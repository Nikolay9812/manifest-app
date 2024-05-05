import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CiClock2 } from "react-icons/ci";
import { MdOutlineFreeBreakfast, MdOutlineMapsHomeWork } from "react-icons/md";
import { LuMapPin, LuPackage, LuPackageCheck, LuPackageX, LuUser } from "react-icons/lu";
import { GiPathDistance } from "react-icons/gi";
import { formatHours } from '../utils';
import ManifestItem from '../components/ManifestItem';
import { useSelector } from 'react-redux';

export default function ManifestPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [manifest, setManifest] = useState(null);
  const [recentManifests, setRecentManifests] = useState(null);

  const { manifestSlug } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchManifest = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/manifest/getmanifests?slug=${manifestSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setManifest(data.manifests[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    const fetchRecentManifests = async () => {
      try {
        const res = await fetch(`/api/manifest/getmanifests?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentManifests(data.manifests);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchManifest();
    fetchRecentManifests();
  }, [manifestSlug]);

  if (loading) {
    return (
      <div className="flex justify-center item-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        Delivery Associate Control Sheet
      </h1>
      {error ? (
        <div>Error fetching data. Please try again later.</div>
      ) : (
        <div className="mt-3 lg:text-xl">
          {manifest && <ManifestItem manifest={manifest} userId={manifest.userId} />}
        </div>
      )}
    </main>
  );
}
