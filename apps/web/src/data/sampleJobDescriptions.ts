export interface SampleJobDescription {
  id: string;
  title: string;
  company: string;
  text: string;
}

export const sampleJobDescriptions: SampleJobDescription[] = [
  {
    id: "fullstack",
    title: "Senior Full-Stack Engineer (React & Node.js)",
    company: "Starlight Tech Solutions",
    text: `Job Title: Senior Full-Stack Engineer (React & Node.js)
Location: Remote / Hybrid

About the Role:
We are seeking a versatile Full-Stack Engineer to lead development of customer-facing web applications and distributed backend microservices.

Key Responsibilities:
- Build and maintain modern, responsive user interfaces using React, JavaScript (ES6+), and TypeScript.
- Architect high-throughput RESTful APIs using Node.js and Express with PostgreSQL databases.
- Develop and optimize Docker container images and participate in container orchestration using Kubernetes (EKS).
- Implement automated testing pipelines with Jest, Cypress, and GitHub Actions CI/CD workflows.
- Collaborate with cross-functional teams to translate business requirements into scalable technical architectures.

Requirements & Skills:
- 3+ years of commercial software engineering experience.
- Deep expertise in React.js, modern JavaScript/TypeScript, HTML5, and responsive CSS.
- Proven experience building backend services with Node.js, Express, and SQL databases.
- Practical knowledge of Docker, container registries, and microservices architecture.
- Hands-on experience with Kubernetes, Helm, and CI/CD automation pipelines.
- Experience writing automated unit and integration tests.
- Excellent communication skills and familiarity with Git version control workflows.`
  },
  {
    id: "cloud-devops",
    title: "Cloud & Platform DevOps Specialist",
    company: "CloudScale Systems",
    text: `Job Title: Cloud & Platform DevOps Engineer
Location: Remote

Responsibilities:
- Build, monitor, and scale production cloud infrastructure across AWS environments.
- Manage Kubernetes clusters, Helm charts, and automated deployment manifests.
- Author Infrastructure as Code using Terraform and CloudFormation.
- Configure CI/CD automated deployment pipelines with GitHub Actions or GitLab CI.
- Implement comprehensive observability using Prometheus, Grafana, and CloudWatch.
- Enforce cloud security posture, IAM least-privilege policies, and encryption at rest.

Qualifications:
- Solid background in Linux systems administration and shell scripting.
- Experience containerizing workloads with Docker and running multi-tenant Kubernetes clusters.
- Demonstrated experience with AWS (VPC, EC2, S3, RDS, IAM).
- Familiarity with monitoring, alerting, log aggregation, and incident response.`
  }
];

