# 🌟 Proyecto Final - Sistemas Distribuidos

¡Bienvenid@ al repositorio del **Proyecto Final de la materia de Sistemas Distribuidos**! Este proyecto consta de dos APIs, cada una con su respectiva función y base de datos:

1. **API REST**: Desarrollada en TypeScript, utiliza MongoDB para gestionar colecciones.
2. **API SOAP**: Desarrollada en C#, utiliza PostgreSQL para manejar tareas.

El despliegue se realiza en **Kubernetes**, organizando los recursos en namespaces específicos:

- `done-dbs`: Bases de datos.
- `done-api`: APIs.

---

## 🛠️ Tecnologías Utilizadas

- **APIs**:
  - 🌐 **REST**: TypeScript (MongoDB).
  - ⚙️ **SOAP**: C# (PostgreSQL).
- **Bases de Datos**:
  - 🗃️ **MongoDB**: Base de datos no relacional.
  - 🗃️ **PostgreSQL**: Base de datos relacional.
  - 🗃️ **Redis**: Sistema de cache
- **Orquestación**:
  - 🐳 Kubernetes: Despliegue y gestión de contenedores.
  - 📦 Helm: Instalación de dependencias.

---

## 🚀 Cómo Empezar

### 1. Configurar Namespaces

Primero, crea los namespaces necesarios:
```bash
kubectl create namespace done-dbs
kubectl create namespace done-api
```

### 2. Instalar Dependencias con Helm

#### Repo Bitnami (Repo de helm para instalar todas las bases de datos)
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
```

#### MongoDB (para la API REST)
```bash
helm install done-mongo bitnami/mongodb --namespace done-dbs
```

#### PostgreSQL (para la API SOAP)
```bash
helm install done-postgres bitnami/postgresql --version 16.2.3 -n done-dbs
```

#### Redis (para la cache de la API REST)
```bash
helm install done-redis bitnami/redis --version 20.3.0 -n done-dbs
```

### 3. Crear la tabla tasks en PostgreSQL

Hacer port forward de postgres
```bash
kubectl get pods -n done-dbs
kubectl port-forward -n done-dbs <el-nombre-de-tu-pod-de-mongo> 27017:27017
```

Conectarse a la base de datos y crear la tablas tasks
```sql
CREATE TABLE Tasks(
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    iscompleted BOOLEAN NOT NULL,
    duedate TIMESTAMP NOT NULL
);
```

### 4. Obtener los secretos de las bases de datos

#### Mongo
```bash
kubectl get secret --namespace done-dbs done-mongo-mongodb -o jsonpath="{.data.mongodb-root-password}" | base64 -d
```

#### Postgres
```bash
kubectl get secret --namespace done-dbs done-postgres-postgresql -o jsonpath="{.data.postgres-password}" | base64 -d
```

#### Redis
```bash
kubectl get secret --namespace done-dbs done-redis -o jsonpath="{.data.redis-password}" | base64 -d
```

### 5. Actualizar los secretos

### RestApi

MongoDB
```bash
echo "mongodb://root:<tu-secreto>@done-mongo-mongodb.done-dbs.svc.cluster.local:27017" | base64
```

Redis
```bash
echo "redis://:<tu-secreto>@done-redis-master.done-dbs.svc.cluster.local:6379" | base64
```

### SoapApi

PostgreSQL
```bash
echo "Server=done-postgres-postgresql.done-dbs.svc.cluster.local;Port=5432;Database=postgres;User Id=postgres;Password=<tu-secreto>;" | base64
```

Despues deberas colocar estos secretos en sus respectivos archivos secrets.yml de cada api

### 6. Construir los builds y hacer push

Terminal 1
```bash
docker run --rm -it --network=host alpine ash -c "apk add socat && socat TCP-LISTEN:5000,reuseaddr,fork TCP:host.docker.internal:5000"
```

Terminal 2
```bash
kubectl port-forward --namespace kube-system service/registry 5000:80
```

Terminal 3
```bash
cd SoapApi
docker build -t localhost:5000/tasks-api:1
docker push -t localhost:5000/tasks-api:1
cd ..
cd RestApi
docker build -t localhost:5000/collections-api:1
docker push -t localhost:5000/collections-api:1
```

### 7. Aplicar Archivos YAML en Kubernetes

Asegúrate de que los archivos YAML están en las carpetas correspondientes:

#### API REST
```bash
cd ..
kubectl apply -f RestApi/secrets.yml --namespace done-api
kubectl apply -f RestApi/service.yml --namespace done-api
kubectl apply -f RestApi/deployment.yml --namespace done-api
```

#### API SOAP
```bash
kubectl apply -f SoapApi/secrets.yml --namespace done-api
kubectl apply -f SoapApi/service.yml --namespace done-api
kubectl apply -f SoapApi/deployment.yml --namespace done-api
```

Verifica los recursos:
```bash
kubectl get all -n done-dbs
kubectl get all -n done-api
```

---

## 📁 Estructura del Proyecto

```
final-project-sd/
├── RestApi/           # API REST (TypeScript)
├── SoapApi/           # API SOAP (C#)
└── README.md          # Este archivo
```

---

## 👥 Colaboradores

- ✨ Miguel Angel Balderas Balderas (GitHub: [@mbalderasuaq](https://github.com/mbalderasuaq))
- ✨ Ana María Velázquez Figueroa (GitHub: [@anitavf1](https://github.com/anitavf1))

--- 