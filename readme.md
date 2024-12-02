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

#### MongoDB (para la API REST)
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install mongodb bitnami/mongodb --namespace done-dbs
```

#### PostgreSQL (para la API SOAP)
```bash
helm install postgresql bitnami/postgresql --namespace done-dbs
```

### 3. Aplicar Archivos YAML en Kubernetes

Asegúrate de que los archivos YAML están en las carpetas correspondientes:

#### API REST
```bash
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