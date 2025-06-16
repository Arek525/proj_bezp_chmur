Arkadiusz Lorek, 292596

Domyślny port to http://localhost:9000/.

KeyCloak:
    login: admin
    hasło: admin

Panel:
    Admin:
        login: admin1
        hasło: admin1
    User:
        login: test
        hasło: test



Aby włączyć DOCKERA, w głównym folderze wystarczy wpisać "docker compose up"



KUBERNETES:

kubectl apply -f ./kubernetes/frontend-deployment.yaml;
kubectl apply -f ./kubernetes/keycloak-deployment.yaml ;
kubectl apply -f ./kubernetes/keycloak-cm0-configmap.yaml;
kubectl apply -f ./kubernetes/redis-deployment.yaml ;
kubectl apply -f ./kubernetes/redis-data-persistentvolumeclaim.yaml ;
kubectl apply -f ./kubernetes/redis-service.yaml ;
kubectl apply -f ./kubernetes/keycloak-service.yaml ;
kubectl apply -f ./kubernetes/frontend-service.yaml ;

odczekujemy chwilę, aby włączył się redis

kubectl apply -f ./kubernetes/backend-deployment.yaml; 
kubectl apply -f ./kubernetes/backend-service.yaml ;