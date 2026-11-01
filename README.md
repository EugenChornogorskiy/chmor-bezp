
A full-stack web application deployed on Kubernetes with Kustomize, secured by OAuth2 (Authorization Code + PKCE) through a self-hosted Authentik identity provider.

The demo app is a small Pokémon manager: browse a list of Pokémon, create your own, and open a stats view for each one. The focus of the project is not the app itself but the infrastructure and authentication around it.

Features
Kubernetes deployment: frontend, backend, Nginx and Authentik run as separate services in one cluster.
Kustomize layout: shared manifests in base/, environment-specific changes in overlays/prod/.
One-command deploy: kubectl apply -k overlays/prod.
OAuth2 with PKCE: the frontend logs users in through Authentik without a client secret.
Token verification: the frontend keeps the token in a React context (persisted in localStorage) and re-checks it against the backend verify endpoint on load.
Nginx as the single entry point to the application.
CI: GitHub Actions workflow in .github/workflows/
 
