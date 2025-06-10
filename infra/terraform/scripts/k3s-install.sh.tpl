#!/bin/bash
set -e

until ip -4 addr show eth0 | grep -q "inet "; do
  echo "Waiting for eth0 to be ready..."
  sleep 2
done

EXTERNAL_IP=$(curl -s https://ipinfo.io/ip)
PRIVATE_IP=$(ip -4 addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}')

echo "External IP: $EXTERNAL_IP"
echo "Private IP: $PRIVATE_IP"

if [ "${node_type}" = "server" ] && [ "${is_first}" = "true" ]; then
  curl -sfL https://get.k3s.io | sh -s - server \
    --token=${k3s_token} \
    --tls-san=$EXTERNAL_IP \
    --node-ip=$PRIVATE_IP \
    --cluster-init \
    --disable servicelb \
    --disable traefik >> /var/log/k3s-install.log 2>&1

  ln -s /usr/local/bin/k3s /usr/local/bin/kubectl
  bash /usr/local/bin/setup-metallb.sh $EXTERNAL_IP

elif [ "${node_type}" = "server" ]; then
  curl -sfL https://get.k3s.io | sh -s - server \
    --token=${k3s_token} \
    --tls-san=$EXTERNAL_IP \
    --node-ip=$PRIVATE_IP \
    --server https://${master_ip}:6443 \
    --disable servicelb \
    --disable traefik >> /var/log/k3s-install.log 2>&1

  ln -s /usr/local/bin/k3s /usr/local/bin/kubectl
fi
