import { integer, json, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

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

export const chapterstable = pgTable("chapters", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  courseId: varchar({ length: 255 }).notNull().references(() => coursesTable.courseId),
  chapterId: varchar({ length: 255 }).notNull().unique(),
  chapterTitle: varchar({ length: 255 }).notNull(),
  videocontent: json(),
  captions: json(),
  audioFileURl: varchar({ length: 1024}),
  createdAt: timestamp().defaultNow(),
});

export const chapterContentSlidesTable = pgTable("chapter_content_slides", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  courseId: varchar({ length: 255 }).notNull().references(() => coursesTable.courseId),
  chapterId: varchar({ length: 255 }).notNull().references(() => chapterstable.chapterId),
  slideId: varchar({ length: 255 }).notNull().unique(),
  slideIndex: integer().notNull(),
  audioFileName: varchar({ length: 255 }).notNull(),
  audioFileURL: varchar({ length: 1024}).notNull(),
  narration:json().notNull(),
  html:text(),
  revelData: json(),

  createdAt: timestamp().defaultNow(),
});