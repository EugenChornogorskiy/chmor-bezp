Yewhenii Chornohorskyi 300833


Start-Job { kubectl port-forward service/nginx 80:80 }
Start-Job { kubectl port-forward service/authentik 9000:9000 }
 