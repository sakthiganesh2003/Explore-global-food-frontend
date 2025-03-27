'use client';

import { useState } from 'react';
import MaidChoose from './ui/MaidChoose';
import SelectCuisine from './ui/SelectCuisine';
import Members from './ui/Members';
import Time from './ui/Time';
import FinalReview from './ui/FinalReview';
import Payment from './ui/Payment';

// Define types for your form data
type MaidType = {
  _id: string;
  // Add other maid properties as needed
  name?: string;
};

type CuisineType = {
  // Define your cuisine type structure
  id: string;
  name: string;
};

type MemberType = {
  // Define your member type structure
  id: string;
  name: string;
};

type TimeSlotType = {
  // Define your time slot type structure
  date: string;
  time: string[];
};

type FoodItemType = {
  // Define your food item type structure
  id: string;
  name: string;
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

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const updateFormData = (data: Partial<FormDataType>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <MaidChoose onNext={(maid: MaidType) => updateFormData({ maid })} />;
      case 1:
        console.log("Rendering SelectCuisine with Maid ID:", formData.maid?._id);
        return (
          <SelectCuisine
            maidId={formData.maid?._id}
            onSelect={(selection: CuisineType) => updateFormData({ cuisine: selection })}
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
        return <Time onNext={(time: TimeSlotType) => updateFormData({ time })} />;
      case 4:
        return <FinalReview formData={formData} />;
      case 5:
        return <Payment />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="w-full p-10 bg-gray-100 rounded-lg shadow-lg min-h-screen">
        <div className="relative">
          <div className="overflow-hidden rounded-full bg-gray-200 h-2">
            <div
              className="h-2 rounded-full bg-green-500 transition-all"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <ol className="mt-6 grid grid-cols-6 text-sm font-medium text-gray-500 text-center">
            {steps.map((step, index) => (
              <li
                key={index}
                className={`flex items-center justify-center ${
                  index <= currentStep ? 'text-black font-semibold' : ''
                }`}
              >
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 text-center">
          {renderStepContent()}
          <div className="mt-4 flex justify-between">
            <button 
              onClick={prevStep} 
              disabled={currentStep === 0} 
              className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              onClick={nextStep} 
              disabled={currentStep === steps.length - 1} 
              className="px-4 py-2 bg-pink-600 text-white rounded disabled:opacity-50"
            >
              {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepProgress;