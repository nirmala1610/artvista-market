import React from "react";

const steps = ["Basic", "Schedule", "Tickets", "Artists", "Preview"];

const ExhibitionStepper = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-10">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center w-full">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300
              ${
                currentStep >= index
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-white/10 text-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <span className="mt-2 text-sm">{step}</span>
          </div>

          {index !== steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-3 rounded-full ${
                currentStep > index ? "bg-cyan-500" : "bg-white/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ExhibitionStepper;