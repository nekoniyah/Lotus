import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const guilds = sqliteTable("guilds", {
  id: text().unique().notNull(),
  logChannelId: text(),
  levelingChannelId: text(),
});

export const quizzes = sqliteTable("quizzes", {
  id: int().primaryKey(),
  question: text(),
  options: text(),
  answer: text(),
  amount: int(),
});

export const modmails = sqliteTable("modmails", {
  id: int().primaryKey(),
  categoryId: text(),
  guildId: text()
    .references(() => guilds.id)
    .notNull()
    .unique(),
});

export const modmailSessions = sqliteTable("modmailSessions", {
  modmailId: text()
    .references(() => modmails.id)
    .notNull(),
  memberId: text().notNull(),
  open: int({ mode: "boolean" }).default(false),
});

export const welcomers = sqliteTable("welcomers", {
  guildId: text()
    .references(() => guilds.id)
    .unique()
    .notNull(),
  channelId: text().notNull(),
});

export const levels = sqliteTable("levels", {
  userId: text().notNull(),
  guildId: text()
    .references(() => guilds.id)
    .notNull(),
  level: int().default(0),
  experience: int().default(0),
});

export const levelRoles = sqliteTable("levelRoles", {
  guildId: text()
    .references(() => guilds.id)
    .notNull(),
  roleId: text().notNull(),
  level: int().notNull(),
});

export const wallets = sqliteTable("wallets", {
  guildId: text()
    .references(() => guilds.id)
    .notNull(),
  userId: text().notNull(),
  amount: int().default(0),
});

export const multiplierRoles = sqliteTable("multipliersRoles", {
  guildId: text()
    .references(() => guilds.id)
    .notNull(),
  multiplier: int().default(1.1),
  roleId: text().notNull(),
});

export const reactionRoles = sqliteTable("reactionRoles", {
  guildId: text()
    .references(() => guilds.id)
    .notNull(),
  channelId: text().notNull(),
  messageId: text().notNull(),
  roleId: text().notNull(),
  emoji: text().notNull(),
});

export const starboards = sqliteTable("starboards", {
  guildId: text()
    .references(() => guilds.id)
    .unique()
    .notNull(),
  channelId: text().notNull(),
  goal: int().default(5),
});

export const items = sqliteTable("items", {
  id: int().primaryKey(),
  guildId: text()
    .references(() => guilds.id)
    .unique()
    .notNull(),
  cost: int().notNull(),
  activation: text().default("consumable").notNull(),
  filepath: text().notNull(),
});

export const inventories = sqliteTable("inventories", {
  guildId: text()
    .references(() => guilds.id)
    .unique()
    .notNull(),
  itemId: int()
    .references(() => items.id)
    .notNull()
    .unique(),
  userId: text().notNull(),
});

export const currencies = sqliteTable("currencies", {
  guildId: text()
    .references(() => guilds.id)
    .notNull()
    .unique(),
  name: text().default("LotusBucks"),
  emoji: text().default("🪷"),
});

export const memberRoles = sqliteTable("memberRoles", {
  guildId: text()
    .references(() => guilds.id)
    .notNull(),
  userId: text().notNull(),
  roleId: text().notNull(),
});

export const stickyRoles = sqliteTable("stickyRoles", {
  guildId: text()
    .references(() => guilds.id)
    .notNull(),
  roleId: text().notNull().unique(),
});

export const stickyMessages = sqliteTable("stickyMessages", {
  guildId: text()
    .references(() => guilds.id)
    .notNull(),
  channelId: text().notNull(),
  content: text().notNull(),
  messageId: text(),
});

export const memberQuizzes = sqliteTable("memberQuizzed", {
  userId: text(),
  lastQuizAt: int().$defaultFn(() => Date.now()),
});

export const ticketings = sqliteTable("ticketings", {
  panelId: text(),
  categoryId: text(),
  guildId: text().references(() => guilds.id),
  messageId: text(),
  modRoleId: text(),
});
