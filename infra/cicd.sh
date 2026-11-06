#!/usr/bin/env bash
# CD del portafolio: crea (o actualiza) la cuenta portafolio-build y el trigger portafolio-main en
# josecarloscorona-web. Se corre una vez desde Cloud Shell con tu cuenta (las sesiones en la nube no tienen
# llave de este proyecto). Puede correrse de nuevo sin duplicar nada.
# Requiere el repo conectado a Cloud Build con la app de GitHub (región global), ya hecho el 2026-11-06.
set -euo pipefail

PROJECT=josecarloscorona-web
SA=portafolio-build
SA_EMAIL="$SA@$PROJECT.iam.gserviceaccount.com"

gcloud config set project "$PROJECT" >/dev/null

gcloud iam service-accounts describe "$SA_EMAIL" >/dev/null 2>&1 ||
  gcloud iam service-accounts create "$SA" --display-name="Portafolio · Cloud Build (despliegue desde main)"

# Publicar en Hosting, escribir logs y usar las APIs del proyecto; nada más.
for rol in roles/firebasehosting.admin roles/logging.logWriter roles/serviceusage.serviceUsageConsumer; do
  gcloud projects add-iam-policy-binding "$PROJECT" --member="serviceAccount:$SA_EMAIL" \
    --role="$rol" --condition=None --quiet >/dev/null
done

args=(
  --name=portafolio-main
  --description="Despliega josecarloscorona.dev en cada merge a main"
  --region=global
  --repo-owner=Metuendus
  --repo-name=portafolio
  --branch-pattern='^main$'
  --build-config=cloudbuild.yaml
  --ignored-files='README.md,design/**,video/**,.github/**'
  --service-account="projects/$PROJECT/serviceAccounts/$SA_EMAIL"
)

if gcloud builds triggers describe portafolio-main --region=global >/dev/null 2>&1; then
  gcloud builds triggers delete portafolio-main --region=global --quiet
fi
gcloud builds triggers create github "${args[@]}"

gcloud builds triggers list --region=global --format="table(name,github.push.branch,serviceAccount)"
