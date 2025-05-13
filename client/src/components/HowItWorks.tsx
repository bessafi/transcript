import React from 'react';

const steps = [
  {
    number: 1,
    title: "Paste Your Video URL",
    description: "Simply copy the link from YouTube, TikTok, or Instagram and paste it into our transcription tool."
  },
  {
    number: 2,
    title: "Choose Your Preferences",
    description: "Select the language, add timestamps, enable speaker identification, and more customization options."
  },
  {
    number: 3,
    title: "Let AI Do Its Magic",
    description: "Our advanced AI processes the audio, recognizes speech, and converts it to accurate text in minutes."
  },
  {
    number: 4,
    title: "Get Your Transcript",
    description: "Download, copy, or share your transcript in various formats. Edit if needed before finalizing."
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our process is designed to be simple, fast, and effective.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary"></div>
            
            {/* Steps */}
            <div className="relative z-10">
              {steps.map((step, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center ${index !== steps.length - 1 ? 'mb-16' : ''} relative`}>
                  <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 text-center md:text-right">
                    {index % 2 === 0 ? (
                      <>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">{step.title}</h3>
                        <p className="text-gray-600">
                          {step.description}
                        </p>
                      </>
                    ) : <></>}
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-xl font-bold">
                    {step.number}
                  </div>
                  <div className="md:w-1/2 md:pl-12 text-center md:text-left">
                    {index % 2 === 1 ? (
                      <>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">{step.title}</h3>
                        <p className="text-gray-600">
                          {step.description}
                        </p>
                      </>
                    ) : <></>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
