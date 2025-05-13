import React from 'react';

const GlobalUsage: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Helping Millions Around the Globe</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our AI-powered transcription service is used by people in over 190 countries. From students and journalists to content creators and businesses, TranscribeAI helps everyone get accurate transcripts in seconds.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <div className="flex items-center">
                <div className="text-primary text-3xl mr-3"><i className="fas fa-users"></i></div>
                <div>
                  <h4 className="font-bold text-2xl text-gray-800">10M+</h4>
                  <p className="text-gray-600">Active Users</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-primary text-3xl mr-3"><i className="fas fa-file-alt"></i></div>
                <div>
                  <h4 className="font-bold text-2xl text-gray-800">500M+</h4>
                  <p className="text-gray-600">Transcriptions</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-primary text-3xl mr-3"><i className="fas fa-globe"></i></div>
                <div>
                  <h4 className="font-bold text-2xl text-gray-800">30+</h4>
                  <p className="text-gray-600">Languages</p>
                </div>
              </div>
            </div>
            <a href="#signup" className="inline-block bg-primary hover:bg-secondary transition-colors text-white font-semibold py-3 px-8 rounded-md">
              Start Transcribing for Free
            </a>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://pixabay.com/get/g8b83ea8cd846f62c4c09ce924bf027feaab15ad5439b261651a180360e359db65cf9885ff4f0b2a5c59a0c8d31b642805a1dc033d9b53676e0ca412d2d5ccace_1280.jpg" 
              alt="Global usage map showing TranscribeAI users worldwide" 
              className="rounded-xl shadow-lg w-full h-auto" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalUsage;
