
# AWS Provider Configuration
provider "aws" {
  region = var.aws_region
}

# Terraform Backend Configuration
terraform {
  backend "s3" {
    # These values will be provided during terraform init
    # bucket = "terraform-state-bucket"
    # key    = "jewelry-tracker-hub/terraform.tfstate"
    # region = "us-east-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# VPC and Networking
module "vpc" {
  source = "./modules/vpc"
  
  vpc_name        = "${var.project_name}-vpc"
  vpc_cidr        = var.vpc_cidr
  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs
  
  enable_nat_gateway = true
  single_nat_gateway = var.environment == "production" ? false : true
  
  tags = local.common_tags
}

# MQTT Broker (AWS MQ)
module "mqtt_broker" {
  source = "./modules/mq"
  
  broker_name     = "${var.project_name}-mqtt-broker"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets
  
  admin_username  = var.mqtt_admin_username
  admin_password  = var.mqtt_admin_password
  instance_type   = var.mqtt_instance_type
  deployment_mode = var.environment == "production" ? "ACTIVE_STANDBY_MULTI_AZ" : "SINGLE_INSTANCE"
  
  # Open access only to VPC internal traffic and specific allowed IPs
  allowed_ingress_cidr_blocks = concat([var.vpc_cidr], var.mqtt_allowed_ips)
  allowed_admin_cidr_blocks   = var.mqtt_admin_allowed_ips
  
  # Enable publicly accessible only in dev and staging
  publicly_accessible = var.environment != "production"
  
  tags = local.common_tags
}

# S3 Bucket for File Storage
module "s3" {
  source = "./modules/s3"
  
  bucket_name = "${var.project_name}-files-${var.environment}"
  tags        = local.common_tags
}

# RDS Database
module "rds" {
  source = "./modules/rds"
  
  identifier        = "${var.project_name}-db"
  engine            = "postgres"
  engine_version    = "15.3"
  instance_class    = var.db_instance_class
  allocated_storage = var.db_allocated_storage
  
  db_name     = var.db_name
  db_username = var.db_username
  db_password = var.db_password
  
  vpc_id                    = module.vpc.vpc_id
  subnet_ids                = module.vpc.private_subnets
  vpc_security_group_ids    = [module.security_groups.database_sg_id]
  
  tags = local.common_tags
}

# Security Groups
module "security_groups" {
  source = "./modules/security-groups"
  
  vpc_id      = module.vpc.vpc_id
  project_name = var.project_name
  environment = var.environment
  
  tags = local.common_tags
}

# ECS for Container Hosting
module "ecs" {
  source = "./modules/ecs"
  
  cluster_name = "${var.project_name}-cluster"
  
  vpc_id         = module.vpc.vpc_id
  subnets        = module.vpc.private_subnets
  security_groups = [module.security_groups.app_sg_id]
  
  container_name  = "${var.project_name}-app"
  container_image = var.app_image
  container_port  = var.app_port
  
  environment_variables = [
    { name = "NODE_ENV", value = var.environment },
    { name = "DB_HOST", value = module.rds.db_instance_address },
    { name = "DB_PORT", value = "5432" },
    { name = "DB_NAME", value = var.db_name },
    { name = "DB_USER", value = var.db_username },
    { name = "DB_PASSWORD", value = var.db_password },
    { name = "S3_BUCKET", value = module.s3.bucket_name },
    { name = "MQTT_BROKER_URL", value = split(":", element(module.mqtt_broker.primary_endpoint, 0))[1] },
    { name = "MQTT_PORT", value = "1883" },
    { name = "MQTT_WS_PORT", value = "61619" },
    { name = "MQTT_TLS_PORT", value = "8883" },
    { name = "MQTT_USERNAME", value = var.mqtt_admin_username },
    { name = "MQTT_PASSWORD", value = var.mqtt_admin_password },
    { name = "MQTT_TOPIC_PREFIX", value = var.mqtt_topic_prefix }
  ]
  
  desired_count = var.app_desired_count
  
  tags = local.common_tags
}

# Application Load Balancer
module "alb" {
  source = "./modules/alb"
  
  name            = "${var.project_name}-alb"
  vpc_id          = module.vpc.vpc_id
  subnets         = module.vpc.public_subnets
  security_groups = [module.security_groups.alb_sg_id]
  
  target_groups = [
    {
      name     = "${var.project_name}-tg"
      port     = var.app_port
      protocol = "HTTP"
      health_check = {
        path = "/health"
        port = var.app_port
      }
    }
  ]
  
  http_listeners = [
    {
      port     = 80
      protocol = "HTTP"
      actions = [
        {
          type        = "redirect"
          status_code = "HTTP_301"
          protocol    = "HTTPS"
          port        = "443"
        }
      ]
    }
  ]
  
  https_listeners = [
    {
      port            = 443
      protocol        = "HTTPS"
      certificate_arn = var.certificate_arn
      actions = [
        {
          type               = "forward"
          target_group_index = 0
        }
      ]
    }
  ]
  
  tags = local.common_tags
}

# Route53 Records
module "route53" {
  source = "./modules/route53"
  
  zone_id  = var.hosted_zone_id
  domain_name = var.domain_name
  alb_dns_name = module.alb.dns_name
  alb_zone_id  = module.alb.zone_id
  
  tags = local.common_tags
}

# Local values
locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
