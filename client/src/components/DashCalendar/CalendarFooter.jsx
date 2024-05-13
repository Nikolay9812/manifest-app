import { formatHours } from "../../utils";

export default function CalendarFooter({ totalHours }) {
    return (
        <div className="flex justify-center p-3 text-xl">
            Total Hours: {formatHours(totalHours)}
        </div>
    );
}