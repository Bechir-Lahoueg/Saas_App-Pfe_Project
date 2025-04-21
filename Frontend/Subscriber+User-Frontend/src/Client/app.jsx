import React, { useState } from 'react';
import { ChevronRight, X, MapPin, Clock } from 'lucide-react';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const steps = [
    <SalonDetails onReserve={() => setCurrentStep(1)} />,
    <ServiceSelection 
      selectedService={selectedService} 
      setSelectedService={setSelectedService} 
      onContinue={() => setCurrentStep(2)} 
      onClose={() => setCurrentStep(0)}
    />,
    <StylistSelection 
      selectedService={selectedService}
      selectedStylist={selectedStylist}
      setSelectedStylist={setSelectedStylist}
      onContinue={() => setCurrentStep(3)}
      onClose={() => setCurrentStep(1)}
    />,
    <TimeSelection 
      selectedService={selectedService}
      selectedStylist={selectedStylist}
      selectedTime={selectedTime}
      setSelectedTime={setSelectedTime}
      onContinue={() => alert("Réservation confirmée!")}
      onClose={() => setCurrentStep(2)}
    />
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header currentStep={currentStep} />
      {steps[currentStep]}
    </div>
  );
}

function Header({ currentStep }) {
  return (
    <header className="bg-white p-4 flex items-center justify-between border-b">
      <div className="flex items-center">
        <div className="text-indigo-800 font-bold text-2xl mr-1">S</div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
        </div>
      </div>
      <div className="flex space-x-6">
        <button className="font-medium">Page d'accueil</button>
        <button className="font-medium">Mes Reservations</button>
      </div>
    </header>
  );
}

function SalonDetails({ onReserve }) {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="text-sm py-2 text-gray-700">Page d'accueil</div>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-medium">Page d'accueil</h1>
        <div className="text-sm">Barbershop</div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="relative rounded-md overflow-hidden h-64 bg-black">
          <img src="/api/placeholder/400/400" alt="Salon Interior" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-black rounded-sm ml-1"></div>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 flex space-x-4">
            <div className="w-16 h-16 bg-white rounded-full"></div>
            <div className="w-16 h-16 bg-white rounded-full"></div>
            <div className="w-16 h-16 bg-white rounded-full"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-md overflow-hidden bg-gray-200 h-32">
            <img src="/api/placeholder/400/200" alt="Salon services" className="w-full h-full object-cover" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xl">
              VURVE
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md overflow-hidden bg-gray-200 h-32">
              <img src="/api/placeholder/200/200" alt="Salon equipment" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-md overflow-hidden bg-gray-200 h-32 relative">
              <img src="/api/placeholder/200/200" alt="Haircut" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 right-2 bg-white text-xs px-2 py-1 rounded-md">
                voir tous les images
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Vurve - Bangalore</h2>
        <div className="flex items-center mt-2 text-sm">
          <div className="flex items-center">
            <span className="font-bold">5.0</span>
            <div className="flex ml-1">
              {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-gray-500">(196)</span>
          </div>
          <div className="ml-4 flex items-center">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Closed</span>
            <span className="ml-1 text-gray-700">opens soon at 9:00am</span>
          </div>
          <div className="ml-4 text-gray-700">MG Road, Bangalore</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <div className="flex">
          <div className="text-gray-600 mr-6">
            <div className="flex items-start mb-1">
              <MapPin size={18} className="text-gray-400 mr-2 mt-1" />
              <div>
                <div>1st Floor, Icon Mall, 2981, 12th Main Rd,</div>
                <div>Indiranagar, Bengaluru, Karnataka 560008</div>
              </div>
            </div>
          </div>
          
          <div className="text-gray-600">
            <div className="flex items-start mb-1">
              <Clock size={18} className="text-gray-400 mr-2 mt-1" />
              <div>
                <div>Mon</div>
                <div>Tue - Sun</div>
              </div>
              <div className="ml-4">
                <div>Closed</div>
                <div>10:00 am - 07:30 pm</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="text-gray-600 text-sm mr-4">15 personnes ont récemment reservé</div>
          <button 
            onClick={onReserve}
            className="bg-indigo-800 text-white px-6 py-2 rounded-md hover:bg-indigo-900"
          >
            Reserver
          </button>
        </div>
      </div>
      
      <div className="mt-16 text-center text-xs text-gray-400">
        © 2023 Schedoo
      </div>
    </div>
  );
}

function ServiceSelection({ selectedService, setSelectedService, onContinue, onClose }) {
  const services = [
    { id: 1, name: "Coupe de cheveux - Premier Stylist", duration: "1h", price: "10 TND" },
    { id: 2, name: "Coupe de cheveux - Top Stylist", duration: "1h", price: "10 TND" },
    { id: 3, name: "Salon Director Cut", duration: "1h", price: "10 TND" },
    { id: 4, name: "Vurve Director Cut", duration: "1h", price: "10 TND" },
    { id: 5, name: "Hair Trim", duration: "1h", price: "10 TND" },
    { id: 6, name: "Kids Cut (Below 5 years)", duration: "1h", price: "10 TND" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-600">Étape 1 sur 5</div>
        <button onClick={onClose} className="text-gray-600">
          <X size={20} />
        </button>
      </div>
      
      <h1 className="text-xl font-bold mb-6">Selectionnez le service désiré</h1>
      
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <button className="bg-indigo-800 text-white px-4 py-2 rounded-md whitespace-nowrap">
          Coupe de cheveux
        </button>
        <button className="bg-white text-gray-800 px-4 py-2 rounded-md whitespace-nowrap">
          Hair Colour
        </button>
        <button className="bg-white text-gray-800 px-4 py-2 rounded-md whitespace-nowrap">
          Hair Texture
        </button>
        <button className="bg-white text-gray-800 px-4 py-2 rounded-md whitespace-nowrap">
          Hair Treatment
        </button>
        <button className="bg-white text-gray-800 px-4 py-2 rounded-md whitespace-nowrap">
          Skin Care
        </button>
        <button className="bg-white text-gray-800 px-4 py-2 rounded-md whitespace-nowrap">
          Nails
        </button>
        <button className="text-gray-800 flex items-center">
          <ChevronRight size={20} />
        </button>
      </div>
      
      <h2 className="font-medium mb-4">Coupe de cheveux</h2>
      
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          {services.map(service => (
            <div 
              key={service.id}
              className="border-b py-4 flex items-center cursor-pointer"
              onClick={() => setSelectedService(service)}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                selectedService?.id === service.id 
                  ? "border-yellow-500 bg-yellow-500" 
                  : "border-gray-300"
              }`}>
                {selectedService?.id === service.id && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-grow">
                <div className="font-medium">{service.name}</div>
                <div className="text-gray-500 text-sm">{service.duration}</div>
              </div>
              <div className="font-medium">{service.price}</div>
            </div>
          ))}
          
          <div className="mt-8">
            <h2 className="font-medium mb-4">Styling</h2>
            {/* Styling services would go here */}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md h-fit">
          <div className="flex items-center mb-4">
            <img src="/api/placeholder/60/60" alt="Salon" className="w-12 h-12 rounded-md object-cover" />
            <div className="ml-2">
              <div className="font-medium">Vurve - Bangalore</div>
              <div className="text-sm text-gray-600">MG Road, Bangalore</div>
            </div>
          </div>
          
          {selectedService && (
            <div className="border-t pt-4">
              <div className="flex justify-between mb-1">
                <div>
                  <div className="text-sm">{selectedService.name}</div>
                  <div className="text-xs text-gray-600">{selectedService.duration}</div>
                </div>
                <div>{selectedService.price}</div>
              </div>
            </div>
          )}
          
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-medium">
              <div>Totale</div>
              <div>{selectedService ? selectedService.price : "0 TND"}</div>
            </div>
          </div>
          
          <button 
            onClick={onContinue}
            disabled={!selectedService}
            className={`w-full mt-4 py-2 rounded-md text-center ${
              selectedService 
                ? "bg-indigo-800 text-white" 
                : "bg-gray-200 text-gray-500"
            }`}
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}

function StylistSelection({ selectedService, selectedStylist, setSelectedStylish, onContinue, onClose }) {
  const stylists = Array(6).fill({
    id: 1,
    name: "Jason Price",
    title: "Coiffeur",
    email: "janick_parisian@yahoo.com"
  });
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-600">Étape 2 sur 5</div>
        <button onClick={onClose} className="text-gray-600">
          <X size={20} />
        </button>
      </div>
      
      <h1 className="text-xl font-bold mb-6">Selectionnez le prestataire désiré</h1>
      
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          <div className="grid grid-cols-3 gap-4">
            {stylists.map((stylist, index) => (
              <div 
                key={index}
                className="bg-white rounded-md p-4 shadow-sm cursor-pointer"
                onClick={() => setSelectedStylish(stylist)}
              >
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-2">
                    <img src="/api/placeholder/100/100" alt={stylist.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="font-medium text-center">{stylist.name}</div>
                  <div className="text-sm text-gray-600 text-center">{stylist.title}</div>
                  <div className="text-xs text-gray-500 text-center mt-1">{stylist.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md h-fit">
          <div className="flex items-center mb-4">
            <img src="/api/placeholder/60/60" alt="Salon" className="w-12 h-12 rounded-md object-cover" />
            <div className="ml-2">
              <div className="font-medium">Vurve - Bangalore</div>
              <div className="text-sm text-gray-600">MG Road, Bangalore</div>
            </div>
          </div>
          
          {selectedService && (
            <div className="border-t pt-4">
              <div className="flex justify-between mb-1">
                <div>
                  <div className="text-sm">{selectedService.name}</div>
                  <div className="text-xs text-gray-600">{selectedService.duration}</div>
                </div>
                <div>{selectedService.price}</div>
              </div>
            </div>
          )}
          
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-medium">
              <div>Totale</div>
              <div>{selectedService ? selectedService.price : "0 TND"}</div>
            </div>
          </div>
          
          <button 
            onClick={onContinue}
            className="w-full mt-4 py-2 rounded-md text-center bg-indigo-800 text-white"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}

function TimeSelection({ selectedService, selectedStylist, selectedTime, setSelectedTime, onContinue, onClose }) {
  const timeSlots = [
    "9:00pm", "4:45pm", "5:00pm", "5:15pm", "5:30pm", "5:45pm", "6:00pm", "8:00pm"
  ];
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-600">Étape 3 sur 5</div>
        <button onClick={onClose} className="text-gray-600">
          <X size={20} />
        </button>
      </div>
      
      <h1 className="text-xl font-bold mb-6">Select time</h1>
      
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">July</div>
              <ChevronRight size={18} />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { day: "Sun", date: "16", active: true },
                { day: "Mon", date: "17" },
                { day: "Tue", date: "18" },
                { day: "Wed", date: "19" },
                { day: "Thu", date: "20" },
                { day: "Fri", date: "21" },
                { day: "Sat", date: "22" },
                { day: "Sun", date: "23" },
                { day: "Mon", date: "24" }
              ].map((dateObj, index) => (
                <div 
                  key={index}
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded-md ${
                    dateObj.active ? "bg-yellow-500 text-white" : "bg-white text-gray-800"
                  }`}
                >
                  <div className="text-xs">{dateObj.day}</div>
                  <div className="font-medium">{dateObj.date}</div>
                </div>
              ))}
            </div>
          </div>
          
          {timeSlots.map((time, index) => (
            <div 
              key={index}
              className="border-b py-4 flex items-center justify-between cursor-pointer"
              onClick={() => setSelectedTime(time)}
            >
              <div className="font-medium">{time}</div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md h-fit">
          <div className="flex items-center mb-4">
            <img src="/api/placeholder/60/60" alt="Salon" className="w-12 h-12 rounded-md object-cover" />
            <div className="ml-2">
              <div className="font-medium">Vurve - Bangalore</div>
              <div className="text-sm text-gray-600">MG Road, Bangalore</div>
            </div>
          </div>
          
          {selectedService && (
            <div className="border-t pt-4">
              <div className="flex justify-between mb-1">
                <div>
                  <div className="text-sm">{selectedService.name}</div>
                  <div className="text-xs text-gray-600">{selectedService.duration}</div>
                </div>
                <div>{selectedService.price}</div>
              </div>
            </div>
          )}
          
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-medium">
              <div>Totale</div>
              <div>{selectedService ? selectedService.price : "0 TND"}</div>
            </div>
          </div>
          
          <button 
            onClick={onContinue}
            className="w-full mt-4 py-2 rounded-md text-center bg-indigo-800 text-white"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;