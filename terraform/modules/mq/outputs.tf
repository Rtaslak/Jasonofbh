
output "broker_id" {
  description = "The ID of the broker"
  value       = aws_mq_broker.mqtt_broker.id
}

output "broker_arn" {
  description = "The ARN of the broker"
  value       = aws_mq_broker.mqtt_broker.arn
}

output "broker_instances" {
  description = "The list of broker instances (hostname, endpoints, etc.)"
  value       = aws_mq_broker.mqtt_broker.instances
}

output "primary_endpoint" {
  description = "The primary MQTT endpoint URL"
  value       = [for instance in aws_mq_broker.mqtt_broker.instances : instance.endpoints if instance.endpoints != null][0]
}

output "websocket_endpoint" {
  description = "The WebSocket endpoint URL for browser clients"
  value       = "ws://${aws_mq_broker.mqtt_broker.instances[0].ip_address}:${var.mqtt_ws_port}"
}

output "security_group_id" {
  description = "The ID of the security group for the broker"
  value       = aws_security_group.mq_security_group.id
}

output "mqtt_configuration" {
  description = "MQTT broker configuration details for clients"
  value = {
    broker_url: aws_mq_broker.mqtt_broker.instances[0].ip_address
    port: var.mqtt_tls_port
    ws_port: var.mqtt_ws_port
    topic_prefix: var.mqtt_topic_prefix
    use_tls: true
  }
}
