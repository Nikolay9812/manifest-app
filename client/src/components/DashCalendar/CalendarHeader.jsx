// CalendarHeader.js
import React from "react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const CalendarHeader = ({
  currentDate,
  goToPreviousMonth,
  goToNextMonth,
  goToPreviousYear,
  goToNextYear,
}) => {
  return (
    <div className="flex justify-between items-center p-3 text-sm sm:text-xl">
      <MdKeyboardDoubleArrowLeft
        className="cursor-pointer opacity-[1] transition-opacity duration-300 hover:opacity-[.2]"
        onClick={goToPreviousYear}
      />
      <div className="flex items-center justify-center gap-3">
        <MdKeyboardArrowLeft
          className="cursor-pointer opacity-[1] transition-opacity duration-300 hover:opacity-[.2]"
          onClick={goToPreviousMonth}
        />
        <div className="w-[200px] text-center">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <MdKeyboardArrowRight
          className="cursor-pointer opacity-[1] transition-opacity duration-300 hover:opacity-[.2]"
          onClick={goToNextMonth}
        />
      </div>
      <MdKeyboardDoubleArrowRight
        className="cursor-pointer opacity-[1] transition-opacity duration-300 hover:opacity-[.2]"
        onClick={goToNextYear}
      />
    </div>
  );
};

export default CalendarHeader;
