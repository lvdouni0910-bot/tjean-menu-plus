import type { Config, Context } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { getStore } from '@netlify/blobs';
function auth(req:Request){const key=Netlify.env.get('TJEAN_ADMIN_KEY'); return !!key && req.headers.get('x-admin-key')===key}
export default async (req:Request,ctx:Context)=>{
 if(!auth(req)) return Response.json({error:'Unauthorized'},{status:401});
 const db=getDatabase(); const url=new URL(req.url);
 if(req.method==='GET'){const rows=await db.sql`SELECT * FROM recipes ORDER BY updated_at DESC`;return Response.json({recipes:rows.map((r:any)=>({...r,image_url:r.image_key?'/api/recipe-image?id='+r.id+'&v='+encodeURIComponent(r.image_key):null}))})}
 const body=await req.json();
 if(req.method==='POST'){
  const [r]=await db.sql`INSERT INTO recipes(slug,name,emoji,categories,free,people,ingredients,steps,params,status,update_month) VALUES(${body.slug},${body.name},${body.emoji||'🍽️'},${body.categories||[]},${!!body.free},${body.people||''},${JSON.stringify(body.ingredients||[])},${JSON.stringify(body.steps||[])},${JSON.stringify(body.params||{})},${body.status||'draft'},${body.update_month||null}) RETURNING *`; return Response.json({recipe:r},{status:201});
 }
 if(req.method==='PUT'){
  const id=Number(url.searchParams.get('id')); if(!id)return Response.json({error:'Missing id'},{status:400});
  const [r]=await db.sql`UPDATE recipes SET slug=${body.slug},name=${body.name},emoji=${body.emoji||'🍽️'},categories=${body.categories||[]},free=${!!body.free},people=${body.people||''},ingredients=${JSON.stringify(body.ingredients||[])},steps=${JSON.stringify(body.steps||[])},params=${JSON.stringify(body.params||{})},status=${body.status||'draft'},update_month=${body.update_month||null},updated_at=NOW() WHERE id=${id} RETURNING *`; return Response.json({recipe:r});
 }
 if(req.method==='DELETE'){const id=Number(url.searchParams.get('id'));const [old]=await db.sql`SELECT image_key FROM recipes WHERE id=${id}`;await db.sql`DELETE FROM recipes WHERE id=${id}`;if(old?.image_key)await getStore({name:'recipe-images',consistency:'strong'}).delete(old.image_key).catch(()=>{});return Response.json({ok:true})}
 return Response.json({error:'Method not allowed'},{status:405});
};
export const config:Config={path:'/api/admin/recipes'};
