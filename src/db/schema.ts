import { pgTable, uuid, text, varchar, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id:           uuid('id').primaryKey().defaultRandom(),
  username:     text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt:    timestamp('created_at').notNull().defaultNow(),
});

export const posts = pgTable('posts', {
  id:        uuid('id').primaryKey().defaultRandom(),
  userId:    uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title:     text('title').notNull(),
  body:      text('body').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const friendships = pgTable('friendships', {
  id:        uuid('id').primaryKey().defaultRandom(),
  userId:    uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  friendId:  uuid('friend_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status:    varchar('status', { length: 20 }).notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});