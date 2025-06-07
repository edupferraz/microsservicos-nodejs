import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import { cluster } from "../cluster";
import { ordersDockerImage } from "../images/orders";
import { amqpListener, rabbitMQAdminHttpListener } from "./rabbitmq";
import { appLoadBalancer } from "../load-balancer";

const ordersTargetGroup = appLoadBalancer.createTargetGroup('orders-target', {
    port: 3333,
    protocol: 'HTTP',
    healthCheck: {
        path: '/health',
        protocol: 'HTTP',
    }
})

export const ordersHttpListener = appLoadBalancer.createListener('orders-listener', {
    port: 3333,
    protocol: 'HTTP',
    targetGroup: ordersTargetGroup,
})

export const ordersService = new awsx.classic.ecs.FargateService('fargate-orders', {
    cluster,
    desiredCount: 1,
    waitForSteadyState: false,
    taskDefinitionArgs: {
        container: {
            image: ordersDockerImage.ref,
            cpu: 256,
            memory: 512,
            portMappings: [
                ordersHttpListener
            ],
            environment: [
                {
                    name: 'BROKER_URL',
                    value: pulumi.interpolate`amqp://guest:guest@${amqpListener.endpoint.hostname}:${amqpListener.endpoint.port}`
                },
                {
                    name: 'DATABASE_URL',
                    value: 'postgresql://orders_owner:npg_PaiucISp3Vk4@ep-autumn-frog-a4ot41gm.us-east-1.aws.neon.tech/orders?sslmode=require'
                },
                {
                    name: "OTEL_TRACES_EXPORTER",
                    value: "otlp"
                },
                {
                    name: "OTEL_EXPORTER_OTLP_ENDPOINT",
                    value: "https://otlp-gateway-prod-sa-east-1.grafana.net/otlp"
                },
                {
                    name: "OTEL_EXPORTER_OTLP_HEADERS",
                    value: "Authorization=Basic MTI4MjIyNjpnbGNfZXlKdklqb2lNVFExTWpJNU9DSXNJbTRpT2lKemRHRmpheTB4TWpneU1qSTJMVzkwWld3dGIyNWliMkZ5WkdsdVp5MWxkbVZ1ZEMxdWIyUmxJaXdpYXlJNkluazNORXcwTjJsd1RVd3pNbWMxTjB3d1RGWkpTV3M0UXlJc0ltMGlPbnNpY2lJNkluQnliMlF0YzJFdFpXRnpkQzB4SW4xOQ=="
                },
                {
                    name: "OTEL_RESOURCE_ATTRIBUTES",
                    value: "service.name=orders,service.namespace=event-node,deployment.environment=production"
                },
                {
                    name: "OTEL_NODE_RESOURCE_DETECTORS",
                    value: "env,host,os"
                },
                {
                    name: "OTEL_SERVICE_NAME",
                    value: "orders"
                },
                {
                    name: 'OTEL_NODE_ENABLED_INSTRUMENTATIONS',
                    value: 'http,fastify,pg,amqplib'
                }
            ],
        }
    }
})