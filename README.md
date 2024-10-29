# AlloMedia_dashboard_back

## Contexte du Projet

AlloMedia est une application de livraison qui facilite la gestion des commandes entre les clients, les livreurs et les gestionnaires de restaurants. Ce projet se concentre sur le développement du backend, fournissant des API RESTful robustes pour gérer les interactions entre les différents acteurs.

## Acteurs

- **Client** : Utilisateur qui passe des commandes auprès des restaurants.
- **Livreur** : Utilisateur qui gère la livraison des commandes.
- **Gestionnaire de Restaurant** : Utilisateur qui gère les commandes et le menu du restaurant.
- **Super Admin** : Utilisateur qui supervise et approuve les inscriptions des restaurants.

## Fonctionnalités du Backend

### Super Admin
- **Gestion des Inscriptions des Restaurants** : 
  - Approuver ou refuser les demandes d'inscription des restaurants.
  - Assurer que seuls les restaurants vérifiés ont accès à la plateforme.

- **Gestion des Restaurants** : 
  - Ajouter, modifier et supprimer des restaurants pour maintenir les informations à jour.

- **Recherche des Restaurants** : 
  - Rechercher des restaurants par nom, type de cuisine ou emplacement.

### Client
- **Recherche de Restaurants** : 
  - API permettant aux clients de rechercher des restaurants selon divers critères.

- **Gestion des Commandes** : 
  - API pour passer des commandes, consulter le menu, et suivre l'état des commandes.

### Livreur
- **Notification de Commandes** : 
  - Recevoir des notifications lorsqu'une nouvelle commande est prête pour la livraison.

- **Confirmation de Livraison** : 
  - API pour confirmer la livraison des commandes.

### Gestionnaire de Restaurant
- **Gestion du Menu** : 
  - API permettant d'ajouter, modifier ou supprimer des articles du menu.

- **Gestion des Commandes** : 
  - Voir les nouvelles commandes et mettre à jour leur statut.

## Technologies Utilisées

### Backend
- **Node.js** : Environnement d'exécution pour le backend.
- **Express.js** : Framework pour créer des API RESTful et gérer les requêtes HTTP.
- **Socket.IO** : Pour la communication en temps réel, permettant aux livreurs et aux clients de recevoir des notifications instantanées.

### Base de Données
- **MongoDB** : Base de données NoSQL pour stocker des données semi-structurées, comme les informations des utilisateurs et des commandes.

### Authentification et Sécurité
- **JSON Web Tokens (JWT)** : Pour l'authentification des utilisateurs et la gestion des autorisations.
- **Bcryptjs** : Pour le hachage des mots de passe, assurant la sécurité des informations des utilisateurs.

## Installation et Lancement

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/OSMaben/AlloMedia_dashboard_back
