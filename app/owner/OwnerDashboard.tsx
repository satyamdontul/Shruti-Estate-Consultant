"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./owner.module.css";

type Listing={id:number;title:string;purpose:"Rent"|"Sale";propertyType:string;location:string;price:string;bedrooms:number;bathrooms:number;area:number;furnished:string;imageUrl:string;description:string;featured:boolean};
type Draft=Omit<Listing,"id">;
const blank:Draft={title:"",purpose:"Sale",propertyType:"Apartment",location:"Dahisar East",price:"Price on request",bedrooms:2,bathrooms:2,area:700,furnished:"Unfurnished",imageUrl:"",description:"",featured:false};

export default function OwnerDashboard({ownerName,ownerEmail,signOutPath}:{ownerName:string;ownerEmail:string;signOutPath:string}){
  const [listings,setListings]=useState<Listing[]>([]);
  const [draft,setDraft]=useState<Draft>(blank);
  const [photo,setPhoto]=useState<File|null>(null);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [notice,setNotice]=useState("");
  const [error,setError]=useState("");
  const [query,setQuery]=useState("");

  useEffect(()=>{fetch("/api/listings").then(async r=>{if(!r.ok)throw new Error("Could not load listings.");return r.json()}).then(data=>setListings(data.listings??[])).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[]);
  const filtered=useMemo(()=>listings.filter(x=>`${x.title} ${x.location}`.toLowerCase().includes(query.toLowerCase())),[listings,query]);

  function update<K extends keyof Draft>(key:K,value:Draft[K]){setDraft(current=>({...current,[key]:value}))}

  async function addListing(e:FormEvent){
    e.preventDefault(); setSaving(true); setError(""); setNotice("");
    try{
      let imageUrl=draft.imageUrl.trim();
      if(photo){const form=new FormData();form.append("file",photo);const upload=await fetch("/api/uploads",{method:"POST",body:form});const uploaded=await upload.json();if(!upload.ok)throw new Error(uploaded.error??"Photo upload failed.");imageUrl=uploaded.url}
      const payload={...draft,imageUrl:imageUrl||"/shruti-estate-storefront.jpg"};
      const response=await fetch("/api/listings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data=await response.json();if(!response.ok)throw new Error(data.error??"Could not add property.");
      setListings(current=>[data.listing,...current]);setDraft(blank);setPhoto(null);setNotice("Property added successfully.");
      const fileInput=document.getElementById("property-photo") as HTMLInputElement|null;if(fileInput)fileInput.value="";
    }catch(e){setError(e instanceof Error?e.message:"Could not add property.")}finally{setSaving(false)}
  }

  async function removeListing(listing:Listing){
    if(!window.confirm(`Remove “${listing.title}” from the website?`))return;
    setError("");setNotice("");
    const response=await fetch(`/api/listings?id=${listing.id}`,{method:"DELETE"});
    const data=await response.json();if(!response.ok){setError(data.error??"Could not remove property.");return}
    setListings(current=>current.filter(x=>x.id!==listing.id));setNotice("Property removed successfully.");
  }

  return <main className={styles.dashboard}>
    <header className={styles.header}><a className={styles.brand} href="/"><img src="/shruti-estate-logo.png" alt=""/><span><strong>Shruti Estate Consultant</strong><small>Owner dashboard</small></span></a><div className={styles.account}><span><strong>{ownerName}</strong><small>{ownerEmail}</small></span><a href={signOutPath}>Sign out</a></div></header>
    <section className={styles.intro}><div><p className={styles.kicker}>Private management area</p><h1>Manage your property inventory</h1><p>Add current properties with photos and remove listings that are no longer available.</p></div><a className={styles.viewSite} href="/" target="_blank">View public website ↗</a></section>
    {(notice||error)&&<div className={error?styles.error:styles.notice} role="status">{error||notice}</div>}
    <div className={styles.workspace}>
      <section className={styles.formCard}><div className={styles.cardHeading}><span>01</span><div><h2>Add property</h2><p>Complete the details shown to visitors.</p></div></div>
        <form onSubmit={addListing}>
          <label className={styles.wide}><span>Listing title</span><input required value={draft.title} onChange={e=>update("title",e.target.value)} placeholder="e.g. Northern Hills · 2 BHK"/></label>
          <label><span>Purpose</span><select value={draft.purpose} onChange={e=>update("purpose",e.target.value as "Rent"|"Sale")}><option>Sale</option><option>Rent</option></select></label>
          <label><span>Property type</span><select value={draft.propertyType} onChange={e=>update("propertyType",e.target.value)}><option>Apartment</option><option>Shop</option><option>Office</option><option>Industrial Shed</option><option>Plot</option></select></label>
          <label className={styles.wide}><span>Location</span><input required value={draft.location} onChange={e=>update("location",e.target.value)} placeholder="Area, city"/></label>
          <label><span>Price</span><input required value={draft.price} onChange={e=>update("price",e.target.value)} placeholder="Price on request"/></label>
          <label><span>Carpet area (sq.ft.)</span><input type="number" min="0" value={draft.area} onChange={e=>update("area",Number(e.target.value))}/></label>
          <label><span>Configuration</span><select value={draft.bedrooms} onChange={e=>update("bedrooms",Number(e.target.value))}><option value="0">1 RK / Commercial</option><option value="1">1 BHK</option><option value="2">2 BHK</option><option value="3">3 BHK</option><option value="4">4 BHK</option></select></label>
          <label><span>Bathrooms</span><input type="number" min="0" value={draft.bathrooms} onChange={e=>update("bathrooms",Number(e.target.value))}/></label>
          <label className={styles.wide}><span>Status / furnishing</span><input required value={draft.furnished} onChange={e=>update("furnished",e.target.value)} placeholder="Resale, Furnished, Possession date…"/></label>
          <label><span>Upload photo</span><input id="property-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setPhoto(e.target.files?.[0]??null)}/><small>JPG, PNG or WebP · max 8 MB</small></label>
          <label><span>Or image URL</span><input value={draft.imageUrl} onChange={e=>update("imageUrl",e.target.value)} placeholder="Optional"/></label>
          <label className={styles.wide}><span>Description</span><textarea required value={draft.description} onChange={e=>update("description",e.target.value)} placeholder="Society, connectivity, possession and property highlights…"/></label>
          <label className={`${styles.checkbox} ${styles.wide}`}><input type="checkbox" checked={draft.featured} onChange={e=>update("featured",e.target.checked)}/><span>Mark as featured property</span></label>
          <button className={`${styles.save} ${styles.wide}`} disabled={saving}>{saving?"Adding property…":"Add property to website"}</button>
        </form>
      </section>
      <section className={styles.inventoryCard}><div className={styles.cardHeading}><span>02</span><div><h2>Current inventory</h2><p>{listings.length} properties on the website</p></div></div><input className={styles.search} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search listings…" aria-label="Search listings"/>
        <div className={styles.list}>{loading?<p className={styles.state}>Loading properties…</p>:filtered.length===0?<p className={styles.state}>No matching properties.</p>:filtered.map(x=><article key={x.id}><img src={x.imageUrl} alt=""/><div><strong>{x.title}</strong><span>{x.location}</span><small>{x.purpose} · {x.area>0?`${x.area.toLocaleString("en-IN")} sq.ft.`:"Area on request"} · {x.price}</small></div><button onClick={()=>removeListing(x)} aria-label={`Remove ${x.title}`}>Remove</button></article>)}</div>
      </section>
    </div>
  </main>;
}
