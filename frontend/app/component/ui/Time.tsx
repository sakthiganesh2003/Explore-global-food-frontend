import React, { useState } from "react";

const Time = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [prepTime, setPrepTime] = useState("");
  const [error, setError] = useState("");

  // Mocked available time slots
  const availableTimeSlots = {
    morning: ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"],
    afternoon: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"],
    evening: ["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"],
  };

  const prepOptions = [
    { label: "No extra time needed", value: "" },
    { label: "15 minutes", value: "15" },
    { label: "30 minutes", value: "30" },
    { label: "1 hour", value: "60" },
  ];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setError("");
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTime = e.target.value;
    if (newTime && !selectedTimes.includes(newTime)) {
      setSelectedTimes([...selectedTimes, newTime]);
    }
    setError("");
  };

  const handlePrepTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrepTime(e.target.value);
  };

  const removeTimeSlot = (time: string) => {
    setSelectedTimes(selectedTimes.filter((t) => t !== time));
  };

  const handleSubmit = () => {
    if (!selectedDate || selectedTimes.length === 0) {
      setError("Please select both a date and at least one time slot.");
      return;
    }

    // Log data to console before sending
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time Slots:", selectedTimes);
    console.log("Preparation Time:", prepTime);

    alert(
      `Your session is scheduled on ${selectedDate} at ${selectedTimes.join(
        ", "
      )}${prepTime ? ` with ${prepTime} minutes of preparation time.` : ""}`
    );

    // Proceed to next step or submit data
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Select Your Preferred Time
      </h3>
      <p className="text-gray-600 text-center mb-6">
        Choose a date, multiple time slots, and preparation time if needed.
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
          min={new Date().toISOString().split("T")[0]} // Prevent past dates
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

      {/* Preparation Time Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Need Extra Preparation Time?
        </label>
        <select
          value={prepTime}
          onChange={handlePrepTimeChange}
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800"
        >
          {prepOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      {/* Confirm Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Confirm Time
        </button>
      </div>
    </div>
  );
};

export default Time;
