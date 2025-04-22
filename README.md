# Backend Express pour relayer l'API OpenRouter
#
# 1. Installe les dépendances :
#    npm install express axios dotenv cors
#
# 2. Crée un fichier .env à la racine avec :
#    OPENROUTER_API_KEY=ta_cle_api_openrouter
#    SITE_URL=ton_url (optionnel)
#    SITE_NAME=ton_nom_site (optionnel)
#
# 3. Lance le serveur :
#    node index.js
#
# La route POST /chat attend :
# {
#   "text": "...", // message utilisateur
#   "image_url": "..." // (optionnel) URL d'image
# }
