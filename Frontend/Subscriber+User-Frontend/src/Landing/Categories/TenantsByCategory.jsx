import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function TenantsByCategory() {
  const { categoryName } = useParams();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8888/auth/tenant/getTenantByCategory/${categoryName}`
        );
        setTenants(res.data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les prestataires.");
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [categoryName]);

  return (
    <div className="bg-white text-gray-800">
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <Navbar />
      </div>
      <div className="h-[80px] bg-gray-50" />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4" data-aos="fade-up">
            Prestataires pour « {categoryName.replace(/-/g, " ")} »
          </h2>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600">Chargement…</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          ) : tenants.length === 0 ? (
            <p className="text-center text-gray-600">Aucun prestataire trouvé.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tenants.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden"
                  data-aos="fade-up"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {t.businessName}
                    </h3>
                    <p className="text-gray-600 mb-1">
                      {t.firstName} {t.lastName}
                    </p>
                    <p className="text-gray-600 mb-1">{t.city}, {t.country}</p>
                    <p className="text-gray-600 mb-1">📞 {t.phone}</p>
                    <a
                      href={`https://${t.subdomain}.127.0.0.1.nip.io:5173/app`}
                      className="mt-4 inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                    >
                      Voir la page de réservation
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
