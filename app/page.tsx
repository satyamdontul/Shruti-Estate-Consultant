"use client";

import { useEffect, useMemo, useState } from "react";

type Listing = { id:number; title:string; purpose:"Rent"|"Sale"; propertyType:string; location:string; price:string; bedrooms:number; bathrooms:number; area:number; furnished:string; imageUrl:string; description:string; featured:boolean; available?:boolean };
type ChatMessage = { role:"assistant"|"visitor"; text:string };

const samples: Listing[] = [
  { id:101, title:"Northern Hills · 2 BHK · 647 sq.ft.", purpose:"Sale", propertyType:"Apartment", location:"Northern Hills, Dahisar East", price:"Price on request", bedrooms:2, bathrooms:0, area:647, furnished:"Possession Diwali 2026", imageUrl:"/northern-hills.webp", description:"2 BHK apartment for outright sale in Northern Hills, Dahisar East. Carpet area: 647 sq. ft. Expected possession: Diwali 2026.", featured:true },
  { id:102, title:"Northern Hills · 2 BHK · 627 sq.ft.", purpose:"Sale", propertyType:"Apartment", location:"Northern Hills, Dahisar East", price:"Price on request", bedrooms:2, bathrooms:0, area:627, furnished:"Possession Diwali 2026", imageUrl:"/northern-hills.webp", description:"2 BHK apartment for outright sale in Northern Hills, Dahisar East. Carpet area: 627 sq. ft. Expected possession: Diwali 2026.", featured:false },
  { id:103, title:"Northern Hills · 2 BHK · 700 sq.ft.", purpose:"Sale", propertyType:"Apartment", location:"Northern Hills, Dahisar East", price:"Price on request", bedrooms:2, bathrooms:0, area:700, furnished:"Possession Diwali 2026", imageUrl:"/northern-hills.webp", description:"2 BHK apartment for outright sale in Northern Hills, Dahisar East. Carpet area: 700 sq. ft. Expected possession: Diwali 2026.", featured:false },
  { id:104, title:"Northern Hills · 3 BHK · 1,100 sq.ft.", purpose:"Sale", propertyType:"Apartment", location:"Northern Hills, Dahisar East", price:"Price on request", bedrooms:3, bathrooms:0, area:1100, furnished:"Possession Diwali 2026", imageUrl:"/northern-hills.webp", description:"Spacious 3 BHK apartment for outright sale in Northern Hills, Dahisar East. Carpet area: 1,100 sq. ft. Expected possession: Diwali 2026.", featured:true },
  { id:201, title:"Northern Heights · 2 BHK · 650 sq.ft.", purpose:"Sale", propertyType:"Apartment", location:"Northern Heights, Dahisar East", price:"Price on request", bedrooms:2, bathrooms:0, area:650, furnished:"Details on request", imageUrl:"/northern-heights.jpg", description:"2 BHK apartment for sale in Northern Heights, Dahisar East. Carpet area: 650 sq. ft. Contact Shruti Estate Consultant for price and viewing details.", featured:false },
  { id:202, title:"Northern Heights · 2 BHK · 700 sq.ft.", purpose:"Sale", propertyType:"Apartment", location:"Northern Heights, Dahisar East", price:"Price on request", bedrooms:2, bathrooms:0, area:700, furnished:"Details on request", imageUrl:"/northern-heights.jpg", description:"2 BHK apartment for sale in Northern Heights, Dahisar East. Carpet area: 700 sq. ft. Contact Shruti Estate Consultant for price and viewing details.", featured:false },
  { id:203, title:"Northern Heights · Luxury 2 BHK · 800 sq.ft.", purpose:"Sale", propertyType:"Apartment", location:"Northern Heights, Dahisar East", price:"Price on request", bedrooms:2, bathrooms:0, area:800, furnished:"Luxury flat", imageUrl:"/northern-heights.jpg", description:"Luxury 2 BHK apartment for sale in Northern Heights, Dahisar East. Carpet area: 800 sq. ft. Contact Shruti Estate Consultant for price and viewing details.", featured:true },
  { id:301, title:"NL Aryavarta · Resale 2 BHK · 700 sq.ft.", purpose:"Sale", propertyType:"Apartment", location:"NL Aryavarta, Dahisar East", price:"Price on request", bedrooms:2, bathrooms:0, area:700, furnished:"Resale", imageUrl:"/nl-aryavarta.jpg", description:"2 BHK resale apartment in NL Aryavarta, Dahisar East. Carpet area: 700 sq. ft. Contact Shruti Estate Consultant for price and viewing details.", featured:false },
  { id:302, title:"NL Aryavarta · Resale 3 BHK · 981 sq.ft.", purpose:"Sale", propertyType:"Apartment", location:"NL Aryavarta, Dahisar East", price:"Price on request", bedrooms:3, bathrooms:0, area:981, furnished:"Resale", imageUrl:"/nl-aryavarta.jpg", description:"3 BHK resale apartment in NL Aryavarta, Dahisar East. Carpet area: 981 sq. ft. Contact Shruti Estate Consultant for price and viewing details.", featured:true },
];

const oneRkCard: Listing = { id:-1, title:"1 RK Homes · Dahisar East", purpose:"Sale", propertyType:"Apartment", location:"Dahisar East", price:"No inventory currently", bedrooms:0, bathrooms:0, area:0, furnished:"Register your requirement", imageUrl:"/shruti-estate-storefront.jpg", description:"There is no 1 RK inventory available right now. Register your requirement with Shruti Estate Consultant and we will contact you when a suitable home becomes available.", featured:false, available:false };
const unitLabel=(listing:Listing)=>listing.bedrooms===0?"1 RK":`${listing.bedrooms} BHK`;
const localImageFor=(listing:Listing)=>listing.title.startsWith("Northern Hills")?"/northern-hills.webp":listing.title.startsWith("Northern Heights")?"/northern-heights.jpg":listing.title.startsWith("NL Aryavarta")?"/nl-aryavarta.jpg":listing.imageUrl;

const phone="+919820200510";
const displayPhone="98202 00510";
const headOfficePhone="+919321000198";
const branchOfficePhone="+919324498199";
const businessEmail="dinesh.nit1104@gmail.com";
const directions="https://www.google.com/maps/search/?api=1&query=Shruti+Estate+Consultant%2C+Harsh+Apartment%2C+Anand+Nagar%2C+Dahisar+East%2C+Mumbai";
const branchDirections="https://www.google.com/maps/search/?api=1&query=Shop+No.+34%2C+Yudhisthir+Co-op+Society%2C+N.L.+Complex%2C+Dahisar+East%2C+Mumbai";

export default function Home() {
  const [listings,setListings]=useState<Listing[]>(samples);
  const [purpose,setPurpose]=useState("All");
  const [location,setLocation]=useState("All locations");
  const [bedrooms,setBedrooms]=useState("Any configuration");
  const [query,setQuery]=useState("");
  const [selected,setSelected]=useState<Listing|null>(null);
  const [chatOpen,setChatOpen]=useState(false);
  const [chatInput,setChatInput]=useState("");
  const [chatMessages,setChatMessages]=useState<ChatMessage[]>([{role:"assistant",text:"Namaste! I’m the Shruti Property Assistant. Are you looking to buy, rent or sell a property?"}]);

  useEffect(()=>{ fetch("/api/listings").then(r=>r.ok?r.json():Promise.reject()).then(data=>{if(data.listings?.length)setListings(data.listings)}).catch(()=>undefined) },[]);
  const displayListings=useMemo(()=>[...listings,oneRkCard],[listings]);
  const locations=useMemo(()=>["All locations",...Array.from(new Set(displayListings.map(x=>x.location)))],[displayListings]);
  const filtered=useMemo(()=>displayListings.filter(x=>{
    const text=`${x.title} ${x.location} ${x.propertyType}`.toLowerCase();
    return (purpose==="All"||x.purpose===purpose)&&(location==="All locations"||x.location===location)&&(bedrooms==="Any configuration"||x.bedrooms===Number(bedrooms))&&text.includes(query.toLowerCase())
  }),[displayListings,purpose,location,bedrooms,query]);

  function askAssistant(question:string){
    const q=question.trim(); if(!q)return;
    const lower=q.toLowerCase();
    let reply="I can help with buying, renting, selling, available configurations, our service areas or office details. You can also send your exact requirement on WhatsApp.";
    if(lower.includes("buy")||lower.includes("purchase"))reply="We currently have sale options in Northern Hills, Northern Heights and NL Aryavarta in Dahisar. Open the Properties section to compare configurations and carpet areas.";
    else if(lower.includes("rent"))reply="There is no rental inventory displayed right now. Send your preferred area, budget and configuration on WhatsApp and our team will check suitable options.";
    else if(lower.includes("sell"))reply="We can assist with selling your flat, shop, industrial shed or plot across Dahisar, Borivali and Kandivali. Send the property location and basic details on WhatsApp.";
    else if(lower.includes("1 rk")||lower.includes("1rk"))reply="There is currently no 1 RK inventory. We can register your requirement and contact you when a suitable property becomes available.";
    else if(lower.includes("2 bhk"))reply="Available 2 BHK options include Northern Hills (627, 647 and 700 sq.ft.), Northern Heights (650, 700 and luxury 800 sq.ft.) and NL Aryavarta resale (700 sq.ft.).";
    else if(lower.includes("3 bhk"))reply="Available 3 BHK options include Northern Hills (1,100 sq.ft.) and NL Aryavarta resale (981 sq.ft.). Contact us to confirm price and availability.";
    else if(lower.includes("office")||lower.includes("address")||lower.includes("location"))reply="Head Office: Shop No. 3 A/5, Harsh Apartments, Anand Nagar, C. S. Road, Dahisar East. Branch Office: Shop No. 34, Yudhisthir Co-op Society, N. L. Complex, Behind Anand Nagar, Dahisar East.";
    else if(lower.includes("area")||lower.includes("dahisar")||lower.includes("borivali")||lower.includes("kandivali"))reply="We operate across Dahisar, Borivali and Kandivali for the sale, purchase and rental of residential and commercial properties.";
    else if(lower.includes("rera"))reply="Shruti Estate Consultant is RERA registered. Registration number: A51800011242.";
    else if(lower.includes("call")||lower.includes("phone")||lower.includes("contact"))reply="Main enquiry: 98202 00510. Head Office: 93210 00198. Branch Office: 93244 98199.";
    setChatMessages(current=>[...current,{role:"visitor",text:q},{role:"assistant",text:reply}]);setChatInput("");
  }
  const message=selected?.available===false?"Hi Shruti Estate Consultant, please register my requirement for a 1 RK home in Dahisar East.":selected?`Hi, I am interested in ${selected.title} at ${selected.location}. Please share more details.`:"Hi, I am looking for a property. Please contact me.";

  return <main>
    <header className="site-header">
      <a className="brand" href="#top"><span className="brand-mark"><img src="/shruti-estate-logo.png" alt="" aria-hidden="true"/></span><span><strong>Shruti Estate Consultant</strong><small>RERA Registered Property Advisor</small></span></a>
      <nav><a href="#properties">Properties</a><a href="#services">Services</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
      <a className="owner-button" href={`tel:${phone}`}>Call {displayPhone}</a>
    </header>

    <section className="hero" id="top"><div className="hero-shade"/><div className="hero-content">
      <p className="eyebrow">Dahisar · Borivali · Kandivali</p><h1>Your trusted guide to the right property.</h1>
      <p className="hero-copy">Homes and commercial properties for rent and sale across Dahisar, Borivali and Kandivali, with personal guidance from first visit to final paperwork.</p>
      <p className="hero-services">Sale &amp; Purchase of Flats, Shops, Industrial Sheds, Plots, etc.</p>
    </div></section>

    <section className="search-dock" aria-label="Property search"><div className="search-panel"><div className="purpose-tabs">{["All","Rent","Sale"].map(x=><button className={purpose===x?"active":""} key={x} onClick={()=>setPurpose(x)}>{x==="All"?"All properties":`For ${x}`}</button>)}</div>
        <div className="search-fields">
          <label><span>Location</span><select value={location} onChange={e=>setLocation(e.target.value)}>{locations.map(x=><option key={x}>{x}</option>)}</select></label>
          <label><span>Home type</span><select value={bedrooms} onChange={e=>setBedrooms(e.target.value)}><option>Any configuration</option><option value="0">1 RK</option><option value="1">1 BHK</option><option value="2">2 BHK</option><option value="3">3 BHK</option><option value="4">4 BHK</option></select></label>
          <label><span>Search</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Area, society or property"/></label>
          <a className="search-button" href="#properties">View homes</a>
        </div>
      </div></section>

    <section className="trust-strip"><div><strong>3 Key Areas</strong><span>Dahisar · Borivali · Kandivali</span></div><div><strong>RERA Registered</strong><span>A51800011242</span></div><div><strong>2 Local Offices</strong><span>Anand Nagar &amp; NL Complex</span></div><a href={`tel:${phone}`}><strong>{displayPhone}</strong><span>Call directly</span></a></section>

    <section className="properties-section" id="properties">
      <div className="section-heading"><div><p className="eyebrow dark">Current opportunities</p><h2>Properties worth visiting</h2></div><p>{filtered.length} {filtered.length===1?"property":"properties"} matching your search</p></div>
      {filtered.length?<div className="property-grid">{filtered.map(x=><article className="property-card" key={x.id}>
        <div className="property-image-wrap"><img src={localImageFor(x)} alt={`${x.title} in ${x.location}`}/><span className="status">{x.available===false?"Waitlist open":`For ${x.purpose}`}</span>{x.featured&&<span className="featured">Featured</span>}</div>
        <div className="property-body"><p className="location">⌖ {x.location}</p><h3>{x.title}</h3><strong className="price">{x.price}</strong><div className="facts"><span>{unitLabel(x)}</span>{x.bathrooms>0&&<span>{x.bathrooms} baths</span>}{x.area>0&&<span>{x.area.toLocaleString("en-IN")} sq.ft. carpet</span>}<span>{x.available===false?"Notify me":"Available"}</span></div>
          <div className="card-actions"><button onClick={()=>setSelected(x)}>View details</button><a href={`https://wa.me/${phone.replace("+","")}?text=${encodeURIComponent(x.available===false?"Hi Shruti Estate Consultant, please register my requirement for a 1 RK home in Dahisar East.":`Hi Shruti Estate Consultant, I am interested in ${x.title} at ${x.location}.`)}`} target="_blank" rel="noreferrer">{x.available===false?"Register interest":"WhatsApp"}</a></div>
        </div></article>)}</div>:<div className="empty-state"><h3>No exact match yet</h3><p>Try a different location or tell us what you need.</p><button onClick={()=>{setPurpose("All");setLocation("All locations");setBedrooms("Any configuration");setQuery("")}}>Clear filters</button></div>}
      <p className="listing-note">Project images are representative. Availability, price and unit details are subject to confirmation.</p>
    </section>

    <section className="services-section" id="services"><div className="service-intro"><p className="eyebrow dark">More than listings</p><h2>A smoother property journey.</h2><p>Clear communication and dependable help at every important step.</p></div><div className="services-grid">
      <article><span>01</span><h3>Buy & sell</h3><p>Shortlisting, visits, negotiation and practical coordination.</p></article><article><span>02</span><h3>Rent & lease</h3><p>Quick tenant-owner matching with transparent property details.</p></article><article><span>03</span><h3>Documentation</h3><p>Support with agreements and the paperwork needed to close confidently.</p></article>
    </div></section>

    <section className="about-section" id="about"><div className="about-photo"/><div className="about-copy"><p className="eyebrow dark">Your neighbourhood property advisor</p><h2>Relationships before transactions.</h2><p>Shruti Estate Consultant provides straightforward real-estate assistance across Dahisar, Borivali and Kandivali through our head office in Anand Nagar and branch office in NL Complex. We listen first, shortlist carefully and stay involved until you have the keys in hand.</p><ul><li>Curated options based on your actual requirements</li><li>Flexible property visits and fast follow-ups</li><li>One trusted point of contact throughout</li></ul><a className="primary-cta" href={`https://wa.me/${phone.replace("+","")}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">Discuss your requirement</a></div></section>
    <section className="contact-band" id="contact"><div><p className="eyebrow">Visit or contact us</p><h2>Shruti Estate Consultant</h2><div className="business-credentials"><span>Proprietor: Dinesh N. Dontul</span><span>RERA Regn. No. A51800011242</span></div><div className="office-list"><article><strong>Head Office</strong><p>Shop No. 3 A/5, Harsh Apartments, Anand Nagar, C. S. Road, Dahisar (East), Mumbai 400068</p><a className="office-phone" href={`tel:${headOfficePhone}`}>Tel: 93210 00198</a><a className="office-direction" href={directions} target="_blank" rel="noreferrer">Directions →</a></article><article><strong>Branch Office</strong><p>Shop No. 34, Yudhisthir Co-op Society, N. L. Complex, Behind Anand Nagar, Dahisar (East), Mumbai 400068</p><a className="office-phone" href={`tel:${branchOfficePhone}`}>Tel: 93244 98199</a><a className="office-direction" href={branchDirections} target="_blank" rel="noreferrer">Directions →</a></article></div><div className="contact-meta"><small>Business hours: closes at 8 PM</small><a href={`mailto:${businessEmail}`}>{businessEmail}</a></div></div><div className="contact-side"><div className="qr-card"><img src="/google-business-qr.png" alt="QR code for Shruti Estate Consultant Google Business Profile"/><span>Scan to view us on Google</span></div><div className="contact-actions"><a href={`tel:${phone}`}>Main: {displayPhone}</a><a href={`https://wa.me/${phone.replace("+","")}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">WhatsApp</a></div></div></section>
    <footer><div className="brand footer-brand"><span className="brand-mark"><img src="/shruti-estate-logo.png" alt="" aria-hidden="true"/></span><span><strong>Shruti Estate Consultant</strong><small>RERA Registered Property Advisor</small></span></div><p>Property availability is subject to confirmation.</p><p>© 2026 Shruti Estate Consultant</p></footer>

    <button className="chat-launcher" onClick={()=>setChatOpen(open=>!open)} aria-label={chatOpen?"Close property assistant":"Open property assistant"}><span>✦</span> Ask us</button>
    {chatOpen&&<section className="chat-widget" aria-label="Shruti Property Assistant"><header><div><strong>Shruti Property Assistant</strong><small>Automated assistant · replies instantly</small></div><button onClick={()=>setChatOpen(false)} aria-label="Close chat">×</button></header><div className="chat-messages" aria-live="polite">{chatMessages.map((item,index)=><p className={item.role} key={`${item.role}-${index}`}>{item.text}</p>)}</div><div className="chat-options">{["Buy a property","Rent a property","Sell my property","1 RK availability","Office details"].map(option=><button key={option} onClick={()=>askAssistant(option)}>{option}</button>)}</div><form className="chat-form" onSubmit={e=>{e.preventDefault();askAssistant(chatInput)}}><input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Type your question…" aria-label="Message the property assistant"/><button>Send</button></form><a className="chat-whatsapp" href={`https://wa.me/${phone.replace("+","")}?text=${encodeURIComponent("Hi Shruti Estate Consultant, I have a property enquiry.")}`} target="_blank" rel="noreferrer">Continue with a person on WhatsApp →</a></section>}

    {selected&&<div className="modal-backdrop" onMouseDown={()=>setSelected(null)}><section className="details-modal" onMouseDown={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>×</button><img src={localImageFor(selected)} alt={selected.title}/><div className="modal-copy"><p className="location">⌖ {selected.location}</p><h2>{selected.title}</h2><strong className="price">{selected.price}</strong><div className="facts"><span>{unitLabel(selected)}</span>{selected.bathrooms>0&&<span>{selected.bathrooms} bathrooms</span>}{selected.area>0&&<span>{selected.area.toLocaleString("en-IN")} sq.ft. carpet</span>}<span>{selected.furnished}</span></div><p>{selected.description}</p><a className="primary-cta" href={`https://wa.me/${phone.replace("+","")}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">{selected.available===false?"Register interest on WhatsApp":"Enquire on WhatsApp"}</a></div></section></div>}

  </main>
}
