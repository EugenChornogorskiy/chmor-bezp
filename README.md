Yewhenii Chornohorskyi 300833 Grupa 3

Uruchomienie:
kubectl apply -k overlays/prod
Start-Job { kubectl port-forward service/nginx 80:80 }
Start-Job { kubectl port-forward service/authentik 9000:9000 }
 
Można otrzymać listę pokemonów, stworzyć swojego, otworzyć statystykę pokemona
Mam OAuth2 z PKCE, również context który przechowuje token w localstorage
Po pobieraniu tokena z localStorage sprawdzanie go za pomocą endpointu verify
 