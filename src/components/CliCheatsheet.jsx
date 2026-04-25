import { useState } from 'react';

const CLI_GROUPS = [
  {
    service: 'EC2',
    icon: '🖥️',
    color: 'var(--aws-orange)',
    commands: [
      { desc: 'List all EC2 instances', cmd: 'aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType]" --output table' },
      { desc: 'Launch a new instance', cmd: 'aws ec2 run-instances --image-id ami-0abcdef1234 --instance-type t3.micro --key-name MyKey --count 1' },
      { desc: 'Stop an instance', cmd: 'aws ec2 stop-instances --instance-ids i-0abc123def456' },
      { desc: 'Start an instance', cmd: 'aws ec2 start-instances --instance-ids i-0abc123def456' },
      { desc: 'Terminate an instance', cmd: 'aws ec2 terminate-instances --instance-ids i-0abc123def456' },
    ]
  },
  {
    service: 'S3',
    icon: '🪣',
    color: 'var(--aws-green)',
    commands: [
      { desc: 'List all buckets', cmd: 'aws s3 ls' },
      { desc: 'List bucket contents', cmd: 'aws s3 ls s3://my-bucket --recursive --human-readable' },
      { desc: 'Upload a file', cmd: 'aws s3 cp myfile.txt s3://my-bucket/folder/' },
      { desc: 'Download a file', cmd: 'aws s3 cp s3://my-bucket/folder/myfile.txt ./' },
      { desc: 'Sync local dir to S3', cmd: 'aws s3 sync ./build s3://my-bucket --delete' },
      { desc: 'Create a bucket', cmd: 'aws s3 mb s3://my-new-bucket --region us-east-1' },
      { desc: 'Remove a bucket', cmd: 'aws s3 rb s3://my-bucket --force' },
    ]
  },
  {
    service: 'Lambda',
    icon: 'λ',
    color: 'var(--aws-orange)',
    commands: [
      { desc: 'List functions', cmd: 'aws lambda list-functions --query "Functions[*].[FunctionName,Runtime,MemorySize]" --output table' },
      { desc: 'Invoke a function', cmd: 'aws lambda invoke --function-name myFunc --payload \'{"key":"value"}\' output.json' },
      { desc: 'Create function from zip', cmd: 'aws lambda create-function --function-name myFunc --runtime python3.12 --handler app.handler --zip-file fileb://code.zip --role arn:aws:iam::123:role/myRole' },
      { desc: 'Update function code', cmd: 'aws lambda update-function-code --function-name myFunc --zip-file fileb://code.zip' },
      { desc: 'View function logs', cmd: 'aws logs tail /aws/lambda/myFunc --follow' },
    ]
  },
  {
    service: 'IAM',
    icon: '🛡️',
    color: 'var(--aws-red)',
    commands: [
      { desc: 'List all users', cmd: 'aws iam list-users --output table' },
      { desc: 'Create a new user', cmd: 'aws iam create-user --user-name john' },
      { desc: 'Attach policy to user', cmd: 'aws iam attach-user-policy --user-name john --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess' },
      { desc: 'List roles', cmd: 'aws iam list-roles --query "Roles[*].[RoleName,CreateDate]" --output table' },
      { desc: 'Get current identity', cmd: 'aws sts get-caller-identity' },
    ]
  },
  {
    service: 'DynamoDB',
    icon: '⚡',
    color: 'var(--aws-blue)',
    commands: [
      { desc: 'List tables', cmd: 'aws dynamodb list-tables' },
      { desc: 'Describe a table', cmd: 'aws dynamodb describe-table --table-name MyTable' },
      { desc: 'Put an item', cmd: 'aws dynamodb put-item --table-name MyTable --item \'{"id":{"S":"1"},"name":{"S":"Alice"}}\'' },
      { desc: 'Get an item', cmd: 'aws dynamodb get-item --table-name MyTable --key \'{"id":{"S":"1"}}\'' },
      { desc: 'Scan entire table', cmd: 'aws dynamodb scan --table-name MyTable --output table' },
    ]
  },
  {
    service: 'CloudWatch',
    icon: '📊',
    color: 'var(--aws-teal)',
    commands: [
      { desc: 'List log groups', cmd: 'aws logs describe-log-groups --query "logGroups[*].logGroupName" --output table' },
      { desc: 'Tail logs live', cmd: 'aws logs tail /aws/lambda/myFunc --follow --since 10m' },
      { desc: 'List alarms', cmd: 'aws cloudwatch describe-alarms --state-value ALARM --output table' },
      { desc: 'Get CPU metric', cmd: 'aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization --period 300 --statistics Average --start-time 2024-01-01 --end-time 2024-01-02' },
    ]
  },
  {
    service: 'General',
    icon: '⚙️',
    color: 'var(--aws-purple)',
    commands: [
      { desc: 'Configure AWS CLI', cmd: 'aws configure' },
      { desc: 'Check CLI version', cmd: 'aws --version' },
      { desc: 'List all regions', cmd: 'aws ec2 describe-regions --query "Regions[*].RegionName" --output table' },
      { desc: 'Get account ID', cmd: 'aws sts get-caller-identity --query Account --output text' },
      { desc: 'Set default region', cmd: 'export AWS_DEFAULT_REGION=us-east-1' },
    ]
  },
];

export default function CliCheatsheet({ onCopy }) {
  const [search, setSearch] = useState('');

  const filtered = CLI_GROUPS.map(group => ({
    ...group,
    commands: group.commands.filter(c =>
      !search ||
      c.desc.toLowerCase().includes(search.toLowerCase()) ||
      c.cmd.toLowerCase().includes(search.toLowerCase()) ||
      group.service.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(g => g.commands.length > 0);

  const copyCmd = (cmd) => {
    navigator.clipboard.writeText(cmd);
    onCopy('Command copied!');
  };

  const totalCommands = CLI_GROUPS.reduce((sum, g) => sum + g.commands.length, 0);

  return (
    <div className="tool-panel" id="cli-panel">
      <div className="panel-header">
        <h2>⌨️ AWS CLI <span className="gradient-text">Cheatsheet</span></h2>
        <p>{totalCommands} essential commands organized by service — click to copy</p>
      </div>

      <div className="services-search">
        <span className="services-search-icon">🔍</span>
        <input
          id="cli-search"
          type="text"
          placeholder="Search commands... (e.g. list buckets, lambda, create)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="cli-grid">
        {filtered.map(group => (
          <div key={group.service} className="cli-group">
            <div className="cli-group-header">
              <span className="cli-group-icon">{group.icon}</span>
              <span className="cli-group-title">{group.service}</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {group.commands.length} cmds
              </span>
            </div>
            {group.commands.map((c, i) => (
              <div key={i} className="cli-item">
                <div className="cli-desc">{c.desc}</div>
                <div className="cli-command">
                  <code className="cli-code">{c.cmd}</code>
                  <button className="cli-copy" onClick={() => copyCmd(c.cmd)} title="Copy command">
                    📋
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No commands match your search.
        </div>
      )}
    </div>
  );
}
