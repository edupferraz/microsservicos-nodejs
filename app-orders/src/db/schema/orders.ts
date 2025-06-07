import { timestamp } from "drizzle-orm/pg-core";
import { integer, pgEnum } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { schema } from "./index.ts";

export const orderStatusEnum = pgEnum('order_status', [
    'pending',
    'paid',
    'canceled'
])

export const orders = pgTable('orders', {
    id: text().primaryKey(),
    customerId: text().notNull().references(() => schema.customers.id),
    amount: integer().notNull(),
    status: orderStatusEnum().notNull().default('pending'),
    createdAt: timestamp().defaultNow().notNull(),
})