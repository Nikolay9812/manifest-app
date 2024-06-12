import React, { useEffect, useState } from "react";
import {
  LuMapPin,
  LuPackage,
  LuPackageCheck,
  LuPackageX,
  LuUser,
} from "react-icons/lu";
import { CiClock2 } from "react-icons/ci";
import { MdOutlineMapsHomeWork, MdOutlineFreeBreakfast } from "react-icons/md";
import { GiPathDistance } from "react-icons/gi";
import { FiTruck } from "react-icons/fi";
import { IoTimer } from "react-icons/io5";
import { formatHours, formatTimeForInput } from "../utils";

const ManifestItem = ({ manifest, userId }) => {
  const [user, setUser] = useState(null);
  const [secondDriverUser, setSecondDriverUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);

        const mainDriverRes = await fetch(
          `/api/user/getusers?userId=${userId}`
        );
        const mainDriverData = await mainDriverRes.json();

        if (mainDriverRes.ok && mainDriverData.users.length > 0) {
          const foundUser = mainDriverData.users.find(
            (user) => user._id === userId
          );
          setUser(foundUser);
        } else {
          setError(true);
        }

        if (manifest.secondUserId) {
          const secondDriverRes = await fetch(
            `/api/user/getusers?userId=${manifest.secondUserId}`
          );
          const secondDriverData = await secondDriverRes.json();

          if (secondDriverRes.ok && secondDriverData.users.length > 0) {
            const foundSecondUser = secondDriverData.users.find(
              (user) => user._id === manifest.secondUserId
            );
            setSecondDriverUser(foundSecondUser);
          } else {
            setSecondDriverUser(null);
          }
        }

        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setUser(null);
      setSecondDriverUser(null);
      setError(false);
    };
  }, [userId, manifest.secondUserId]);

  if (loading) {
    return <div className="text-center">Loading user information...</div>;
  }

  if (error) {
    return (
      <div className="text-center">
        Error fetching user information. Please try again later.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-2 gap-y-3 sm:grid-cols-2 md:grid-cols-3 text-slate-700 dark:text-slate-400 italic p-2">
      <div className="dark:bg-gray-700 rounded-lg shadow-xl min-h-[100px] row-span-4 col-span-1 md:col-auto flex flex-col items-center justify-center gap-3 p-4 sm:p-6">
        <div className="text-2xl sm:text-3xl text-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            {user && user.profilePicture && (
              <img
                src={user.profilePicture}
                alt="User Profile"
                className="absolute w-full h-full rounded-full z-10 border-4 dark:border-slate-500 border-slate-300"
              />
            )}
            {secondDriverUser && secondDriverUser.profilePicture && (
              <img
                src={secondDriverUser.profilePicture}
                alt="Second Driver Profile"
                className="absolute w-full h-full rounded-full ml-5 sm:ml-7 border-4 dark:border-slate-600 border-slate-400"
              />
            )}
          </div>
        </div>
        <div className="text-xl sm:text-3xl text-center">
          <span className="text-sm">Driver name: </span>
          <br />
          <span className="dark:dark:text-white">{manifest.driverName}</span>
          {secondDriverUser && (
            <div>
              <p className="text-xs sm:text-sm">
                Second Driver: {secondDriverUser.username}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">Stantion:</span>
          <MdOutlineMapsHomeWork />
          <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 dark:text-white text-sm">
            {manifest.stantion}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">Tor:</span>
          <LuMapPin />
          <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 dark:text-white text-sm">
            {manifest.tor}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">Plate:</span>
          <FiTruck />
          <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 dark:text-white text-sm">
            {manifest.plate}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">Date:</span>
          <div className="dark:text-white">
            {new Date(manifest.date).toDateString()}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">Firma:</span>
          <div className="dark:text-white">Ivanov Transport</div>
        </div>
        <span
          className={`font-medium ${
            manifest.status === "inProgress"
              ? "text-yellow-500"
              : manifest.status === "approved"
              ? "text-green-500"
              : "text-red-500"
          } hover:underline cursor-pointer`}
        >
          {manifest.status === "inProgress"
            ? "Waiting for Approval"
            : manifest.status === "approved"
            ? "Approved"
            : "Disapproved"}
        </span>
      </div>
      <div className="dark:bg-gray-700 rounded-lg shadow-xl min-h-[100px] col-span-1 sm:col-span-2 text-2xl sm:text-3xl flex items-center justify-center gap-5 sm:gap-10 p-4">
        <div className="flex items-center gap-1 text-yellow-500">
          <LuPackage />
          {manifest.packages}
        </div>
        <div className="flex items-center gap-1 text-red-500">
          <LuPackageX />
          {manifest.returnedPackages}
        </div>
        <div className="flex items-center gap-1 text-green-500">
          <LuPackageCheck />
          {manifest.totalPackages}
        </div>
      </div>
      <div className="dark:bg-gray-700 rounded-lg shadow-xl min-h-[100px] row-span-2 flex flex-col items-center justify-center gap-3 sm:gap-6 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="text-sm">Handover time handled:</span>
          <CiClock2 />
          <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 dark:text-white text-sm">
            {formatTimeForInput(manifest.startTime)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">Departure time stantion:</span>
          <CiClock2 />
          <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 text-sm dark:text-white">
            {manifest.departure}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">Time of first delivery:</span>
          <CiClock2 />
          <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 text-sm dark:text-white">
            {manifest.firstDelivery}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">Time of last delivery:</span>
          <CiClock2 />
          <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 dark:text-white text-sm">
            {manifest.lastDelivery}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">Return time station:</span>
          <CiClock2 />
          <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 dark:text-white text-sm">
            {manifest.returnTime}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">Time of complete debrief:</span>
          <CiClock2 />
          <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 dark:text-white text-sm">
            {formatTimeForInput(manifest.endTime)}
          </div>
        </div>
      </div>
      <div className="dark:bg-gray-700 rounded-lg shadow-xl min-h-[100px] text-slate-400 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col justify-center items-center">
          <span>Start Kilometers:</span>
          <div className="flex gap-3 items-center">
            <IoTimer />
            <span className="dark:text-white">{manifest.kmStart}</span>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <span>End Kilometers:</span>
          <div className="flex gap-3 items-center">
            <IoTimer />
            <span className="dark:text-white">{manifest.kmEnd}</span>
          </div>
        </div>
      </div>
      <div className="dark:bg-gray-700 rounded-lg shadow-xl min-h-[100px] text-slate-400 flex flex-col items-center justify-center text-2xl sm:text-3xl p-4">
        <MdOutlineFreeBreakfast />
        <div className="flex gap-3 items-center sm:p-6">
          <span>Break:</span>
          <span className="dark:text-white">
            {manifest.workingHours <= 8.5 ? "30 min" : "45 min"}
          </span>
        </div>
      </div>
      <div className="dark:bg-gray-700 rounded-lg shadow-xl min-h-[100px] col-span-1 sm:col-span-2 flex justify-around p-4 sm:p-10">
        <div className="flex gap-3 items-center">
          <div className="flex flex-col justify-center items-center dark:text-white">
            <span>Total Hours:</span>
            <div className="flex gap-3 items-center">
              <CiClock2 />
              {formatHours(manifest.workingHours)}
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex flex-col justify-center items-center dark:text-white">
            <span>Total Kilometers:</span>
            <div className="flex gap-3 items-center">
              <GiPathDistance />
              {manifest.totalKm}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManifestItem;
