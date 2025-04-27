import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, X } from 'lucide-react';

function getCookie(name) {
  const v = `; ${document.cookie}`;
  const parts = v.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(';').shift() : null;
}

const HR = () => {
  const [employees, setEmployees]     = useState([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState(null);
  const [newEmp, setNewEmp]           = useState({ firstName:'', lastName:'', email:'', phone:'', status:'ACTIVE' });
  const [editingEmp, setEditingEmp]   = useState(null);

  // ─── Axios config & initial load ─────────────────────────────────
  useEffect(() => {
    const token  = getCookie("accessToken");
    const tenant = getCookie("subdomain");

    axios.defaults.baseURL         = "http://localhost:8888";
    axios.defaults.withCredentials = true;
    if (token)  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (tenant) axios.defaults.headers.common["X-Tenant-ID"]  = tenant;

    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/schedule/employee/getall');
      setEmployees(data);
    } catch (e) {
      console.error(e);
      setError("Impossible de charger les employés");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Handlers ────────────────────────────────────────────────────
  const handleChange = (field, value) => {
    if (editingEmp) {
      setEditingEmp(emp => ({ ...emp, [field]: value }));
    } else {
      setNewEmp(ne => ({ ...ne, [field]: value }));
    }
  };

  const startEdit = emp => {
    setEditingEmp({ ...emp });
    setNewEmp({ firstName:'', lastName:'', email:'', phone:'', status:'ACTIVE' });
  };

  const cancelEdit = () => {
    setEditingEmp(null);
    setNewEmp({ firstName:'', lastName:'', email:'', phone:'', status:'ACTIVE' });
  };

  const saveEmployee = async e => {
    e.preventDefault();
    try {
      if (editingEmp) {
        await axios.put(`/schedule/employee/update/${editingEmp.id}`, editingEmp);
        setEmployees(es => es.map(x => x.id === editingEmp.id ? editingEmp : x));
        cancelEdit();
      } else {
        const { data } = await axios.post(`/schedule/employee/create`, newEmp);
        setEmployees(es => [...es, data]);
        setNewEmp({ firstName:'', lastName:'', email:'', phone:'', status:'ACTIVE' });
      }
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const deleteEmployee = async id => {
    if (!window.confirm("Supprimer cet employé ?")) return;
    try {
      await axios.delete(`/schedule/employee/delete/${id}`);
      setEmployees(es => es.filter(x => x.id !== id));
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la suppression");
    }
  };

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 space-y-8">

        <h2 className="text-2xl font-bold">Gestion des employés</h2>

        {/* Form */}
        <form onSubmit={saveEmployee} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Prénom"
            value={ editingEmp?.firstName ?? newEmp.firstName }
            onChange={e => handleChange('firstName', e.target.value)}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Nom"
            value={ editingEmp?.lastName ?? newEmp.lastName }
            onChange={e => handleChange('lastName', e.target.value)}
            className="border rounded p-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={ editingEmp?.email ?? newEmp.email }
            onChange={e => handleChange('email', e.target.value)}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Téléphone"
            value={ editingEmp?.phone ?? newEmp.phone }
            onChange={e => handleChange('phone', e.target.value)}
            className="border rounded p-2"
          />
          <select
            value={ editingEmp?.status ?? newEmp.status }
            onChange={e => handleChange('status', e.target.value)}
            className="border rounded p-2"
          >
            <option value="ACTIVE">ACTIF</option>
            <option value="INACTIVE">INACTIF</option>
          </select>

          <div className="md:col-span-3 flex gap-2">
            {editingEmp && (
              <button type="button"
                onClick={cancelEdit}
                className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100 flex items-center"
              ><X className="mr-1"/> Annuler</button>
            )}
            <button
              type="submit"
              className={`px-4 py-2 rounded font-medium ${
                editingEmp 
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {editingEmp ? 'Mettre à jour' : 'Ajouter employé'}
            </button>
          </div>
        </form>

        {/* List */}
        {isLoading
          ? <div className="flex justify-center p-8">
              <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"/>
            </div>
          : <ul className="space-y-2">
              {employees.map(emp => (
                <li key={emp.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <span className="font-medium">{emp.firstName} {emp.lastName}</span>
                    <span className="ml-2 text-sm text-gray-500">— {emp.email}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(emp)}
                            className="text-yellow-600 hover:text-yellow-800">
                      <Pencil size={18}/>
                    </button>
                    <button onClick={() => deleteEmployee(emp.id)}
                            className="text-red-600 hover:text-red-800">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
        }
      </div>
    </div>
  );
};

export default HR;
