import { useState, useCallback } from 'react';

const ALL_QUESTIONS = [
  {
    q: 'Which AWS service lets you run code without provisioning servers?',
    options: ['EC2', 'Lambda', 'ECS', 'Lightsail'],
    correct: 1,
    explanation: 'AWS Lambda is a serverless compute service. You upload your code and Lambda runs it in response to events. No servers to manage, and you pay only for compute time consumed.'
  },
  {
    q: 'S3 stores data as:',
    options: ['Blocks', 'Files in directories', 'Objects in buckets', 'Tables and rows'],
    correct: 2,
    explanation: 'S3 is an object storage service. Data is stored as objects (files + metadata) inside buckets. Unlike file systems, S3 has a flat structure — there are no real folders, just key prefixes.'
  },
  {
    q: 'What does IAM stand for?',
    options: ['Internet Access Manager', 'Identity and Access Management', 'Integrated Application Module', 'Instance Allocation Manager'],
    correct: 1,
    explanation: 'IAM (Identity and Access Management) controls WHO (authentication) can do WHAT (authorization) in your AWS account. It\'s free and one of the most important services to learn.'
  },
  {
    q: 'Which service provides managed relational databases?',
    options: ['DynamoDB', 'ElastiCache', 'RDS', 'Redshift'],
    correct: 2,
    explanation: 'RDS (Relational Database Service) supports MySQL, PostgreSQL, Oracle, SQL Server, and Aurora. RDS handles backups, patching, and replication so you focus on your app.'
  },
  {
    q: 'What is the purpose of a VPC?',
    options: ['Store objects', 'Isolate your network in the cloud', 'Monitor resources', 'Deploy containers'],
    correct: 1,
    explanation: 'A VPC (Virtual Private Cloud) is your own isolated network in AWS. You define IP ranges, create subnets, configure route tables, and control traffic with security groups and NACLs.'
  },
  {
    q: 'Which S3 storage class is cheapest for rarely accessed data?',
    options: ['S3 Standard', 'S3 Intelligent-Tiering', 'S3 Glacier Deep Archive', 'S3 One Zone-IA'],
    correct: 2,
    explanation: 'S3 Glacier Deep Archive is the lowest-cost storage class (~$0.00099/GB/month). It\'s designed for data retained 7-10 years with retrieval times of 12-48 hours. Perfect for compliance archives.'
  },
  {
    q: 'EC2 Spot Instances can save up to:',
    options: ['25% over On-Demand', '50% over On-Demand', '75% over On-Demand', '90% over On-Demand'],
    correct: 3,
    explanation: 'Spot Instances use spare EC2 capacity at up to 90% discount! The catch: AWS can reclaim them with 2 minutes notice. Great for batch processing, data analysis, and stateless workloads.'
  },
  {
    q: 'Which service is a fully managed NoSQL database?',
    options: ['RDS', 'Aurora', 'DynamoDB', 'Neptune'],
    correct: 2,
    explanation: 'DynamoDB is a serverless NoSQL database with single-digit millisecond latency at any scale. It uses key-value and document data models. Auto-scales and replicates across 3 AZs.'
  },
  {
    q: 'What does CloudFront do?',
    options: ['Manages DNS records', 'Provides a CDN for content delivery', 'Monitors AWS resources', 'Manages user permissions'],
    correct: 1,
    explanation: 'CloudFront is AWS\'s CDN (Content Delivery Network). It caches your content at 450+ edge locations worldwide, reducing latency for users. Works with S3, ALB, EC2, and custom origins.'
  },
  {
    q: 'Which IAM entity should you use for an EC2 instance to access S3?',
    options: ['IAM User', 'IAM Group', 'IAM Role', 'IAM Policy'],
    correct: 2,
    explanation: 'IAM Roles are the correct choice for granting AWS services permissions. Never put access keys on EC2! An IAM Role provides temporary credentials that auto-rotate — much more secure.'
  },
  {
    q: 'SQS is used for:',
    options: ['Sending emails', 'Message queuing between services', 'Domain name registration', 'Container orchestration'],
    correct: 1,
    explanation: 'SQS (Simple Queue Service) decouples microservices by queuing messages between producers and consumers. This prevents data loss and allows services to operate at different speeds.'
  },
  {
    q: 'What is the maximum size of a single S3 object?',
    options: ['5 GB', '50 GB', '5 TB', '50 TB'],
    correct: 2,
    explanation: 'A single S3 object can be up to 5TB. For uploads over 100MB, AWS recommends multipart uploads. Objects over 5GB MUST use multipart upload. S3 has unlimited total storage.'
  },
  {
    q: 'Which service manages DNS and domain registration?',
    options: ['CloudFront', 'Route 53', 'API Gateway', 'Direct Connect'],
    correct: 1,
    explanation: 'Route 53 is AWS\'s highly available DNS service. The name refers to port 53 (DNS port). It offers domain registration, DNS routing (simple, weighted, failover, latency-based), and health checks.'
  },
  {
    q: 'What does "Multi-AZ" deployment provide?',
    options: ['Better performance', 'Cost savings', 'High availability', 'Data encryption'],
    correct: 2,
    explanation: 'Multi-AZ creates a synchronous standby replica in a different Availability Zone. If the primary fails, AWS automatically fails over to the standby — typically within 60 seconds. Used heavily with RDS.'
  },
  {
    q: 'Which AWS service is free to use?',
    options: ['EC2', 'S3', 'IAM', 'RDS'],
    correct: 2,
    explanation: 'IAM is completely free — no charges for users, groups, roles, or policies. It\'s one of the few AWS services with no cost at all. You only pay for the resources those identities access.'
  },
];

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function CloudQuiz() {
  const [questions, setQuestions] = useState(() => shuffleArray(ALL_QUESTIONS).slice(0, 10));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState([]);

  const q = questions[current];

  const handleSelect = (index) => {
    if (selected !== null) return;
    setSelected(index);
    setShowExplanation(true);
    if (index === q.correct) {
      setScore(s => s + 1);
    }
    setAnswered(prev => [...prev, { question: q.q, selected: index, correct: q.correct, isCorrect: index === q.correct }]);
  };

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const restart = useCallback(() => {
    setQuestions(shuffleArray(ALL_QUESTIONS).slice(0, 10));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setShowExplanation(false);
    setFinished(false);
    setAnswered([]);
  }, []);

  const getGrade = () => {
    const pct = (score / questions.length) * 100;
    if (pct >= 90) return { emoji: '🏆', text: 'AWS Expert!', color: 'var(--aws-orange)' };
    if (pct >= 70) return { emoji: '🌟', text: 'Great Knowledge!', color: 'var(--aws-green)' };
    if (pct >= 50) return { emoji: '📚', text: 'Good Start!', color: 'var(--aws-blue)' };
    return { emoji: '💪', text: 'Keep Learning!', color: 'var(--aws-purple)' };
  };

  if (finished) {
    const grade = getGrade();
    return (
      <div className="tool-panel" id="quiz-panel">
        <div className="panel-header">
          <h2>🧠 AWS <span className="gradient-text">Knowledge Quiz</span></h2>
        </div>
        <div className="quiz-card">
          <div className="quiz-score-card">
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{grade.emoji}</div>
            <div className="quiz-score-number">{score}/{questions.length}</div>
            <div className="quiz-score-label">{grade.text}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              You got {Math.round((score / questions.length) * 100)}% correct
            </div>
            <button className="btn btn-primary" onClick={restart} style={{ padding: '12px 32px' }}>
              🔄 Try Again (New Questions)
            </button>
          </div>
        </div>

        {/* Review Answers */}
        <div className="card">
          <div className="card-label">
            <span className="card-label-dot" style={{ background: 'var(--aws-blue)' }}></span>
            Review Your Answers
          </div>
          {answered.map((a, i) => (
            <div key={i} style={{
              padding: '12px',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '8px',
              borderLeft: `3px solid ${a.isCorrect ? 'var(--aws-green)' : 'var(--aws-red)'}`,
            }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>
                {a.isCorrect ? '✅' : '❌'} Q{i + 1}: {a.question}
              </div>
              {!a.isCorrect && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Your answer: <span style={{ color: 'var(--aws-red)' }}>{questions[i]?.options[a.selected]}</span>
                  {' · '}
                  Correct: <span style={{ color: 'var(--aws-green)' }}>{questions[i]?.options[a.correct]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tool-panel" id="quiz-panel">
      <div className="panel-header">
        <h2>🧠 AWS <span className="gradient-text">Knowledge Quiz</span></h2>
        <p>Test your AWS knowledge — 10 random questions from a pool of {ALL_QUESTIONS.length}</p>
      </div>

      {/* Progress */}
      <div className="quiz-progress">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
        <span className="quiz-progress-text">{current + 1} / {questions.length}</span>
      </div>

      {/* Question */}
      <div className="quiz-card">
        <div className="quiz-question-num">Question {current + 1}</div>
        <div className="quiz-question">{q.q}</div>

        <div className="quiz-options">
          {q.options.map((opt, i) => {
            let cls = 'quiz-option';
            if (selected !== null) {
              if (i === q.correct) cls += ' correct';
              else if (i === selected) cls += ' wrong';
              else cls += ' disabled';
            }
            return (
              <button key={i} className={cls} onClick={() => handleSelect(i)}>
                <span className="quiz-option-letter">
                  {selected !== null && i === q.correct ? '✓' : selected !== null && i === selected ? '✗' : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="quiz-explanation">
            <strong>💡 Explanation:</strong> {q.explanation}
          </div>
        )}
      </div>

      {selected !== null && (
        <div className="quiz-controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Score: <span style={{ color: 'var(--aws-orange)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{score}</span>
            </span>
          </div>
          <button className="btn btn-primary" onClick={nextQuestion}>
            {current + 1 >= questions.length ? '🏁 See Results' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
}
