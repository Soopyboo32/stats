# Auth
echo "$CRED" > /secrets.json
gcloud auth activate-service-account --key-file=/secrets.json
rm /secrets.json

gcloud compute url-maps invalidate-cdn-cache stats-web-balancer-2 --path "/*"