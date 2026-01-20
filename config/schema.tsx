import { integer, json, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(5),
});


export const coursesTable = pgTable("courses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }).notNull().references(() => usersTable.email),
 courseId: varchar({ length: 255 }).notNull(),
 courseName: varchar({ length: 255 }).notNull(),
 userInput: varchar({ length: 1000 }).notNull(),
  type: varchar({ length: 100 }).notNull(),
  courselayout:json(),
  createdAt: timestamp().defaultNow(),
});