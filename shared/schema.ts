import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const videoRequests = pgTable("video_requests", {
  id: serial("id").primaryKey(),
  inputText: text("input_text").notNull(),
  videoUrl: text("video_url"),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVideoRequestSchema = createInsertSchema(videoRequests).pick({
  inputText: true,
});

export const generateVideoSchema = z.object({
  text: z.string().min(1, "Text is required").max(500, "Text must be less than 500 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type VideoRequest = typeof videoRequests.$inferSelect;
export type InsertVideoRequest = z.infer<typeof insertVideoRequestSchema>;
export type GenerateVideoRequest = z.infer<typeof generateVideoSchema>;
