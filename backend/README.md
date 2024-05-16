## Deploy to GCP

`docker buildx build . -t us-east1-docker.pkg.dev/hackathon-cohere/lablabai-face-off/lablabai-face-off:1 --build-arg app=lablabai-face-off --platform linux/amd64 --load`

`docker push us-east1-docker.pkg.dev/hackathon-cohere/lablabai-face-off/lablabai-face-off:1`


`gcloud run deploy lablabai-face-off \
--image=us-east1-docker.pkg.dev/hackathon-cohere/lablabai-face-off/lablabai-face-off@sha256:21630a45e5fd35a6c5862223f889fbb19a8f86f2aa3e1f80d4fbe138bbfff58a \
--set-env-vars=API_KEY=cualquiercosa \
--region=us-central1 \
--project=hackathon-cohere \
 && gcloud run services update-traffic lablabai-face-off --to-latest`