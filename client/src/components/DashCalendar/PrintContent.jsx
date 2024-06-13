import React, { useEffect, useMemo, useState, useRef } from "react";
import { formatHours, formatTimeForInput } from "../../utils";
import { useSelector } from "react-redux";

const PrintContent = ({
  selectedUser,
  currentDate,
  manifests,
  totalHours,
  totalKm,
  totalDelivered,
  totalReturned,
  totalManifests,
  contentRef,
}) => {
    const [users, setUsers] = useState([]);
    const { currentUser } = useSelector((state) => state.user);


  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/user/getusers`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const days = [];

    // Previous month days
    const prevMonthLastDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDate - i, month: "prev" });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month: "current" });
    }

    // Next month days
    const remainingDays = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, month: "next" });
    }

    return days;
  };

  const getManifestForDate = (date) => {
    const manifestsForDate = manifests.filter((manifest) => {
      const createdAtDate = new Date(manifest.createdAt);
      return (
        createdAtDate.getFullYear() === currentDate.getFullYear() &&
        createdAtDate.getMonth() === currentDate.getMonth() &&
        createdAtDate.getDate() === date
      );
    });

    return manifestsForDate.length > 0 ? manifestsForDate[0] : null;
  };

  const selectedUserName = useMemo(() => {
    if (!selectedUser) return currentUser.username;
    const user = users.find((user) => user._id === selectedUser);
    return user ? user.username : "Unknown User";
  }, [selectedUser, users]);

  const daysInMonth = generateCalendarDays().filter(
    (day) => day.month === "current"
  );

  const getWeekdayShort = (day, month, year) => {
    const date = new Date(year, month, day);
    return date.toLocaleString("en-US", { weekday: "short" });
  };

  const calculateTotalExpenses = () => {
    return manifests.reduce((total, manifest) => {
      const expense = manifest.workingHours <= 8.2 ? 0 : 1;
      return total + expense;
    }, 0);
  };

  const totalExpenses = calculateTotalExpenses();

  return (
    <div className="p-4 text-[.5rem] sm:text-xl" ref={contentRef}>
      <h2 className="text-2xl font-bold mb-4">Driver: {selectedUserName}</h2>
      <h3 className="text-xl mb-4">
        {currentDate.toLocaleString("en-US", { month: "long" })}{" "}
        {currentDate.getFullYear()}
      </h3>
      <div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Manifest Start Time</th>
              <th className="border p-2">Manifest End Time</th>
              <th className="border p-2">Working Hours</th>
              <th className="border p-2">Break</th>
              <th className="border p-2">Expenses</th>
            </tr>
          </thead>
          <tbody>
            {daysInMonth.map((day) => {
              const manifest = getManifestForDate(day.day);
              const breakTime =
                manifest && manifest.workingHours <= 8.5 ? "30 min" : "45 min";
              const expenses =
                manifest && manifest.workingHours <= 8.2 ? "0" : "1";
              return (
                <tr key={day.day}>
                  <td className="border p-2">{`${day.day}.${
                    currentDate.getMonth() + 1
                  }.${currentDate.getFullYear()}/${getWeekdayShort(
                    day.day,
                    currentDate.getMonth(),
                    currentDate.getFullYear()
                  )}`}</td>
                  {manifest ? (
                    <>
                      <td className="border p-2">
                        {formatTimeForInput(manifest.startTime)}
                      </td>
                      <td className="border p-2">
                        {formatTimeForInput(manifest.endTime)}
                      </td>
                      <td className="border p-2">
                        {formatHours(manifest.workingHours)}
                      </td>
                      <td className="border p-2">{breakTime}</td>
                      <td className="border p-2">{expenses}</td>
                    </>
                  ) : (
                    <>
                      <td className="border p-2">-</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">-</td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-4">
          <h4 className="text-lg font-bold text-center">Totals</h4>
          <div className="flex items-center justify-center gap-10 mt-4">
            <div className="">
              <p>Total Hours: {formatHours(totalHours)}</p>
              <p>Total Km: {totalKm}</p>
            </div>
            <div className="">
              <p>Total Manifests: {totalManifests}</p>
              <p>Total Expenses: {totalExpenses}</p>
            </div>
            <div className="">
              <p>Total Delivered: {totalDelivered}</p>
              <p>Total Returned: {totalReturned}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintContent;
