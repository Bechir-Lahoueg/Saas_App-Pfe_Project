// src/components/Calendar.jsx
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  PlusCircle,
  Clock,
  X,
  Users  // Add this import
} from 'lucide-react';
import axios from 'axios';

const Calendar = () => {
  // ─── Calendar State ─────────────────────────────────────────────────
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedView, setSelectedView] = useState('Mois');
  const [selectedDate, setSelectedDate] = useState(null);

  // ─── Événement State ────────────────────────────────────────────────
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    color: 'blue',
    time: '09:00'
  });
  const [allEvents, setAllEvents] = useState({
    0: [
      { id: 1, title: 'New Year Celebration', date: '2025-01-01', color: 'blue', time: '00:00' },
      { id: 2, title: 'Winter Conference',  date: '2025-01-15', color: 'green', time: '09:30' }
    ],
    9: [
      { id: 1, title: 'Porsche showroom',    date: '2025-10-01', color: 'purple', time: '14:00' },
      { id: 2, title: 'Design Conference',   date: '2025-10-10', color: 'indigo', time: '10:00' },
      { id: 3, title: 'Weekend Festival',    date: '2025-10-05', color: 'pink',   time: '18:00' }
    ],
    11: [
      { id: 1, title: 'Holiday Party',       date: '2025-12-24', color: 'red',    time: '20:00' },
      { id: 2, title: "New Year's Eve",      date: '2025-12-31', color: 'yellow', time: '22:00' }
    ]
  });

  // ─── Backend Data ───────────────────────────────────────────────────
  const [services, setServices]   = useState([]);
  const [employees, setEmployees] = useState([]);

  // ─── Réservation State ──────────────────────────────────────────────
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    serviceId: null,
    employeeId: null,
    time: '09:00',
    numberOfAttendees: null,
    startTime: ''
  });
  const [formErrors, setFormErrors]     = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError]     = useState('');
  const [loading, setLoading]             = useState(false);

  // ─── Configure Axios & Fetch Initial Data ──────────────────────────
  useEffect(() => {
    // adjust these as needed for your auth cookie names
    axios.defaults.baseURL         = 'http://localhost:8888';
    axios.defaults.withCredentials = true;
    const token     = document.cookie.match(/accessToken=([^;]+)/)?.[1];
    const subdomain = document.cookie.match(/subdomain=([^;]+)/)?.[1];
    if (token)     axios.defaults.headers.common['Authorization'] = `Bearer ${decodeURIComponent(token)}`;
    if (subdomain) axios.defaults.headers.common['X-Tenant-ID']    = decodeURIComponent(subdomain);

    fetchServices();
    fetchEmployees();
  }, []);

  // ─── Fetchers ──────────────────────────────────────────────────────
  const fetchServices = async () => {
    const { data } = await axios.get('/schedule/service/getall');
    setServices(data);
    // after services, also fetch existing reservations to display
    fetchReservations(data);
  };

  const fetchEmployees = async () => {
    const { data } = await axios.get('/schedule/employee/getall');
    setEmployees(data);
  };

  const fetchReservations = async (svcList=services) => {
    const { data } = await axios.get('/schedule/reservation/getall');
    // build month→events map
    const byMonth = {};
    data.forEach(r => {
      const dt  = new Date(r.startTime);
      const m   = dt.getMonth();
      const svc = svcList.find(s => s.id === r.serviceId);
      const title = svc ? svc.name : 'Réservation';
      const evt = {
        id:    r.id,
        title,
        date:  dt.toISOString().slice(0,10),
        time:  dt.toISOString().slice(11,16),
        color: 'teal'
      };
      byMonth[m] = [...(byMonth[m]||[]), evt];
    });
    // merge with your static allEvents (so both types show up)
    setAllEvents(prev => {
      const merged = { ...prev };
      Object.entries(byMonth).forEach(([m,evts]) => {
        merged[m] = [ ...(merged[m]||[]), ...evts ];
      });
      return merged;
    });
  };

  // ─── Événement Handlers ────────────────────────────────────────────
  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title) return;
    const month = selectedDate.getMonth();
    const day   = selectedDate.getDate();
    const formattedDate = `${currentYear}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

    const newEvt = {
      id: Date.now(),
      title: newEvent.title,
      date: formattedDate,
      color: newEvent.color,
      time: newEvent.time
    };

    setAllEvents(prev => ({
      ...prev,
      [month]: [...(prev[month]||[]), newEvt]
    }));

    setNewEvent({ title:'', color:'blue', time:'09:00' });
    setShowEventModal(false);
  };

  // ─── Réservation Handlers ─────────────────────────────────────────
  const openReservationModal = () => {
    if (!selectedDate) {
      alert('Veuillez sélectionner une date d’abord');
      return;
    }
    setReservationForm({
      serviceId: null,
      employeeId: null,
      time: '09:00',
      numberOfAttendees: null,
      startTime: ''
    });
    setFormErrors({});
    setSubmitSuccess(false);
    setSubmitError('');
    setShowReservationModal(true);
  };

  const validateForm = () => {
    const e = {};
    if (!reservationForm.serviceId) {
      e.serviceId = 'Service requis';
    } else {
      const svc = services.find(s => s.id === +reservationForm.serviceId);
      if (svc?.requiresEmployeeSelection && !reservationForm.employeeId) {
        e.employeeId = 'Employé requis';
      }
    }
    if (!reservationForm.time) e.time = 'Heure requise';
    if (reservationForm.numberOfAttendees < 1) {
      e.numberOfAttendees = 'Au moins 1 participant';
    }
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleReservationInput = (e) => {
    const { name, value } = e.target;
    setReservationForm(f => ({ ...f, [name]: value }));
  };

  const submitReservation = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // build combined ISO string
    const dt = new Date(selectedDate);
    const [hh,mm] = reservationForm.time.split(':');
    dt.setHours(+hh, +mm, 0, 0);

    setLoading(true);
    try {
      const { data } = await axios.post('/schedule/reservation/create', {
        serviceId: +reservationForm.serviceId,
        employeeId: reservationForm.employeeId ? +reservationForm.employeeId : null,
        startTime: dt.toISOString(),
        numberOfAttendees: reservationForm.numberOfAttendees
      });
      setSubmitSuccess(true);
      // refresh events
      fetchReservations();
      // auto-close after a moment
      setTimeout(() => {
        setShowReservationModal(false);
        setSubmitSuccess(false);
      }, 1500);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  // ─── Calendar Render Helpers ──────────────────────────────────────
  const renderCalendarGrid = (month) => {
    const firstDay    = new Date(currentYear, month, 1).getDay();
    const daysInMonth = new Date(currentYear, month+1, 0).getDate();
    const monthEvents = allEvents[month] || [];

    const blanks = firstDay === 0 ? 6 : firstDay-1;
    const cells = [];
    for (let i=0; i<blanks; i++) cells.push(<div key={`b${i}`} />);
    for (let day=1; day<=daysInMonth; day++) {
      const dt   = new Date(currentYear, month, day);
      const isSel = selectedDate && dt.toDateString() === selectedDate.toDateString();
      const evts  = monthEvents.filter(e => new Date(e.date).getDate() === day);

      cells.push(
        <div
          key={day}
          onClick={() => setSelectedDate(dt)}
          className={`
            p-2 text-center rounded-lg cursor-pointer relative
            ${isSel ? 'bg-blue-100 border border-blue-400' : ''}
            hover:bg-blue-50 transition-colors
          `}
        >
          <span className={`inline-block w-7 h-7 rounded-full ${isSel?'bg-blue-500 text-white':''}`}>
            {day}
          </span>
          <div className="mt-1 space-y-1">
            {evts.slice(0,2).map(e => (
              <div key={e.id} className="text-xs text-white px-1 py-0.5 rounded bg-blue-500 truncate">
                {e.title}
              </div>
            ))}
            {evts.length > 2 && (
              <div className="text-xs text-gray-500">+{evts.length-2} more</div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(d => (
          <div key={d} className="text-center text-gray-500 font-medium">{d}</div>
        ))}
        {cells}
      </div>
    );
  };

  const renderYearView = () => (
    <div className="grid grid-cols-3 gap-4">
      {[...Array(12)].map((_, month) => (
        <div
          key={month}
          className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => { setSelectedMonth(month); setSelectedView('Mois'); }}
        >
          <h3 className="text-center font-semibold mb-3">
            {new Date(currentYear, month).toLocaleString('default',{month:'long'})}
          </h3>
          {/* mini-month days */}
          <div className="grid grid-cols-7 gap-1 text-xs">
            {['L','M','M','J','V','S','D'].map((d,i) => (
              <div key={i} className="text-center text-gray-500">{d}</div>
            ))}
            {Array.from({length: new Date(currentYear,month+1,0).getDate()}, (_, i) => {
              const day = i+1;
              const hasEvt = (allEvents[month]||[]).some(e=>new Date(e.date).getDate()===day);
              return (
                <div key={day} className={`text-center text-xs p-1 ${hasEvt?'bg-blue-100 rounded-full':''}`}>
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="w-96 bg-white p-6 border-r shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Événements & Réservations</h2>
          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white p-2 rounded-lg flex items-center"
              onClick={() => {
                if (!selectedDate) return alert('Sélectionnez une date');
                setShowEventModal(true);
              }}
            >
              <PlusCircle size={18} className="mr-1"/>Événement
            </button>
            <button
              className="bg-green-500 text-white p-2 rounded-lg flex items-center"
              onClick={openReservationModal}
            >
              <Users size={18} className="mr-1"/>Réservation
            </button>
          </div>
        </div>

        {selectedDate ? (
          <>
            <div className="bg-blue-50 p-3 rounded mb-4">
              <h3 className="font-medium text-blue-800">Date sélectionnée :</h3>
              <p className="text-lg text-blue-900">
                {selectedDate.toLocaleDateString('fr-FR',{
                  weekday:'long', year:'numeric', month:'long', day:'numeric'
                })}
              </p>
            </div>

            {/* List both events and reservations for that day */}
            <div className="space-y-3">
              {(allEvents[selectedDate.getMonth()]||[])
                .filter(e=> new Date(e.date).getDate() === selectedDate.getDate())
                .map(e=>(
                  <div key={e.id} className="bg-white border rounded-lg p-4 shadow-sm flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1 bg-${e.color}-500`} />
                    <div className="flex-1">
                      <h4 className="font-semibold">{e.title}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={14} className="mr-1"/> {e.time}
                      </div>
                    </div>
                  </div>
                ))
              }
              {!(allEvents[selectedDate.getMonth()]||[])
                .some(e=>new Date(e.date).getDate()=== selectedDate.getDate()) && (
                <p className="italic text-gray-500">Aucun événement ou réservation</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400 p-10">
            <CalendarIcon size={48} className="mx-auto mb-2"/>
            <p>Sélectionnez une date pour voir ou ajouter</p>
          </div>
        )}
      </div>

      {/* Main calendar */}
      <div className="flex-grow p-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b bg-gray-50">
            <button onClick={()=>setCurrentYear(y=>y-1)}><ChevronLeft size={20}/></button>
            <h2 className="text-xl font-semibold">{currentYear}</h2>
            <button onClick={()=>setCurrentYear(y=>y+1)}><ChevronRight size={20}/></button>
          </div>
          {/* Month/Year toggle */}
          <div className="flex border-b">
            {['Mois','Année'].map(v=>(
              <button
                key={v}
                onClick={()=>setSelectedView(v)}
                className={`flex-1 py-3 transition-colors ${
                  selectedView===v
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="p-6">
            {selectedView==='Mois' ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <button onClick={()=>setSelectedMonth(m=>m>0?m-1:11)}><ChevronLeft/></button>
                  <h3 className="text-xl">{new Date(currentYear, selectedMonth).toLocaleString('default',{month:'long'})}</h3>
                  <button onClick={()=>setSelectedMonth(m=>m<11?m+1:0)}><ChevronRight/></button>
                </div>
                {renderCalendarGrid(selectedMonth)}
              </>
            ) : (
              renderYearView()
            )}
          </div>
        </div>
      </div>

      {/* ─── Événement Modal ──────────────────────────────────────────── */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Nouvel événement</h3>
              <button onClick={()=>setShowEventModal(false)}><X size={24}/></button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Date:</p>
              <p className="font-medium">
                {selectedDate.toLocaleDateString('fr-FR',{
                  weekday:'long', year:'numeric', month:'long', day:'numeric'
                })}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Titre</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={e=>setNewEvent(ne=>({...ne,title:e.target.value}))}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de l'événement"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Heure</label>
              <input
                type="time"
                value={newEvent.time}
                onChange={e=>setNewEvent(ne=>({...ne,time:e.target.value}))}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">Couleur</label>
              <div className="flex flex-wrap gap-2">
                {['blue','green','red','yellow','purple','pink','indigo','orange','teal'].map(color=>(
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full bg-${color}-500 ${
                      newEvent.color===color?'ring-2 ring-offset-2 ring-gray-400':''
                    }`}
                    onClick={()=>setNewEvent(ne=>({...ne,color}))}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={()=>setShowEventModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!newEvent.title}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Réservation Modal ───────────────────────────────────────── */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Nouvelle réservation</h3>
              <button onClick={()=>setShowReservationModal(false)}><X size={24}/></button>
            </div>

            {submitSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                Réservation créée avec succès !
              </div>
            )}
            {submitError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {submitError}
              </div>
            )}

            <form onSubmit={submitReservation} className="space-y-4">
              {/* Service */}
              <div>
                <label className="block text-sm font-medium">Service</label>
                <select
                  name="serviceId"
                  value={reservationForm.serviceId}
                  onChange={handleReservationInput}
                  className="mt-1 w-full border rounded p-2"
                >
                  <option value="">— Choisir —</option>
                  {services.map(s=>(
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {formErrors.serviceId && <p className="text-red-600 text-sm">{formErrors.serviceId}</p>}
              </div>

              {/* Employee */}
              {(() => {
                const svc = services.find(s=>s.id===+reservationForm.serviceId);
                if (svc?.requiresEmployeeSelection) {
                  return (
                    <div>
                      <label className="block text-sm font-medium">Employé</label>
                      <select
                        name="employeeId"
                        value={reservationForm.employeeId}
                        onChange={handleReservationInput}
                        className="mt-1 w-full border rounded p-2"
                      >
                        <option value="">— Choisir —</option>
                        {svc.employees.map(emp=>(
                          <option key={emp.id} value={emp.id}>
                            {emp.firstName} {emp.lastName}
                          </option>
                        ))}
                      </select>
                      {formErrors.employeeId && <p className="text-red-600 text-sm">{formErrors.employeeId}</p>}
                    </div>
                  );
                }
                return null;
              })()}

              {/* Date & Time */}
              <div>
                <label className="block text-sm font-medium">Date & heure</label>
                <input
                  type="datetime-local"
                  name="time"
                  value={`${selectedDate.toISOString().slice(0,10)}T${reservationForm.time}`}
                  onChange={e=>setReservationForm(f=>({
                    ...f,
                    time: e.target.value.split('T')[1]
                  }))}
                  className="mt-1 w-full border rounded p-2"
                />
                {formErrors.time && <p className="text-red-600 text-sm">{formErrors.time}</p>}
              </div>

              {/* Participants */}
              <div>
                <label className="block text-sm font-medium">Participants</label>
                <input
                  type="number"
                  name="numberOfAttendees"
                  min="1"
                  value={reservationForm.numberOfAttendees}
                  onChange={handleReservationInput}
                  className="mt-1 w-full border rounded p-2"
                />
                {formErrors.numberOfAttendees && (
                  <p className="text-red-600 text-sm">{formErrors.numberOfAttendees}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={()=>setShowReservationModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded text-white ${
                    loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {loading ? 'En cours...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
