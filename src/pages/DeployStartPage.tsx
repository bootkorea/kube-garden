import { Server, Cloud, Workflow, Sparkles, Shield, Rocket, ArrowLeft } from 'lucide-react';

interface DeployStartPageProps {
  onStartDeploy: () => void;
  onBack: () => void;
}

const steps = [
  {
    icon: Server,
    title: 'Connect Workloads',
    description: 'Link your Kubernetes clusters or serverless stacks. The agent ingests manifests, Terraform, and guardrails.',
  },
  {
    icon: Shield,
    title: 'AI Plan Review',
    description: 'Our agent synthesizes change summaries, runs policy checks, and drafts the rollout plan before you ship.',
  },
  {
    icon: Workflow,
    title: 'Guided Execution',
    description: 'Trigger tests, security scans, and staged rollouts—then promote or rollback with one tap.',
  },
];

export default function DeployStartPage({ onStartDeploy, onBack }: DeployStartPageProps) {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-stone-50 to-white">
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 px-8 py-4 backdrop-blur">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-white"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>
      <section className="mx-auto flex max-w-5xl flex-col gap-8 px-8 py-14 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
            <Sparkles size={16} />
            Serverless Control Plane + AI Agent
          </div>
          <h1 className="text-4xl font-black text-slate-900">
            Launch secure deployments in a single click.
          </h1>
          <p className="text-lg text-slate-600">
            The Kube Garden agent keeps releases calm: describe your change, review the plan, then let the console guide tests, scans, and rollout decisions without touching raw cluster commands.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">
              <Cloud size={16} className="text-green-500" />
              AWS Serverless Backend
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">
              <Server size={16} className="text-emerald-500" />
              Multi-cluster ready
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">
              <Sparkles size={16} className="text-amber-500" />
              AI Deployment Agent
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onStartDeploy}
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-slate-300 transition-all hover:bg-green-600 hover:shadow-green-200"
            >
              <Rocket size={20} />
              Deploy with Agent
            </button>
            <button className="rounded-2xl border border-slate-200 px-8 py-4 text-lg font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-white">
              View AWS Diagram
            </button>
          </div>
        </div>

        <div className="flex-1 rounded-3xl border border-green-100 bg-white/80 p-8 shadow-xl shadow-green-100 backdrop-blur">
          <div className="mb-6 flex items-center gap-3 text-sm font-semibold text-emerald-600">
            <Cloud className="text-emerald-500" size={18} />
            Serverless Reference Flow
          </div>
          <div className="space-y-6 text-sm text-slate-600">
            <p>
              <strong>1.</strong> `deploy.garden.com` invokes API Gateway and authenticates the operator.
            </p>
            <p>
              <strong>2.</strong> Lambda orchestrator calls Bedrock / OpenAI for plan generation and policy validation.
            </p>
            <p>
              <strong>3.</strong> EventBridge fans out to CodeBuild, security scans, and Argo Rollouts webhooks against your existing clusters.
            </p>
            <p>
              <strong>4.</strong> Results stream back to the console in real time via AppSync/WebSocket APIs.
            </p>
          </div>
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5 text-white shadow-lg">
            <p className="text-sm uppercase tracking-[0.2em]">Status</p>
            <p className="text-2xl font-bold">Ready for Launch</p>
            <p className="text-sm text-emerald-100">
              Agent online · Guardrails configured · Canary policy loaded
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-8 pb-16 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-slate-600">
              <Icon size={14} />
              {title}
            </div>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

