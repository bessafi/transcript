import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="gradient-bg py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Instantly Transcribe Any Video
            </h1>
            <p className="text-xl text-gray-100 mb-8">
              Convert YouTube, TikTok, and Instagram videos to text with our AI-powered transcription service. Fast, accurate, and completely free.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#transcribe" className="bg-accent hover:bg-opacity-90 transition-colors text-white text-lg font-semibold py-3 px-8 rounded-md text-center">
                Start Transcribing
              </a>
              <a href="#how-it-works" className="bg-white hover:bg-gray-100 transition-colors text-primary text-lg font-semibold py-3 px-8 rounded-md text-center">
                How It Works
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Person using transcription service" 
              className="rounded-xl shadow-xl w-full max-w-lg h-auto" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
