'use client';

import { useState } from 'react';
import MaidChoose from './ui/MaidChoose';
import SelectCuisine from './ui/SelectCuisine';
import Members from './ui/Members';
import Time from './ui/Time';
import Payment from './ui/Payment';

const steps = ['Maid Choose', 'Select Cuisine', 'Members', 'Time', 'Payment'];

const StepProgress = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <MaidChoose />;
      case 1:
        return <SelectCuisine />;
      case 2:
        return <Members />;
      case 3:
        return <Time />;
      case 4:
        return <Payment />;
      default:
        return null;
    }
  };

  return (
    <div className=" sticky min-h-screen flex justify-center items-center  bg-white">
      <div className="w-full  p-10 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="sr-only">Steps</h2>

        <div className="relative">
          <div className="overflow-hidden rounded-full bg-gray-200 h-2">
            <div
              className="h-2 rounded-full bg-green-500 transition-all "
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>

          <ol className="mt-6 grid grid-cols-5 text-sm font-medium text-gray-500 text-center">
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
              className={`px-4 py-2 text-white rounded ${
                currentStep === 0 ? 'bg-gray-300' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              Previous
            </button>

            <button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className={`px-4 py-2 text-white rounded ${
                currentStep === steps.length - 1
                  ? 'bg-gray-300'
                  : 'bg-pink-600 hover:bg-white-600'
              }`}
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepProgress;
