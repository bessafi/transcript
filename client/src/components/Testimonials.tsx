import React from 'react';

const testimonials = [
  {
    content: "TranscribeAI has completely changed my workflow. I used to spend hours transcribing interviews, now it takes minutes. The accuracy is impressive even with multiple speakers.",
    author: "David Chen",
    role: "Journalist, The Daily News",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    content: "As a content creator, I need fast and reliable transcriptions for my YouTube videos. TranscribeAI delivers perfect captions every time. My international audience loves it!",
    author: "Maria Lopez",
    role: "YouTube Creator, 1.2M subscribers",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    content: "I'm a Ph.D. student working with interview data. TranscribeAI saves me countless hours and the timestamps feature is incredibly helpful for analysis. Highly recommend!",
    author: "James Wilson",
    role: "Ph.D. Researcher, Stanford University",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of content creators, journalists, and students who trust TranscribeAI.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 relative">
              <div className="text-yellow-400 flex mb-4">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className={index !== 2 ? "fas fa-star" : "fas fa-star-half-alt"}></i>
              </div>
              <p className="text-gray-700 mb-8 italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.author}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
