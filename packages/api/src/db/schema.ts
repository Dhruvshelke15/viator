import {
  pgTable,
  uuid,
  text,
  integer,
  date,
  time,
  timestamp,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  trips: many(trips),
}));

// Trips

export const trips = pgTable("trips", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  budgetCents: integer("budget_cents"),
  currency: text("currency").default("USD").notNull(),
  coverImageUrl: text("cover_image_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const tripsRelations = relations(trips, ({ one, many }) => ({
  owner: one(users, {
    fields: [trips.ownerId],
    references: [users.id],
  }),
  days: many(itineraryDays),
}));

// Itinerary Days

export const itineraryDays = pgTable("itinerary_days", {
  id: uuid("id").defaultRandom().primaryKey(),
  tripId: uuid("trip_id")
    .references(() => trips.id, { onDelete: "cascade" })
    .notNull(),
  dayNumber: integer("day_number").notNull(),
  date: date("date"),
  notes: text("notes"),
});

export const itineraryDaysRelations = relations(
  itineraryDays,
  ({ one, many }) => ({
    trip: one(trips, {
      fields: [itineraryDays.tripId],
      references: [trips.id],
    }),
    items: many(itineraryItems),
  }),
);

// Itinerary Items

export const itineraryItems = pgTable("itinerary_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  dayId: uuid("day_id")
    .references(() => itineraryDays.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  type: text("type", {
    enum: ["place", "activity", "food", "transport"],
  }).notNull(),
  startTime: time("start_time"),
  endTime: time("end_time"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  address: text("address"),
  notes: text("notes"),
  estimatedCostCents: integer("estimated_cost_cents"),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const itineraryItemsRelations = relations(itineraryItems, ({ one }) => ({
  day: one(itineraryDays, {
    fields: [itineraryItems.dayId],
    references: [itineraryDays.id],
  }),
}));
