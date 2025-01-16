README

1. Safetrain IA ☢️
SafeTrain est une plateforme web qui combine la recherche documentaire et l'intelligence artificielle générative grâce à une technologie appelée Retrieval-Augmented Generation (RAG). Elle permet aux utilisateurs de téléverser des documents PDF, de poser des questions sur leur contenu, et d’obtenir des réponses précises basées sur ces documents, tout en utilisant des modèles avancés de traitement du langage.

Les fonctionnalités principales incluent :

Chat avec les documents PDF : les utilisateurs peuvent interagir directement avec leurs fichiers pour extraire des informations spécifiques.
Techniques avancées de RAG : des méthodes comme le "late chunking", le "reranking", et la "recherche hybride" améliorent la pertinence des résultats.
Agents personnalisables : les utilisateurs peuvent configurer des modèles pour adapter les réponses à leurs besoins spécifiques.
SafeTrain vise à rendre l'exploration de documents technique accessible, efficace et fiable, en particulier pour des secteurs nécessitant une précision élevée, comme la médecine ou l'industrie.

2. Prérequis
Avant de commencer, assurez-vous que votre environnement de développement est configuré avec :

- Git : pour cloner le dépôt.
- Node.js (version LTS recommandée) et npm ou yarn : pour installer les dépendances et lancer le projet.
- Un éditeur de code (Visual Studio Code, par exemple) pour visualiser et modifier le code.

2. Cloner le dépôt GitHub

- Ouvrir un terminal.
- Cloner votre dépôt avec la commande suivante :

```bash
git clone https://github.com/BillyH2O/safetrain.git
```

- Accédez au répertoire cloné :

```bash
cd votre-projet
```

3. Installer les dépendances
Selon le gestionnaire de paquets que vous préférez (npm ou yarn), exécutez :

Avec npm
```bash
npm install
```
Avec yarn
```bash
yarn install
```

4. Configurer les variables d'environnement
Safetrain utilise plusieurs services (NeonDB, PineconeDB, AWS S3, LLM) qui nécessitent des identifiants et des clés secrètes. Pour configurer correctement l'application :

- Dans la racine du projet, créez un fichier .env.local (Next.js charge automatiquement ce fichier en développement).
- Ajoutez les variables d'environnement suivantes :

```bash
# Upstash
UPSTASH_VECTOR_REST_URL="https://curious-aardvark-62512-eu1-vector.upstash.io"
UPSTASH_VECTOR_REST_TOKEN="ABoFMGN1cmlvdXMtYWFyZHZhcmstNjI1MTItZXUxYWRtaW5ZbUl6TmpObE9ESXRaVGd5TkMwMFptRXlMVGsyTkRJdE5tWm1NemxsTkdObE16QTA="
QSTASH_TOKEN=eyJVc2VySUQiOiI1MDY3YWU3Ny1kNWMyLTRlNDMtYWU2ZS0yMTMzNTUwZWMwM2YiLCJQYXNzd29yZCI6Ijc0YWExNDdjOWRhODQ0MmRhZmQxNjI5ZTQ2MWQ0OGQ5In0=
UPSTASH_REDIS_REST_URL="https://meet-chipmunk-52932.upstash.io"
UPSTASH_REDIS_REST_TOKEN="Ac7EAAIjcDEyMGRlMGFhNDc1NDI0NDIzOWVhZDBlZDczY2Q3NDNlOXAxMA"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YXBwYXJlbnQtd2Fob28tOTcuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_VLi30Hmhm0aXqZxfhrsC6eEB6U3COeJbWtPFqKTCVE
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in # pointe vers la page sign in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
CLERK_AFTER_SIGN_UP_URL=/dashboard
CLERK_AFTER_SIGN_IN_URL=/dashboard

# DB
DATABASE_URL=postgresql://safetraindb_owner:QrcvbYu2E0we@ep-twilight-waterfall-a22y3kiv.eu-central-1.aws.neon.tech/safetraindb?sslmode=require

# AWS S3
NEXT_PUBLIC_S3_ACCESS_KEY_ID=AKIA6GSNHEYASCNTOY7O
NEXT_PUBLIC_S3_SECRET_ACCESS_KEY=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
NEXT_PUBLIC_S3_BUCKET_NAME=safetrainbucket

# Pinecone
PINECONE_API_KEY=pcsk_3GfspB_Egct96JMtmhTUCFig78RcSKcwXDVDt1ojoocMz4VDALbLDiGvHXb8MwrfAhCV2n

# Model
OPENAI_API_KEY="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"
GROK_API_KEY=xai-q5qhfb3rKSjB2JAy0mJNYC0yVyRIHQrIj9iuYiLDqPj4Oat8FdvizQLDj69ESwkkMN885ej5qX00BIHn
GEMINI_API_KEY=AIzaSyDa8L5NAtxmq9hq-wV-dIFZrxDkhjuvyY8

HUGGINGFACE_API_KEY="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"
```

- Sauvegardez le fichier .env.local.

5. Lancer le serveur de développement

Une fois le code cloné, les dépendances installées et la configuration faite, lancez le projet :

Avec npm
```bash
npm run dev
```

Avec npm
```bash
yarn dev
```

Next.js démarrera le serveur de développement sur le port par défaut 3000. Vous devriez voir dans le terminal un message indiquant :
Local:    http://localhost:3000
Network:  http://<votre-adresse-ip>:3000

6. Accéder à l’application via le navigateur
Ouvrez votre navigateur.
Rendez-vous à l’adresse http://localhost:3000.
Vous devriez voir l’interface Safetrain s’afficher.

Cette commande va télécharger et installer toutes les dépendances indiquées dans le fichier package.json.

7. Besoin d’aide ?
Si vous avez le moindre problème, n'hésitez pas à me contacter. Je vous aiderai avec grand plaisir 🙂
