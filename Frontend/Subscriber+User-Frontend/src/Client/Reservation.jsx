import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Check, X } from 'lucide-react';

// Utility to map JS getDay() to backend DayOfWeek
const JS_DAY_TO_BACKEND = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];

export default function Reservation() {
  const [tenant, setTenant] = useState('');
  const [availability, setAvailability] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Base URL for API
  const API_BASE = `http://${window.location.hostname}:8888`;

  // Extract tenant from hostname
  useEffect(() => {
    setTenant(window.location.hostname.split('.')[0]);
  }, []);

  // Fetch availability
  useEffect(() => {
    if (!tenant) return;
    setLoading(true);
    fetch(`${API_BASE}/booking/client/reservation/getAvailability`, { headers: { 'X-Tenant-ID': tenant } })
      .then(res => res.ok ? res.json() : Promise.reject('Network error'))
      .then(data => setAvailability(data))
      .catch(() => setError('Failed to load availability'))
      .finally(() => setLoading(false));
  }, [tenant]);

  // Build time slots (HH:mm format)
  useEffect(() => {
    if (!availability) return;
    const dayKey = JS_DAY_TO_BACKEND[selectedDate.getDay()];
    const wd = availability.workingDays.find(w => w.dayOfWeek === dayKey && w.active);
    if (!wd) return setTimeSlots([]);
    const slots = [];
    wd.timeSlots.forEach(ts => {
      const [sH, sM] = ts.startTime.split(':').map(Number);
      const [eH, eM] = ts.endTime.split(':').map(Number);
      const start = new Date(selectedDate);
      start.setHours(sH, sM, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(eH, eM, 0, 0);
      let cursor = new Date(start);
      while (cursor < end) {
        const hh = cursor.getHours().toString().padStart(2, '0');
        const mm = cursor.getMinutes().toString().padStart(2, '0');
        slots.push(`${hh}:${mm}`);
        cursor = new Date(cursor.getTime() + 30 * 60000);
      }
    });
    setTimeSlots(slots);
    setSelectedTime(null);
  }, [selectedDate, availability]);

  const handleConfirm = () => {
    if (!selectedService || !selectedTime) return;
    // build start and end in ISO
    const [h, m] = selectedTime.split(':').map(Number);
    const start = new Date(selectedDate);
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + selectedService.duration * 60000);
    const body = {
      serviceId: selectedService.id,
      employeeId: selectedService.requiresEmployeeSelection ? selectedEmployee.id : null,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      numberOfAttendees: 1
    };
    fetch(`${API_BASE}/booking/client/reservation/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Tenant-ID': tenant },
      body: JSON.stringify(body)
    })
      .then(res => res.ok ? res.json() : Promise.reject('Booking failed'))
      .then(() => alert('Reservation confirmed!'))
      .catch(() => alert('Error creating reservation'));
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!availability) return null;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        {['📅 Date','⏱️ Service','👤 Employee','✅ Confirm'][step-1]}
      </h2>
      {step === 1 && (
        <div>
          <input type="date" className="border p-2 mb-4" value={selectedDate.toISOString().split('T')[0]} onChange={e => setSelectedDate(new Date(e.target.value))} min={new Date().toISOString().split('T')[0]} />
          <div className="grid grid-cols-3 gap-2 mb-4">
            {timeSlots.map(t => (
              <button key={t} onClick={() => setSelectedTime(t)} className={`p-2 border rounded ${selectedTime===t?'bg-blue-200':''}`}>{t}</button>
            ))}
          </div>
          <button onClick={() => setStep(2)} disabled={!selectedTime} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          {availability.services.map(s => (
            <div key={s.id} onClick={() => timeSlots.includes(selectedTime) && setSelectedService(s)} className={`p-4 border rounded mb-2 ${selectedService?.id===s.id?'bg-blue-100':''}`}>{s.name}</div>
          ))}
          <button onClick={() => setStep(selectedService.requiresEmployeeSelection?3:4)} disabled={!selectedService} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 mr-2">Next</button>
          <button onClick={() => setStep(1)} className="px-4 py-2 bg-gray-200 rounded">Back</button>
        </div>
      )}
      {step === 3 && selectedService.requiresEmployeeSelection && (
        <div>
          {availability.employees.map(e => (
            <div key={e.id} onClick={() => setSelectedEmployee(e)} className={`p-4 border rounded mb-2 ${selectedEmployee?.id===e.id?'bg-blue-100':''}`}>{e.firstName} {e.lastName}</div>
          ))}
          <button onClick={() => setStep(4)} disabled={!selectedEmployee} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 mr-2">Next</button>
          <button onClick={() => setStep(2)} className="px-4 py-2 bg-gray-200 rounded">Back</button>
        </div>
      )}
      {step === 4 && (
        <div>
          <ul className="list-disc pl-5 mb-4">
            <li>Date: {selectedDate.toLocaleDateString()}</li>
            <li>Time: {selectedTime}</li>
            <li>Service: {selectedService.name}</li>
            {selectedService.requiresEmployeeSelection && <li>Employee: {selectedEmployee.firstName} {selectedEmployee.lastName}</li>}
          </ul>
          <button onClick={handleConfirm} className="px-4 py-2 bg-green-600 text-white rounded">Confirm</button>
          <button onClick={() => setStep(selectedService.requiresEmployeeSelection?3:2)} className="ml-2 px-4 py-2 bg-gray-200 rounded">Back</button>
        </div>
      )}
    </div>
  );
}
