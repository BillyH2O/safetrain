import { integer, pgTable, varchar, serial, text, timestamp, pgEnum, real, boolean } from "drizzle-orm/pg-core";
import { FileKey } from "lucide-react";

export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user']) // def d'un type enum

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const chats = pgTable("chats", { // chats
  id: serial('id').primaryKey(),
  pdfName: text('pdf_name').notNull(),
  pdfUrl: text('pdf_url').notNull(),
  thumbnailUrl: text("thumbnailUrl"), 
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: varchar('user_id', {length:256}).notNull(),
  fileKey: text('file_key').notNull(),
});

export type DrizzleChat = typeof chats.$inferSelect;

export const messages = pgTable('messages' , {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id').references(()=>chats.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  role: userSystemEnum('role').notNull()
})

export const configs = pgTable('configs' , {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  chunkingStrategy: text('chunking_strategy').notNull().default('ma_valeur_par_defaut'),
  rerankingModel: text('reranking_model').notNull().default('null'),
  hybridSearch: boolean('hybrid_search').notNull().default(false), 
  temperature: real('temperature').notNull(),
  topP: real('topP').notNull(),
  topK: real('topK').notNull(),
  maxSteps: integer('maxSteps').notNull(),
  stopSequences: text('stopSequences').notNull(),
  prompt: text('prompt').notNull(),
  userId: varchar('user_id', {length:256}).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
