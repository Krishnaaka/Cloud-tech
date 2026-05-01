# ☁️ CloudCamp - AWS Cloud Learning Hub

An interactive AWS Cloud learning platform built with React + Vite.

## Features

- 🔍 **Service Explorer** - Browse and search all major AWS services
- 🏗️ **Architecture Lab** - Visualize common AWS architecture patterns
- 🛡️ **IAM Policy Builder** - Build and understand IAM policies interactively
- 🧠 **Cloud Quiz** - Test your AWS knowledge
- ⌨️ **CLI Reference** - Quick reference for AWS CLI commands

## Tech Stack

- React 19
- Vite
- Vanilla CSS

## Getting Started

```bash
npm install
npm run dev
```
# CloudCamp — Automated Cloud Deployment Pipeline

## Architecture
GitHub → GitHub Actions → Terraform → 
Docker → ECR → EC2 → Live App

## Tech Stack
- Terraform (IaC) — infrastructure automation
- Docker — containerization
- GitHub Actions — CI/CD pipeline
- AWS EC2 — compute
- AWS ECR — container registry
- React + nginx — frontend

## How it works
1. Push code to main branch
2. GitHub Actions triggers automatically
3. Terraform creates EC2 infrastructure
4. Docker builds and pushes image to ECR
5. EC2 pulls and runs the container
6. App is live — zero manual work!

## Live URL
http://YOUR-EC2-IP
