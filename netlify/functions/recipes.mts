import type { Config, Context } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
async function session(db:any, token:string|null){if(!token)return null;const r=await db.sql`SELECT model,owner FROM activation_codes WHERE session_token=${token} AND used_at IS NOT NULL`;return r[0]||null}
export default async(req:Request,ctx:Context)=>{
 const db=getDatabase(), url=new URL(req.url), token=req.headers.get('x-menu-token'), s:any=await session(db,token);
 const slug=url.searchParams.get('slug'), month=url.searchParams.get('month');
 let rows:any[];
 if(slug) rows=await db.sql`SELECT * FROM recipes WHERE status='published' AND slug=${slug} LIMIT 1`;
 else if(month) rows=await db.sql`SELECT * FROM recipes WHERE status='published' AND update_month=${month} ORDER BY id DESC`;
 else rows=await db.sql`SELECT * FROM recipes WHERE status='published' ORDER BY COALESCE(update_month,'0000-00') DESC,id DESC`;
 const recipes=rows.map((r:any)=>{const locked=!r.free&&!s;const out:any={id:r.id,slug:r.slug,name:r.name,emoji:r.emoji,categories:r.categories,free:r.free,people:r.people,update_month:r.update_month,locked};if(!locked){out.ingredients=r.ingredients;out.steps=r.steps;out.params=s?{[s.model]:r.params?.[s.model]??null}:r.params;}return out});
 return Response.json({recipes,session:s?{model:s.model,owner:s.owner}:null});
};
export const config:Config={path:'/api/recipes'};
