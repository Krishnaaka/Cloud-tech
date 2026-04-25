import { useState, useMemo } from 'react';

const SERVICE_ACTIONS = {
  S3: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject', 's3:ListBucket', 's3:GetBucketLocation', 's3:ListAllMyBuckets'],
  EC2: ['ec2:RunInstances', 'ec2:StopInstances', 'ec2:TerminateInstances', 'ec2:DescribeInstances', 'ec2:StartInstances', 'ec2:CreateTags'],
  Lambda: ['lambda:InvokeFunction', 'lambda:CreateFunction', 'lambda:DeleteFunction', 'lambda:UpdateFunctionCode', 'lambda:ListFunctions'],
  DynamoDB: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:DeleteItem', 'dynamodb:Query', 'dynamodb:Scan', 'dynamodb:UpdateItem', 'dynamodb:CreateTable'],
  IAM: ['iam:CreateUser', 'iam:DeleteUser', 'iam:AttachUserPolicy', 'iam:CreateRole', 'iam:PassRole', 'iam:ListUsers'],
  SQS: ['sqs:SendMessage', 'sqs:ReceiveMessage', 'sqs:DeleteMessage', 'sqs:GetQueueAttributes', 'sqs:CreateQueue'],
  SNS: ['sns:Publish', 'sns:Subscribe', 'sns:CreateTopic', 'sns:ListTopics'],
  CloudWatch: ['logs:CreateLogGroup', 'logs:PutLogEvents', 'cloudwatch:PutMetricData', 'cloudwatch:GetMetricData'],
};

const RESOURCE_EXAMPLES = {
  S3: 'arn:aws:s3:::my-bucket/*',
  EC2: 'arn:aws:ec2:us-east-1:123456789:instance/*',
  Lambda: 'arn:aws:lambda:us-east-1:123456789:function:my-func',
  DynamoDB: 'arn:aws:dynamodb:us-east-1:123456789:table/my-table',
  IAM: 'arn:aws:iam::123456789:user/*',
  SQS: 'arn:aws:sqs:us-east-1:123456789:my-queue',
  SNS: 'arn:aws:sns:us-east-1:123456789:my-topic',
  CloudWatch: 'arn:aws:logs:us-east-1:123456789:log-group:*',
};

const TEMPLATE_POLICIES = [
  {
    name: '📖 S3 Read-Only',
    statements: [{ effect: 'Allow', service: 'S3', actions: ['s3:GetObject', 's3:ListBucket'], resource: 'arn:aws:s3:::my-bucket/*' }]
  },
  {
    name: '⚡ Lambda Full Access',
    statements: [{ effect: 'Allow', service: 'Lambda', actions: ['lambda:InvokeFunction', 'lambda:CreateFunction', 'lambda:DeleteFunction', 'lambda:UpdateFunctionCode', 'lambda:ListFunctions'], resource: '*' }]
  },
  {
    name: '🔒 Deny Delete',
    statements: [
      { effect: 'Allow', service: 'S3', actions: ['s3:GetObject', 's3:PutObject', 's3:ListBucket'], resource: 'arn:aws:s3:::my-bucket/*' },
      { effect: 'Deny', service: 'S3', actions: ['s3:DeleteObject'], resource: 'arn:aws:s3:::my-bucket/*' }
    ]
  },
];

export default function IamPlayground({ onCopy }) {
  const [statements, setStatements] = useState([
    { effect: 'Allow', service: 'S3', actions: ['s3:GetObject', 's3:ListBucket'], resource: 'arn:aws:s3:::my-bucket/*' }
  ]);

  const [currentEffect, setCurrentEffect] = useState('Allow');
  const [currentService, setCurrentService] = useState('S3');
  const [currentActions, setCurrentActions] = useState([]);
  const [currentResource, setCurrentResource] = useState('');

  const policy = useMemo(() => {
    return JSON.stringify({
      Version: "2012-10-17",
      Statement: statements.map(s => ({
        Effect: s.effect,
        Action: s.actions.length === 1 ? s.actions[0] : s.actions,
        Resource: s.resource || '*'
      }))
    }, null, 2);
  }, [statements]);

  const toggleAction = (action) => {
    setCurrentActions(prev =>
      prev.includes(action)
        ? prev.filter(a => a !== action)
        : [...prev, action]
    );
  };

  const addStatement = () => {
    if (currentActions.length === 0) return;
    setStatements(prev => [...prev, {
      effect: currentEffect,
      service: currentService,
      actions: [...currentActions],
      resource: currentResource || RESOURCE_EXAMPLES[currentService]
    }]);
    setCurrentActions([]);
    setCurrentResource('');
  };

  const removeStatement = (index) => {
    setStatements(prev => prev.filter((_, i) => i !== index));
  };

  const loadTemplate = (template) => {
    setStatements(template.statements.map(s => ({ ...s, actions: [...s.actions] })));
  };

  const copyPolicy = () => {
    navigator.clipboard.writeText(policy);
    onCopy('IAM Policy JSON copied!');
  };

  return (
    <div className="tool-panel" id="iam-panel">
      <div className="panel-header">
        <h2>🛡️ IAM <span className="gradient-text">Policy Builder</span></h2>
        <p>Build IAM policies visually — see the JSON output in real-time</p>
      </div>

      {/* Templates */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', marginRight: '4px' }}>TEMPLATES:</span>
        {TEMPLATE_POLICIES.map(t => (
          <button key={t.name} className="btn btn-secondary" onClick={() => loadTemplate(t)} style={{ fontSize: '0.78rem', padding: '6px 14px' }}>
            {t.name}
          </button>
        ))}
      </div>

      <div className="iam-layout">
        {/* Left: Builder */}
        <div>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-label">
              <span className="card-label-dot" style={{ background: 'var(--aws-orange)' }}></span>
              Add Statement
            </div>

            <div className="iam-builder">
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="iam-field" style={{ flex: 1 }}>
                  <span className="iam-label">Effect</span>
                  <select className="iam-select" value={currentEffect} onChange={(e) => setCurrentEffect(e.target.value)}>
                    <option value="Allow">✅ Allow</option>
                    <option value="Deny">🚫 Deny</option>
                  </select>
                </div>
                <div className="iam-field" style={{ flex: 1 }}>
                  <span className="iam-label">Service</span>
                  <select className="iam-select" value={currentService} onChange={(e) => { setCurrentService(e.target.value); setCurrentActions([]); }}>
                    {Object.keys(SERVICE_ACTIONS).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="iam-field">
                <span className="iam-label">Actions (click to select)</span>
                <div className="iam-actions-list">
                  {SERVICE_ACTIONS[currentService].map(action => (
                    <button
                      key={action}
                      className={`iam-action-chip ${currentActions.includes(action) ? 'selected' : ''}`}
                      onClick={() => toggleAction(action)}
                    >
                      {currentActions.includes(action) ? '✓ ' : ''}{action}
                    </button>
                  ))}
                </div>
              </div>

              <div className="iam-field">
                <span className="iam-label">Resource ARN</span>
                <input
                  className="iam-input"
                  type="text"
                  placeholder={RESOURCE_EXAMPLES[currentService]}
                  value={currentResource}
                  onChange={(e) => setCurrentResource(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={addStatement}
                disabled={currentActions.length === 0}
                style={{ opacity: currentActions.length === 0 ? 0.5 : 1 }}
              >
                ➕ Add Statement
              </button>
            </div>
          </div>

          {/* Current Statements Visual */}
          <div className="card">
            <div className="card-label">
              <span className="card-label-dot" style={{ background: 'var(--aws-blue)' }}></span>
              Statements ({statements.length})
            </div>

            {statements.length === 0 && (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No statements yet. Build one above!
              </div>
            )}

            <div className="iam-statement-cards">
              {statements.map((stmt, i) => (
                <div key={i} className="iam-statement-card">
                  <div className="iam-statement-header">
                    <span className={`iam-effect-badge ${stmt.effect.toLowerCase()}`}>
                      {stmt.effect === 'Allow' ? '✅' : '🚫'} {stmt.effect}
                    </span>
                    <button className="iam-remove-btn" onClick={() => removeStatement(i)}>🗑</button>
                  </div>
                  <div className="iam-visual">
                    <div className="iam-visual-row" style={{ borderLeftColor: 'var(--aws-purple)' }}>
                      <span className="iam-visual-label">Service</span>
                      <span className="iam-visual-value">{stmt.service}</span>
                    </div>
                    <div className="iam-visual-row" style={{ borderLeftColor: 'var(--aws-orange)' }}>
                      <span className="iam-visual-label">Actions</span>
                      <span className="iam-visual-value" style={{ fontSize: '0.75rem' }}>{stmt.actions.join(', ')}</span>
                    </div>
                    <div className="iam-visual-row" style={{ borderLeftColor: 'var(--aws-green)' }}>
                      <span className="iam-visual-label">Resource</span>
                      <span className="iam-visual-value" style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>{stmt.resource}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: JSON Output */}
        <div className="card">
          <div className="card-label">
            <span className="card-label-dot" style={{ background: 'var(--aws-cyan)' }}></span>
            Generated Policy JSON
          </div>
          <textarea className="iam-policy-output" value={policy} readOnly />
          <div style={{ display: 'flex', gap: '8px', marginTop: '0.75rem' }}>
            <button className="btn btn-primary" onClick={copyPolicy}>📋 Copy Policy</button>
            <button className="btn btn-secondary" onClick={() => setStatements([])}>🗑 Clear All</button>
          </div>
        </div>
      </div>
    </div>
  );
}
