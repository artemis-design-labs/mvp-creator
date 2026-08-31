import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const API_BASE = 'http://localhost:3001/api';

const server = new Server(
  { name: 'mvp-creator', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${options.method || 'GET'} ${path} → ${res.status}: ${body}`);
  }
  return res.json();
};

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_projects',
      description: 'List all MVP projects with id, name, status, tags, and lastUpdated.',
      inputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
      name: 'get_project',
      description: 'Get the full data for a single project including all Click Framework sections.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Project ID' }
        },
        required: ['id']
      }
    },
    {
      name: 'create_project',
      description: 'Create a new project. Accepts optional name and pre-populated Click Framework data.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Project name (3–6 words)' },
          status: {
            type: 'string',
            enum: ['draft', 'hypothesis-set', 'testing', 'validated', 'killed'],
            description: 'Project status'
          },
          tags: { type: 'array', items: { type: 'string' } },
          hypothesis: {
            type: 'object',
            description: 'Foundation Hypothesis section',
            properties: {
              customer: { type: 'string', description: 'Specific target customer segment' },
              problem: { type: 'string', description: 'The pain they experience today' },
              solution: { type: 'string', description: 'The specific offering' },
              hook: { type: 'string', description: 'One-liner: why they will care NOW' },
              antiCustomer: { type: 'string', description: 'Who this is explicitly NOT for' }
            }
          },
          advantage: {
            type: 'object',
            description: 'Unfair Advantage section',
            properties: {
              capability: { type: 'string', description: 'What tech/assets/skills make this possible' },
              motivation: { type: 'string', description: 'Why this matters beyond money' },
              insight: { type: 'string', description: 'What we know that competitors miss' }
            }
          },
          principles: {
            type: 'array',
            items: { type: 'string' },
            description: 'Decision guardrails (e.g. "Boring > Exciting")'
          },
          clickTest: {
            type: 'object',
            description: 'The Click Test section',
            properties: {
              riskiestAssumption: { type: 'string', description: 'The one thing that if false kills the idea' },
              testMethod: { type: 'string', description: 'How to validate before building' },
              successMetric: { type: 'string', description: 'Specific number that proves it works' }
            }
          },
          blueprint: {
            type: 'object',
            description: 'Blueprint / execution plan section',
            properties: {
              milestones: { type: 'array', items: { type: 'string' } },
              blockers: { type: 'array', items: { type: 'string' } },
              timelineNotes: { type: 'string' }
            }
          },
          journey: {
            type: 'object',
            description: 'User journey map',
            properties: {
              persona: { type: 'string' },
              goal: { type: 'string' },
              stages: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    steps: { type: 'array', items: { type: 'string' } },
                    emotion: { type: 'string', enum: ['frustrated', 'curious', 'neutral', 'hopeful', 'happy', 'excited', 'disappointed'] },
                    painPoints: { type: 'array', items: { type: 'string' } },
                    opportunities: { type: 'array', items: { type: 'string' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    {
      name: 'update_project',
      description: 'Update any fields on an existing project. Pass only the fields you want to change — nested objects are deep-merged.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Project ID to update' },
          name: { type: 'string' },
          status: {
            type: 'string',
            enum: ['draft', 'hypothesis-set', 'testing', 'validated', 'killed']
          },
          tags: { type: 'array', items: { type: 'string' } },
          hypothesis: {
            type: 'object',
            properties: {
              customer: { type: 'string' },
              problem: { type: 'string' },
              solution: { type: 'string' },
              hook: { type: 'string' },
              antiCustomer: { type: 'string' }
            }
          },
          advantage: {
            type: 'object',
            properties: {
              capability: { type: 'string' },
              motivation: { type: 'string' },
              insight: { type: 'string' }
            }
          },
          principles: { type: 'array', items: { type: 'string' } },
          clickTest: {
            type: 'object',
            properties: {
              riskiestAssumption: { type: 'string' },
              testMethod: { type: 'string' },
              successMetric: { type: 'string' }
            }
          },
          blueprint: {
            type: 'object',
            properties: {
              milestones: { type: 'array', items: { type: 'string' } },
              blockers: { type: 'array', items: { type: 'string' } },
              timelineNotes: { type: 'string' }
            }
          },
          journey: {
            type: 'object',
            properties: {
              persona: { type: 'string' },
              goal: { type: 'string' },
              stages: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    steps: { type: 'array', items: { type: 'string' } },
                    emotion: { type: 'string', enum: ['frustrated', 'curious', 'neutral', 'hopeful', 'happy', 'excited', 'disappointed'] },
                    painPoints: { type: 'array', items: { type: 'string' } },
                    opportunities: { type: 'array', items: { type: 'string' } }
                  }
                }
              }
            }
          }
        },
        required: ['id']
      }
    },
    {
      name: 'delete_project',
      description: 'Permanently delete a project by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Project ID to delete' }
        },
        required: ['id']
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'list_projects') {
      const data = await apiFetch('/projects');
      const summary = (data.projects || []).map(p => ({
        id: p.id,
        name: p.name,
        status: p.status,
        tags: p.tags,
        lastUpdated: p.lastUpdated
      }));
      return { content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }] };
    }

    if (name === 'get_project') {
      const project = await apiFetch(`/projects/${args.id}`);
      return { content: [{ type: 'text', text: JSON.stringify(project, null, 2) }] };
    }

    if (name === 'create_project') {
      const project = await apiFetch('/projects', {
        method: 'POST',
        body: JSON.stringify(args)
      });
      return { content: [{ type: 'text', text: JSON.stringify(project, null, 2) }] };
    }

    if (name === 'update_project') {
      const { id, ...updates } = args;
      const project = await apiFetch(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return { content: [{ type: 'text', text: JSON.stringify(project, null, 2) }] };
    }

    if (name === 'delete_project') {
      const result = await apiFetch(`/projects/${args.id}`, { method: 'DELETE' });
      return { content: [{ type: 'text', text: JSON.stringify(result) }] };
    }

    return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
  } catch (err) {
    return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
