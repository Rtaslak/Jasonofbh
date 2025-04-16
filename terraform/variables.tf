
# General
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "jewelry-tracker-hub"
}

variable "environment" {
  description = "Environment (dev, staging, production)"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

# VPC
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

# MQTT Broker
variable "mqtt_instance_type" {
  description = "Instance type for the MQTT broker"
  type        = string
  default     = "mq.t3.micro"
}

variable "mqtt_admin_username" {
  description = "Admin username for the MQTT broker"
  type        = string
  sensitive   = true
}

variable "mqtt_admin_password" {
  description = "Admin password for the MQTT broker"
  type        = string
  sensitive   = true
}

variable "mqtt_allowed_ips" {
  description = "List of IP addresses allowed to connect to MQTT broker"
  type        = list(string)
  default     = []
}

variable "mqtt_admin_allowed_ips" {
  description = "List of IP addresses allowed to access MQTT admin console"
  type        = list(string)
  default     = []
}

variable "mqtt_topic_prefix" {
  description = "Prefix for MQTT topics"
  type        = string
  default     = "jewelry/rfid/"
}

# Database
variable "db_name" {
  description = "Database name"
  type        = string
  default     = "jewelrytracker"
}

variable "db_username" {
  description = "Database username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.small"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS in GB"
  type        = number
  default     = 20
}

# Application
variable "app_image" {
  description = "Docker image for the application"
  type        = string
  default     = "your-account-id.dkr.ecr.us-east-1.amazonaws.com/jewelry-tracker-hub:latest"
}

variable "app_port" {
  description = "Port the application listens on"
  type        = number
  default     = 8000
}

variable "app_desired_count" {
  description = "Desired count of application tasks"
  type        = number
  default     = 2
}

# DNS and Certificates
variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "app.example.com"
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "ARN of the SSL certificate"
  type        = string
  default     = ""
}
