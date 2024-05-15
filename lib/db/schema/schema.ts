import { pgTable, text, timestamp, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { InferSelectModel } from 'drizzle-orm';

export const UserRole = pgEnum('UserRole', ['User', 'Admin']);
export enum UserRoleEnum {
  User = 'User',
  Admin = 'Admin',
}

export const users = pgTable(
  'User',
  {
    id: text('id').primaryKey().notNull(),
    role: UserRole('role').notNull(),
    firstName: text('firstName'),
    username: text('username'),
    fullName: text('fullName'),
    imageUrl: text('imageUrl'),
    email: text('email').notNull(),
    createdAt: timestamp('createdAt')
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .default(sql`now()`),
  },
  (users) => ({
    usernameIndex: uniqueIndex('User_username_key').on(users.username),
    emailIndex: uniqueIndex('User_email_key').on(users.email),
  })
);

export type User = InferSelectModel<typeof users>;
