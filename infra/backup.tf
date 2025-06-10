# main.tf
terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.45"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.12"
    }
  }
}

# Configure Hetzner Cloud provider
provider "hcloud" {
  token = var.hcloud_token
}

# Create a Kubernetes cluster
resource "hcloud_network" "k8s_network" {
  name     = "k8s-network"
  ip_range = "10.0.0.0/16"
}

resource "hcloud_network_subnet" "k8s_subnet" {
  network_id   = hcloud_network.k8s_network.id
  type         = "cloud"
  network_zone = "eu-central"
  ip_range     = "10.0.1.0/24"
}

resource "hcloud_load_balancer" "ingress_lb" {
  name               = "ingress-lb"
  load_balancer_type = "lb11"
  location           = "fsn1"
  algorithm {
    type = "round_robin"
  }
}

resource "hcloud_load_balancer_network" "ingress_lb_network" {
  load_balancer_id = hcloud_load_balancer.ingress_lb.id
  network_id       = hcloud_network.k8s_network.id
  ip               = "10.0.1.5"
}

resource "hcloud_kubernetes_cluster" "k8s_cluster" {
  name         = "saas-platform"
  network_id   = hcloud_network.k8s_network.id
  location     = "fsn1"
  ha_control_planes = false

  default_node_pool {
    name       = "worker-pool"
    node_type  = "cx21"
    min_nodes  = 3
    max_nodes  = 5
  }
}

# Configure Kubernetes provider
provider "kubernetes" {
  host                   = hcloud_kubernetes_cluster.k8s_cluster.kubeconfig.0.host
  client_certificate     = base64decode(hcloud_kubernetes_cluster.k8s_cluster.kubeconfig.0.client_certificate)
  client_key             = base64decode(hcloud_kubernetes_cluster.k8s_cluster.kubeconfig.0.client_key)
  cluster_ca_certificate = base64decode(hcloud_kubernetes_cluster.k8s_cluster.kubeconfig.0.cluster_ca_certificate)
}

provider "helm" {
  kubernetes {
    host                   = hcloud_kubernetes_cluster.k8s_cluster.kubeconfig.0.host
    client_certificate     = base64decode(hcloud_kubernetes_cluster.k8s_cluster.kubeconfig.0.client_certificate)
    client_key             = base64decode(hcloud_kubernetes_cluster.k8s_cluster.kubeconfig.0.client_key)
    cluster_ca_certificate = base64decode(hcloud_kubernetes_cluster.k8s_cluster.kubeconfig.0.cluster_ca_certificate)
  }
}

# Install MetalLB for LoadBalancer IP allocation
resource "helm_release" "metallb" {
  name       = "metallb"
  repository = "https://metallb.github.io/metallb"
  chart      = "metallb"
  namespace  = "metallb-system"
  create_namespace = true

  set {
    name  = "speaker.frr.enabled"
    value = "true"
  }
}

# Configure MetalLB IP pool
resource "kubernetes_manifest" "metallb_ip_pool" {
  manifest = {
    apiVersion = "metallb.io/v1beta1"
    kind       = "IPAddressPool"
    metadata = {
      name      = "default-pool"
      namespace = "metallb-system"
    }
    spec = {
      addresses = [
        "10.0.1.100-10.0.1.200"
      ]
    }
  }
}

resource "kubernetes_manifest" "metallb_l2_advertisement" {
  manifest = {
    apiVersion = "metallb.io/v1beta1"
    kind       = "L2Advertisement"
    metadata = {
      name      = "default"
      namespace = "metallb-system"
    }
    spec = {
      ipAddressPools = ["default-pool"]
    }
  }
}

# Install Nginx Ingress Controller
resource "helm_release" "nginx_ingress" {
  name       = "nginx-ingress"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = "ingress-nginx"
  create_namespace = true

  set {
    name  = "controller.service.type"
    value = "LoadBalancer"
  }
  set {
    name  = "controller.service.annotations.metallb\\.universe\\.tf/address-pool"
    value = "default-pool"
  }
}

# Install Cert-Manager for TLS certificates
resource "helm_release" "cert_manager" {
  name       = "cert-manager"
  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"
  namespace  = "cert-manager"
  create_namespace = true

  set {
    name  = "installCRDs"
    value = "true"
  }
}

# Configure Let's Encrypt ClusterIssuer
resource "kubernetes_manifest" "letsencrypt_issuer" {
  manifest = {
    apiVersion = "cert-manager.io/v1"
    kind       = "ClusterIssuer"
    metadata = {
      name = "letsencrypt-prod"
    }
    spec = {
      acme = {
        server = "https://acme-v02.api.letsencrypt.org/directory"
        email  = var.letsencrypt_email
        privateKeySecretRef = {
          name = "letsencrypt-prod"
        }
        solvers = [{
          http01 = {
            ingress = {
              class = "nginx"
            }
          }
        }]
      }
    }
  }
}

# variables.tf
variable "hcloud_token" {
  description = "Hetzner Cloud API token"
  type        = string
  sensitive   = true
}

variable "letsencrypt_email" {
  description = "Email for Let's Encrypt account"
  type        = string
}