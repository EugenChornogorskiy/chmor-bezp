kubectl create secret generic pg-user --from-literal=PG_USER=postgres
kubectl create secret generic pg-password --from-literal=PG_PASSWORD=postgres
 
kubectl create secret generic auth-pg-user --from-literal=AUTH_PG_USER=postgres
kubectl create secret generic auth-pg-password --from-literal=AUTH_PG_PASSWORD=postgres
 
kubectl create secret generic auth-secret-key --from-literal=AUTHENTIK_SECRET_KEY=secret
kubectl create configmap env-common --from-env=env.common.json
kubectl create configmap pokemons --from-file=pokemon.json
kubectl apply -f nginx-conf.yaml
kubectl apply -f app-config-configmap.yaml
kubectl apply -f postgres-data-pvc.yaml
kubectl apply -f authorization-pg-data-pvc.yaml
kubectl apply -f redis-pvc.yaml
 
kubectl apply -f postgres-deployment.yaml
kubectl apply -f postgres-service.yaml
 
kubectl apply -f authorization-pg-deployment.yaml
kubectl apply -f authorization-pg-service.yaml
 
kubectl apply -f redis-deployment.yaml
kubectl apply -f redis-service.yaml
 
kubectl apply -f postgres-network.yaml
kubectl apply -f redis-network.yaml
kubectl apply -f authorization-pg-network.yaml
kubectl apply -f authorization-network.yaml
kubectl apply -f authorization-worker-network.yaml
kubectl apply -f api-network.yaml
kubectl apply -f nginx-network.yaml
kubectl apply -f authorization-deployment.yml 
kubectl apply -f authorization-service.yaml

kubectl apply -f api-pdb.yaml
kubectl apply -f api-deployment.yaml
kubectl apply -f api-service.yaml
 
kubectl apply -f nginx-deployment.yaml
kubectl apply -f nginx-service.yaml
Start-Job { kubectl port-forward service/nginx 80:80 }
Start-Job { kubectl port-forward service/authentik 9000:9000 }


curl http://localhost:3000/metrics -UseBasicParsing | Select-Object -ExpandProperty Content | Select-String "http_requests"