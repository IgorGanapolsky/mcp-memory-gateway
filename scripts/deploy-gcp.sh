#!/bin/bash
# GSD: Deploy RLHF Control Plane to Google Cloud Run

PROJECT_ID=$(gcloud config get-value project)
SERVICE_NAME="rlhf-control-plane"
REGION="us-central1"

echo "🚀 Deploying Agentic Control Plane to $REGION..."

gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars RLHF_ALLOW_INSECURE=true

echo "✅ Success! Your Control Plane is live."
gcloud run services describe $SERVICE_NAME --region $REGION --format='value(status.url)'
