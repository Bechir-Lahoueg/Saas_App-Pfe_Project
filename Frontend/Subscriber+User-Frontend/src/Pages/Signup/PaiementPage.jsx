import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, redirect } from "react-router-dom";

const TenantRegistrationPage = () => {


  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1); // 1: Form, 2: Payment, 3: Result
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
  });
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation du formulaire
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!formData.firstName || !formData.lastName) {
      setError("First name and last name are required");
      return false;
    }
    if (!formData.businessName || !formData.subdomain) {
      setError("Business name and subdomain are required");
      return false;
    }
    return true;
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setStep(2); // Passer à l'étape de paiement
  };

  // Générer un ID de commande aléatoire
  const generateOrderId = () => {
    return `REG-${Date.now()}`;
  };

  // Initialisation du paiement via Konnect
  const handleInitiatePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const paymentData = {
        receiverWalletId: "67dd5a772f786e7f6069197a",
        token: "TND",
        amount: 300,
        type: "immediate",
        description: `Tenant registration for ${formData.businessName}`,
        acceptedPaymentMethods: ["wallet", "bank_card", "e-DINAR"],
        lifespan: 10,
        addPaymentFeesToAmount: true,
        orderId: generateOrderId(),
        successUrl: "http://localhost:5173/paiement?step=3&status=success",
        failUrl: "http://localhost:5173/paiement?step=3&status=failed",
        customerDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipcode: formData.zipcode,
        },
        // Utiliser metadata pour les données d'enregistrement tenant

          tenantRegistration: {
            businessName: formData.businessName,
            subdomain: formData.subdomain,
            password: formData.password,

        },
      };

      const response = await fetch(
        "http://localhost:5001/payments/tenant-registration",
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
        // Stocker les informations de paiement pour référence future
        setPaymentInfo({
          paymentId: result.paymentRef,
          paymentUrl: result.payUrl,
        });

        // Rediriger vers l'URL de paiement de Konnect
        window.location.href = result.payUrl;
      } else {
        setError(result.error || "Échec de l'initialisation du paiement");
        setStep(1); // Retour au formulaire en cas d'échec
      }
    } catch (err) {
      setError(
        "Une erreur s'est produite lors de l'initialisation du paiement"
      );
      console.error("Erreur de paiement:", err);
      setStep(1); // Retour au formulaire en cas d'échec
    } finally {
      setLoading(false);
    }
  };

  // Vérification du statut du paiement après redirection
// Vérification du statut du paiement après redirection
useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const paymentResult = queryParams.get("status");
  const paymentRef = queryParams.get("payment_ref");
  const stepParam = queryParams.get("step");
  
  if (paymentResult) {
    // Explicitly set step to 3 when redirected from payment
    setStep(parseInt(stepParam) || 3);
    
    if (paymentRef) {
      setPaymentInfo((prev) => ({ ...prev, paymentId: paymentRef }));
    }
    handlePaymentComplete(paymentResult);
  }
}, [location.search]);

  // Gestion de la finalisation du paiement
  const handlePaymentComplete = async (status) => {
    setPaymentStatus(status);
    setStep(3);

    const paymentId =
      paymentInfo?.paymentId ||
      new URLSearchParams(location.search).get("payment_ref");

    if (status === "success" && paymentId) {
      try {
        // Vérifier et compléter le paiement via le backend
        const response = await fetch(
          `http://localhost:5001/payments/complete/${paymentId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        const result = await response.json();

        if (result.success && result.status === "completed") {
          console.log("Enregistrement du tenant complété avec succès");
          setTimeout(() => navigate("/dashbord"), 2000);
        } else {
          setError(
            "Paiement complété mais l'enregistrement du tenant a échoué"
          );
          handleReset();
        }
      } catch (err) {
        setError("Erreur lors de la vérification du paiement");
        console.error("Erreur de finalisation:", err);
        handleReset();
      }
    } else if (status === "failed") {
      setError("Le paiement a échoué");
    } else {
      handleReset();
    }
  };

  // Réinitialisation du formulaire
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
      zipcode,
      city: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Barre de progression */}
        <div className="flex items-center justify-between mb-12">
          <div
            className={`flex items-center ${
              step >= 1 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              1
            </div>
            <span className="ml-2">Information</span>
          </div>
          <div className="flex-1 mx-4 h-1 bg-gray-200">
            <div
              className={`h-full transition-all duration-500 ${
                step >= 2 ? "bg-blue-600" : "bg-gray-200"
              }`}
              style={{ width: step >= 2 ? "100%" : "0%" }}
            ></div>
          </div>
          <div
            className={`flex items-center ${
              step >= 2 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              2
            </div>
            <span className="ml-2">Payment</span>
          </div>
          <div className="flex-1 mx-4 h-1 bg-gray-200">
            <div
              className={`h-full transition-all duration-500 ${
                step >= 3 ? "bg-blue-600" : "bg-gray-200"
              }`}
              style={{ width: step >= 3 ? "100%" : "0%" }}
            ></div>
          </div>
          <div
            className={`flex items-center ${
              step >= 3 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              3
            </div>
            <span className="ml-2">Complete</span>
          </div>
        </div>

        {/* Conteneur principal */}
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-2xl font-bold">Business Registration</h1>
            <p className="opacity-90">
              Create your tenant account in few simple steps
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {step === 1 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                      Email*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="password"
                    >
                      Password*
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="firstName"
                    >
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="lastName"
                    >
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="phone">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="businessName"
                    >
                      Business Name*
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="businessName"
                    >
                      city*
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="businessName"
                    >
                      zipcode*
                    </label>
                    <input
                      type="text"
                      id="zipcode"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="subdomain"
                    >
                      Subdomain*
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="subdomain"
                        name="subdomain"
                        value={formData.subdomain}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <span className="bg-gray-200 px-4 py-2 border-t border-b border-r rounded-r-lg flex items-center">
                        .yourdomain.com
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="address"
                    >
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
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
                    "Continue to Payment"
                  )}
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold mb-4">
                  Complete Your Payment
                </h2>
                <p className="mb-6 text-gray-600">
                  You will be redirected to Konnect's secure payment gateway
                </p>
                <div className="bg-blue-50 p-6 rounded-lg mb-6 max-w-md mx-auto">
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">500 TND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-semibold">
                      {paymentInfo?.paymentId || generateOrderId()}
                    </span>
                  </div>
                </div>
                {error && (
                  <motion.div
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}
                <button
                  onClick={handleInitiatePayment}
                  disabled={loading}
                  className={`bg-blue-600 text-white py-3 px-6 rounded-lg transition duration-200 ${
                    loading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
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
                    "Proceed to Payment"
                  )}
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  Back to Form
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                {paymentStatus === "success" ? (
                  <>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-10 h-10 text-green-500"
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
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-green-600">
                      Registration Complete!
                    </h2>
                    <p className="mb-6">
                      Your tenant account has been created successfully.
                      Redirecting to dashboard...
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-10 h-10 text-red-500"
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
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-red-600">
                      Payment Failed
                    </h2>
                    <p className="mb-6">
                      Tenant not registered. Please try again or contact
                      support.
                    </p>
                    <button
                      onClick={handleReset}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg transition duration-200"
                    >
                      Try Again
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TenantRegistrationPage;
