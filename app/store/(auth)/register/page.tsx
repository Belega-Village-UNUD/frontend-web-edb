"use client";

import ButtonConfirm from "@/components/button/ButtonConfirm";
import Container from "@/components/Container";
import ProgressBar from "@/components/ProgressBar";
import { ArrowBigLeft } from "lucide-react";
import { useState } from "react";
import AddressFormStore from "./AddressFormStore";
import FileFormStore from "./FileFormStore";
import NameFormStore from "./NameFormStore";

const RegiterStore = () => {
  const [currentStep, setCurrentStep] = useState('01');

  const handleNameFormSubmit = () => {
    setCurrentStep('02');
  };
  const handleAddressFormSubmit = () => {
    setCurrentStep('03');
  };

  const handleBack = () => {
    if (currentStep === '02') {
      setCurrentStep('01');
    } else if (currentStep === '03') {
      setCurrentStep('02');
    }
  };
  return (
    <Container>
      <div className="my-20 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
        <ProgressBar
          currentStep={currentStep}
          steps={[
            { id: '01', name: 'Name Form Store', description: 'Enter your personal details such as name, date of birth, etc.', href: '#' },
            { id: '02', name: 'Application form', description: 'Fill out the application form with relevant information.', href: '#' },
            { id: '03', name: 'Preview', description: 'Review and confirm the information you have entered.', href: '#' },
          ]}
        />
        <div className="p-12">
          <div className="w-14 pb-4">
            {currentStep !== '01' &&
              <ButtonConfirm icon={<ArrowBigLeft />} onClick={handleBack} outline />}
          </div>
          {currentStep === '01' && <NameFormStore onNameFormSubmit={handleNameFormSubmit} />}
          {currentStep === '02' && <AddressFormStore onAddressFormSubmit={handleAddressFormSubmit} />}
          {currentStep === '03' && <FileFormStore onFileFormSubmit={handleAddressFormSubmit} />}
        </div>
      </div>
    </Container>
  )
};

export default RegiterStore;