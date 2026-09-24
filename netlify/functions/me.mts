import type {Config} from '@netlify/functions'; import {getDatabase} from '@netlify/database';
export default async(req:Request)=>{const token=req.headers.get('x-menu-token');if(!token)return Response.json({active:false});const db=getDatabase();const r=await db.sql`SELECT model,owner,used_at FROM activation_codes WHERE session_token=${token} AND used_at IS NOT NULL`;return Response.json(r[0]?{active:true,...r[0]}:{active:false})};
export const config:Config={path:'/api/me'};
