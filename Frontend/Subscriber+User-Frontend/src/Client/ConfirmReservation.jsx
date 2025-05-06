import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Add useParams
import {
  Check,
  X,
  RefreshCw,
  Mail,
  ArrowRight,
  Shield,
  AlertCircle,
} from "lucide-react";

export default function EnhancedConfirmationCode() {
  const { confirmId } = useParams();
  const [reservationId, setReservationId] = useState("");
  const [confirmationCode, setConfirmationCode] = useState([
    "","","","","","",
  ]);
  const [tenant, setTenant] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showSuccessView, setShowSuccessView] = useState(false);
  
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const API_BASE = `http://${window.location.hostname}:8888`;

  useEffect(() => {
    setTenant(window.location.hostname.split(".")[0]);

    if (confirmId) {
      setReservationId(confirmId);
    } else {
      const storedId = sessionStorage.getItem("reservationId");
      if (storedId) {
        setReservationId(storedId);
      }
    }

    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [confirmId]);

  useEffect(() => {
    const floatAnimation = () => {
      const image = document.getElementById("floating-image");
      if (image) {
        let position = 0;
        let direction = 1;

        const animate = () => {
          position += 0.3 * direction;

          if (position > 15) direction = -1;
          if (position < -15) direction = 1;

          image.style.transform = `translateY(${position}px) rotate(${
            position / 5
          }deg)`;
          requestAnimationFrame(animate);
        };

        animate();
      }
    };

    floatAnimation();
  }, []);

  // Add useEffect for redirect after success
  useEffect(() => {
    if (showSuccessView) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessView, navigate]);

  const handleInputChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return;

    // Update the code array
    const newCode = [...confirmationCode];
    newCode[index] = value;
    setConfirmationCode(newCode);

    // Move to next input if current input is filled
    if (value && index < 5) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !confirmationCode[index] && index > 0) {
      setFocusedIndex(index - 1);
      inputRefs.current[index - 1].focus();
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      setFocusedIndex(index - 1);
      inputRefs.current[index - 1].focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Check if pasted data is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setConfirmationCode(digits);

      // Focus the last input
      setFocusedIndex(5);
      inputRefs.current[5].focus();
    }
  };

  const handleConfirm = () => {
    const code = confirmationCode.join("");

    if (!reservationId || code.length !== 6) {
      setMessage("Veuillez saisir votre code de confirmation à 6 chiffres");
      return;
    }

    setStatus("loading");
    setMessage("");

    // Use the booking prefix in the URL as in your other API calls
    fetch(
      `${API_BASE}/booking/client/reservation/confirm/${reservationId}/${code}`,
      {
        method: "POST",
        headers: { "X-Tenant-ID": tenant },
      }
    )
      .then((res) => {
        if (!res.ok) {
          // Get status code for better error messages
          if (res.status === 400) {
            throw new Error("Code de confirmation invalide");
          } else if (res.status === 404) {
            throw new Error("Réservation non trouvée");
          } else {
            throw new Error("Échec de la confirmation");
          }
        }
        // Don't try to parse the response since it's void
        return { success: true };
      })
      .then(() => {
        setStatus("success");
        setMessage("Votre réservation a été confirmée avec succès !");
        
        // Show success view and will trigger redirect
        setShowSuccessView(true);

        // Clear the stored data after successful confirmation
        sessionStorage.removeItem("reservationId");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.message ||
            "Échec de la confirmation de réservation. Veuillez vérifier votre code de confirmation."
        );
      });
  };

  const resendCode = () => {
    // Placeholder for resend functionality
    setMessage("Envoi d'un nouveau code de confirmation à votre e-mail...");
    // Here you would implement the API call to resend the code
  };

  // Determine if submit button should be disabled
  const isSubmitDisabled =
    status === "loading" || confirmationCode.join("").length !== 6;

  // Animation for input focus highlight
  const getInputHighlightClass = (index) => {
    if (focusedIndex === index) {
      return "scale-105 border-indigo-600 bg-indigo-50 shadow-lg ring-2 ring-indigo-200";
    } else if (confirmationCode[index]) {
      return "border-gray-300 bg-white";
    } else {
      return "border-gray-200 bg-gray-50";
    }
  };

   // Success view component
   const SuccessView = () => (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 animate-fadeIn">
      <div className="text-center max-w-2xl mx-auto p-8">
        <div className="relative w-56 h-56 mx-auto mb-6">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/1642/1642097.png" 
            alt="Réservation confirmée" 
            className="w-full h-full object-contain drop-shadow-xl animate-bounce-slow" 
          />
        </div>
        
        <h1 className="text-4xl font-bold text-green-600 mb-4">Merci pour votre réservation !</h1>
        <p className="text-xl text-gray-700 mb-4">Votre réservation a été confirmée avec succès.</p>
        <div className="text-sm text-gray-500">Redirection en cours...</div>
        
        <div className="mt-8 w-full max-w-xs mx-auto">
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (showSuccessView) {
    return <SuccessView />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 flex flex-col">
      {/* Added pt-16 to create space below the transparent navbar */}
      <div className="flex-grow flex items-center justify-center p-4 pt-16">
        <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 transform hover:shadow-3xl">
          {/* Left side - Image and decoration */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-800 p-8 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-lg"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full translate-x-1/3 translate-y-1/3 blur-lg"></div>

            {/* Animated image */}
            <div className="relative w-64 h-64 mx-auto mb-6 mt-4">
              <img
                id="floating-image"
                src="https://cdn-icons-png.flaticon.com/512/2665/2665038.png"
                alt="Vérification"
                className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-300"
              />
            </div>

            <h2 className="text-2xl font-bold text-white text-center mt-4 mb-2">
              Vérification Sécurisée
            </h2>
            <p className="text-indigo-100 text-center text-sm max-w-xs">
              Nous avons envoyé un code à 6 chiffres à votre adresse e-mail pour vérifier votre réservation.
            </p>
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
            {/* Header */}
            <div className="text-center md:text-left mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Code de Vérification
              </h1>
              <div className="flex items-center justify-center md:justify-start text-gray-500 gap-2">
                <Mail size={18} />
                <p>Saisissez le code envoyé à votre e-mail</p>
              </div>
            </div>

            {/* Status Messages */}
            {status === "success" && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 flex items-center shadow-md">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Check className="text-green-500" size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Succès !</h3>
                  <p>{message}</p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center shadow-md">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <X className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Erreur</h3>
                  <p>{message}</p>
                </div>
              </div>
            )}

            <input type="hidden" value={reservationId} />

            {/* Code Input Section */}
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-bold mb-3">
                Saisissez votre code à 6 chiffres
              </label>

              <div
                className="flex justify-between gap-2 md:gap-3 mb-6"
                onPaste={handlePaste}
              >
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className="relative flex-1">
                    <input
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      className={`w-full h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-300 focus:outline-none ${getInputHighlightClass(
                        index
                      )}`}
                      value={confirmationCode[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onFocus={() => setFocusedIndex(index)}
                    />

                    {/* Subtle underline animation when focused */}
                    {focusedIndex === index && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full animate-pulse" />
                    )}
                  </div>
                ))}
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={isSubmitDisabled}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSubmitDisabled
                    ? "bg-gradient-to-r from-indigo-300 to-purple-300 cursor-not-allowed opacity-70"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                }`}
              >
                {status === "loading" ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    <span>Vérification...</span>
                  </>
                ) : (
                  <>
                    <span>Vérifier le Code</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>

            {/* Resend Section */}
            <div className="flex flex-col items-center">
              <p className="text-gray-500 text-sm mb-2">
                Vous n'avez pas reçu le code ?
              </p>
              <button
                onClick={resendCode}
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 group"
              >
                <RefreshCw
                  size={18}
                  className="group-hover:rotate-180 transition-transform duration-500"
                />
                <span>Renvoyer le Code</span>
              </button>
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <AlertCircle size={16} />
                <p className="text-sm">
                  Besoin d'aide ? Contactez{" "}
                  <span className="text-indigo-600 font-medium cursor-pointer hover:underline">
                    planifygo17@gmail.com
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Votre Entreprise. Tous droits réservés.
          </p>
        </div>
        <div className="flex gap-4">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Politique de Confidentialité
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Conditions d'Utilisation
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Contactez-Nous
          </a>
        </div>
      </div>
    </div>
  );
}
