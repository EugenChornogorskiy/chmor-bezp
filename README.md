# chmor-bezp

A full-stack web application deployed on **Kubernetes** with **Kustomize**, secured by **OAuth2 (Authorization Code + PKCE)** through a self-hosted **Authentik** identity provider, and built and verified by a **GitHub Actions** CI/CD pipeline.

The demo app is a Pokémon catalog: browse and filter Pokémon, search, compare and favorite them, rate and comment, create your own and open a stats view. The focus of the project is not the app itself but the infrastructure, security and automation around it.

## Highlights

- **Kubernetes + Kustomize**: shared manifests in `base/`, environment settings in `overlays/prod/`, deployed with one command.
- **Six workloads**: API (5 replicas), Nginx with the React frontend, PostgreSQL, Redis, Authentik (server and worker) and a separate PostgreSQL for Authentik.
- **OAuth2 with PKCE** via Authentik. The backend validates access tokens against Authentik's JWKS endpoint.
- **Hardening**: NetworkPolicies per component, non-root containers, `allowPrivilegeEscalation: false`, resource requests and limits.
- **Reliability**: liveness, readiness and startup probes, init containers that wait for databases, a PodDisruptionBudget for the API, persistent volumes for databases and Redis.
- **Two-layer caching**: Redis cache for `/stats` in the backend, plus an Nginx `proxy_cache` in front of it (visible in the `X-Cache` and `X-Cache-Status` headers).
- **Observability**: Prometheus metrics at `/metrics` (`prom-client`) and a `/health` endpoint that reports database and Redis status.
- **CI/CD**: tests with real PostgreSQL and Redis service containers, image builds pushed to GitHub Container Registry, and a deployment smoke test on a temporary Minikube cluster.

## Architecture

```
                    Browser
                       │
                       ▼
               ┌───────────────┐
               │     Nginx     │  serves the React app,
               │ (frontend img)│  proxies /api/ to the API
               └───────┬───────┘
                       │ /api/
                       ▼
               ┌───────────────┐   verifies tokens (JWKS)   ┌─────────────────┐
               │  API (x5)     │───────────────────────────▶│   Authentik     │
               │ Node/Express  │                            │ server + worker │
               └───┬───────┬───┘                            └────────┬────────┘
                   │       │                                         │
                   ▼       ▼                                         ▼
            ┌──────────┐ ┌───────┐                          ┌─────────────────┐
            │PostgreSQL│ │ Redis │ ◀── cache / sessions     │ PostgreSQL (auth)│
            └──────────┘ └───────┘                          └─────────────────┘
```

Traffic between pods is limited by NetworkPolicies, so each component can only talk to the services it actually needs.

## How authentication works

1. The frontend creates a PKCE code verifier and challenge and redirects the user to Authentik.
2. After login, Authentik redirects back to `/callback` with an authorization code.
3. The frontend sends the code and the verifier to the backend (`POST /auth/callback`), which exchanges them for tokens.
4. The access token is kept in a React context. Protected endpoints require it, and the backend checks its signature with the keys published by Authentik.
5. `GET /verify` lets the frontend confirm that a stored token is still valid on load. `POST /auth/logout` clears the user's cached data in Redis.

## CI/CD pipeline

Defined in `.github/workflows/docker-image.yml`:

| Job | Runs on | What it does |
|-----|---------|--------------|
| `test-backend` | push and pull request | Installs the backend, runs Jest unit tests (with coverage) against PostgreSQL 15 and Redis 7 service containers, uploads the coverage report |
| `build-backend`, `build-frontend` | push to `new` | Build Docker images and push them to GitHub Container Registry, tagged `latest` and with the commit SHA |
| `deploy` | push to `new` | Starts a temporary Minikube cluster, applies `overlays/prod`, waits for every deployment with `kubectl rollout status` and prints the cluster state. On failure it prints pod descriptions, logs and events for debugging |

The `deploy` job is a smoke test: it proves that the manifests apply cleanly and every service becomes ready. It does not deploy to a permanent environment.

## Repository structure

| Path | Purpose |
|------|---------|
| `base/` | Kubernetes manifests: Deployments, Services, NetworkPolicies, PVCs, PodDisruptionBudget, ConfigMaps |
| `overlays/prod/` | Overlay with environment config and generated Secrets |
| `backend/` | Node.js / Express API, Dockerfile and Jest tests |
| `frontend/` | React (TypeScript) client, Nginx config and Dockerfile |
| `.github/workflows/` | CI/CD pipeline |

## Getting started

### Prerequisites

- A Kubernetes cluster, for example [minikube](https://minikube.sigs.k8s.io/), [kind](https://kind.sigs.k8s.io/) or Docker Desktop with Kubernetes enabled
- [`kubectl`](https://kubernetes.io/docs/tasks/tools/) (Kustomize support is built in)

### 1. Deploy

```bash
kubectl apply -k overlays/prod
kubectl get pods
```

Wait until all pods are `Running`. Authentik can take a minute or two on the first start because it migrates its database.

### 2. Expose the services locally

**Windows (PowerShell):**

```powershell
Start-Job { kubectl port-forward service/nginx 80:80 }
Start-Job { kubectl port-forward service/authentik 9000:9000 }
```

**Linux / macOS:**

```bash
sudo kubectl port-forward service/nginx 80:80 &
kubectl port-forward service/authentik 9000:9000 &
```

Port 80 is used because the redirect URI is `http://localhost/callback`.

### 3. Configure Authentik (first run only)

Open <http://localhost:9000>, finish the initial setup, then create an **OAuth2/OpenID provider** and an **application** that match the values in `overlays/prod/kustomization.yaml`:

| Setting | Value |
|---------|-------|
| Application slug | `my-app` |
| Client ID | `my-app` |
| Client secret | `secret` |
| Redirect URI | `http://localhost/callback` |

### 4. Open the app

Go to <http://localhost> and log in through Authentik.

> The credentials in `overlays/prod` (`secret`, `postgres`) are demo values for local use. Replace them before running this anywhere real.

## Running the tests

```bash
cd backend
npm ci
npm run test:unit
```

The tests need PostgreSQL and Redis. The CI pipeline provides them as service containers.

## Tech stack

Kubernetes · Kustomize · Docker · Nginx · Authentik · OAuth2 / PKCE · Node.js · Express · React · TypeScript · PostgreSQL · Redis · Prometheus client · Jest · GitHub Actions · Minikube

## Author

Yewhenii Chornohorskyi, Applied Computer Science, University of Gdańsk.
