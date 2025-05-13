import React from 'react';

const CallToAction: React.FC = () => {
  return (
    <section className="py-20 gradient-bg">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Video Content?</h2>
        <p className="text-xl text-gray-100 mb-10 max-w-3xl mx-auto">
          Join millions of users worldwide who trust TranscribeAI for fast, accurate video transcriptions. Start for free today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <a href="#signup" className="bg-white hover:bg-gray-100 transition-colors text-primary text-lg font-semibold py-4 px-8 rounded-md">
            Create Free Account
          </a>
          <a href="#transcribe" className="bg-accent hover:bg-opacity-90 transition-colors text-white text-lg font-semibold py-4 px-8 rounded-md">
            Try Without Signing Up
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
