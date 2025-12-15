# AWS Lambda Function - Mark Hero as Done

Esta es una Cloud Function (AWS Lambda) para marcar un héroe como completado.

## Estructura

```
lambda/
  markHeroDone/
    index.js          # Código de la función Lambda
    package.json      # Dependencias
```

## Despliegue en AWS Lambda

### Opción 1: Usando AWS CLI

1. Instala AWS CLI si no lo tienes:
   ```bash
   brew install awscli
   ```

2. Configura tus credenciales:
   ```bash
   aws configure
   ```

3. Crea un archivo ZIP con la función:
   ```bash
   cd lambda/markHeroDone
   npm install
   zip -r function.zip index.js package.json node_modules/
   ```

4. Crea la función Lambda:
   ```bash
   aws lambda create-function \
     --function-name markHeroDone \
     --runtime nodejs18.x \
     --role arn:aws:iam::TU_ACCOUNT_ID:role/lambda-execution-role \
     --handler index.handler \
     --zip-file fileb://function.zip \
     --environment Variables="{MONGODB_URI=tu_connection_string}"
   ```

### Opción 2: Usando la Consola de AWS

1. Ve a AWS Lambda en la consola
2. Crea una nueva función
3. Sube el código desde `lambda/markHeroDone/index.js`
4. Configura las variables de entorno (MONGODB_URI)
5. Asigna un rol de ejecución con permisos necesarios

## Configuración en el Backend

Agrega al `.env` del backend:

```env
MARK_HERO_DONE_LAMBDA_FUNCTION=markHeroDone
AWS_REGION=us-east-1
```

## Alternativa: Web Service

Si prefieres no usar Lambda, puedes crear un servicio web separado que haga lo mismo.

