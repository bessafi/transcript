import React from 'react';

const pricingPlans = [
  {
    name: "Free",
    description: "Perfect for occasional use",
    price: "$0",
    period: "/month",
    features: [
      "10 minutes of transcription/month",
      "Standard accuracy",
      "Basic export formats",
      "5 languages supported"
    ],
    buttonText: "Get Started",
    buttonStyle: "block text-center bg-gray-200 hover:bg-gray-300 transition-colors text-gray-800 font-semibold py-3 px-4 rounded-md w-full",
    popularChoice: false,
    borderColor: "border-gray-300"
  },
  {
    name: "Pro",
    description: "For content creators and professionals",
    price: "$15",
    period: "/month",
    features: [
      "5 hours of transcription/month",
      "High accuracy",
      "All export formats",
      "30 languages supported",
      "Speaker identification",
      "Priority processing"
    ],
    buttonText: "Choose Pro",
    buttonStyle: "block text-center bg-primary hover:bg-secondary transition-colors text-white font-semibold py-3 px-4 rounded-md w-full",
    popularChoice: true,
    borderColor: "border-primary"
  },
  {
    name: "Business",
    description: "For teams and high-volume needs",
    price: "$49",
    period: "/month",
    features: [
      "20 hours of transcription/month",
      "Highest accuracy",
      "All export formats",
      "All 30+ languages",
      "Advanced speaker identification",
      "Priority+ processing",
      "Team collaboration",
      "Dedicated support"
    ],
    buttonText: "Choose Business",
    buttonStyle: "block text-center bg-secondary hover:bg-opacity-90 transition-colors text-white font-semibold py-3 px-4 rounded-md w-full",
    popularChoice: false,
    borderColor: "border-secondary"
  }
];

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Start for free, upgrade as you grow. No hidden fees or complicated pricing structures.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl shadow-md overflow-hidden border-t-4 ${plan.borderColor} ${plan.popularChoice ? 'transform scale-105 shadow-lg' : ''}`}
            >
              {plan.popularChoice && (
                <div className="bg-primary text-white text-center py-2 text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <i className="fas fa-check text-success mt-1 mr-2"></i>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="#signup" className={plan.buttonStyle}>
                  {plan.buttonText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
