import { timestamp } from "drizzle-orm/pg-core";
import { integer, pgEnum } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { schema } from "./index.ts";
import { create } from "domain";

export const invoices = pgTable('invoices', {
    id: text().primaryKey(),
    orderId: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
})