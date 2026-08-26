import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const listings = sqliteTable("listings", {
  id: integer("id").primaryKey({autoIncrement:true}), title:text("title").notNull(), purpose:text("purpose",{enum:["Rent","Sale"]}).notNull(),
  propertyType:text("property_type").notNull(), location:text("location").notNull(), price:text("price").notNull(), bedrooms:integer("bedrooms").notNull(),
  bathrooms:integer("bathrooms").notNull(), area:integer("area").notNull(), furnished:text("furnished").notNull(), imageUrl:text("image_url").notNull(),
  description:text("description").notNull(), featured:integer("featured",{mode:"boolean"}).notNull().default(false), createdAt:integer("created_at",{mode:"timestamp"}).notNull().$defaultFn(()=>new Date()),
});
