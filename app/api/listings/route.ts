import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { listings } from "../../../db/schema";
import { isSiteOwner } from "../../owner-auth";

const msg=(e:unknown)=>e instanceof Error?e.message:"Unexpected error";
const hills="/northern-hills.webp";
const heights="/northern-heights.jpg";
const aryavarta="/nl-aryavarta.jpg";
const seed=[
  ["Northern Hills · 2 BHK · 647 sq.ft.",2,647,"Possession Diwali 2026",hills,false],["Northern Hills · 2 BHK · 627 sq.ft.",2,627,"Possession Diwali 2026",hills,false],["Northern Hills · 2 BHK · 700 sq.ft.",2,700,"Possession Diwali 2026",hills,false],["Northern Hills · 3 BHK · 1,100 sq.ft.",3,1100,"Possession Diwali 2026",hills,true],
  ["Northern Heights · 2 BHK · 650 sq.ft.",2,650,"Details on request",heights,false],["Northern Heights · 2 BHK · 700 sq.ft.",2,700,"Details on request",heights,false],["Northern Heights · Luxury 2 BHK · 800 sq.ft.",2,800,"Luxury flat",heights,true],
  ["NL Aryavarta · Resale 2 BHK · 700 sq.ft.",2,700,"Resale",aryavarta,false],["NL Aryavarta · Resale 3 BHK · 981 sq.ft.",3,981,"Resale",aryavarta,true],
] as const;
const seedValues=seed.map(([title,bedrooms,area,furnished,imageUrl,featured])=>{const project=title.split(" · ")[0];const resale=furnished==="Resale";return {title,purpose:"Sale" as const,propertyType:"Apartment",location:`${project}, Dahisar East`,price:"Price on request",bedrooms,bathrooms:0,area,furnished,imageUrl,description:`${bedrooms} BHK ${resale?"resale ":""}apartment for sale in ${project}, Dahisar East. Carpet area: ${area.toLocaleString("en-IN")} sq. ft.${furnished==="Possession Diwali 2026"?" Expected possession: Diwali 2026.":" Contact Shruti Estate Consultant for price and viewing details."}`,featured}});
export async function GET(){try{const db=getDb();let rows=await db.select().from(listings).orderBy(desc(listings.featured),desc(listings.createdAt));if(!rows.length)rows=await db.insert(listings).values(seedValues).returning();return Response.json({listings:rows})}catch(e){return Response.json({error:msg(e)},{status:500})}}
export async function POST(request:Request){
  if(!(await isSiteOwner()))return Response.json({error:"Owner access required."},{status:403});
  try{
    const b=await request.json() as Record<string,unknown>; const required=["title","purpose","propertyType","location","price","imageUrl","description"];
    if(required.some(k=>!String(b[k]??"").trim()))return Response.json({error:"Please complete all required fields."},{status:400});
    const [listing]=await getDb().insert(listings).values({title:String(b.title).trim(),purpose:b.purpose==="Sale"?"Sale":"Rent",propertyType:String(b.propertyType).trim(),location:String(b.location).trim(),price:String(b.price).trim(),bedrooms:Math.max(0,Number(b.bedrooms)||0),bathrooms:Math.max(0,Number(b.bathrooms)||0),area:Math.max(0,Number(b.area)||0),furnished:String(b.furnished??"Unfurnished").trim(),imageUrl:String(b.imageUrl).trim(),description:String(b.description).trim(),featured:Boolean(b.featured)}).returning();
    return Response.json({listing},{status:201});
  }catch(e){return Response.json({error:msg(e)},{status:500})}
}
export async function DELETE(request:Request){
  if(!(await isSiteOwner()))return Response.json({error:"Owner access required."},{status:403});
  try{const id=Number(new URL(request.url).searchParams.get("id"));if(!Number.isInteger(id)||id<1)return Response.json({error:"Valid id required"},{status:400});await getDb().delete(listings).where(eq(listings.id,id));return Response.json({ok:true})}catch(e){return Response.json({error:msg(e)},{status:500})}
}
