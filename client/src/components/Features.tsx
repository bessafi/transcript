import React from 'react';

const features = [
  {
    icon: "fas fa-globe-americas",
    title: "Multi-language Support",
    description: "Transcribe videos in over 30 languages with high accuracy. Perfect for international content."
  },
  {
    icon: "fas fa-bolt",
    title: "Lightning Fast",
    description: "Get your transcription in minutes, not hours. Our optimized algorithm works quickly without sacrificing quality."
  },
  {
    icon: "fas fa-user-friends",
    title: "Speaker Identification",
    description: "Automatically identify and label different speakers in your video for better readability."
  },
  {
    icon: "fas fa-clock",
    title: "Timestamps",
    description: "Every transcription includes accurate timestamps to easily reference specific moments in your video."
  },
  {
    icon: "fas fa-file-export",
    title: "Multiple Export Formats",
    description: "Download your transcript as plain text, SRT for subtitles, or formatted documents ready to use."
  },
  {
    icon: "fas fa-lock",
    title: "Privacy First",
    description: "Your content stays private. We don't store video data and all transcripts are encrypted."
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our advanced AI technology provides accurate transcriptions with helpful features to save you time and effort.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-primary text-2xl mb-4">
                <i className={feature.icon}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
