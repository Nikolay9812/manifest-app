import React, { useEffect, useRef, useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarDaysOfWeek from "./CalendarDaysOfWeek";
import CalendarDay from "./CalendarDay";
import CalendarTotals from "./CalendarTotals";
import { formatHours } from "../../utils";
import CalendarData from "./CalendarData";
import { debounce } from "lodash";
import { Spinner } from "flowbite-react";
import UserSelector from "./UserSelector";
import { FaDownload, FaPrint } from "react-icons/fa";
import PrintContent from "./PrintContent";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DashCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [manifests, setManifests] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [totalDelivered, setTotalDelivered] = useState(0);
  const [totalReturned, setTotalReturned] = useState(0);
  const [totalManifests, setTotalManifests] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const contentRef = useRef(null);

  const fetchManifests = async (year, month, userId) => {
    try {
      setLoading(true);
      const queryString = `year=${year}&month=${month}${
        userId ? `&userId=${userId}` : ""
      }`;
      const response = await fetch(
        `/api/manifest/getallmanifests?${queryString}`
      );
      const data = await response.json();
      setManifests(data.manifests);
      setTotalManifests(data.totalManifests);
      setTotalHours(data.totalHours);
      setTotalKm(data.totalKm);
      setTotalDelivered(data.totalDelivered);
      setTotalReturned(data.totalReturned);
    } catch (error) {
      console.error("Error fetching manifests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchManifestsDebounced = debounce(
    (year, month, userId) => fetchManifests(year, month, userId),
    300
  );

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    fetchManifestsDebounced(year, month, selectedUser);
    return () => fetchManifestsDebounced.cancel();
  }, [currentDate, selectedUser]);

  const getWorkedHoursForDate = (date) => {
    const manifestsForDate = manifests.filter((manifest) => {
      const createdAtDate = new Date(manifest.date);
      return (
        createdAtDate.getFullYear() === currentDate.getFullYear() &&
        createdAtDate.getMonth() === currentDate.getMonth() &&
        createdAtDate.getDate() === date
      );
    });

    return manifestsForDate.length > 0
      ? manifestsForDate.map((manifest) => (
          <CalendarData key={manifest._id} manifest={manifest} />
        ))
      : "";
  };

  const changeMonth = (delta) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + delta);
      return newDate;
    });
  };

  const goToPreviousMonth = () => changeMonth(-1);
  const goToNextMonth = () => changeMonth(1);

  const changeYear = (delta) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setFullYear(newDate.getFullYear() + delta);
      return newDate;
    });
  };

  const goToPreviousYear = () => changeYear(-1);
  const goToNextYear = () => changeYear(1);

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

  const openPrintModal = () => {
    setShowPrintModal(true);
  };

  const closePrintModal = () => {
    setShowPrintModal(false);
  };

  const handleOutsideClick = (event) => {
    if (event.target.id === "printModal") {
      closePrintModal();
    }
  };

  const downloadPdf = (contentRef) => {
    const input = contentRef.current;
    html2canvas(input, { scale: 1 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = canvas.width * 0.75; // Adjust the scale factor as needed
      const pdfHeight = canvas.height * 0.75; // Adjust the scale factor as needed
      const pdf = new jsPDF({
        orientation: "portrait", // or "landscape"
        unit: "pt", // units: 'mm', 'cm', 'in', 'px'
        format: [pdfWidth, pdfHeight], // specify custom dimensions
      });
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("manifest.pdf");
    });
  };

  return (
    <div className="md:mx-auto p-6 w-full">
      <UserSelector onUserSelect={setSelectedUser} />
      <button
        onClick={openPrintModal}
        className="flex items-center p-2 bg-green-500/50 text-white rounded mb-4 w-full lg:w-fit"
      >
        <FaPrint className="mr-2" /> Open Table
      </button>
      <CalendarHeader
        currentDate={currentDate}
        goToPreviousMonth={goToPreviousMonth}
        goToNextMonth={goToNextMonth}
        goToPreviousYear={goToPreviousYear}
        goToNextYear={goToNextYear}
      />
      <CalendarTotals
        totalHours={formatHours(totalHours)}
        totalKm={totalKm}
        totalDelivered={totalDelivered}
        totalReturned={totalReturned}
        totalManifests={totalManifests}
      />
      <CalendarDaysOfWeek />
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1 p-1 border-2 border-gray-500">
          {generateCalendarDays().map((day, index) => (
            <CalendarDay
              key={index}
              day={day.day}
              month={day.month}
              getWorkedHoursForDate={getWorkedHoursForDate}
            />
          ))}
        </div>
      )}
      {showPrintModal && (
        <div
          id="printModal"
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-white text-gray-500 p-6 rounded-lg max-w-4xl h-full overflow-auto">
            <PrintContent
              selectedUser={selectedUser}
              currentDate={currentDate}
              manifests={manifests}
              totalHours={totalHours}
              totalKm={totalKm}
              totalDelivered={totalDelivered}
              totalReturned={totalReturned}
              totalManifests={totalManifests}
              contentRef={contentRef}
            />
            <button
              onClick={closePrintModal}
              className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
              Close Modal
            </button>
            <button
              onClick={() => downloadPdf(contentRef)}
              className="ml-4 mt-4 p-2 bg-yellow-500 text-white rounded"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
