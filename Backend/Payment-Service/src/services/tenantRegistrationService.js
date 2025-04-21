// src/services/tenantRegistrationService.js
const axios = require('axios');
const EurekaServiceFinder = require('../utils/eurekaServiceFinder');

const REGISTER_SERVICE_NAME = 'register-service';

/**
 * Enregistre un nouveau locataire après un paiement réussi
 * @param {Object} tenantData - Données du locataire
 * @returns {Promise} - Résultat de l'enregistrement
 */
const registerTenant = async (tenantData) => {
    try {
        // Obtenir l'URL du service depuis Eureka
        const serviceUrl = await EurekaServiceFinder.getServiceUrl(REGISTER_SERVICE_NAME);
        const registrationEndpoint = `${serviceUrl}/register/tenant/signup`;

        // Appeler le service d'enregistrement
        const response = await axios.post(registrationEndpoint, tenantData, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000
        });

        return response.data;
    } catch (error) {
        // Gestion des erreurs
        if (error.response) {
            console.error('Registration API error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('No response received from registration service');
        } else {
            console.error('Tenant registration failed:', error.message);
        }
        throw new Error(`Registration failed: ${error.message}`);
    }
};

module.exports = { registerTenant };