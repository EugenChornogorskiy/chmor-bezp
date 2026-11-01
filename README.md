# chmor-bezp

A full-stack web application deployed on **Kubernetes** with **Kustomize**, secured by **OAuth2 (Authorization Code + PKCE)** through a self-hosted **Authentik** identity provider.

The demo app is a small Pokémon manager: browse a list of Pokémon, create your own, and open a stats view for each one. The focus of the project is not the app itself but the infrastructure and authentication around it.

## Features

- **Kubernetes deployment**: frontend, backend, Nginx and Authentik run as separate services in one cluster.
- **Kustomize layout**: shared manifests in `base/`, environment-specific changes in `overlays/prod/`.
- **One-command deploy**: `kubectl apply -k overlays/prod`.
- **OAuth2 with PKCE**: the frontend logs users in through Authentik without a client secret.
- **Token verification**: the frontend keeps the token in a React context (persisted in `localStorage`) and re-checks it against the backend `verify` endpoint on load.
- **Nginx** as the single entry point to the application.
- **CI**: GitHub Actions workflow in `.github/workflows/`.

## Architecture

```
                 ┌──────────────┐
 Browser ───────▶│    Nginx     │
                 └──────┬───────┘
                        │
          ┌─────────────┴─────────────┐
          ▼                           ▼
   ┌─────────────┐             ┌─────────────┐
   │  Frontend   │             │   Backend   │
   │   (React)   │             │ (REST API)  │
   └──────┬──────┘             └──────┬──────┘
          │  login (PKCE)             │  verify token
          ▼                           ▼
                 ┌──────────────┐
                 │  Authentik   │
                 │  (OAuth2 IdP)│
                 └──────────────┘
```

<!-- TODO: adjust the diagram if the real routing differs (for example, if the frontend is served by Nginx directly). -->

## Repository structure

| Path | Purpose |
|------|---------|
| `base/` | Core Kubernetes manifests (Deployments, Services, config) |
| `overlays/prod/` | Production overlay applied with Kustomize |
| `backend/` | Backend API source code |
| `frontend/` | React client source code |
| `key/` | Kubernetes files |
| `.github/workflows/` | CI pipeline |

## Prerequisites

- A Kubernetes cluster, for example [minikube](https://minikube.sigs.k8s.io/), [kind](https://kind.sigs.k8s.io/) or Docker Desktop with Kubernetes enabled
- [`kubectl`](https://kubernetes.io/docs/tasks/tools/) (Kustomize support is built in)
- Docker, if you want to rebuild the images yourself

## Getting started

### 1. Deploy to the cluster

```bash
kubectl apply -k overlays/prod
```

Check that everything is running:

```bash
kubectl get pods
kubectl get services
```

### 2. Expose the services locally

**Windows (PowerShell):**

```powershell
Start-Job { kubectl port-forward service/nginx 80:80 }
Start-Job { kubectl port-forward service/authentik 9000:9000 }
```

**Linux / macOS:**

```bash
kubectl port-forward service/nginx 8080:80 &
kubectl port-forward service/authentik 9000:9000 &
```

(On Linux and macOS port 80 needs elevated privileges, so 8080 is used instead.)

### 3. Open the app

- Application: <http://localhost> (or <http://localhost:8080> on Linux/macOS)
- Authentik: <http://localhost:9000>

<!-- TODO: if Authentik needs a one-time setup (an OAuth2 provider and application with the redirect URI), list the steps here. -->

## How authentication works

1. The user opens the frontend and clicks **Log in**.
2. The frontend generates a PKCE code verifier and challenge and redirects to Authentik.
3. After login, Authentik redirects back with an authorization code.
4. The frontend exchanges the code (plus the verifier) for an access token.
5. The token is stored in a React context and in `localStorage`.
6. On every page load the stored token is sent to the backend `verify` endpoint. If it is invalid or expired, the user is sent back to login.

PKCE removes the need for a client secret in the browser, which is why it is the recommended flow for single-page apps.

## Tech stack

Kubernetes · Kustomize · Docker · Nginx · Authentik · OAuth2 / PKCE · React · REST API · GitHub Actions

## Cleanup

```bash
kubectl delete -k overlays/prod
```

## Author

Yewhenii Chornohorskyi, Applied Computer Science, University of Gdańsk.
