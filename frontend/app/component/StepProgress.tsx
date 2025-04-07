'use client';

import { useState } from 'react';
import MaidChoose from './ui/MaidChoose';
import SelectCuisine from './ui/SelectCuisine';
import Members from './ui/Members';
import Time from './ui/Time';
import FinalReview from './ui/FinalReview';
import Payment from './ui/Payment';

// Enhanced type definitions
type MaidType = {
  _id: string;
  fullName: string;
  specialties: string[];
  rating: number;
  experience: string | number;
  image?: string;
  hourlyRate?: number;
  cuisine?: string[];
};

type CuisineType = {
  id: string;
  name: string;
};

type MemberType = {
  id: string;
  name: string;
};

type TimeSlotType = {
  date: string;
  time: string[];
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

const steps = ['Maid Choose', 'Select Cuisine', 'Members', 'Time', 'Final Review', 'Payment'] as const;

const StepProgress = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormDataType>({
    maid: null,
    cuisine: null,
    members: [],
    time: null,
    confirmedFoods: [],
  });

  const nextStep = () => {
    // Validate before proceeding to next step
    if (currentStep === 0 && !formData.maid) {
      alert('Please select a maid first');
      return;
    }
    if (currentStep === 1 && !formData.cuisine) {
      alert('Please select a cuisine');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const updateFormData = (data: Partial<FormDataType>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // Auto-progress to next step when maid is selected
    if (data.maid && currentStep === 0) {
      setTimeout(() => nextStep(), 500);
    }
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
            maidId={formData.maid?._id || ''}
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
            onSelect={(time: TimeSlotType) => updateFormData({ time })}
          />
        );
      case 4:
        return (
          <FinalReview 
            formData={formData} 
            onConfirm={() => nextStep()}
          />
        );
      case 5:
        return (
          <Payment 
            formData={formData}
            onComplete={() => {
              // Handle payment completion
              console.log('Booking completed', formData);
              alert('Booking confirmed!');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="w-full p-4 md:p-10 bg-gray-100 rounded-lg shadow-lg min-h-screen">
        {/* Progress indicator */}
        <div className="relative">
          <div className="overflow-hidden rounded-full bg-gray-200 h-2">
            <div
              className="h-2 rounded-full bg-green-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <ol className="mt-6 grid grid-cols-6 text-sm font-medium text-gray-500 text-center">
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

        {/* Step content */}
        <div className="mt-6">
          {renderStepContent()}
        </div>

        {/* Navigation buttons */}
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
    </div>
  );
};

export default StepProgress;