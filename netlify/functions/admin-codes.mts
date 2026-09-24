import type { Config, Context } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import crypto from 'node:crypto';

function auth(req: Request) {
  const key = Netlify.env.get('TJEAN_ADMIN_KEY');
  return !!key && req.headers.get('x-admin-key') === key;
}
const clean = (v: unknown) => String(v || '').trim();

export default async (req: Request, ctx: Context) => {
  if (!auth(req)) return Response.json({ error: '后台密钥错误' }, { status: 401 });
  const db = getDatabase();
  if (req.method === 'GET') {
    const rows = await db.sql`SELECT code,platform,order_number,model,used_at,owner FROM activation_codes ORDER BY used_at DESC NULLS LAST, order_number DESC`;
    return Response.json({ codes: rows });
  }
  if (req.method === 'POST') {
    const b = await req.json();
    const orders = Array.isArray(b.orders) ? b.orders : [b];
    if (orders.length > 2000) return Response.json({ error: '单次最多导入2000条订单' }, { status: 400 });
    let added = 0, skipped = 0;
    const errors: string[] = [];
    for (let i = 0; i < orders.length; i++) {
      const o = orders[i] || {};
      const platform = clean(o.platform);
      const orderNumber = clean(o.orderNumber || o.order_number);
      const model = clean(o.model);
      if (!platform || !orderNumber || !model) { errors.push(`第${i + 1}行缺少平台/订单号/机型`); continue; }
      const existing = await db.sql`SELECT code FROM activation_codes WHERE platform=${platform} AND order_number=${orderNumber}`;
      if (existing.length) { skipped++; continue; }
      const internalCode = 'ORD-' + crypto.createHash('sha256').update(platform + ':' + orderNumber).digest('hex').slice(0, 24).toUpperCase();
      await db.sql`INSERT INTO activation_codes(code,model,platform,order_number) VALUES(${internalCode},${model},${platform},${orderNumber})`;
      added++;
    }
    return Response.json({ ok: true, added, skipped, errors });
  }
  if (req.method === 'DELETE') {
    const b = await req.json();
    const platform = clean(b.platform), orderNumber = clean(b.orderNumber);
    if (!platform || !orderNumber) return Response.json({ error: 'Missing order' }, { status: 400 });
    const used = await db.sql`SELECT used_at FROM activation_codes WHERE platform=${platform} AND order_number=${orderNumber}`;
    if (used[0]?.used_at) return Response.json({ error: '已激活订单不能删除' }, { status: 409 });
    await db.sql`DELETE FROM activation_codes WHERE platform=${platform} AND order_number=${orderNumber}`;
    return Response.json({ ok: true });
  }
  return Response.json({ error: 'Method not allowed' }, { status: 405 });
};
export const config: Config = { path: '/api/admin/codes' };
