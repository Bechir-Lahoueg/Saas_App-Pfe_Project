import React, { useState, useEffect } from 'react';
import { ChevronRight, X, MapPin, Clock } from 'lucide-react';

function Reservation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tenantId, setTenantId] = useState('');

  // Extract tenant ID from subdomain
  useEffect(() => {
    // In real environment, this extracts subdomain like planifygo.example.com → planifygo
    const extractTenantFromSubdomain = () => {
      const hostname = window.location.hostname;
      // Extract first part of hostname before first dot
      const subdomain = hostname.split('.')[0];
      // Handle localhost or IP addresses
      if (subdomain === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
        // For development, default to planifygo or use URL param
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('tenant') || 'planifygo';
      }
      return subdomain;
    };

    const tenant = extractTenantFromSubdomain();
    setTenantId(tenant);
  }, []);

  // Fetch availability data using tenant ID
  useEffect(() => {
    if (!tenantId) return;

    const fetchAvailabilityData = async () => {
      try {
        setLoading(true);
        const endpoint = 'http://localhost:8888/booking/client/reservation/getAvailability';
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'X-Tenant-ID': tenantId,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        setAvailabilityData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching availability data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAvailabilityData();
  }, [tenantId]);

  // Function to create reservation
  const createReservation = async (reservationData) => {
    try {
      const endpoint = 'http://localhost:8888/booking/client/reservation/create';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'X-Tenant-ID': tenantId,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create reservation: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error creating reservation:', err);
      throw err;
    }
  };

  const handleConfirmReservation = async () => {
    if (!selectedService || !selectedTime) {
      alert("Please select all required information");
      return;
    }

    try {
      const reservationData = {
        serviceId: selectedService.id,
        employeeId: selectedStylist?.id || null,
        startTime: selectedTime,
        numberOfAttendees: 1,
        // Add any other required fields here
      };

      const result = await createReservation(reservationData);
      alert("Réservation confirmée!");
      // Reset or navigate as needed
    } catch (err) {
      alert(`Reservation failed: ${err.message}`);
    }
  };

  const steps = [
    <SalonDetails 
      onReserve={() => setCurrentStep(1)} 
      tenantData={availabilityData} 
      loading={loading} 
    />,
    <ServiceSelection 
      selectedService={selectedService} 
      setSelectedService={setSelectedService} 
      onContinue={() => setCurrentStep(2)} 
      onClose={() => setCurrentStep(0)}
      services={availabilityData?.services || []}
      tenantData={availabilityData}
    />,
    <StylistSelection 
      selectedService={selectedService}
      selectedStylist={selectedStylist}
      setSelectedStylist={setSelectedStylist}
      onContinue={() => setCurrentStep(3)}
      onClose={() => setCurrentStep(1)}
      employees={availabilityData?.employees || []}
      serviceEmployees={selectedService?.requiresEmployeeSelection ? 
        availabilityData?.services.find(s => s.id === selectedService.id)?.employees || [] 
        : []}
      tenantData={availabilityData}
    />,
    <TimeSelection 
      selectedService={selectedService}
      selectedStylist={selectedStylist}
      selectedTime={selectedTime}
      setSelectedTime={setSelectedTime}
      onContinue={handleConfirmReservation}
      onClose={() => setCurrentStep(2)}
      workingDays={availabilityData?.workingDays || []}
      reservations={availabilityData?.reservations || []}
      tenantData={availabilityData}
    />
  ];

  if (loading && currentStep === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <div>Loading tenant data...</div>
        </div>
      </div>
    );
  }

  if (error && currentStep === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <div className="mb-4 text-2xl">Error</div>
          <div>{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-800 text-white px-6 py-2 rounded-md mt-4 hover:bg-indigo-900"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header currentStep={currentStep} tenantData={availabilityData} />
      {steps[currentStep]}
    </div>
  );
}

function Header({ currentStep, tenantData }) {
  const logo = tenantData?.medias?.find(media => media.mediaType === "logo")?.url;
  
  return (
    <header className="bg-white p-4 flex items-center justify-between border-b">
      <div className="flex items-center">
        {logo ? (
          <img src={logo} alt="Logo" className="h-8 w-auto mr-2" />
        ) : (
          <>
            <div className="text-indigo-800 font-bold text-2xl mr-1">S</div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            </div>
          </>
        )}
      </div>
      <div className="flex space-x-6">
        <button className="font-medium">Page d'accueil</button>
        <button className="font-medium">Mes Reservations</button>
      </div>
    </header>
  );
}

// Helper function to check if business is currently open
function isBusinessOpen(workingDays) {
  if (!workingDays || workingDays.length === 0) return false;
  
  const now = new Date();
  const dayOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][now.getDay()];
  const currentWorkingDay = workingDays.find(day => day.dayOfWeek === dayOfWeek);
  
  if (!currentWorkingDay || !currentWorkingDay.active) return false;
  
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:00`;
  
  return currentWorkingDay.timeSlots.some(slot => 
    slot.startTime <= currentTimeString && currentTimeString <= slot.endTime
  );
}

// Helper function to get next opening text
function getNextOpeningText(workingDays) {
  if (!workingDays || workingDays.length === 0) return "No schedule available";
  
  const now = new Date();
  const today = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:00`;
  
  // Check if we're open today but later
  const todayWorkingDay = workingDays.find(day => 
    day.dayOfWeek === ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][today]
  );
  
  if (todayWorkingDay && todayWorkingDay.active) {
    const laterSlot = todayWorkingDay.timeSlots.find(slot => slot.startTime > currentTimeString);
    if (laterSlot) {
      return `Opens today at ${laterSlot.startTime.substring(0, 5)}`;
    }
  }
  
  // Otherwise find next working day
  for (let i = 1; i <= 7; i++) {
    const nextDay = (today + i) % 7;
    const nextDayName = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][nextDay];
    const nextWorkingDay = workingDays.find(day => day.dayOfWeek === nextDayName);
    
    if (nextWorkingDay && nextWorkingDay.active && nextWorkingDay.timeSlots.length > 0) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `Opens ${dayNames[nextDay]} at ${nextWorkingDay.timeSlots[0].startTime.substring(0, 5)}`;
    }
  }
  
  return "No upcoming openings";
}

function SalonDetails({ onReserve, tenantData, loading }) {
  if (loading || !tenantData) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div>Loading salon details...</div>
      </div>
    );
  }
  
  // Extract media
  const banner = tenantData.medias?.find(media => media.mediaType === "banner")?.url;
  const photos = tenantData.medias?.filter(media => media.mediaType === "photo").map(photo => photo.url);
  const video = tenantData.medias?.find(media => media.mediaType === "video")?.url;
  
  // Get working hours
  const getWorkingHoursText = () => {
    const weekdays = tenantData.workingDays?.filter(day => day.active) || [];
    if (weekdays.length === 0) return "No working hours available";
    
    // Group days with same hours
    const hoursByDay = {};
    weekdays.forEach(day => {
      const hours = day.timeSlots.map(slot => `${slot.startTime.substring(0, 5)} - ${slot.endTime.substring(0, 5)}`).join(", ");
      if (!hoursByDay[hours]) hoursByDay[hours] = [];
      hoursByDay[hours].push(day.dayOfWeek);
    });
    
    // Format the output
    return Object.entries(hoursByDay).map(([hours, days]) => {
      const dayNames = days.map(day => day.charAt(0) + day.slice(1).toLowerCase()).join(", ");
      return `${dayNames}: ${hours}`;
    }).join("\n");
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="text-sm py-2 text-gray-700">Page d'accueil</div>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-medium">Page d'accueil</h1>
        <div className="text-sm">Service Reservation</div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="relative rounded-md overflow-hidden h-64 bg-black">
          <img 
            src={banner || "/api/placeholder/400/400"} 
            alt="Business Banner" 
            className="w-full h-full object-cover opacity-90" 
          />
          {video && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-sm ml-1"></div>
              </div>
            </div>
          )}
          <div className="absolute bottom-4 left-4 flex space-x-4">
            {photos.slice(0, 3).map((photo, index) => (
              <div key={index} className="w-16 h-16 bg-white rounded-full overflow-hidden">
                <img src={photo} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-md overflow-hidden bg-gray-200 h-32">
            <img 
              src={photos[0] || "/api/placeholder/400/200"} 
              alt="Business services" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md overflow-hidden bg-gray-200 h-32">
              <img 
                src={photos[1] || "/api/placeholder/200/200"} 
                alt="Business showcase" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="rounded-md overflow-hidden bg-gray-200 h-32 relative">
              <img 
                src={photos[2] || "/api/placeholder/200/200"} 
                alt="Business showcase" 
                className="w-full h-full object-cover" 
              />
              {photos.length > 3 && (
                <div className="absolute bottom-2 right-2 bg-white text-xs px-2 py-1 rounded-md">
                  voir tous les images ({photos.length})
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Services Booking</h2>
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
            {isBusinessOpen(tenantData.workingDays) ? (
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">Open</span>
            ) : (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Closed</span>
            )}
            <span className="ml-1 text-gray-700">
              {getNextOpeningText(tenantData.workingDays)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <div className="flex">
          <div className="text-gray-600 mr-6">
            <div className="flex items-start mb-1">
              <MapPin size={18} className="text-gray-400 mr-2 mt-1" />
              <div>
                <div>Business Location</div>
                <div>Address details</div>
              </div>
            </div>
          </div>
          
          <div className="text-gray-600">
            <div className="flex items-start mb-1">
              <Clock size={18} className="text-gray-400 mr-2 mt-1" />
              <div>
                {getWorkingHoursText().split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
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
        © 2025 PlanifyGo
      </div>
    </div>
  );
}

function ServiceSelection({ selectedService, setSelectedService, onContinue, onClose, services, tenantData }) {
  // Group services by category (this is simulated as we don't have categories in the data)
  const groupedServices = {
    "All Services": services
  };

  const [activeCategory, setActiveCategory] = useState("All Services");

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-600">Étape 1 sur 3</div>
        <button onClick={onClose} className="text-gray-600">
          <X size={20} />
        </button>
      </div>
      
      <h1 className="text-xl font-bold mb-6">Selectionnez le service désiré</h1>
      
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {Object.keys(groupedServices).map((category) => (
          <button 
            key={category}
            className={`${
              activeCategory === category 
                ? "bg-indigo-800 text-white" 
                : "bg-white text-gray-800"
            } px-4 py-2 rounded-md whitespace-nowrap`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <h2 className="font-medium mb-4">{activeCategory}</h2>
      
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          {groupedServices[activeCategory].map(service => (
            <div 
              key={service.id}
              className="border-b py-4 flex items-center cursor-pointer"
              onClick={() => setSelectedService({
                id: service.id,
                name: service.name,
                duration: service.duration,
                requiresEmployeeSelection: service.requiresEmployeeSelection,
                price: "10 TND" // Assuming a default price
              })}
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
                <div className="text-gray-500 text-sm">{service.duration} min</div>
              </div>
              <div className="font-medium">10 TND</div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md h-fit">
          <div className="flex items-center mb-4">
            <img 
              src={tenantData?.medias?.find(m => m.mediaType === "logo")?.url || "/api/placeholder/60/60"} 
              alt="Business" 
              className="w-12 h-12 rounded-md object-cover" 
            />
            <div className="ml-2">
              <div className="font-medium">Business Name</div>
              <div className="text-sm text-gray-600">Location</div>
            </div>
          </div>
          
          {selectedService && (
            <div className="border-t pt-4">
              <div className="flex justify-between mb-1">
                <div>
                  <div className="text-sm">{selectedService.name}</div>
                  <div className="text-xs text-gray-600">{selectedService.duration} min</div>
                </div>
                <div>{selectedService.price}</div>
              </div>
            </div>
          )}
          
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-medium">
              <div>Total</div>
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

function StylistSelection({ 
  selectedService, 
  selectedStylist, 
  setSelectedStylist, 
  onContinue, 
  onClose, 
  employees,
  serviceEmployees,
  tenantData
}) {
  // Filter employees for the selected service
  const availableStylists = selectedService?.requiresEmployeeSelection 
    ? serviceEmployees 
    : [];

  // If service doesn't require employee selection, skip this step
  useEffect(() => {
    if (selectedService && !selectedService.requiresEmployeeSelection) {
      // Wait a moment to avoid UI flicker
      const timer = setTimeout(() => {
        onContinue();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedService, onContinue]);

  // If no employee selection required, show loading indicator
  if (selectedService && !selectedService.requiresEmployeeSelection) {
    return (
      <div className="max-w-6xl mx-auto p-4 text-center">
        <div>Continuing to next step...</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-600">Étape 2 sur 3</div>
        <button onClick={onClose} className="text-gray-600">
          <X size={20} />
        </button>
      </div>
      
      <h1 className="text-xl font-bold mb-6">Selectionnez le prestataire désiré</h1>
      
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          <div className="grid grid-cols-3 gap-4">
            {availableStylists.map((stylist) => (
              <div 
                key={stylist.id}
                className={`bg-white rounded-md p-4 shadow-sm cursor-pointer ${
                  selectedStylist?.id === stylist.id ? "ring-2 ring-indigo-800" : ""
                }`}
                onClick={() => setSelectedStylist(stylist)}
              >
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-2">
                    <img src="/api/placeholder/100/100" alt={`${stylist.firstName} ${stylist.lastName}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="font-medium text-center">{`${stylist.firstName} ${stylist.lastName}`}</div>
                  <div className="text-sm text-gray-600 text-center">Staff</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md h-fit">
          <div className="flex items-center mb-4">
            <img 
              src={tenantData?.medias?.find(m => m.mediaType === "logo")?.url || "/api/placeholder/60/60"} 
              alt="Business" 
              className="w-12 h-12 rounded-md object-cover" 
            />
            <div className="ml-2">
              <div className="font-medium">Business Name</div>
              <div className="text-sm text-gray-600">Location</div>
            </div>
          </div>
          
          {selectedService && (
            <div className="border-t pt-4">
              <div className="flex justify-between mb-1">
                <div>
                  <div className="text-sm">{selectedService.name}</div>
                  <div className="text-xs text-gray-600">{selectedService.duration} min</div>
                </div>
                <div>{selectedService.price}</div>
              </div>
            </div>
          )}
          
          {selectedStylist && (
            <div className="mt-2 text-sm">
              <div>with {selectedStylist.firstName} {selectedStylist.lastName}</div>
            </div>
          )}
          
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-medium">
              <div>Total</div>
              <div>{selectedService ? selectedService.price : "0 TND"}</div>
            </div>
          </div>
          
          <button 
            onClick={onContinue}
            disabled={!selectedService || (selectedService.requiresEmployeeSelection && !selectedStylist)}
            className={`w-full mt-4 py-2 rounded-md text-center ${
              selectedService && (!selectedService.requiresEmployeeSelection || selectedStylist)
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

// Helper function to format date for API
function formatDateTimeForAPI(date) {
  return date.toISOString().slice(0, 19);
}

function TimeSelection({ 
  selectedService, 
  selectedStylist, 
  selectedTime, 
  setSelectedTime, 
  onContinue, 
  onClose,
  workingDays,
  reservations,
  tenantData
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [visibleDates, setVisibleDates] = useState([]);
  
  // Generate dates for the next 14 days
  function TimeSelection({ 
    selectedService, 
    selectedStylist, 
    selectedTime, 
    setSelectedTime, 
    onContinue, 
    onClose,
    workingDays,
    reservations,
    tenantData
  }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [visibleDates, setVisibleDates] = useState([]);
    
    // Generate dates for the next 14 days
    useEffect(() => {
      const dates = [];
      const today = new Date();
      
      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Check if this date is a working day
        const dayOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][date.getDay()];
        const workingDay = workingDays.find(day => day.dayOfWeek === dayOfWeek);
        
        dates.push({
          date,
          dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
          dayNumber: date.getDate(),
          month: date.toLocaleString('default', { month: 'short' }),
          isWorkingDay: workingDay?.active || false,
          timeSlots: workingDay?.timeSlots || []
        });
      }
      
      setVisibleDates(dates);
      // Select first working day by default
      const firstWorkingDay = dates.find(d => d.isWorkingDay);
      if (firstWorkingDay) {
        setSelectedDate(firstWorkingDay.date);
      }
    }, [workingDays]);
    
    // Generate available time slots for selected date
    useEffect(() => {
      if (!selectedDate || !selectedService) return;
      
      // Get working hours for the selected day
      const dayOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][selectedDate.getDay()];
      const workingDay = workingDays.find(day => day.dayOfWeek === dayOfWeek);
      
      if (!workingDay || !workingDay.active) {
        setAvailableSlots([]);
        return;
      }
      
      // Generate time slots based on service duration
      const serviceDuration = selectedService.duration || 30; // Default 30 min if not specified
      const slots = [];
      
      workingDay.timeSlots.forEach(timeSlot => {
        const startTime = new Date(`1970-01-01T${timeSlot.startTime}`);
        const endTime = new Date(`1970-01-01T${timeSlot.endTime}`);
        
        while (startTime.getTime() + serviceDuration * 60000 <= endTime.getTime()) {
          const slotTime = new Date(selectedDate);
          slotTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
          
          // Check if this slot conflicts with existing reservations
          const isBooked = reservations.some(reservation => {
            const reservationStart = new Date(reservation.startTime);
            const reservationEnd = new Date(reservationStart.getTime() + reservation.duration * 60000);
            
            // If the stylist is specified, only check reservations for that stylist
            if (selectedStylist && reservation.employeeId !== selectedStylist.id) {
              return false;
            }
            
            // Check if our slot overlaps with this reservation
            return slotTime >= reservationStart && slotTime < reservationEnd;
          });
          
          if (!isBooked) {
            slots.push({
              time: slotTime,
              formattedTime: slotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              timestamp: formatDateTimeForAPI(slotTime)
            });
          }
          
          // Move to next slot
          startTime.setMinutes(startTime.getMinutes() + 15); // 15-minute increments
        }
      });
      
      setAvailableSlots(slots);
      // Clear selected time when date changes
      setSelectedTime(null);
    }, [selectedDate, selectedService, selectedStylist, workingDays, reservations]);
    
    const handleDateScroll = (direction) => {
      const container = document.getElementById('date-scroller');
      container.scrollBy({ left: direction * 300, behavior: 'smooth' });
    };
  
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-600">Étape 3 sur 3</div>
          <button onClick={onClose} className="text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <h1 className="text-xl font-bold mb-6">Selectionnez la date et l'heure désirée</h1>
        
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-3">
            <div className="relative">
              <button 
                onClick={() => handleDateScroll(-1)} 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md"
              >
                <ChevronRight className="transform rotate-180" size={16} />
              </button>
              
              <div id="date-scroller" className="flex overflow-x-auto no-scrollbar pb-4 relative px-6">
                {visibleDates.map((dateObj, index) => (
                  <div 
                    key={index}
                    className={`flex-shrink-0 mx-1 w-16 text-center py-2 rounded-lg cursor-pointer ${
                      !dateObj.isWorkingDay 
                        ? "bg-gray-100 text-gray-400" 
                        : selectedDate && dateObj.date.toDateString() === selectedDate.toDateString()
                          ? "bg-indigo-800 text-white" 
                          : "bg-white hover:bg-gray-100"
                    }`}
                    onClick={() => dateObj.isWorkingDay && setSelectedDate(dateObj.date)}
                  >
                    <div className="text-xs">{dateObj.dayName}</div>
                    <div className="text-lg font-medium">{dateObj.dayNumber}</div>
                    <div className="text-xs">{dateObj.month}</div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => handleDateScroll(1)} 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="mt-6">
              <h2 className="font-medium mb-4">Available Time Slots</h2>
              
              {availableSlots.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No available slots for this date
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      className={`py-2 rounded-md text-center ${
                        selectedTime === slot.timestamp
                          ? "bg-indigo-800 text-white"
                          : "bg-white border hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedTime(slot.timestamp)}
                    >
                      {slot.formattedTime}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md h-fit">
            <div className="flex items-center mb-4">
              <img 
                src={tenantData?.medias?.find(m => m.mediaType === "logo")?.url || "/api/placeholder/60/60"} 
                alt="Business" 
                className="w-12 h-12 rounded-md object-cover" 
              />
              <div className="ml-2">
                <div className="font-medium">Business Name</div>
                <div className="text-sm text-gray-600">Location</div>
              </div>
            </div>
            
            {selectedService && (
              <div className="border-t pt-4">
                <div className="flex justify-between mb-1">
                  <div>
                    <div className="text-sm">{selectedService.name}</div>
                    <div className="text-xs text-gray-600">{selectedService.duration} min</div>
                  </div>
                  <div>{selectedService.price}</div>
                </div>
              </div>
            )}
            
            {selectedStylist && (
              <div className="mt-2 text-sm">
                <div>with {selectedStylist.firstName} {selectedStylist.lastName}</div>
              </div>
            )}
            
            {selectedTime && (
              <div className="mt-2 text-sm">
                <div>
                  {new Date(selectedTime).toLocaleDateString()} at {new Date(selectedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
            
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-medium">
                <div>Total</div>
                <div>{selectedService ? selectedService.price : "0 TND"}</div>
              </div>
            </div>
            
            <button 
              onClick={onContinue}
              disabled={!selectedService || !selectedTime}
              className={`w-full mt-4 py-2 rounded-md text-center ${
                selectedService && selectedTime
                  ? "bg-indigo-800 text-white" 
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              Confirmer la réservation
            </button>
          </div>
        </div>
      </div>
    );
  }
  
}

export default Reservation;