# Plan d'Implémentation : Google Maps, Nouveaux Quartiers 3D & Système Économique Cotonou [COMPLÉTÉ]

Intégration complète de **Google Maps Platform**, extension de la modélisation 3D urbaine de Cotonou (Dantokpa, Fidjrossè Plage, Quartier Administratif ministériel) et implémentation d'un **système économique interactif** (Kobo Invest, emplois légaux, braquages, rachats d'entreprises locales et flux Mobile Money).

---

## 1. Choix Utilisateur & Décisions Validées

> [!IMPORTANT]
> - **Google Maps** : Tablette GPS tactile in-game avec vraie vue satellite haute résolution (Cotonou, Bénin), suivi en temps réel du joueur (Zack/Zahra), marqueurs interactifs (`AdvancedMarker`) pour tous les points d'intérêt, et pose de repère waypoint 3D au clic.
> - **Système Économique** : Application smartphone in-game "Kobo Invest" combinée à des kiosques physiques MTN MoMo / Moov Money pour sécuriser le cash, acheter des entreprises et percevoir des dividendes passifs réguliers.
> - **Activités & Gameplay** : Emplois légaux (chauffeur Zémidjan officiel, livreur Dantokpa Express), braquages à haut risque (fourgon blindé au Ministère des Finances, conteneur portuaire) et rachat d'entreprises locales à revenus passifs.

---

## 2. Synthèse des Réalisations

### A. Intégration Google Maps Platform (`@vis.gl/react-google-maps`) [Terminé]
1. Clé Google Maps Platform provisionnée et configurée (`VITE_GOOGLE_MAPS_API_KEY`).
2. Composant Tablette GPS Satellite (`src/components/GpsGoogleMapsModal.tsx`) :
   - Initialisation avec `<APIProvider>` et `<Map mapId="DEMO_MAP_ID" mapTypeId="hybrid">`.
   - Suivi en temps réel de la position du joueur (Zack/Zahra) avec conversion GPS précise.
   - `AdvancedMarker` pour les lieux emblématiques (Ministère des Finances, Dantokpa, Plage de Fidjrossè, Étoile Rouge, Garages, Kiosques MoMo).
   - Pose de waypoint 3D au clic sur la carte satellite avec report de navigation en jeu.
   - Boutons de téléportation et de bascule Hybrid/Satellite/Terrain.

### B. Système Économique Interactif & Kobo Invest (`src/game/economy.ts`) [Terminé]
1. **Double Trésorerie** :
   - Cash physique en poche (vulnérable à 40% lors d'une arrestation policière).
   - Compte bancaire Mobile Money (MTN MoMo / Moov) 100% protégé des saisies judiciaires.
2. **Kobo Invest & Rachats de Commerces** :
   - 4 commerces achetables : Kiosque Sikè-Fictif, Maquis Chez Tata Tundé, Hangar Dantokpa, Villa VIP Fidjrossè.
   - Dividendes passifs calculés en temps réel et collectables sur le compte MoMo.
3. **Marché des Commodités Fluctuant** :
   - Indice du carburant DahoFuel, Indice du tissu Wax Dantokpa et cours boursier Kobo Cash.
4. **Emplois & Braquages** :
   - Emplois légaux : Course Zémidjan Express, Livraison de Pagne Wax Dantokpa, Ravitaillement Fidjrossè.
   - Braquages à haut risque : Fourgon blindé du Ministère des Finances (+300 000 FCFA, indice 4 étoiles), Détournement de conteneur portuaire (+180 000 FCFA, 3 étoiles).

### C. Modélisation 3D des Environnements de Cotonou (`src/game/models.ts` & `src/game/cityMap.ts`) [Terminé]
1. **Quartier Administratif (Marina)** :
   - Grand complexe du Ministère des Finances avec péristyle à colonnes néoclassiques, podium en marbre, guérite de sécurité et barrière levante.
   - Mâts cérémoniaux avec pavillons tricolores du Bénin.
   - Fourgon blindé lourd de transport de fonds stationné dans la cour d'honneur.
2. **Grand Marché Dantokpa (Secteur Grossistes)** :
   - Grand hangar de stockage couvert de toits en zinc ondulé avec piles de sacs de jute et ballots d'étoffes wax.
3. **Fidjrossè Plage (Front Océanique)** :
   - Ensembles de transats de plage en bois, parasols en paille tressée et planches de surf prêtes pour l'océan Atlantique.
4. **Kiosques MoMo Interactifs** :
   - Kiosques physiques jaune MTN et bleu Moov à Sikè-Fictif, Dantokpa et l'Étoile Rouge avec détection de proximité (Touche E).

### D. Interface Joueur & Intégration HUD (`src/components/PhoneModal.tsx`, `HUD.tsx`, `App.tsx`) [Terminé]
1. Application Smartphone Kobo 229 avec 3 onglets intégrés : Kobo Invest, MoMo Pay, et Contrats / Braquages.
2. Bouton tactile direct `GPS Satellite` et `Smartphone Kobo` sur le HUD.
3. Raccourcis clavier (Touche `M` pour Google Maps, Touche `P` pour le Smartphone Kobo).
4. Tests unitaires automatisés validés à 100% (19 tests sur 19 passés avec succès).
