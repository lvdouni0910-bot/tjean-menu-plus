import type { Config, Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { getDatabase } from '@netlify/database';
import crypto from 'node:crypto';

const store = () => getStore({ name: 'recipe-images', consistency: 'strong' });
const admin = (req: Request) => {
  const secret = Netlify.env.get('TJEAN_ADMIN_KEY');
  return !!secret && req.headers.get('x-admin-key') === secret;
};
const json = (error: string, status: number) => Response.json({ error }, { status });
const MAX_BYTES = 4 * 1024 * 1024;
function imageType(data: Uint8Array): string | null {
  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return 'image/jpeg';
  if (data.length >= 8 && [137,80,78,71,13,10,26,10].every((b,i) => data[i] === b)) return 'image/png';
  if (data.length >= 12 && String.fromCharCode(...data.slice(0,4)) === 'RIFF' && String.fromCharCode(...data.slice(8,12)) === 'WEBP') return 'image/webp';
  return null;
}
export default async (req: Request, _context: Context) => {
  const id = Number(new URL(req.url).searchParams.get('id'));
  if (!Number.isSafeInteger(id) || id < 1) return json('Invalid recipe ID', 400);
  const db = getDatabase();
  if (req.method === 'POST') {
    if (!admin(req)) return json('Unauthorized', 401);
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > MAX_BYTES) return json('图片不能超过 4 MB', 413);
    const [recipe] = await db.sql`SELECT id,image_key FROM recipes WHERE id=${id}`;
    if (!recipe) return json('菜谱不存在，请先保存菜谱', 404);
    const data = await req.arrayBuffer();
    const bytes = new Uint8Array(data);
    if (bytes.length === 0 || bytes.length > MAX_BYTES) return json('图片不能超过 4 MB', 413);
    const type = imageType(bytes);
    if (!type) return json('仅支持 JPG、PNG 或 WebP 图片', 415);
    const key = `recipes/${id}/${crypto.randomUUID()}`;
    await store().set(key, data, { metadata: { contentType: type } });
    await db.sql`UPDATE recipes SET image_key=${key},updated_at=NOW() WHERE id=${id}`;
    if (recipe.image_key) await store().delete(recipe.image_key).catch(() => {});
    return Response.json({ ok: true, image_url: `/api/recipe-image?id=${id}&v=${encodeURIComponent(key)}` });
  }
  if (req.method === 'DELETE') {
    if (!admin(req)) return json('Unauthorized', 401);
    const [recipe] = await db.sql`SELECT image_key FROM recipes WHERE id=${id}`;
    if (!recipe) return json('菜谱不存在', 404);
    await db.sql`UPDATE recipes SET image_key=NULL,updated_at=NOW() WHERE id=${id}`;
    if (recipe.image_key) await store().delete(recipe.image_key).catch(() => {});
    return Response.json({ ok: true });
  }
  if (req.method !== 'GET') return json('Method not allowed', 405);
  const [recipe] = await db.sql`SELECT image_key,status FROM recipes WHERE id=${id}`;
  if (!recipe?.image_key || (recipe.status !== 'published' && !admin(req))) return json('Image not found', 404);
  const [data, meta] = await Promise.all([store().get(recipe.image_key, { type: 'arrayBuffer' }), store().getMetadata(recipe.image_key)]);
  if (!data) return json('Image not found', 404);
  const type = String(meta?.metadata?.contentType || 'image/jpeg');
  return new Response(data, { headers: { 'Content-Type': type, 'Cache-Control': recipe.status === 'published' ? 'public, max-age=60' : 'private, no-store', 'X-Content-Type-Options': 'nosniff' } });
};
export const config: Config = { path: '/api/recipe-image' };
