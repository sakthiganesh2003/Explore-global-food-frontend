import React, { useState } from "react";

const Time = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Mocked available time slots
  const availableTimeSlots = {
    morning: ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"],
    afternoon: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"],
    evening: ["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"],
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTime = e.target.value;
    if (newTime && !selectedTimes.includes(newTime)) {
      setSelectedTimes([...selectedTimes, newTime]);
    }
  };

  const removeTimeSlot = (time: string) => {
    setSelectedTimes(selectedTimes.filter((t) => t !== time));
  };

  const handleSubmit = () => {
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time Slots:", selectedTimes);

    setSuccessMessage(
      `Your session is scheduled on ${selectedDate} at ${selectedTimes.join(", ")}.`
    );
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Select Your Preferred Time
      </h3>
      <p className="text-gray-600 text-center mb-6">
        Choose a date and multiple time slots.
      </p>

      {/* Date Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Choose Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800"
        />
      </div>

      {/* Time Slot Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Choose Time (Select multiple)
        </label>
        <select
          value=""
          onChange={handleTimeChange}
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800"
        >
          <option value="">Select a time slot</option>
          <optgroup label="Morning">
            {availableTimeSlots.morning.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </optgroup>
          <optgroup label="Afternoon">
            {availableTimeSlots.afternoon.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </optgroup>
          <optgroup label="Evening">
            {availableTimeSlots.evening.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Display Selected Time Slots */}
      {selectedTimes.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Selected Time Slots:
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedTimes.map((time, index) => (
              <span
                key={index}
                className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-2"
              >
                {time}
                <button
                  type="button"
                  className="ml-2 text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center"
                  onClick={() => removeTimeSlot(time)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Confirm Time
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <p className="mt-4 text-green-500 text-center font-semibold">
          {successMessage}
        </p>
      )}
    </div>
  );
};

export default Time;
