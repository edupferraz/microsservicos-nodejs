# Event-Driven Microservices Platform

A scalable event-driven microservices architecture built with Node.js, TypeScript, and deployed on AWS using Pulumi. The system demonstrates modern patterns for building distributed applications with message queuing, observability, and API gateway integration.

## 🏗️ Architecture Overview

This project implements a microservices architecture with the following components:

- **Orders Service** - Handles order creation and management
- **Invoices Service** - Processes invoice generation based on order events
- **RabbitMQ** - Message broker for asynchronous communication
- **Kong API Gateway** - API management and routing
- **PostgreSQL** - Database for each service
- **Jaeger** - Distributed tracing
- **AWS ECS Fargate** - Container orchestration
- **Pulumi** - Infrastructure as Code

## 🚀 Services

### Orders Service (`app-orders`)
- **Port**: 3333
- **Database**: PostgreSQL with Drizzle ORM
- **Features**:
  - Order creation and management
  - Customer management
  - Event publishing to RabbitMQ
  - OpenTelemetry instrumentation

### Invoices Service (`app-invoices`)
- **Port**: 3334
- **Database**: PostgreSQL with Drizzle ORM
- **Features**:
  - Invoice generation from order events
  - Event consumption from RabbitMQ
  - OpenTelemetry instrumentation

## 🛠️ Technology Stack

- **Runtime**: Node.js 22 with TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL with Drizzle ORM
- **Message Broker**: RabbitMQ
- **API Gateway**: Kong
- **Observability**: OpenTelemetry + Jaeger
- **Infrastructure**: AWS ECS Fargate
- **IaC**: Pulumi
- **Containerization**: Docker

## 📋 Prerequisites

- Node.js 22+
- Docker and Docker Compose
- AWS CLI configured
- Pulumi CLI
- pnpm (for infrastructure)

## 🏃‍♂️ Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-driven-microservices
   ```

2. **Start infrastructure services**
   ```bash
   docker-compose up -d
   ```
   This starts:
   - RabbitMQ (Management UI: http://localhost:15672)
   - Jaeger (UI: http://localhost:16686)
   - Kong API Gateway (Admin: http://localhost:8002)

3. **Set up databases**
   ```bash
   # Orders service database
   cd app-orders
   docker-compose up -d
   
   # Invoices service database
   cd ../app-invoices
   docker-compose up -d
   ```

4. **Configure environment variables**
   
   Create `.env` files in each service directory:
   
   **app-orders/.env**:
   ```env
   DATABASE_URL=postgresql://docker:docker@localhost:5482/orders
   BROKER_URL=amqp://guest:guest@localhost:5672
   ```
   
   **app-invoices/.env**:
   ```env
   DATABASE_URL=postgresql://docker:docker@localhost:5483/invoices
   BROKER_URL=amqp://guest:guest@localhost:5672
   ```

5. **Run database migrations**
   ```bash
   # Orders service
   cd app-orders
   npx drizzle-kit push
   
   # Invoices service
   cd ../app-invoices
   npx drizzle-kit push
   ```

6. **Start the services**
   ```bash
   # Terminal 1 - Orders service
   cd app-orders
   npm run dev
   
   # Terminal 2 - Invoices service
   cd app-invoices
   npm run dev
   ```

### Testing the System

1. **Create an order**
   ```bash
   curl -X POST http://localhost:3333/orders \
     -H "Content-Type: application/json" \
     -d '{"amount": 1000}'
   ```

2. **Check RabbitMQ Management UI**
   - Visit http://localhost:15672
   - Login: guest/guest
   - Monitor message flow in the `orders` queue

3. **View traces in Jaeger**
   - Visit http://localhost:16686
   - Search for traces from the `orders` service

## 🚀 Production Deployment

### AWS Infrastructure Setup

1. **Configure AWS credentials**
   ```bash
   aws configure
   ```

2. **Set up Pulumi**
   ```bash
   cd infra
   pnpm install
   pulumi login
   pulumi stack init dev
   ```

3. **Configure secrets**
   ```bash
   # Set required secrets in GitHub
   # AWS_ACCESS_KEY_ID
   # AWS_SECRET_ACCESS_KEY
   # PULUMI_ACCESS_TOKEN
   ```

4. **Deploy infrastructure**
   ```bash
   pulumi up
   ```

### CI/CD Pipeline

The project includes GitHub Actions workflow (`.github/workflows/deploy.yml`) that:
- Builds and pushes Docker images to ECR
- Deploys infrastructure using Pulumi
- Updates ECS services with new images

## 📊 Monitoring & Observability

### OpenTelemetry Integration
Both services are instrumented with OpenTelemetry for:
- Distributed tracing
- HTTP request tracking
- Database query monitoring
- Message queue operations

### Jaeger Tracing
- **Local**: http://localhost:16686
- **Production**: Integrated with Grafana Cloud

### Health Checks
- Orders Service: `GET /health`
- Invoices Service: `GET /health`

## 🗄️ Database Schema

### Orders Service
- **customers**: Customer information
- **orders**: Order records with status tracking

### Invoices Service
- **invoices**: Invoice records linked to orders

## 🔧 Development

### Database Migrations
```bash
# Generate migration
npx drizzle-kit generate

# Apply migration
npx drizzle-kit push

# View database
npx drizzle-kit studio
```

### Message Contracts
Shared message interfaces are defined in the `contracts/` directory to ensure type safety across services.

### Adding New Services
1. Create new service directory following the pattern
2. Add Docker configuration
3. Update `docker-compose.yml`
4. Add Pulumi infrastructure configuration
5. Update Kong routing configuration

## 🐳 Docker Configuration

Each service includes:
- Multi-stage Dockerfile for optimized builds
- Docker Compose for local database setup
- Health checks and proper signal handling

## 🔒 Security Considerations

- Services run as non-root users in containers
- Database connections use environment variables
- Kong provides API gateway security features
- AWS security groups restrict network access

## 📝 API Documentation

### Orders Service

#### Create Order
```http
POST /orders
Content-Type: application/json

{
  "amount": 1000
}
```

#### Health Check
```http
GET /health
```

### Invoices Service

#### Health Check
```http
GET /health
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

1. **Database connection errors**
   - Ensure PostgreSQL containers are running
   - Check connection strings in `.env` files

2. **RabbitMQ connection issues**
   - Verify RabbitMQ container is healthy
   - Check BROKER_URL configuration

3. **Port conflicts**
   - Ensure ports 3333, 3334, 5672, 15672 are available
   - Update port mappings if needed

### Logs
```bash
# View service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f orders
```

## 🔗 Useful Links

- [Fastify Documentation](https://www.fastify.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [RabbitMQ Management](https://www.rabbitmq.com/management.html)
- [Kong Gateway](https://docs.konghq.com/)
- [Pulumi AWS](https://www.pulumi.com/docs/clouds/aws/)
- [OpenTelemetry Node.js](https://opentelemetry.io/docs/languages/js/)