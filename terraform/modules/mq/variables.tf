
variable "broker_name" {
  description = "Name of the MQTT broker"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where the broker will be deployed"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the broker deployment"
  type        = list(string)
}

variable "engine_version" {
  description = "ActiveMQ engine version"
  type        = string
  default     = "5.17.6" # Current ActiveMQ version supported by AWS MQ
}

variable "instance_type" {
  description = "Instance type for the broker"
  type        = string
  default     = "mq.t3.micro"
}

variable "admin_username" {
  description = "Username for the admin user"
  type        = string
  sensitive   = true
}

variable "admin_password" {
  description = "Password for the admin user"
  type        = string
  sensitive   = true
}

variable "deployment_mode" {
  description = "Deployment mode for the broker (SINGLE_INSTANCE, ACTIVE_STANDBY_MULTI_AZ)"
  type        = string
  default     = "SINGLE_INSTANCE"
}

variable "publicly_accessible" {
  description = "Whether the broker should be publicly accessible"
  type        = bool
  default     = false
}

variable "mqtt_port" {
  description = "Port for MQTT traffic"
  type        = number
  default     = 1883
}

variable "mqtt_tls_port" {
  description = "Port for MQTT over TLS"
  type        = number
  default     = 8883
}

variable "mqtt_ws_port" {
  description = "Port for MQTT over WebSockets"
  type        = number
  default     = 61619
}

variable "mqtt_wss_port" {
  description = "Port for MQTT over WebSockets with TLS"
  type        = number
  default     = 61618
}

variable "web_console_port" {
  description = "Port for web console access"
  type        = number
  default     = 8162
}

variable "allowed_ingress_cidr_blocks" {
  description = "List of CIDR blocks allowed to connect to the broker"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "allowed_admin_cidr_blocks" {
  description = "List of CIDR blocks allowed to access the admin console"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "maintenance_day_of_week" {
  description = "Day of the week for maintenance window"
  type        = string
  default     = "SUNDAY"
}

variable "maintenance_time_of_day" {
  description = "Time of day for maintenance window (HH:MM)"
  type        = string
  default     = "02:00"
}

variable "maintenance_time_zone" {
  description = "Time zone for maintenance window"
  type        = string
  default     = "UTC"
}

variable "use_custom_kms_key" {
  description = "Whether to use a custom KMS key for encryption"
  type        = bool
  default     = false
}

variable "kms_key_id" {
  description = "KMS key ID for encryption if use_custom_kms_key is true"
  type        = string
  default     = null
}

variable "enable_audit_logs" {
  description = "Whether to enable audit logs"
  type        = bool
  default     = false
}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}

variable "mqtt_topic_prefix" {
  description = "Topic prefix for MQTT messages"
  type        = string
  default     = "jewelry/rfid/"
}
