locals {
  tf_state_name = "platform/static/development/connect-demo"

  environment  = "development"
  service_name = "connect-demo"
}

terraform {
  backend "s3" {
    bucket = "creditkudos-terraform-state"
    key    = "platform/static/development/connect-demo.tfstate"
    region = "eu-west-1"
  }

  required_version = "0.12.24"
}

provider "aws" {
  region  = "eu-west-1"
  version = "2.46.0"
}

module "context" {
  source = "git@github.com:creditkudos/infrastructure.git//_lib/context/v1"

  environment  = local.environment
  service_name = local.service_name
  state        = local.tf_state_name
}
