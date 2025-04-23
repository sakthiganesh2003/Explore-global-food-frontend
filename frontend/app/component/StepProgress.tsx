'use client';

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import MaidChoose from './ui/MaidChoose';
import SelectCuisine from './ui/SelectCuisine';
import Members from './ui/Members';
import Time from './ui/Time';
import FinalReview from './ui/FinalReview';

type MaidType = {
  userId: string;
  fullName: string;
  specialties: string[];
  rating: number;
  experience: string | number;
  image?: string;
  cuisine?: string[];
};

type CuisineType = {
  id: string;
  name: string;
  price?: number;
};

type MemberType = {
  _id?: string;
  dietaryPreference: string;
  allergies: string;
  specialRequests: string;
  mealQuantity: number;
};

type TimeSlotType = {
  date: string;
  time: string[];
  address: string;
  phoneNumber: string;
};

type FoodItemType = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type FormDataType = {
  maid: MaidType | null;
  cuisine: CuisineType | null;
  members: MemberType[];
  time: TimeSlotType | null;
  confirmedFoods: FoodItemType[];
};

const steps = ['Maid Choose', 'Select Cuisine', 'Members', 'Time', 'Final Review'] as const;

const StepProgress = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormDataType>({
    maid: null,
    cuisine: null,
    members: [],
    time: null,
    confirmedFoods: [],
  });

  console.log('StepProgress Form Data:', formData);

  const nextStep = () => {
    if (currentStep === 0 && !formData.maid) {
      toast.error('Please select a maid!');
      return;
    }
    if (currentStep === 1 && !formData.cuisine) {
      toast.error('Please select a cuisine');
      return;
    }
    if (currentStep === 2 && formData.members.length === 0) {
      toast.error('Please add at least one member');
      return;
    }
    if (currentStep === 3 && !formData.time) {
      // toast.error('Please confirm your time and details');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const updateFormData = (data: Partial<FormDataType>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    if (data.maid && currentStep === 0) {
      setTimeout(() => nextStep(), 500);
    }
  };

  const updateMembers = (members: MemberType[]) => {
    setFormData((prev) => ({ ...prev, members }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <MaidChoose
            onNext={(maid: MaidType) => {
              updateFormData({ maid });
            }}
          />
        );
      case 1:
        return (
          <SelectCuisine
            maidId={formData.maid?.userId || ''}
            maidSpecialties={formData.maid?.specialties || []}
            onSelect={(cuisine: CuisineType) => updateFormData({ cuisine })}
            onSelectConfirmedFoods={(foods: FoodItemType[]) => updateFormData({ confirmedFoods: foods })}
          />
        );
      case 2:
        return (
          <Members
            members={formData.members}
            setMembers={(members: MemberType[]) => updateFormData({ members })}
          />
        );
      case 3:
        return (
          <Time
            onSelect={(time: TimeSlotType) => {
              updateFormData({ time });
              toast.success('Time details confirmed!');
              setTimeout(() => nextStep(), 500);
            }}
          />
        );
      case 4:
        return (
          <FinalReview
            formData={formData}
            onConfirm={() => {
              console.log('Booking completed', formData);
              toast.success('Booking confirmed!');
            }}
            updateMembers={updateMembers}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="w-full p-4 md:p-10 bg-gray-100 rounded-lg shadow-lg min-h-screen">
        <div className="relative">
          <div className="overflow-hidden rounded-full bg-gray-200 h-2">
            <div
              className="h-2 rounded-full bg-green-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <ol className="mt-6 grid grid-cols-5 text-sm font-medium text-gray-500 text-center">
            {steps.map((step, index) => (
              <li
                key={index}
                className={`flex items-center justify-center ${
                  index <= currentStep ? 'text-black font-semibold' : ''
                } ${index === currentStep ? 'text-blue-600' : ''}`}
              >
                <span className="truncate">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-6">{renderStepContent()}</div>
        <div className="mt-8 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          {currentStep < steps.length - 1 && (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          )}
          {currentStep === steps.length - 1 && (
            <button
              onClick={() => console.log('Submit booking', formData)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Confirm Booking
            </button>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default StepProgress;