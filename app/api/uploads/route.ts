import { env } from "cloudflare:workers";
import { isSiteOwner } from "../../owner-auth";

export async function POST(request:Request){
  if(!(await isSiteOwner()))return Response.json({error:"Owner access required."},{status:403});
  const form=await request.formData(); const file=form.get("file");
  if(!(file instanceof File))return Response.json({error:"Photo required"},{status:400});
  if(!["image/jpeg","image/png","image/webp"].includes(file.type))return Response.json({error:"Use JPG, PNG or WebP"},{status:400});
  if(file.size>8*1024*1024)return Response.json({error:"Photo must be under 8 MB"},{status:400});
  const ext=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";
  const key=`properties/${crypto.randomUUID()}.${ext}`;
  await env.BUCKET.put(key,await file.arrayBuffer(),{httpMetadata:{contentType:file.type}});
  return Response.json({url:`/api/images/${encodeURIComponent(key)}`},{status:201});
}
