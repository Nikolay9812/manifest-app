// CalendarData.js
import React from "react";
import { formatHours } from "../../utils";
import { Link } from "react-router-dom";

const CalendarData = ({ manifest }) => {
  return (
    <>
      <div
        className={`relative w-10 h-10 ${manifest.secondUserId ? "mr-4" : ""}`}
      >
        <div className="group">
          <Link to={`/manifest/${manifest.slug}`}>
            <img
              src={manifest.profilePicture}
              alt="user"
              className="absolute w-full h-full rounded-full z-10 border-2 dark:border-slate-500 border-slate-300 transition-scale duration-300 hover:scale-150 hover:z-50"
            />
          </Link>
          <div className="absolute bottom-14 left-[-8px] w-full dark:border-slate-500 border-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
            <span className="text-xs text-gray-700 dark:text-gray-300 px-1">
              {manifest.username}
            </span>
          </div>
        </div>
        {manifest.secondUserId && manifest.secondProfilePicture && (
          <div className="group">
            <img
              src={manifest.secondProfilePicture}
              alt="user"
              className="absolute w-full h-full rounded-full ml-4 border-2 dark:border-slate-600 border-slate-400 transition-scale duration-300 hover:scale-150 hover:z-50"
            />
            <div className="absolute bottom-14 left-[17px] w-full bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
              <span className="text-xs text-gray-700 dark:text-gray-300 px-1">
                {manifest.secondUsername}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="p-2">{formatHours(manifest.workingHours)}</div>
    </>
  );
};

export default CalendarData;
