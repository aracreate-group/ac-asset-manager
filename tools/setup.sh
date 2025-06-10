# #!/bin/bash
# set -e

# # Install dependencies
# echo "Installing dependencies..."
# pnpm install

# # Build shared packages
# echo "Building shared packages..."
# pnpm build

# # Setup database
# # echo "Setting up database..."
# # pnpm db:setup

# # Start development environment
# echo "Starting development environment..."
# pnpm dev

# !/bin/bash
# deploy-k3s-env.sh
# Usage: ./deploy-k3s-env.sh <env> <domain>

set -e

ENV=$1
DOMAIN=$2
EMAIL="admin@$DOMAIN"

# Validate input
echo "Starting setup for $ENV ($DOMAIN)"
if [[ -z "$ENV" || -z "$DOMAIN" ]]; then
  echo "Usage: $0 <env> <domain>"
  exit 1
fi

# Define server plan based on environment
case "$ENV" in
  dev|test)
    SERVER_TYPE="cx21"
    ;;
  staging)
    SERVER_TYPE="cx31"
    ;;
  prod)
    SERVER_TYPE="cx41"
    ;;
  *)
    echo "Invalid environment: $ENV"
    exit 1
    ;;
esac

# Setup
SERVER_NAME="k3s-$ENV"
USER_DATA_FILE="cloud-init-$ENV.yaml"

# Generate cloud-init file
cat > $USER_DATA_FILE <<EOF
#cloud-config
package_update: true
packages:
  - curl
  - jq
write_files:
  - path: /root/install.sh
    permissions: '0755'
    content: |
      #!/bin/bash
      curl -sfL https://get.k3s.io | sh -s - --disable traefik
      sleep 10
      kubectl apply -f https://github.com/metallb/metallb/releases/download/v0.13.7/metallb-native.yaml
      sleep 15
      IP=$(curl -s http://169.254.169.254/hetzner/v1/metadata/public-ipv4)
      cat <<EOF2 | kubectl apply -f -
      apiVersion: metallb.io/v1beta1
      kind: IPAddressPool
      metadata:
        name: pool
        namespace: metallb-system
      spec:
        addresses:
        - $IP/32
      ---
      apiVersion: metallb.io/v1beta1
      kind: L2Advertisement
      metadata:
        name: advert
        namespace: metallb-system
      spec:
        ipAddressPools:
        - pool
EOF2
      helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
      helm repo update
      helm install ingress-nginx ingress-nginx/ingress-nginx \
        --set controller.service.type=LoadBalancer \
        --set controller.service.externalTrafficPolicy=Local
      kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml
      sleep 10
      cat <<EOF3 | kubectl apply -f -
      apiVersion: cert-manager.io/v1
      kind: ClusterIssuer
      metadata:
        name: letsencrypt-prod
      spec:
        acme:
          server: https://acme-v02.api.letsencrypt.org/directory
          email: $EMAIL
          privateKeySecretRef:
            name: letsencrypt-prod
          solvers:
          - http01:
              ingress:
                class: nginx
EOF3
      sed "s/127.0.0.1/$IP/g" /etc/rancher/k3s/k3s.yaml > /root/kubeconfig.yaml
      echo "Cluster ready. Access using kubeconfig.yaml"
runcmd:
  - bash /root/install.sh
EOF

# Create server
hcloud server create \
  --name $SERVER_NAME \
  --type $SERVER_TYPE \
  --image ubuntu-22.04 \
  --ssh-key your-key-name \
  --user-data-from-file $USER_DATA_FILE

# Wait until server is up
while ! hcloud server describe $SERVER_NAME | grep -q "running"; do sleep 5; done
IP=$(hcloud server describe $SERVER_NAME -o json | jq -r '.public_net.ipv4.ip')
echo "Server $SERVER_NAME is ready at $IP"
echo "Update your DNS to point $DOMAIN to $IP"
echo "You can get the kubeconfig using:"
echo "scp root@$IP:/root/kubeconfig.yaml ~/.kube/config-$ENV"
