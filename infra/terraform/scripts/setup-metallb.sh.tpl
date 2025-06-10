#!/bin/bash
set -e

EXTERNAL_IP=$(curl -s -m 5 https://ipinfo.io/ip)
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

echo "Installing MetalLB..."
kubectl apply -f https://github.com/metallb/metallb/releases/download/v0.13.7/metallb-native.yaml
kubectl wait --namespace metallb-system --for=condition=ready pod --selector=app=metallb --timeout=90s

cat <<EOF | kubectl apply -f -
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: default-pool
  namespace: metallb-system
spec:
  addresses:
  - $EXTERNAL_IP/32
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: default-advert
  namespace: metallb-system
spec:
  ipAddressPools:
  - default-pool
EOF
