import type { Context, Config } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import crypto from 'node:crypto';

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
  const body = await req.json();
  const owner = String(body.owner || '').trim();
  const platform = String(body.platform || '').trim();
  const orderNumber = String(body.orderNumber || body.code || '').trim();
  if (!owner || !platform || !orderNumber) return Response.json({ error: 'Vui lòng chọn nền tảng, nhập email/số điện thoại và mã đơn hàng.' }, { status: 400 });

  const db = getDatabase();
  const rows = await db.sql`SELECT * FROM activation_codes WHERE platform=${platform} AND order_number=${orderNumber}`;
  if (!rows.length) return Response.json({ error: 'Không tìm thấy đơn hàng đủ điều kiện. Vui lòng kiểm tra nền tảng và mã đơn hàng.' }, { status: 404 });
  const item: any = rows[0];
  if (item.used_at && String(item.owner || '').toLowerCase() !== owner.toLowerCase()) {
    return Response.json({ error: 'Đơn hàng này đã được liên kết với tài khoản Menu+ khác.' }, { status: 409 });
  }
  let token = item.session_token || crypto.randomBytes(32).toString('hex');
  if (!item.used_at) {
    await db.sql`UPDATE activation_codes SET used_at=NOW(), owner=${owner}, session_token=${token}, activated_model=${item.model} WHERE code=${item.code}`;
  } else if (!item.session_token) {
    await db.sql`UPDATE activation_codes SET session_token=${token} WHERE code=${item.code}`;
  }
  return Response.json({ ok: true, model: item.model, owner, platform, orderNumber, token, message: 'Kích hoạt thành công!' });
};
export const config: Config = { path: '/api/activate' };
