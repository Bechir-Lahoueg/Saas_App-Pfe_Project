# PlanifyGo - SaaS Appointment Booking Platform

<div align="center">
  <img src="Frontend/Subscriber+User-Frontend/public/LogoPlanifygoPNG.png" alt="PlanifyGo Logo" width="200"/>
  <h3>Solution de réservation professionnelle</h3>
</div>

## 📋 Description

PlanifyGo est une plateforme SaaS (Software as a Service) de réservation en ligne tout-en-un qui permet aux professionnels de gérer leurs rendez-vous et aux clients de réserver des services facilement. La plateforme offre une solution complète pour la gestion des réservations, des horaires, des employés et des services.

## ✨ Fonctionnalités

### Pour les Professionnels (Tenants)
- **Gestion des Services** : Créez et gérez vos services avec prix, durée et capacité
- **Gestion des Employés** : Ajoutez vos employés et assignez-les à des services spécifiques
- **Horaires Personnalisables** : Définissez vos heures d'ouverture et de fermeture
- **Tableau de Bord** : Visualisez vos statistiques et réservations
- **Calendrier Interactif** : Gérez votre planning en temps réel
- **Gestion des Médias** : Téléchargez des images pour personnaliser votre profil
- **Notifications** : Recevez des alertes pour les nouvelles réservations

### Pour les Clients
- **Recherche par Catégorie** : Trouvez des professionnels par secteur d'activité
- **Réservation en Ligne** : Réservez des services en quelques clics
- **Confirmation par Email** : Recevez des confirmations automatiques
- **Historique des Réservations** : Consultez vos réservations passées et à venir

### Pour les Administrateurs
- **Gestion des Utilisateurs** : Supervisez tous les utilisateurs de la plateforme
- **Statistiques Globales** : Analysez les performances de la plateforme
- **Gestion des Paiements** : Suivez les abonnements et les transactions

## 🏗️ Architecture

PlanifyGo est construit sur une architecture microservices moderne, permettant une scalabilité et une maintenance optimales.

### Backend
- **API Gateway** : Point d'entrée unique pour toutes les requêtes
- **Service Discovery** : Enregistrement et découverte des services
- **Auth Service** : Gestion de l'authentification et des autorisations
- **Register Service** : Inscription des utilisateurs et gestion des profils
- **Schedule Service** : Gestion des horaires et des disponibilités
- **ClientBooking Service** : Gestion des réservations clients
- **Payment Service** : Traitement des paiements et abonnements
- **Notification Service** : Envoi de notifications par email
- **Reporting Service** : Génération de rapports et statistiques
- **Integration Service** : Intégration avec des services externes

### Frontend
- **Admin Frontend** : Interface d'administration
- **Subscriber+User Frontend** : Interface pour les professionnels et les clients

## 🛠️ Technologies Utilisées

### Backend
- **Java Spring Boot** : Framework principal pour les microservices
- **Spring Cloud** : Pour la configuration des microservices
- **Spring Security** : Pour la sécurité et l'authentification
- **PostgreSQL** : Base de données relationnelle
- **Node.js** : Pour certains services (Payment, Integration)
- **Express** : Framework web pour Node.js
- **MongoDB** : Base de données NoSQL pour certains services
- **RabbitMQ** : Système de messagerie pour la communication entre services
- **Eureka** : Service de découverte
- **JWT** : Pour l'authentification basée sur les tokens

### Frontend
- **React** : Bibliothèque JavaScript pour l'interface utilisateur
- **Vite** : Outil de build rapide pour le développement
- **Tailwind CSS** : Framework CSS pour le design
- **Framer Motion** : Pour les animations
- **FullCalendar** : Pour l'affichage du calendrier
- **Axios** : Pour les requêtes HTTP
- **React Router** : Pour la navigation
- **Recharts** : Pour les graphiques et visualisations

## 🚀 Installation et Configuration

### Prérequis
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- MongoDB 6+
- RabbitMQ

### Configuration de la Base de Données
1. Créez une base de données PostgreSQL nommée `saas_app`
2. Configurez les informations de connexion dans les fichiers `application.properties` de chaque service

### Démarrage des Services Backend
1. Lancez d'abord le Service Discovery :
   ```bash
   cd Backend/Service-Discovery
   ./mvnw spring-boot:run
   ```

2. Lancez l'API Gateway :
   ```bash
   cd Backend/Api-Gateway
   ./mvnw spring-boot:run
   ```

3. Lancez les autres services dans l'ordre suivant :
   - Auth Service
   - Register Service
   - Schedule Service
   - ClientBooking Service
   - Payment Service
   - Notification Service
   - Reporting Service
   - Integration Service

### Démarrage des Frontends
1. Pour le frontend Subscriber+User :
   ```bash
   cd Frontend/Subscriber+User-Frontend
   npm install
   npm run dev
   ```

2. Pour le frontend Admin :
   ```bash
   cd Frontend/Admin-Frontend
   npm install
   npm run dev
   ```

## 📝 Utilisation

### Accès aux Interfaces
- **Interface Client/Professionnel** : http://127.0.0.1.nip.io:5173
- **Interface Admin** : http://localhost:3000

### API Gateway
Toutes les requêtes API passent par l'API Gateway disponible à l'adresse : http://localhost:8888

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).
