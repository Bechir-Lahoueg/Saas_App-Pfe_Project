import React from 'react';

const ServiceSolutionsPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="text-sm text-blue-600 font-medium uppercase bg-blue-100 inline-block px-3 py-1 rounded-full mb-4">
          NOS SOLUTIONS
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">
          Solution <span className="text-blue-600">tout-en-un pour les entreprises de services</span>
        </h1>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Events and Entertainment */}
        <div className="bg-amber-50 rounded-lg p-6 flex flex-col items-center">
          <div className="h-40 flex items-center justify-center mb-4">
            <img 
              src="/api/placeholder/200/200" 
              alt="Microphone" 
              className="h-32 object-contain"
            />
          </div>
          <div className="text-center">
            <h3 className="font-medium text-gray-800">Événements et<br />divertissements</h3>
          </div>
        </div>

        {/* Business Meetings */}
        <div className="bg-blue-50 rounded-lg p-6 flex flex-col items-center">
          <div className="h-40 flex items-center justify-center mb-4">
            <img 
              src="/api/placeholder/200/200" 
              alt="Briefcase" 
              className="h-32 object-contain"
            />
          </div>
          <div className="text-center">
            <h3 className="font-medium text-gray-800">Réunions et<br />services personnels</h3>
          </div>
        </div>

        {/* Medical Services */}
        <div className="bg-blue-50 rounded-lg p-6 flex flex-col items-center">
          <div className="h-40 flex items-center justify-center mb-4">
            <img 
              src="/api/placeholder/200/200" 
              alt="Stethoscope" 
              className="h-32 object-contain"
            />
          </div>
          <div className="text-center">
            <h3 className="font-medium text-gray-800">Services médicaux et<br />de santé</h3>
          </div>
        </div>

        {/* Sports & Fitness */}
        <div className="bg-amber-50 rounded-lg p-6 flex flex-col items-center">
          <div className="h-40 flex items-center justify-center mb-4">
            <img 
              src="/api/placeholder/200/200" 
              alt="Fitness instructor" 
              className="h-32 object-contain"
            />
          </div>
          <div className="text-center">
            <h3 className="font-medium text-gray-800">Sports &<br />Fitness</h3>
          </div>
        </div>

        {/* Beauty & Wellness */}
        <div className="bg-rose-50 rounded-lg p-6 flex flex-col items-center">
          <div className="h-40 flex items-center justify-center mb-4">
            <img 
              src="/api/placeholder/200/200" 
              alt="Lotus flower" 
              className="h-32 object-contain"
            />
          </div>
          <div className="text-center">
            <h3 className="font-medium text-gray-800">Beauté et<br />bien-être</h3>
          </div>
        </div>

        {/* Education */}
        <div className="bg-blue-50 rounded-lg p-6 flex flex-col items-center">
          <div className="h-40 flex items-center justify-center mb-4">
            <img 
              src="/api/placeholder/200/200" 
              alt="Student reading" 
              className="h-32 object-contain"
            />
          </div>
          <div className="text-center">
            <h3 className="font-medium text-gray-800">Enseignement</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSolutionsPage;