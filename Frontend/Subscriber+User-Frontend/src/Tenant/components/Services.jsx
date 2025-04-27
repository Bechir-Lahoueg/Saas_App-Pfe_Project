import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X, Trash2 } from "lucide-react";

function getCookie(name) {
  const v = `; ${document.cookie}`;
  const parts = v.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(";").shift() : null;
}

export default function ServicesPage() {
  const [services, setServices]   = useState([]);
  const [employees, setEmployees] = useState([]);
  const nextTempId                = useRef(0);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [pendingAssign, setPendingAssign] = useState({}); // track dropdown per service

  // ─── Setup axios + initial load ───────────────────────────────
  useEffect(() => {
    const token  = getCookie("accessToken");
    const tenant = getCookie("subdomain");
    axios.defaults.baseURL        = "http://localhost:8888";
    axios.defaults.withCredentials = true;
    if (token)  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (tenant) axios.defaults.headers.common["X-Tenant-ID"]  = tenant;

    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [emps, svcs] = await Promise.all([
        axios.get("/schedule/employee/getall"),
        axios.get("/schedule/service/getall")
      ]);
      setEmployees(emps.data);
      setServices(svcs.data.map(svc => ({
        ...svc,
        tempId: null,
        employeeIds: svc.employees?.map(e => e.id) || []
      })));
    } catch (e) {
      console.error(e);
      setError("Échec du chargement");
    } finally {
      setLoading(false);
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────
  const keyOf = s => s.id ?? s.tempId;
  const updateService = (key, fn) =>
    setServices(svcs => svcs.map(s =>
      keyOf(s) === key ? fn(s) : s
    ));

  function addService() {
    const tempId = nextTempId.current++;
    setServices(s => [...s,{
      id:null, tempId,
      name:"", description:"",
      duration:30, price:0,
      requiresEmployeeSelection:false,
      allowSimultaneous:false,
      capacity:1,
      employeeIds:[]
    }]);
  }
  async function removeService(key) {
    const svc = services.find(s=>keyOf(s)===key);
    if (svc.id) await axios.delete(`/schedule/service/delete/${svc.id}`);
    setServices(svcs=>svcs.filter(s=>keyOf(s)!==key));
  }

  function assignEmployee(key) {
    const empId = pendingAssign[key];
    if (!empId) return;
    updateService(key, svc => ({
      ...svc,
      employeeIds: Array.from(new Set([...(svc.employeeIds||[]), empId]))
    }));
    setPendingAssign(pa => ({...pa, [key]:""}));
  }
  function unassignEmployee(key, empId) {
    updateService(key, svc => ({
      ...svc,
      employeeIds: svc.employeeIds.filter(id=>id!==empId)
    }));
  }

  async function saveAll() {
    setLoading(true);
    setError(null);
    try {
      for (let svc of services) {
        if (!svc.name.trim()) throw new Error("Nom requis");
        if (svc.duration<1)   throw new Error("Durée invalide");
        if (svc.price<0)      throw new Error("Prix invalide");
        if (svc.allowSimultaneous && svc.capacity<1)
          throw new Error("Capacité invalide");

        const payload = {
          ...svc,
          employeeIds: svc.employeeIds
        };
        if (svc.id) {
          await axios.put(`/schedule/service/update/${svc.id}`, payload);
        } else {
          const { data } = await axios.post(`/schedule/service/create`, payload);
          // swap in the real ID
          setServices(svcs => svcs.map(x =>
            x===svc ? {...data, tempId:null} : x
          ));
        }
      }
      alert("Sauvegardé !");
      fetchAll();
    } catch (e) {
      console.error(e);
      setError(e.message||"Erreur");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="flex justify-center p-8">
      <div className="animate-spin h-12 w-12 border-blue-500 border-t-2 border-b-2 rounded-full"/>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <button onClick={addService}
        className="mb-4 px-3 py-1 bg-blue-500 text-white rounded">
        + Nouveau Service
      </button>

      <div className="space-y-6">
        {services.map(svc=>{
          const k = keyOf(svc);
          // only employees _not_ already assigned:
          const available = employees.filter(e=>!svc.employeeIds.includes(e.id));
          return (
            <div key={k} className="p-4 border rounded space-y-4">
              <div className="flex justify-between">
                <strong>{svc.id?`#${svc.id}`:"(nouveau)"}</strong>
                <button onClick={()=>removeService(k)}
                        className="text-red-500 hover:text-red-700">
                  <Trash2/>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* name */}
                <div>
                  <label className="block text-sm">Nom</label>
                  <input type="text" value={svc.name}
                    onChange={e=>updateService(k, s=>({...s,name:e.target.value}))}
                    className="mt-1 w-full border rounded p-2"/>
                </div>
                {/* description */}
                <div className="md:col-span-2">
                  <label className="block text-sm">Description</label>
                  <textarea rows={2} value={svc.description}
                    onChange={e=>updateService(k,s=>({...s,description:e.target.value}))}
                    className="mt-1 w-full border rounded p-2"/>
                </div>
                {/* duration */}
                <div>
                  <label className="block text-sm">Durée (min)</label>
                  <input type="number" min="1" value={svc.duration}
                    onChange={e=>updateService(k,s=>({...s,duration:+e.target.value}))}
                    className="mt-1 w-full border rounded p-2"/>
                </div>
                {/* price */}
                <div>
                  <label className="block text-sm">Prix (€)</label>
                  <input type="number" min="0" value={svc.price}
                    onChange={e=>updateService(k,s=>({...s,price:+e.target.value}))}
                    className="mt-1 w-full border rounded p-2"/>
                </div>
                {/* requiresEmployeeSelection */}
                <div className="flex items-center">
                  <input type="checkbox"
                    checked={svc.requiresEmployeeSelection}
                    onChange={e=>updateService(k,s=>({
                      ...s,
                      requiresEmployeeSelection:e.target.checked,
                      // reset assigned if toggled off
                      ...(e.target.checked?{}:{employeeIds:[]})
                    }))}
                    className="h-4 w-4 text-blue-600"/>
                  <label className="ml-2 text-sm">Nécessite un employé</label>
                </div>
                {/* assigned employees */}
                {svc.requiresEmployeeSelection && (
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm">Assignés</label>
                    <div className="flex flex-wrap gap-2">
                      {svc.employeeIds.map(empId=>{
                        const emp = employees.find(e=>e.id===empId);
                        return emp && (
                          <span key={empId}
                                className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                            {emp.firstName} {emp.lastName}
                            <X size={12}
                              onClick={()=>unassignEmployee(k, empId)}
                              className="ml-1 cursor-pointer hover:text-red-600"/>
                          </span>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <select value={pendingAssign[k]||""}
                        onChange={e=>setPendingAssign(pa=>({...pa,[k]:+e.target.value}))}
                        className="mt-1 w-full border rounded p-2"
                      >
                        <option value="">— Choisir —</option>
                        {available.map(emp=>(
                          <option key={emp.id} value={emp.id}>
                            {emp.firstName} {emp.lastName}
                          </option>
                        ))}
                      </select>
                      <button onClick={()=>assignEmployee(k)}
                        className="px-3 py-1 bg-green-500 text-white rounded">
                        Ajouter
                      </button>
                    </div>
                  </div>
                )}
                {/* allowSimultaneous */}
                <div className="flex items-center">
                  <input type="checkbox"
                    checked={svc.allowSimultaneous}
                    onChange={e=>updateService(k,s=>({...s,allowSimultaneous:e.target.checked}))}
                    className="h-4 w-4 text-blue-600"/>
                  <label className="ml-2 text-sm">Réservations simultanées</label>
                </div>
                {/* capacity */}
                <div>
                  <label className="block text-sm">Capacité</label>
                  <input type="number" min="1" value={svc.capacity}
                    onChange={e=>updateService(k,s=>({...s,capacity:+e.target.value}))}
                    className="mt-1 w-full border rounded p-2"/>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={saveAll}
          disabled={loading}
          className={`px-4 py-2 rounded font-medium ${
            loading?"bg-gray-400 text-gray-200":"bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading?"Enregistrement...":"Enregistrer"}
        </button>
      </div>
    </div>
  );
}
