import React, { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Landing/Components/Navbar";
import Footer from "../../Landing/Components/Footer";

const TenantRegistrationPage = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    businessName: "",
    subdomain: "",
    address: "",
    city: "",
    zipcode: "",
    country: "",
    categoryId: "",
  });
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const generateOrderId = () => {
    return `REG-${Date.now()}`;
  };

  useEffect(() => {
    setOrderId(generateOrderId());
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8888/auth/category/getall"
        );
        setCategories(data);
      } catch (err) {
        setError("Impossible de charger les secteurs");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Remove spaces from subdomain as the user types
    if (name === "subdomain") {
      const noSpaces = value.replace(/\s/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: noSpaces,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "categoryId" ? Number(value) : value,
      }));
    }
  };

  const checkExistingCredentials = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check email existence
      const emailResponse = await axios.get(
        `http://localhost:8888/auth/tenant/check-email/${formData.email}`
      );

      if (emailResponse.data.exists) {
        setError("Email existe déjant. Veuillez utiliser un autre email.");
        setLoading(false);
        return false;
      }

      // Check subdomain existence using the new endpoint
      const subdomainResponse = await axios.get(
        `http://localhost:8888/auth/tenant/check-subdomain/${formData.subdomain}`
      );

      if (subdomainResponse.data.exists) {
        setError(
          "Sous-domaine existe déjà. Veuillez utiliser un autre Sous-domaine."
        );
        setLoading(false);
        return false;
      }

      return true;
    } catch (err) {
      setError(
        "Un errur s'est produit lors de la vérification des informations. Veuillez réessayer."
      );
      setLoading(false);
      return false;
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError("Veuillez entrer un email valide");
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Le mot de passe doit comporter au moins 6 caractères");
      return false;
    }
    if (!formData.firstName || !formData.lastName) {
      setError("Nom et prénom sont requis");
      return false;
    }

    // Add phone validation (numbers only, exactly 6 digits)
    const phoneRegex = /^\d{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setError("Le numéro de téléphone doit contenir exactement 8 chiffres");
      return false;
    }

    // Add subdomain space validation
    if (formData.subdomain.includes(" ")) {
      setError("Le sous-domaine ne doit pas contenir d'espaces");
      return false;
    }

    if (!formData.businessName || !formData.subdomain) {
      setError("Nom de l'entreprise et sous-domaine sont requis");
      return false;
    }

    // Add zipcode validation (numbers only)
    const zipcodeRegex = /^\d+$/;
    if (!formData.zipcode || !zipcodeRegex.test(formData.zipcode)) {
      setError("Le code postal doit contenir uniquement des chiffres");
      return false;
    }

    if (!formData.city) {
      setError("Ville est requise");
      return false;
    }
    if (!formData.country) {
      setError("Pays est requis");
      return false;
    }
    if (!formData.categoryId) {
      setError("Veuillez sélectionner un secteur d'activité");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;
    const credentialsValid = await checkExistingCredentials();
    if (!credentialsValid) return;

    // Generate a new order ID and update the state
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);

    setLoading(false);
    setStep(2);
    console.log(formData);
  };

  const handleInitiatePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const paymentData = {
        receiverWalletId: "67dd5a772f786e7f6069197a",
        token: "TND",
        amount: 50000,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zipcode: formData.zipcode,
        country: formData.country,
        businessName: formData.businessName,
        subdomain: formData.subdomain,
        password: formData.password,
        categoryId: formData.categoryId,
        successUrl: `${window.location.origin}/paiement?step=3&status=success`,
        failUrl: `${window.location.origin}/paiement?step=3&status=failed`,
      };

      const response = await fetch(
        "http://localhost:8888/payment/tenant-registration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      const result = await response.json();

      if (response.ok && result.payUrl) {
        // Set loading to false BEFORE redirecting
        setLoading(false);

        setPaymentInfo({
          paymentId: result.paymentRef,
          paymentUrl: result.payUrl,
        });

        // Delay the redirect slightly to ensure state updates
        setTimeout(() => {
          window.location.href = result.payUrl;
        }, 100);
      } else {
        throw new Error(result.error || "Failed to initiate payment");
      }
    } catch (err) {
      setError(err.message || "Payment initialization failed");
      setStep(1);
      setLoading(false); // Make sure to set loading to false on error
    }
    // Remove the finally block since we're handling loading state explicitly
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentResult = queryParams.get("status");
    const paymentRef = queryParams.get("payment_ref");
    const stepParam = queryParams.get("step");

    if (paymentResult) {
      setStep(3);
      if (paymentRef) {
        setPaymentInfo((prev) => ({ ...prev, paymentId: paymentRef }));
      }
      setPaymentStatus(paymentResult);
    }
  }, [location.search]);

  const handlePaymentComplete = async () => {
    if (paymentStatus === "success" && paymentInfo?.paymentId) {
      try {
        const response = await fetch(
          `http://localhost:8888/payment/complete/${paymentInfo.paymentId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        const result = await response.json();

        if (result.success && result.status === "completed") {
          setTimeout(() => navigate("/connexion"), 3000);
        } else {
          throw new Error("Tenant registration failed after payment");
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    if (step === 3 && paymentStatus === "success") {
      handlePaymentComplete();
    }
  }, [step, paymentStatus]);

  const handleReset = () => {
    setStep(1);
    setPaymentStatus(null);
    setPaymentInfo(null);
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      businessName: "",
      subdomain: "",
      address: "",
      city: "",
      zipcode: "",
      country: "",
      categoryId: "",
    });
  };

  const renderStep1 = () => (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <motion.div
          className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
                clipRule="evenodd"
              />
            </svg>
            <p>{error}</p>
          </div>
        </motion.div>
      )}

      <div className="space-y-8">
        {/* Personal Information Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-indigo-800 mb-5 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                id: "firstName",
                label: "First Name",
                type: "text",
                required: true,
                icon: "user",
              },
              {
                id: "lastName",
                label: "Last Name",
                type: "text",
                required: true,
                icon: "user",
              },
              {
                id: "email",
                label: "Email",
                type: "email",
                required: true,
                icon: "mail",
              },
              {
                id: "password",
                label: "Password",
                type: "password",
                required: true,
                icon: "lock",
              },
              {
                id: "phone",
                label: "Phone",
                type: "tel",
                required: false,
                icon: "phone",
                pattern: "[0-9]{8}",
                title:
                  "Le numéro de téléphone doit contenir exactement 8 chiffres",
              },
            ].map((field) => (
              <div key={field.id} className="relative">
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor={field.id}
                >
                  {field.label}{" "}
                  {field.required && <span className="text-indigo-500">*</span>}
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-indigo-400">
                      {renderIcon(field.icon)}
                    </span>
                  </div>
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-indigo-100 bg-white rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                    required={field.required}
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    pattern={field.pattern}
                    title={field.title}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Information Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-indigo-800 mb-5 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            Business Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="businessName"
              >
                Business Name <span className="text-indigo-500">*</span>
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-indigo-400">
                    {renderIcon("briefcase")}
                  </span>
                </div>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-indigo-100 bg-white rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  required
                  placeholder="Enter your business name"
                />
              </div>
            </div>

            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="categoryId"
              >
                Business Sector <span className="text-indigo-500">*</span>
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-indigo-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </span>
                </div>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border-2 border-indigo-100 bg-white rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 appearance-none"
                  required
                >
                  <option value="" disabled>
                    Select your business sector
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-indigo-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="subdomain"
              >
                Subdomain <span className="text-indigo-500">*</span>
              </label>
              <div className="flex rounded-lg shadow-sm">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-indigo-400">
                      {renderIcon("link")}
                    </span>
                  </div>
                  <input
                    type="text"
                    id="subdomain"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-indigo-100 bg-white rounded-l-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                    required
                    placeholder="your-company"
                    pattern="[^\s]+"
                    title="Le sous-domaine ne doit pas contenir d'espaces"
                  />
                </div>
                <span className="bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-3 border-2 border-l-0 border-indigo-100 rounded-r-lg flex items-center text-indigo-700 font-medium">
                  .planifygo.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Location Information Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-indigo-800 mb-5 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            Location Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="country"
              >
                Country <span className="text-indigo-500">*</span>
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-indigo-400">{renderIcon("globe")}</span>
                </div>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border-2 border-indigo-100 bg-white rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 appearance-none"
                  required
                >
                  <option value="" disabled>
                    Select your country
                  </option>
                  <option value="Tunisia">Tunisia</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Albania">Albania</option>
                  <option value="Algeria">Algeria</option>
                  <option value="Andorra">Andorra</option>
                  <option value="Angola">Angola</option>
                  <option value="Antigua and Barbuda">
                    Antigua and Barbuda
                  </option>
                  <option value="Argentina">Argentina</option>
                  <option value="Armenia">Armenia</option>
                  <option value="Australia">Australia</option>
                  <option value="Austria">Austria</option>
                  <option value="Azerbaijan">Azerbaijan</option>
                  <option value="Bahamas">Bahamas</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Barbados">Barbados</option>
                  <option value="Belarus">Belarus</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Belize">Belize</option>
                  <option value="Benin">Benin</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Bosnia and Herzegovina">
                    Bosnia and Herzegovina
                  </option>
                  <option value="Botswana">Botswana</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Brunei">Brunei</option>
                  <option value="Bulgaria">Bulgaria</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Burundi">Burundi</option>
                  <option value="Cabo Verde">Cabo Verde</option>
                  <option value="Cambodia">Cambodia</option>
                  <option value="Cameroon">Cameroon</option>
                  <option value="Canada">Canada</option>
                  <option value="Central African Republic">
                    Central African Republic
                  </option>
                  <option value="Chad">Chad</option>
                  <option value="Chile">Chile</option>
                  <option value="China">China</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Comoros">Comoros</option>
                  <option value="Congo">Congo</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Croatia">Croatia</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Cyprus">Cyprus</option>
                  <option value="Czech Republic">Czech Republic</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Djibouti">Djibouti</option>
                  <option value="Dominica">Dominica</option>
                  <option value="Dominican Republic">Dominican Republic</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Egypt">Egypt</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Equatorial Guinea">Equatorial Guinea</option>
                  <option value="Eritrea">Eritrea</option>
                  <option value="Estonia">Estonia</option>
                  <option value="Eswatini">Eswatini</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="Fiji">Fiji</option>
                  <option value="Finland">Finland</option>
                  <option value="France">France</option>
                  <option value="Gabon">Gabon</option>
                  <option value="Gambia">Gambia</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Germany">Germany</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Greece">Greece</option>
                  <option value="Grenada">Grenada</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Guinea">Guinea</option>
                  <option value="Guinea-Bissau">Guinea-Bissau</option>
                  <option value="Guyana">Guyana</option>
                  <option value="Haiti">Haiti</option>
                  <option value="Honduras">Honduras</option>
                  <option value="Hungary">Hungary</option>
                  <option value="Iceland">Iceland</option>
                  <option value="India">India</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Iran">Iran</option>
                  <option value="Iraq">Iraq</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Israel">Israel</option>
                  <option value="Italy">Italy</option>
                  <option value="Jamaica">Jamaica</option>
                  <option value="Japan">Japan</option>
                  <option value="Jordan">Jordan</option>
                  <option value="Kazakhstan">Kazakhstan</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Kiribati">Kiribati</option>
                  <option value="North Korea">North Korea</option>
                  <option value="South Korea">South Korea</option>
                  <option value="Kosovo">Kosovo</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                  <option value="Laos">Laos</option>
                  <option value="Latvia">Latvia</option>
                  <option value="Lebanon">Lebanon</option>
                  <option value="Lesotho">Lesotho</option>
                  <option value="Liberia">Liberia</option>
                  <option value="Libya">Libya</option>
                  <option value="Liechtenstein">Liechtenstein</option>
                  <option value="Lithuania">Lithuania</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Madagascar">Madagascar</option>
                  <option value="Malawi">Malawi</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Maldives">Maldives</option>
                  <option value="Mali">Mali</option>
                  <option value="Malta">Malta</option>
                  <option value="Marshall Islands">Marshall Islands</option>
                  <option value="Mauritania">Mauritania</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Micronesia">Micronesia</option>
                  <option value="Moldova">Moldova</option>
                  <option value="Monaco">Monaco</option>
                  <option value="Mongolia">Mongolia</option>
                  <option value="Montenegro">Montenegro</option>
                  <option value="Morocco">Morocco</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Myanmar">Myanmar</option>
                  <option value="Namibia">Namibia</option>
                  <option value="Nauru">Nauru</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Niger">Niger</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="North Macedonia">North Macedonia</option>
                  <option value="Norway">Norway</option>
                  <option value="Oman">Oman</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Palau">Palau</option>
                  <option value="Palestine">Palestine</option>
                  <option value="Panama">Panama</option>
                  <option value="Papua New Guinea">Papua New Guinea</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Peru">Peru</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Poland">Poland</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Romania">Romania</option>
                  <option value="Russia">Russia</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Saint Kitts and Nevis">
                    Saint Kitts and Nevis
                  </option>
                  <option value="Saint Lucia">Saint Lucia</option>
                  <option value="Saint Vincent and the Grenadines">
                    Saint Vincent and the Grenadines
                  </option>
                  <option value="Samoa">Samoa</option>
                  <option value="San Marino">San Marino</option>
                  <option value="Sao Tome and Principe">
                    Sao Tome and Principe
                  </option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Senegal">Senegal</option>
                  <option value="Serbia">Serbia</option>
                  <option value="Seychelles">Seychelles</option>
                  <option value="Sierra Leone">Sierra Leone</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Slovakia">Slovakia</option>
                  <option value="Slovenia">Slovenia</option>
                  <option value="Solomon Islands">Solomon Islands</option>
                  <option value="Somalia">Somalia</option>
                  <option value="South Africa">South Africa</option>
                  <option value="South Sudan">South Sudan</option>
                  <option value="Spain">Spain</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Sudan">Sudan</option>
                  <option value="Suriname">Suriname</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Syria">Syria</option>
                  <option value="Taiwan">Taiwan</option>
                  <option value="Tajikistan">Tajikistan</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Timor-Leste">Timor-Leste</option>
                  <option value="Togo">Togo</option>
                  <option value="Tonga">Tonga</option>
                  <option value="Trinidad and Tobago">
                    Trinidad and Tobago
                  </option>
                  <option value="Tunisia">Tunisia</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Turkmenistan">Turkmenistan</option>
                  <option value="Tuvalu">Tuvalu</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Ukraine">Ukraine</option>
                  <option value="United Arab Emirates">
                    United Arab Emirates
                  </option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Uzbekistan">Uzbekistan</option>
                  <option value="Vanuatu">Vanuatu</option>
                  <option value="Vatican City">Vatican City</option>
                  <option value="Venezuela">Venezuela</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-indigo-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="city"
              >
                City <span className="text-indigo-500">*</span>
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-indigo-400">
                    {renderIcon("map-pin")}
                  </span>
                </div>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-indigo-100 bg-white rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  required
                  placeholder="Enter your city"
                />
              </div>
            </div>

            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="zipcode"
              >
                Zipcode <span className="text-indigo-500">*</span>
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-indigo-400">{renderIcon("map")}</span>
                </div>
                <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-indigo-100 bg-white rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  required
                  placeholder="Enter your zipcode"
                />
              </div>
            </div>

            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="address"
              >
                Address
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-indigo-400">{renderIcon("home")}</span>
                </div>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-indigo-100 bg-white rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  placeholder="Enter your full address"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center ${
          loading
            ? "opacity-70 cursor-not-allowed"
            : "hover:from-indigo-700 hover:to-purple-700"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          <>
            Continue to Payment
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </>
        )}
      </motion.button>
    </form>
  );

  const renderStep2 = () => (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Complete Your Payment
      </h2>
      <p className="mb-8 text-gray-600">
        You will be redirected to Konnect's secure payment gateway
      </p>

      <motion.div
        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl mb-8 max-w-md mx-auto shadow-sm border border-indigo-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between mb-4 items-center">
          <span className="text-gray-600 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-indigo-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Amount:
          </span>
          <span className="text-xl font-bold text-gray-800">50 TND</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-indigo-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
            </svg>
            Reference:
          </span>
          <span className="font-medium text-gray-800">{orderId}</span>
        </div>
      </motion.div>

      {error && (
        <motion.div
          className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg mb-6 max-w-md mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          onClick={handleInitiatePayment}
          disabled={loading}
          className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-xl shadow-lg transition duration-300 flex items-center justify-center ${
            loading
              ? "opacity-70 cursor-not-allowed"
              : "hover:shadow-xl hover:from-indigo-700 hover:to-purple-700"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Proceed to Payment
            </>
          )}
        </motion.button>

        <motion.button
          onClick={() => setStep(1)}
          className="text-gray-700 border-2 border-gray-300 py-3 px-6 rounded-xl hover:bg-gray-50 transition duration-200 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
          </svg>
          Back to Form
        </motion.button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <motion.div
      className="text-center py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {paymentStatus === "success" ? (
        <>
          <motion.div
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </motion.div>
          <motion.h2
            className="text-3xl font-bold mb-4 text-green-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Registration Complete!
          </motion.h2>
          <motion.p
            className="mb-8 text-gray-600 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Your tenant account has been created successfully. Redirecting to
            login page...
          </motion.p>
          <motion.div
            className="mx-auto w-16 h-1"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3 }}
            style={{
              background: "linear-gradient(to right, #10B981, #059669)",
            }}
          />
        </>
      ) : (
        <>
          <motion.div
            className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </motion.div>
          <motion.h2
            className="text-3xl font-bold mb-4 text-red-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Payment Failed
          </motion.h2>
          <motion.p
            className="mb-8 text-gray-600 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Tenant not registered. Please try again or contact support.
          </motion.p>
          <motion.button
            onClick={handleReset}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Try Again
          </motion.button>
        </>
      )}
    </motion.div>
  );

  const renderIcon = (name) => {
    switch (name) {
      case "mail":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        );
      case "lock":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        );
      case "user":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        );
      case "phone":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
        );
      case "briefcase":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        );
      case "map-pin":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        );
      case "map":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
          </svg>
        );
      case "globe":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case "link":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
        );
      case "home":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Progress Steps */}
          <div className="mb-12">
            <div className="relative">
              <div className="overflow-hidden h-2 mb-6 rounded-full bg-gray-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between -mt-6">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="relative">
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        step >= stepNumber
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                          : "bg-white border-2 border-gray-300 text-gray-500"
                      } font-medium text-lg shadow-md`}
                      initial={{ scale: 0.8 }}
                      animate={{
                        scale: step === stepNumber ? 1.1 : 1,
                        backgroundColor:
                          step >= stepNumber ? "#4F46E5" : "#FFFFFF",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {step > stepNumber ? (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        stepNumber
                      )}
                    </motion.div>
                    <div className="mt-3 text-center">
                      <span
                        className={`text-sm font-medium ${
                          step >= stepNumber
                            ? "text-indigo-600"
                            : "text-gray-500"
                        }`}
                      >
                        {stepNumber === 1
                          ? "Information"
                          : stepNumber === 2
                          ? "Payment"
                          : "Complete"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-8 text-white">
                <h1 className="text-3xl font-bold">Business Registration</h1>
                <p className="opacity-90 mt-2">
                  Create your tenant account in a few simple steps
                </p>
              </div>

              <div className="p-8">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TenantRegistrationPage;
