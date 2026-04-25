import { useState } from 'react';

const ARCHITECTURES = [
  {
    id: 'three-tier',
    name: '3-Tier Web App',
    icon: '🏗️',
    nodes: [
      { icon: '👤', label: 'Users', sub: 'Browser', color: 'var(--aws-teal)', bg: 'var(--aws-teal-dim)' },
      { icon: '🚀', label: 'CloudFront', sub: 'CDN', color: 'var(--aws-purple)', bg: 'var(--aws-purple-dim)' },
      { icon: '⚖️', label: 'ALB', sub: 'Load Balancer', color: 'var(--aws-purple)', bg: 'var(--aws-purple-dim)' },
      { icon: '🖥️', label: 'EC2 / ECS', sub: 'App Servers', color: 'var(--aws-orange)', bg: 'var(--aws-orange-dim)' },
      { icon: '🗄️', label: 'RDS', sub: 'Database', color: 'var(--aws-blue)', bg: 'var(--aws-blue-dim)' },
    ],
    description: 'The classic 3-tier architecture separates presentation (frontend), application logic (backend), and data storage (database) into distinct layers. This makes each tier independently scalable and maintainable.',
    services: ['CloudFront', 'ALB', 'EC2', 'ECS', 'RDS', 'S3', 'Route 53'],
    steps: [
      'User requests hit CloudFront CDN, which caches static assets at edge locations for low latency.',
      'Dynamic requests pass through Application Load Balancer, which distributes across multiple targets.',
      'EC2 or ECS containers run your application code in private subnets across multiple AZs.',
      'App servers read/write to RDS Multi-AZ database for high availability and automatic failover.',
      'Static files (images, CSS, JS) are stored in S3 and served via CloudFront.',
    ]
  },
  {
    id: 'serverless',
    name: 'Serverless API',
    icon: '⚡',
    nodes: [
      { icon: '📱', label: 'Client', sub: 'Mobile/Web', color: 'var(--aws-teal)', bg: 'var(--aws-teal-dim)' },
      { icon: '🚪', label: 'API Gateway', sub: 'REST/HTTP', color: 'var(--aws-purple)', bg: 'var(--aws-purple-dim)' },
      { icon: 'λ', label: 'Lambda', sub: 'Functions', color: 'var(--aws-orange)', bg: 'var(--aws-orange-dim)' },
      { icon: '⚡', label: 'DynamoDB', sub: 'NoSQL DB', color: 'var(--aws-blue)', bg: 'var(--aws-blue-dim)' },
    ],
    description: 'A fully serverless architecture with zero server management. API Gateway handles HTTP requests, Lambda runs business logic, and DynamoDB stores data. You only pay when requests are made — perfect for startups and variable workloads.',
    services: ['API Gateway', 'Lambda', 'DynamoDB', 'Cognito', 'S3', 'CloudWatch'],
    steps: [
      'Client sends HTTP request to API Gateway endpoint (GET /users, POST /orders, etc.).',
      'API Gateway validates the request, checks authentication (Cognito/API keys), and routes to Lambda.',
      'Lambda function executes business logic — no servers to manage, auto-scales from 0 to thousands.',
      'Lambda reads/writes data to DynamoDB tables with single-digit millisecond latency.',
      'Response flows back: DynamoDB → Lambda → API Gateway → Client. Total time: ~50-200ms.',
    ]
  },
  {
    id: 'static-site',
    name: 'Static Website',
    icon: '🌐',
    nodes: [
      { icon: '👤', label: 'Users', sub: 'Global', color: 'var(--aws-teal)', bg: 'var(--aws-teal-dim)' },
      { icon: '🌐', label: 'Route 53', sub: 'DNS', color: 'var(--aws-purple)', bg: 'var(--aws-purple-dim)' },
      { icon: '🚀', label: 'CloudFront', sub: 'CDN', color: 'var(--aws-purple)', bg: 'var(--aws-purple-dim)' },
      { icon: '🪣', label: 'S3', sub: 'HTML/CSS/JS', color: 'var(--aws-green)', bg: 'var(--aws-green-dim)' },
    ],
    description: 'Host a blazing-fast static website (React, Next.js, HTML) on S3 + CloudFront. Route 53 manages DNS, CloudFront caches globally, and S3 stores files. Costs pennies per month for most sites.',
    services: ['Route 53', 'CloudFront', 'S3', 'ACM (SSL)'],
    steps: [
      'User types your domain (e.g. myapp.com). Route 53 resolves DNS to CloudFront distribution.',
      'CloudFront checks if the content is cached at the nearest edge location (450+ worldwide).',
      'If cached → serve instantly. If not → fetch from S3 bucket origin, cache it, then serve.',
      'S3 stores your index.html, CSS, JS, images. Configured as a static website with public access.',
      'ACM provides free SSL certificate for HTTPS. Auto-renews. Zero configuration hassle.',
    ]
  },
  {
    id: 'microservices',
    name: 'Microservices',
    icon: '🧩',
    nodes: [
      { icon: '⚖️', label: 'ALB', sub: 'Ingress', color: 'var(--aws-purple)', bg: 'var(--aws-purple-dim)' },
      { icon: '📦', label: 'ECS', sub: 'Service A', color: 'var(--aws-orange)', bg: 'var(--aws-orange-dim)' },
      { icon: '📦', label: 'ECS', sub: 'Service B', color: 'var(--aws-orange)', bg: 'var(--aws-orange-dim)' },
      { icon: '📬', label: 'SQS', sub: 'Queue', color: 'var(--aws-amber)', bg: 'var(--aws-amber-dim)' },
      { icon: '📦', label: 'ECS', sub: 'Worker', color: 'var(--aws-orange)', bg: 'var(--aws-orange-dim)' },
    ],
    description: 'Break your monolith into independent microservices running as containers in ECS. Services communicate via ALB (synchronous) and SQS (asynchronous). Each service scales independently based on its own load.',
    services: ['ECS Fargate', 'ALB', 'SQS', 'SNS', 'ECR', 'CloudWatch', 'Service Discovery'],
    steps: [
      'ALB routes requests to different ECS services based on URL path (/api/users → Service A, /api/orders → Service B).',
      'Each ECS service runs in its own Fargate task — independent scaling, deployment, and technology stack.',
      'For async tasks (email, reports), services push messages to SQS queues instead of blocking.',
      'Worker services poll SQS and process tasks in the background. Failed messages go to Dead Letter Queue.',
      'SNS provides event fan-out — one event can trigger multiple subscribers (Lambda, SQS, HTTP).',
    ]
  },
  {
    id: 'data-pipeline',
    name: 'Data Pipeline',
    icon: '📊',
    nodes: [
      { icon: '📥', label: 'Data Sources', sub: 'Logs/Events', color: 'var(--aws-teal)', bg: 'var(--aws-teal-dim)' },
      { icon: '🪣', label: 'S3', sub: 'Data Lake', color: 'var(--aws-green)', bg: 'var(--aws-green-dim)' },
      { icon: 'λ', label: 'Lambda', sub: 'Transform', color: 'var(--aws-orange)', bg: 'var(--aws-orange-dim)' },
      { icon: '🗄️', label: 'Redshift', sub: 'Warehouse', color: 'var(--aws-blue)', bg: 'var(--aws-blue-dim)' },
      { icon: '📊', label: 'QuickSight', sub: 'Dashboards', color: 'var(--aws-pink)', bg: 'var(--aws-pink-dim)' },
    ],
    description: 'Ingest data from multiple sources into an S3 data lake. Transform it with Lambda or Glue, load into Redshift data warehouse, and visualize with QuickSight dashboards. Fully managed and serverless.',
    services: ['S3', 'Lambda', 'Glue', 'Redshift', 'QuickSight', 'Kinesis', 'Athena'],
    steps: [
      'Data streams in from applications, IoT devices, or databases into S3 (raw data lake).',
      'S3 events trigger Lambda functions that clean, validate, and transform the raw data.',
      'Transformed data lands in S3 "processed" prefix — partitioned by date for efficient querying.',
      'AWS Glue crawlers catalog the data. Athena lets you query S3 directly with SQL.',
      'For heavy analytics, data loads into Redshift. QuickSight connects for interactive dashboards.',
    ]
  }
];

export default function ArchitectureLab() {
  const [selected, setSelected] = useState(ARCHITECTURES[0]);

  return (
    <div className="tool-panel" id="architecture-panel">
      <div className="panel-header">
        <h2>🏗️ Visual <span className="gradient-text">Architecture Lab</span></h2>
        <p>Explore common AWS architecture patterns with animated data flow diagrams</p>
      </div>

      <div className="arch-selector">
        {ARCHITECTURES.map(arch => (
          <button
            key={arch.id}
            className={`arch-btn ${selected.id === arch.id ? 'active' : ''}`}
            onClick={() => setSelected(arch)}
          >
            {arch.icon} {arch.name}
          </button>
        ))}
      </div>

      {/* Architecture Diagram */}
      <div className="arch-diagram">
        <div className="arch-flow">
          {selected.nodes.map((node, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                className="arch-node"
                style={{
                  borderColor: node.color,
                  background: node.bg,
                  animationDelay: `${i * 0.12}s`
                }}
              >
                <span className="arch-node-icon">{node.icon}</span>
                <span className="arch-node-label">{node.label}</span>
                <span className="arch-node-sub">{node.sub}</span>
              </div>
              {i < selected.nodes.length - 1 && (
                <div className="arch-arrow" style={{ animationDelay: `${i * 0.2}s` }}>
                  ───▶
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Description & Steps */}
      <div className="arch-description">
        <h4>📖 How It Works</h4>
        <p>{selected.description}</p>

        <div className="arch-services-used">
          {selected.services.map(s => (
            <span key={s} className="arch-service-pill">{s}</span>
          ))}
        </div>

        <div className="arch-step-list">
          {selected.steps.map((step, i) => (
            <div key={i} className="arch-step">
              <span className="arch-step-num">{i + 1}</span>
              <span className="arch-step-text">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
