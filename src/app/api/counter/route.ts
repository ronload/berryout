const KV_KEY = "discharge-count";

interface CloudflareConfig {
  accountId: string;
  namespaceId: string;
  apiToken: string;
}

function getConfig(): CloudflareConfig | null {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
  const apiToken = process.env.CLOUDFLARE_KV_API_TOKEN;
  if (!accountId || !namespaceId || !apiToken) return null;
  return { accountId, namespaceId, apiToken };
}

function kvUrl(config: CloudflareConfig): string {
  return `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/storage/kv/namespaces/${config.namespaceId}/values/${KV_KEY}`;
}

async function getCount(config: CloudflareConfig): Promise<number> {
  const res = await fetch(kvUrl(config), {
    headers: { Authorization: `Bearer ${config.apiToken}` },
    next: { revalidate: 0 },
  });
  if (!res.ok) return 0;
  const text = await res.text();
  return parseInt(text, 10) || 0;
}

async function setCount(
  config: CloudflareConfig,
  value: number,
): Promise<void> {
  await fetch(kvUrl(config), {
    method: "PUT",
    headers: { Authorization: `Bearer ${config.apiToken}` },
    body: String(value),
  });
}

export async function GET() {
  const config = getConfig();
  if (!config) {
    return Response.json({ count: null });
  }
  const count = await getCount(config);
  return Response.json({ count });
}

export async function POST() {
  const config = getConfig();
  if (!config) {
    return Response.json(
      { error: "Counter service not configured" },
      { status: 503 },
    );
  }
  const current = await getCount(config);
  const next = current + 1;
  await setCount(config, next);
  return Response.json({ count: next });
}
