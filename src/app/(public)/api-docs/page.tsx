import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const endpointGroups = [
  {
    name: "Auth",
    description: "User authentication and token management",
    endpoints: [
      { method: "POST", path: "/auth/register", description: "Create a new user account" },
      { method: "POST", path: "/auth/login", description: "Authenticate and receive a token" },
    ],
  },
  {
    name: "Campaigns",
    description: "Create, read, update, and manage campaigns",
    endpoints: [
      { method: "GET", path: "/campaigns", description: "List all public campaigns" },
      { method: "GET", path: "/campaigns/:id", description: "Get campaign details" },
      { method: "POST", path: "/campaigns", description: "Create a new campaign" },
      { method: "PATCH", path: "/campaigns/:id", description: "Update a campaign" },
    ],
  },
  {
    name: "Contributions",
    description: "Process and track contributions",
    endpoints: [
      { method: "POST", path: "/campaigns/:id/contribute", description: "Make a contribution" },
      { method: "GET", path: "/contributions", description: "List user contributions" },
    ],
  },
  {
    name: "Users",
    description: "User profiles and account management",
    comingSoon: true,
    endpoints: [
      { method: "GET", path: "/users/me", description: "Get current user profile" },
      { method: "PATCH", path: "/users/me", description: "Update profile" },
    ],
  },
  {
    name: "Trust Scores",
    description: "Campaign and founder trust verification",
    comingSoon: true,
    endpoints: [
      { method: "GET", path: "/campaigns/:id/trust", description: "Get campaign trust score" },
      { method: "GET", path: "/users/:id/trust", description: "Get founder trust score" },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: "text-emerald-700 bg-emerald-50",
  POST: "text-blue-700 bg-blue-50",
  PATCH: "text-amber-700 bg-amber-50",
  DELETE: "text-red-700 bg-red-50",
};

export default function ApiDocsPage() {
  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-4">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900">
            API Documentation
          </h1>
          <p className="mt-3 text-lg text-secondary-600">
            Build integrations with FundBD
          </p>
        </header>

        {/* Base URL */}
        <Card padding="md" className="mb-8">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-secondary-500">Base URL</span>
            <code className="rounded-md bg-secondary-50 px-3 py-1.5 text-sm font-mono text-secondary-900">
              https://api.fundbd.com/v1
            </code>
          </div>
        </Card>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Authentication
          </h2>
          <p className="text-secondary-600 mb-4">
            All API requests require a Bearer token in the Authorization header.
            Obtain a token by calling the login endpoint.
          </p>
          <div className="rounded-lg bg-secondary-50 border border-secondary-200 p-4 font-mono text-sm text-secondary-800 overflow-x-auto">
            <pre>{`Authorization: Bearer your_api_token_here`}</pre>
          </div>
        </section>

        {/* Example Request/Response */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Example: List Campaigns
          </h2>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-secondary-700">Request</p>
              <div className="rounded-lg bg-secondary-50 border border-secondary-200 p-4 font-mono text-sm text-secondary-800 overflow-x-auto">
                <pre>{`GET /v1/campaigns?status=active&limit=10
Host: api.fundbd.com
Authorization: Bearer your_api_token_here`}</pre>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-secondary-700">Response</p>
              <div className="rounded-lg bg-secondary-50 border border-secondary-200 p-4 font-mono text-sm text-secondary-800 overflow-x-auto">
                <pre>{`{
  "data": [
    {
      "id": "camp_abc123",
      "title": "EcoRickshaw — Electric Rickshaws for Dhaka",
      "founder": {
        "id": "usr_xyz789",
        "name": "Rahim Ahmed",
        "trust_score": 87
      },
      "goal_amount": 500000,
      "raised_amount": 312500,
      "currency": "BDT",
      "status": "active",
      "category": "technology",
      "created_at": "2026-02-15T08:30:00Z"
    }
  ],
  "pagination": {
    "total": 142,
    "page": 1,
    "limit": 10,
    "has_more": true
  }
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Endpoint Groups */}
        <section>
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">
            Endpoints
          </h2>
          <div className="space-y-6">
            {endpointGroups.map((group) => (
              <Card key={group.name} padding="lg">
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {group.name}
                  </h3>
                  {group.comingSoon && (
                    <Badge variant="warning" size="sm">
                      Coming Soon
                    </Badge>
                  )}
                </div>
                <p className="mb-4 text-sm text-secondary-500">
                  {group.description}
                </p>
                <div className="space-y-2">
                  {group.endpoints.map((ep) => (
                    <div
                      key={ep.path}
                      className="flex items-center gap-3 rounded-lg border border-secondary-100 px-3 py-2.5"
                    >
                      <span
                        className={`inline-flex min-w-[52px] justify-center rounded px-2 py-0.5 text-xs font-bold font-mono ${
                          methodColors[ep.method] || ""
                        }`}
                      >
                        {ep.method}
                      </span>
                      <code className="text-sm font-mono text-secondary-700">
                        {ep.path}
                      </code>
                      <span className="ml-auto text-sm text-secondary-400 hidden sm:block">
                        {ep.description}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mt-12">
          <Card padding="lg" className="bg-secondary-50">
            <h3 className="font-semibold text-secondary-900">Rate Limits</h3>
            <p className="mt-2 text-sm text-secondary-600">
              API requests are limited to <strong>100 requests per minute</strong> per
              API key. If you exceed this limit, you will receive a{" "}
              <code className="rounded bg-white px-1.5 py-0.5 text-xs font-mono border border-secondary-200">
                429 Too Many Requests
              </code>{" "}
              response. Contact us at{" "}
              <a href="mailto:api@fundbd.com" className="text-primary-600 hover:underline">
                api@fundbd.com
              </a>{" "}
              if you need higher limits.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}
