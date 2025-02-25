import React, { useState } from 'react';

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      stars: 5,
      text: "\"We've scaled up quickly, and managing billing across multiple Workflow projects was becoming increasingly complex. Frankly, they gave us a central platform where we can handle everything from automated invoicing to payment reporting. The best part? We've cut our billing management time in half, giving us more space to focus on our clients and growth.\"",
      name: "Joe K.",
      title: "CEO, Finsweet",
      companyLogo: "/api/placeholder/100/40",
      companyLogoAlt: "Finsweet logo"
    },
    {
      id: 2,
      stars: 5,
      text: "\"As a small agency handling multiple projects, keeping track of Workflow billing used to be a headache. Frankly's improved that. The tool now automatically syncs our Workflow usage with client invoicing, and the payment tracking is seamless. We've been able to streamline our process and get paid faster—no more chasing clients!\"",
      name: "Leonardo Zakour",
      title: "CEO, Refokus",
      companyLogo: "/api/placeholder/100/40",
      companyLogoAlt: "Refokus logo"
    },
    {
      id: 3,
      stars: 5,
      text: "\"As a small agency handling multiple projects, keeping track of Workflow billing used to be a headache. Frankly's improved that. The tool now automatically syncs our Workflow usage with client invoicing, and the payment tracking is seamless. We've been able to streamline our process and get paid faster—no more chasing clients!\"",
      name: "Harshit Agarwal",
      title: "Freelancer",
      companyLogo: "/api/placeholder/100/40",
      companyLogoAlt: "Flowchef logo"
    }
  ];

  const totalSlides = Math.ceil(testimonials.length / 3);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Display testimonials for current slide (3 per slide)
  const displayTestimonials = testimonials.slice(currentSlide * 3, (currentSlide + 1) * 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
          Nos témoignages
        </div>
        <h2 className="text-4xl font-bold mb-4">
          <span className="text-blue-600">Nos clients</span> disent!
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Lisez les témoignages de nos utilisateurs satisfaits et découvrez comment nos services ont eu un impact positif sur leur vie et leur entreprise.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {displayTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            {/* Stars */}
            <div className="flex mb-4">
              {[...Array(testimonial.stars)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            
            {/* Testimonial Text */}
            <p className="text-gray-600 mb-6 flex-grow">
              {testimonial.text}
            </p>
            
            {/* Person Info & Company */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                  <img src="/api/placeholder/48/48" alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.title}</p>
                </div>
              </div>
              <div>
                <img 
                  src={testimonial.companyLogo} 
                  alt={testimonial.companyLogoAlt} 
                  className="h-6 object-contain" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots & Navigation */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex space-x-2 mx-auto">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full ${currentSlide === index ? 'bg-blue-600' : 'bg-gray-300'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={prevSlide}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-blue-600 hover:bg-blue-50"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;