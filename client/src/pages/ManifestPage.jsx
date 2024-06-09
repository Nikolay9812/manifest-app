import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CiClock2 } from "react-icons/ci";
import { MdOutlineFreeBreakfast, MdOutlineMapsHomeWork } from "react-icons/md";
import {
  LuMapPin,
  LuPackage,
  LuPackageCheck,
  LuPackageX,
  LuUser,
} from "react-icons/lu";
import { GiPathDistance } from "react-icons/gi";
import { formatHours } from "../utils";
import ManifestItem from "../components/ManifestItem";
import { useSelector } from "react-redux";
import ManifestModal from "../components/DashManifest/ManifestModal";

export default function ManifestPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [manifest, setManifest] = useState(null);
  const [recentManifests, setRecentManifests] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { manifestSlug } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchManifest = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/manifest/getmanifests?slug=${manifestSlug}`
        );
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

  const handleDeleteManifest = async () => {
    setShowModal(false);
    try {
      if (!manifest) {
        console.error("No manifest to delete");
        return;
      }
      const res = await fetch(`/api/manifest/delete/${manifest._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Error deleting manifest");
        return;
      }

      navigate("/dashboard?tab=manifests");
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        Delivery Associate Control Sheet
      </h1>
      {error ? (
        <div>Error fetching data. Please try again later.</div>
      ) : (
        <div className="mt-3 lg:text-xl">
          {manifest && (
            <ManifestItem manifest={manifest} userId={manifest.userId} />
          )}
          {currentUser.isAdmin && (
            <div className="flex italic gap-3 my-3">
              <Link
                className="text-teal-500 hover:underline"
                to={`/update-manifest/${manifest._id}`}
              >
                <span>Edit</span>
              </Link>
              <span
                onClick={() => setShowModal(true)}
                className="font-medium text-red-500 hover:underline cursor-pointer"
              >
                Delete
              </span>
            </div>
          )}
          {currentUser.isAdmin && (
            <ManifestModal
              show={showModal}
              onClose={() => setShowModal(false)}
              onDeleteManifest={handleDeleteManifest}
            />
          )}
        </div>
      )}
    </main>
  );
}
