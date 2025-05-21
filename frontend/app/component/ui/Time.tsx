import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface TimeSlotType {
  date: string;
  time: string[];
  address: string;
  phoneNumber: string;
  pincode: string;
}

interface TimeProps {
  onSelect: (time: TimeSlotType) => void;
}

const Time = ({ onSelect }: TimeProps) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pincode, setPincode] = useState('');
  const [errors, setErrors] = useState({
    date: '',
    times: '',
    address: '',
    phone: '',
    pincode: '',
  });

  // Mocked available time slots
  const availableTimeSlots = {
    morning: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'],
    afternoon: ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'],
    evening: ['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'],
  };

  // Function to convert time string (e.g., "8:00 AM") to Date object for comparison
  const parseTimeToDate = (time: string, date: string) => {
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    const timeDate = new Date(date);
    timeDate.setHours(hours, minutes, 0, 0);
    return timeDate;
  };

  // Get current time and calculate the minimum allowed time (current time + 4 hours)
  const now = new Date();
  const minAllowedTime = new Date(now.getTime() + 4 * 60 * 60 * 1000); // Add 4 hours

  // Filter time slots based on current time + 4 hours
  const isFutureTimeSlot = (time: string, date: string) => {
    const timeDate = parseTimeToDate(time, date);
    return timeDate >= minAllowedTime;
  };

  // Filter available time slots for the selected date
  const getFilteredTimeSlots = (date: string) => {
    if (!date || date !== new Date().toISOString().split('T')[0]) {
      // If no date selected or date is not today, show all time slots
      return availableTimeSlots;
    }
    return {
      morning: availableTimeSlots.morning.filter((time) => isFutureTimeSlot(time, date)),
      afternoon: availableTimeSlots.afternoon.filter((time) => isFutureTimeSlot(time, date)),
      evening: availableTimeSlots.evening.filter((time) => isFutureTimeSlot(time, date)),
    };
  };

  const filteredTimeSlots = getFilteredTimeSlots(selectedDate);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setSelectedTimes([]); // Reset selected times when date changes
    setErrors({ ...errors, date: '' });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTime = e.target.value;
    if (newTime && !selectedTimes.includes(newTime)) {
      setSelectedTimes([...selectedTimes, newTime]);
      setErrors({ ...errors, times: '' });
    }
  };

  const removeTimeSlot = (time: string) => {
    setSelectedTimes(selectedTimes.filter((t) => t !== time));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      date: '',
      times: '',
      address: '',
      phone: '',
      pincode: '',
    };

    if (!selectedDate) {
      newErrors.date = 'Please select a date';
      toast.error(newErrors.date);
      valid = false;
    }

    if (selectedTimes.length === 0) {
      newErrors.times = 'Please select at least one time slot';
      toast.error(newErrors.times);
      valid = false;
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
      toast.error(newErrors.address);
      valid = false;
    }

    if (!phoneNumber.trim()) {
      newErrors.phone = 'Phone number is required';
      toast.error(newErrors.phone);
      valid = false;
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      toast.error(newErrors.phone);
      valid = false;
    }

    if (!pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
      toast.error(newErrors.pincode);
      valid = false;
    } else if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
      toast.error(newErrors.pincode);
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const timeData: TimeSlotType = {
      date: selectedDate,
      time: selectedTimes,
      address,
      phoneNumber,
      pincode,
    };

    onSelect(timeData);

    // Reset form after submission
    setSelectedDate('');
    setSelectedTimes([]);
    setAddress('');
    setPhoneNumber('');
    setPincode('');
    setErrors({ date: '', times: '', address: '', phone: '', pincode: '' });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">Book Your Service</h3>
      <p className="text-gray-600 text-center mb-6">Provide your details and preferred time slots</p>

      {/* Address Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Delivery Address *</label>
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setErrors({ ...errors, address: '' });
          }}
          className={`mt-1 block w-full px-3 py-3 border ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800`}
          placeholder="Enter your full address"
        />
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
      </div>

      {/* Pincode Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Pincode *</label>
        <input
          type="text"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value);
            setErrors({ ...errors, pincode: '' });
          }}
          className={`mt-1 block w-full px-3 py-3 border ${
            errors.pincode ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800`}
          placeholder="Enter your 6-digit pincode"
          maxLength={6}
        />
        {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
      </div>

      {/* Phone Number Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
            setErrors({ ...errors, phone: '' });
          }}
          className={`mt-1 block w-full px-3 py-3 border ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800`}
          placeholder="Enter your 10-digit phone number"
          maxLength={10}
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
      </div>

      {/* Date Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Choose Date *</label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className={`mt-1 block w-full px-3 py-3 border ${
            errors.date ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800`}
          min={new Date().toISOString().split('T')[0]} // Disable past dates
        />
        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
      </div>

      {/* Time Slot Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Choose Time Slots (Select multiple) *
        </label>
        <select
          value=""
          onChange={handleTimeChange}
          className={`mt-1 block w-full px-3 py-3 border ${
            errors.times ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800`}
          disabled={!selectedDate} // Disable if no date is selected
        >
          <option value="">Select a time slot</option>
          {filteredTimeSlots.morning.length > 0 && (
            <optgroup label="Morning">
              {filteredTimeSlots.morning.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </optgroup>
          )}
          {filteredTimeSlots.afternoon.length > 0 && (
            <optgroup label="Afternoon">
              {filteredTimeSlots.afternoon.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </optgroup>
          )}
          {filteredTimeSlots.evening.length > 0 && (
            <optgroup label="Evening">
              {filteredTimeSlots.evening.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        {errors.times && <p className="mt-1 text-sm text-red-600">{errors.times}</p>}
        {selectedDate && filteredTimeSlots.morning.length === 0 && filteredTimeSlots.afternoon.length === 0 && filteredTimeSlots.evening.length === 0 && (
          <p className="mt-1 text-sm text-red-600">No available time slots for the selected date.</p>
        )}
      </div>

      {/* Display Selected Time Slots */}
      {selectedTimes.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Selected Time Slots:</label>
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
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default Time;