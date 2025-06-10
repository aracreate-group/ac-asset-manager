terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.45"
    }
  }
}

provider "hcloud" {
  token = var.hcloud_token
}

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

data "hcloud_ssh_key" "existing" {
  name       = "gowtham@ac-sys-001.local"
}

resource "hcloud_server" "k3s_master" {
  name        = "k3s-master"
  server_type = "cpx21"
  image       = "ubuntu-24.04"
  location    = "nbg1"
  ssh_keys    = [data.hcloud_ssh_key.existing.id]

  network {
    network_id = hcloud_network.k8s_network.id
  }

 user_data = templatefile("${path.module}/cloud-init.yml", {
  node_type  = "server"
  is_first   = "true" # or "false" for secondary masters/workers
  k3s_token  = var.k3s_token
  master_ip  = ""
})

  depends_on = [
    hcloud_network_subnet.k8s_subnet
  ]
}

resource "hcloud_server" "k3s_workers" {
  count       = 1
  name        = "k3s-worker-${count.index + 1}"
  server_type = "cpx11"
  image       = "ubuntu-24.04"
  location    = "nbg1"
  ssh_keys    = [data.hcloud_ssh_key.existing.id]

  network {
    network_id = hcloud_network.k8s_network.id
  }

user_data = templatefile("${path.module}/cloud-init.yml", {
  node_type  = "server"
  is_first   = "false" # or "false" for secondary masters/workers
  k3s_token  = var.k3s_token
  master_ip  = hcloud_server.k3s_master.ipv4_address
})

  depends_on = [
    hcloud_server.k3s_master,
    hcloud_network_subnet.k8s_subnet
  ]
}

output "master_ip" {
  value     = hcloud_server.k3s_master.ipv4_address
  sensitive = false
}

output "worker_ips" {
  value     = hcloud_server.k3s_workers[*].ipv4_address
  sensitive = false
}

variable "hcloud_token" {
  description = "Hetzner Cloud API token"
  type        = string
  sensitive   = true
}

variable "k3s_token" {
  description = "K3s cluster token"
  type        = string
  sensitive   = true
}