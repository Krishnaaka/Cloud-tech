import { useState, useMemo } from 'react';

const AWS_SERVICES = [
  // Compute
  { id: 'ec2', name: 'EC2', fullName: 'Elastic Compute Cloud', icon: '🖥️', category: 'Compute', color: 'var(--aws-orange)',
    desc: 'Virtual servers in the cloud. Launch instances with your choice of OS, CPU, memory, and storage.',
    useCases: ['Web hosting', 'Application servers', 'Big data processing', 'Gaming servers'],
    keyConcepts: [
      { title: 'Instance Types', desc: 'Choose from General Purpose (t3, m5), Compute Optimized (c5), Memory Optimized (r5), etc.' },
      { title: 'AMI', desc: 'Amazon Machine Image — a template containing the OS and software to launch an instance.' },
      { title: 'Security Groups', desc: 'Virtual firewalls that control inbound and outbound traffic to your instances.' },
      { title: 'Elastic IP', desc: 'A static IPv4 address that you can attach to any instance in your account.' }
    ],
    pricing: 'On-Demand, Reserved (up to 75% discount), Spot (up to 90% discount)',
    tags: ['Virtual Machine', 'Scalable', 'Pay-per-use']
  },
  { id: 'lambda', name: 'Lambda', fullName: 'AWS Lambda', icon: 'λ', category: 'Compute', color: 'var(--aws-orange)',
    desc: 'Run code without provisioning servers. Pay only for compute time consumed — zero charge when idle.',
    useCases: ['API backends', 'Data processing', 'Real-time file processing', 'Scheduled tasks'],
    keyConcepts: [
      { title: 'Functions', desc: 'Your code packaged and deployed. Supports Python, Node.js, Java, Go, and more.' },
      { title: 'Triggers', desc: 'Events that invoke your function — API Gateway, S3 uploads, DynamoDB changes, etc.' },
      { title: 'Cold Start', desc: 'Initial latency when a function runs for the first time or after being idle.' },
      { title: 'Layers', desc: 'Reusable packages of libraries and dependencies shared across functions.' }
    ],
    pricing: 'First 1M requests/month free, then $0.20 per 1M requests',
    tags: ['Serverless', 'Event-driven', 'Auto-scaling']
  },
  { id: 'ecs', name: 'ECS', fullName: 'Elastic Container Service', icon: '📦', category: 'Compute', color: 'var(--aws-orange)',
    desc: 'Run and manage Docker containers at scale. Integrates with ALB, CloudWatch, and IAM.',
    useCases: ['Microservices', 'Batch processing', 'CI/CD pipelines', 'Machine learning'],
    keyConcepts: [
      { title: 'Tasks', desc: 'A running container instance defined by a Task Definition (image, CPU, memory).' },
      { title: 'Services', desc: 'Maintain a desired number of running tasks and integrate with load balancers.' },
      { title: 'Fargate', desc: 'Serverless compute for containers — no EC2 instances to manage.' },
      { title: 'ECR', desc: 'Elastic Container Registry — store your Docker images securely in AWS.' }
    ],
    pricing: 'ECS itself is free; you pay for EC2/Fargate resources used',
    tags: ['Containers', 'Docker', 'Orchestration']
  },

  // Storage
  { id: 's3', name: 'S3', fullName: 'Simple Storage Service', icon: '🪣', category: 'Storage', color: 'var(--aws-green)',
    desc: 'Object storage with unlimited capacity. Store and retrieve any amount of data from anywhere.',
    useCases: ['Static website hosting', 'Data lakes', 'Backup & archive', 'Content distribution'],
    keyConcepts: [
      { title: 'Buckets', desc: 'Top-level containers for objects. Bucket names must be globally unique.' },
      { title: 'Storage Classes', desc: 'Standard, IA (Infrequent Access), Glacier (archive), and Intelligent-Tiering.' },
      { title: 'Versioning', desc: 'Keep multiple versions of an object to protect against accidental deletion.' },
      { title: 'Lifecycle Policies', desc: 'Automatically move objects between storage classes or delete them after X days.' }
    ],
    pricing: 'Standard: ~$0.023/GB/month for first 50TB',
    tags: ['Object Store', 'Unlimited', 'Durable']
  },
  { id: 'ebs', name: 'EBS', fullName: 'Elastic Block Store', icon: '💾', category: 'Storage', color: 'var(--aws-green)',
    desc: 'Persistent block storage volumes for EC2 instances. Like a virtual hard drive in the cloud.',
    useCases: ['Database storage', 'Boot volumes', 'Throughput-intensive apps', 'Enterprise apps'],
    keyConcepts: [
      { title: 'Volume Types', desc: 'gp3 (general), io2 (high IOPS), st1 (throughput), sc1 (cold).' },
      { title: 'Snapshots', desc: 'Point-in-time backups stored in S3. Incremental — only changed blocks saved.' },
      { title: 'Encryption', desc: 'AES-256 encryption at rest and in transit. Minimal performance impact.' },
      { title: 'Multi-Attach', desc: 'io2 volumes can attach to multiple EC2 instances in the same AZ.' }
    ],
    pricing: 'gp3: $0.08/GB/month + 3000 IOPS free',
    tags: ['Block Storage', 'Persistent', 'Snapshots']
  },

  // Database
  { id: 'rds', name: 'RDS', fullName: 'Relational Database Service', icon: '🗄️', category: 'Database', color: 'var(--aws-blue)',
    desc: 'Managed relational databases. Supports MySQL, PostgreSQL, Oracle, SQL Server, and Aurora.',
    useCases: ['Web applications', 'E-commerce', 'Enterprise apps', 'SaaS backends'],
    keyConcepts: [
      { title: 'Multi-AZ', desc: 'Synchronous standby replica in another AZ for automatic failover.' },
      { title: 'Read Replicas', desc: 'Asynchronous copies for read-heavy workloads. Up to 5 replicas.' },
      { title: 'Automated Backups', desc: 'Point-in-time recovery with retention up to 35 days.' },
      { title: 'Aurora', desc: 'AWS-built engine — 5x faster than MySQL, 3x faster than PostgreSQL.' }
    ],
    pricing: 'db.t3.micro: ~$0.017/hr (free tier eligible for 12 months)',
    tags: ['SQL', 'Managed', 'High Availability']
  },
  { id: 'dynamodb', name: 'DynamoDB', fullName: 'Amazon DynamoDB', icon: '⚡', category: 'Database', color: 'var(--aws-blue)',
    desc: 'Fully managed NoSQL database with single-digit millisecond performance at any scale.',
    useCases: ['Gaming leaderboards', 'IoT data', 'Session management', 'Real-time bidding'],
    keyConcepts: [
      { title: 'Tables, Items, Attributes', desc: 'Tables hold items (rows). Each item has attributes (columns) — schema-less.' },
      { title: 'Partition Key & Sort Key', desc: 'Primary key design is crucial. Partition key distributes data across nodes.' },
      { title: 'Capacity Modes', desc: 'On-Demand (pay per request) or Provisioned (set read/write capacity units).' },
      { title: 'DynamoDB Streams', desc: 'Capture item-level changes in real-time. Great for triggering Lambda.' }
    ],
    pricing: 'On-Demand: $1.25 per M write units, $0.25 per M read units',
    tags: ['NoSQL', 'Serverless', 'Fast']
  },

  // Networking
  { id: 'vpc', name: 'VPC', fullName: 'Virtual Private Cloud', icon: '🔒', category: 'Networking', color: 'var(--aws-purple)',
    desc: 'Your own isolated network in AWS. Full control over IP ranges, subnets, route tables, and gateways.',
    useCases: ['Network isolation', 'Hybrid cloud', 'Multi-tier architectures', 'Compliance'],
    keyConcepts: [
      { title: 'Subnets', desc: 'Public subnets (internet access) and Private subnets (internal only).' },
      { title: 'Route Tables', desc: 'Rules that determine where network traffic is directed.' },
      { title: 'NAT Gateway', desc: 'Allows private subnet instances to access the internet without being publicly accessible.' },
      { title: 'VPC Peering', desc: 'Connect two VPCs privately. Traffic stays on the AWS backbone.' }
    ],
    pricing: 'VPC itself is free. NAT Gateway: $0.045/hr + data processing',
    tags: ['Networking', 'Isolation', 'Security']
  },
  { id: 'route53', name: 'Route 53', fullName: 'Amazon Route 53', icon: '🌐', category: 'Networking', color: 'var(--aws-purple)',
    desc: 'Highly available DNS service. Route users to your app with domain registration and health checks.',
    useCases: ['Domain registration', 'DNS routing', 'Health checking', 'Traffic management'],
    keyConcepts: [
      { title: 'Hosted Zones', desc: 'Container for DNS records of a domain. Public or Private zones.' },
      { title: 'Routing Policies', desc: 'Simple, Weighted, Latency-based, Failover, Geolocation, Multi-value.' },
      { title: 'Alias Records', desc: 'Route traffic to AWS resources (ALB, S3, CloudFront) — free of charge.' },
      { title: 'Health Checks', desc: 'Monitor endpoint health and automatically route away from unhealthy targets.' }
    ],
    pricing: '$0.50/hosted zone/month, $0.40 per M queries',
    tags: ['DNS', 'Domain', 'Routing']
  },
  { id: 'cloudfront', name: 'CloudFront', fullName: 'Amazon CloudFront', icon: '🚀', category: 'Networking', color: 'var(--aws-purple)',
    desc: 'Global CDN that delivers content with low latency from 450+ edge locations worldwide.',
    useCases: ['Website acceleration', 'API caching', 'Video streaming', 'Software distribution'],
    keyConcepts: [
      { title: 'Distributions', desc: 'Configuration that tells CloudFront where to get content and how to deliver it.' },
      { title: 'Edge Locations', desc: '450+ locations worldwide that cache your content close to users.' },
      { title: 'Origin', desc: 'Where CloudFront fetches content from — S3, ALB, EC2, or custom HTTP servers.' },
      { title: 'Lambda@Edge', desc: 'Run code at edge locations to customize content delivery.' }
    ],
    pricing: 'First 1TB/month free, then ~$0.085/GB',
    tags: ['CDN', 'Caching', 'Global']
  },

  // Security
  { id: 'iam', name: 'IAM', fullName: 'Identity & Access Management', icon: '🛡️', category: 'Security', color: 'var(--aws-red)',
    desc: 'Control who can access what in your AWS account. Users, groups, roles, and policies.',
    useCases: ['User management', 'Access control', 'Cross-account access', 'Service permissions'],
    keyConcepts: [
      { title: 'Users & Groups', desc: 'Users are people/apps. Groups are collections of users with shared permissions.' },
      { title: 'Policies', desc: 'JSON documents that define permissions. Attached to users, groups, or roles.' },
      { title: 'Roles', desc: 'Temporary credentials for AWS services or cross-account access. No passwords.' },
      { title: 'MFA', desc: 'Multi-Factor Authentication — adds an extra layer of security to sign-in.' }
    ],
    pricing: 'Free — no charge for IAM usage',
    tags: ['Access Control', 'Free', 'Essential']
  },

  // Management
  { id: 'cloudwatch', name: 'CloudWatch', fullName: 'Amazon CloudWatch', icon: '📊', category: 'Management', color: 'var(--aws-teal)',
    desc: 'Monitor AWS resources and applications. Collect metrics, logs, set alarms, and automate responses.',
    useCases: ['Resource monitoring', 'Log analysis', 'Auto-scaling triggers', 'Incident response'],
    keyConcepts: [
      { title: 'Metrics', desc: 'Time-ordered data points (CPU, memory, request count). Custom metrics supported.' },
      { title: 'Alarms', desc: 'Watch a metric and trigger actions (SNS, Auto Scaling) when thresholds are breached.' },
      { title: 'Logs', desc: 'Collect, store, and query logs from EC2, Lambda, ECS, and other services.' },
      { title: 'Dashboards', desc: 'Custom visualizations of your metrics on a single screen.' }
    ],
    pricing: '10 custom metrics and 10 alarms free, then ~$0.30/metric/month',
    tags: ['Monitoring', 'Logging', 'Alerting']
  },

  // Integration
  { id: 'sqs', name: 'SQS', fullName: 'Simple Queue Service', icon: '📬', category: 'Integration', color: 'var(--aws-amber)',
    desc: 'Fully managed message queue. Decouple microservices and process messages asynchronously.',
    useCases: ['Task queues', 'Microservice decoupling', 'Order processing', 'Email sending'],
    keyConcepts: [
      { title: 'Standard vs FIFO', desc: 'Standard: unlimited throughput, best-effort ordering. FIFO: exactly-once, ordered.' },
      { title: 'Visibility Timeout', desc: 'Time a message is hidden after being read, preventing duplicate processing.' },
      { title: 'Dead Letter Queue', desc: 'Messages that fail processing are moved here after max retries.' },
      { title: 'Long Polling', desc: 'Wait for messages to arrive rather than polling repeatedly. Reduces costs.' }
    ],
    pricing: 'First 1M requests/month free, then $0.40 per M requests',
    tags: ['Messaging', 'Queue', 'Decoupling']
  },
  { id: 'sns', name: 'SNS', fullName: 'Simple Notification Service', icon: '🔔', category: 'Integration', color: 'var(--aws-amber)',
    desc: 'Pub/Sub messaging service. Send notifications to multiple subscribers simultaneously.',
    useCases: ['Push notifications', 'Email/SMS alerts', 'Event fan-out', 'Application alerts'],
    keyConcepts: [
      { title: 'Topics', desc: 'Communication channels. Publishers send messages to topics.' },
      { title: 'Subscriptions', desc: 'Endpoints that receive messages — Lambda, SQS, HTTP, Email, SMS.' },
      { title: 'Fan-out', desc: 'One message → multiple subscribers. Combine with SQS for reliable delivery.' },
      { title: 'Filtering', desc: 'Subscription filter policies let subscribers receive only relevant messages.' }
    ],
    pricing: 'First 1M publishes free, then $0.50 per M publishes',
    tags: ['Pub/Sub', 'Notifications', 'Fan-out']
  },
];

const CATEGORIES = ['All', ...new Set(AWS_SERVICES.map(s => s.category))];

const CAT_COLORS = {
  Compute: 'var(--aws-orange)',
  Storage: 'var(--aws-green)',
  Database: 'var(--aws-blue)',
  Networking: 'var(--aws-purple)',
  Security: 'var(--aws-red)',
  Management: 'var(--aws-teal)',
  Integration: 'var(--aws-amber)',
};

const CAT_DIM_COLORS = {
  Compute: 'var(--aws-orange-dim)',
  Storage: 'var(--aws-green-dim)',
  Database: 'var(--aws-blue-dim)',
  Networking: 'var(--aws-purple-dim)',
  Security: 'var(--aws-red-dim)',
  Management: 'var(--aws-teal-dim)',
  Integration: 'var(--aws-amber-dim)',
};

export default function ServiceExplorer() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedService, setSelectedService] = useState(null);

  const filtered = useMemo(() => {
    return AWS_SERVICES.filter(s => {
      const matchCat = category === 'All' || s.category === category;
      const matchSearch = !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.fullName.toLowerCase().includes(search.toLowerCase()) ||
        s.desc.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [search, category]);

  return (
    <div className="tool-panel" id="services-panel">
      <div className="panel-header">
        <h2>☁️ AWS <span className="gradient-text">Services Explorer</span></h2>
        <p>Browse {AWS_SERVICES.length} services — click any card to deep-dive with key concepts, use cases & pricing</p>
      </div>

      <div className="services-search">
        <span className="services-search-icon">🔍</span>
        <input
          id="service-search"
          type="text"
          placeholder="Search services... (e.g. Lambda, S3, database, serverless)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="category-filter">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`cat-btn ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="services-grid">
        {filtered.map((service, i) => (
          <div
            key={service.id}
            className="service-card"
            onClick={() => setSelectedService(service)}
            style={{ animationDelay: `${i * 0.04}s`, '--card-color': CAT_COLORS[service.category] }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', borderRadius: '3px 3px 0 0', background: CAT_COLORS[service.category], opacity: 0.6 }} />
            <div className="service-card-header">
              <div className="service-icon" style={{ background: CAT_DIM_COLORS[service.category] }}>
                {service.icon}
              </div>
              <div>
                <div className="service-name">{service.name}</div>
                <div className="service-full-name">{service.fullName}</div>
              </div>
            </div>
            <div className="service-desc">{service.desc}</div>
            <div className="service-tags">
              {service.tags.map(tag => (
                <span key={tag} className="service-tag" style={{ background: CAT_DIM_COLORS[service.category], color: CAT_COLORS[service.category] }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No services found. Try a different search term.
        </div>
      )}

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedService(null); }}>
          <div className="modal">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="service-icon" style={{ background: CAT_DIM_COLORS[selectedService.category], fontSize: '1.5rem', width: '52px', height: '52px' }}>
                  {selectedService.icon}
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{selectedService.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedService.fullName}</div>
                  <span className="service-tag" style={{ background: CAT_DIM_COLORS[selectedService.category], color: CAT_COLORS[selectedService.category], marginTop: '4px', display: 'inline-block' }}>
                    {selectedService.category}
                  </span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelectedService(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-section">
                <h3>📝 Overview</h3>
                <p>{selectedService.desc}</p>
              </div>

              <div className="modal-section">
                <h3>🎯 Use Cases</h3>
                <ul>
                  {selectedService.useCases.map(uc => <li key={uc}>{uc}</li>)}
                </ul>
              </div>

              <div className="modal-section">
                <h3>🧠 Key Concepts</h3>
                {selectedService.keyConcepts.map(kc => (
                  <div key={kc.title} className="key-concept">
                    <strong>{kc.title}</strong>
                    <p>{kc.desc}</p>
                  </div>
                ))}
              </div>

              <div className="modal-section">
                <h3>💰 Pricing</h3>
                <p>{selectedService.pricing}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
