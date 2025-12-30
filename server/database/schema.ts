import { pgTable, serial, text, timestamp, varchar, decimal, boolean, integer, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const roleEnum = pgEnum('role', ['admin', 'member'])
export const invitationStatusEnum = pgEnum('invitation_status', ['pending', 'accepted', 'expired', 'rejected'])
export const locationTypeEnum = pgEnum('location_type', ['home', 'work', 'school', 'other'])
export const tagTypeEnum = pgEnum('tag_type', ['samsung', 'apple', 'other'])
export const notificationTypeEnum = pgEnum('notification_type', ['arrival', 'departure', 'invite', 'system'])

// Users table
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    profileIcon: text('profile_icon'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Family groups table
export const familyGroups = pgTable('family_groups', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    createdBy: integer('created_by').notNull().references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Family members table (junction table)
export const familyMembers = pgTable('family_members', {
    id: serial('id').primaryKey(),
    groupId: integer('group_id').notNull().references(() => familyGroups.id, { onDelete: 'cascade' }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    role: roleEnum('role').notNull().default('member'),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
})

// Invitations table
export const invitations = pgTable('invitations', {
    id: serial('id').primaryKey(),
    groupId: integer('group_id').notNull().references(() => familyGroups.id, { onDelete: 'cascade' }),
    email: varchar('email', { length: 255 }).notNull(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    qrCode: text('qr_code'),
    status: invitationStatusEnum('status').notNull().default('pending'),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Locations table (real-time tracking)
export const locations = pgTable('locations', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
    longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
    accuracy: decimal('accuracy', { precision: 10, scale: 2 }),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
})

// Marked locations table (geofencing)
export const markedLocations = pgTable('marked_locations', {
    id: serial('id').primaryKey(),
    groupId: integer('group_id').notNull().references(() => familyGroups.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    type: locationTypeEnum('type').notNull().default('other'),
    latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
    longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
    radius: integer('radius').notNull().default(100), // in meters
    notifyOnArrival: boolean('notify_on_arrival').notNull().default(true),
    createdBy: integer('created_by').notNull().references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Smart tags table
export const smartTags = pgTable('smart_tags', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    tagType: tagTypeEnum('tag_type').notNull(),
    tagId: varchar('tag_id', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    lastLatitude: decimal('last_latitude', { precision: 10, scale: 8 }),
    lastLongitude: decimal('last_longitude', { precision: 11, scale: 8 }),
    lastSeen: timestamp('last_seen'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Notifications table
export const notifications = pgTable('notifications', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: notificationTypeEnum('type').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    read: boolean('read').notNull().default(false),
    metadata: text('metadata'), // JSON string for additional data
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    familyMemberships: many(familyMembers),
    createdGroups: many(familyGroups),
    locations: many(locations),
    smartTags: many(smartTags),
    notifications: many(notifications),
}))

export const familyGroupsRelations = relations(familyGroups, ({ one, many }) => ({
    creator: one(users, {
        fields: [familyGroups.createdBy],
        references: [users.id],
    }),
    members: many(familyMembers),
    invitations: many(invitations),
    markedLocations: many(markedLocations),
}))

export const familyMembersRelations = relations(familyMembers, ({ one }) => ({
    group: one(familyGroups, {
        fields: [familyMembers.groupId],
        references: [familyGroups.id],
    }),
    user: one(users, {
        fields: [familyMembers.userId],
        references: [users.id],
    }),
}))
