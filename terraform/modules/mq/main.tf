
resource "aws_security_group" "mq_security_group" {
  name        = "${var.broker_name}-sg"
  description = "Security group for MQTT broker"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = var.mqtt_port
    to_port     = var.mqtt_port
    protocol    = "tcp"
    cidr_blocks = var.allowed_ingress_cidr_blocks
    description = "MQTT traffic"
  }

  ingress {
    from_port   = var.mqtt_tls_port
    to_port     = var.mqtt_tls_port
    protocol    = "tcp"
    cidr_blocks = var.allowed_ingress_cidr_blocks
    description = "MQTT over TLS"
  }

  ingress {
    from_port   = var.mqtt_ws_port
    to_port     = var.mqtt_ws_port
    protocol    = "tcp"
    cidr_blocks = var.allowed_ingress_cidr_blocks
    description = "MQTT over WebSockets"
  }

  ingress {
    from_port   = var.web_console_port
    to_port     = var.web_console_port
    protocol    = "tcp"
    cidr_blocks = var.allowed_admin_cidr_blocks
    description = "Web console access"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.broker_name}-sg"
    }
  )
}

resource "aws_mq_broker" "mqtt_broker" {
  broker_name        = var.broker_name
  engine_type        = "ACTIVEMQ"
  engine_version     = var.engine_version
  host_instance_type = var.instance_type
  security_groups    = [aws_security_group.mq_security_group.id]
  subnet_ids         = var.subnet_ids

  user {
    username = var.admin_username
    password = var.admin_password
  }

  configuration {
    id       = aws_mq_configuration.mqtt_config.id
    revision = aws_mq_configuration.mqtt_config.latest_revision
  }

  encryption_options {
    use_aws_owned_key = !var.use_custom_kms_key
    kms_key_id        = var.use_custom_kms_key ? var.kms_key_id : null
  }

  maintenance_window_start_time {
    day_of_week = var.maintenance_day_of_week
    time_of_day = var.maintenance_time_of_day
    time_zone   = var.maintenance_time_zone
  }

  publicly_accessible = var.publicly_accessible
  deployment_mode     = var.deployment_mode

  logs {
    general = true
    audit   = var.enable_audit_logs
  }

  tags = var.tags

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_mq_configuration" "mqtt_config" {
  name           = "${var.broker_name}-config"
  engine_type    = "ACTIVEMQ"
  engine_version = var.engine_version
  
  data = <<DATA
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<broker xmlns="http://activemq.apache.org/schema/core">
  <plugins>
    <forcePersistencyModeBrokerPlugin persistenceFlag="true"/>
    <statisticsBrokerPlugin/>
    <timeStampingBrokerPlugin ttlCeiling="86400000" zeroExpirationOverride="86400000"/>
  </plugins>
  <transportConnectors>
    <transportConnector name="openwire" uri="tcp://0.0.0.0:61616?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600"/>
    <transportConnector name="amqp" uri="amqp://0.0.0.0:5672?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600"/>
    <transportConnector name="stomp" uri="stomp://0.0.0.0:61613?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600"/>
    <transportConnector name="mqtt" uri="mqtt://0.0.0.0:${var.mqtt_port}?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600"/>
    <transportConnector name="ws" uri="ws://0.0.0.0:${var.mqtt_ws_port}?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600"/>
  </transportConnectors>
</broker>
DATA

  tags = var.tags
}
