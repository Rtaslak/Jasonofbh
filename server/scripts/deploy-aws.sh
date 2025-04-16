
#!/bin/bash
# Simple AWS deployment script
# This is a basic example - for production use, consider using CI/CD pipeline

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if we're logged in to AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo "Not logged in to AWS. Please run 'aws configure' first."
    exit 1
fi

# Configuration
ECR_REPOSITORY="jewelry-tracker-api"
CLUSTER_NAME="jewelry-tracker-cluster"
SERVICE_NAME="jewelry-tracker-api-service"
REGION="us-east-1"  # Change to your AWS region

# Build Docker image
echo "Building Docker image..."
docker build -t $ECR_REPOSITORY:latest .

# Get ECR login command
echo "Logging in to Amazon ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com

# Check if repository exists, create if it doesn't
if ! aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $REGION &> /dev/null; then
    echo "Creating ECR repository..."
    aws ecr create-repository --repository-name $ECR_REPOSITORY --region $REGION
fi

# Tag and push image to ECR
echo "Tagging and pushing image to Amazon ECR..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPOSITORY_URI="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPOSITORY"
docker tag $ECR_REPOSITORY:latest $ECR_REPOSITORY_URI:latest
docker push $ECR_REPOSITORY_URI:latest

# Update ECS service
echo "Updating ECS service..."
aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --force-new-deployment --region $REGION

echo "Deployment completed successfully!"
