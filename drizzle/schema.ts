import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  int,
  mysqlEnum,
  date,
  time,
  datetime,
  index,
  bigint,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// 1. Group Types
export const groupTypes = mysqlTable(
  "group_types",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
  },
  (table) => ({
    nameKey: uniqueIndex("group_types_name_key").on(table.name),
  })
);

// 2. Groups
export const groups = mysqlTable(
  "groups",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement().notNull(),
    groupTypeId: bigint("group_type_id", { mode: "number" })
      .notNull()
      .references(() => groupTypes.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    name: varchar("name", { length: 191 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
  },
  (table) => ({
    typeIdx: index("groups_group_type_id_fkey").on(table.groupTypeId),
  })
);

// 3. Users
export const users = mysqlTable(
  "users",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    username: varchar("username", { length: 191 }).notNull(),
    emailVerifiedAt: timestamp("email_verified_at", { mode: "string" }),
    password: varchar("password", { length: 191 }).notNull(),
    rememberToken: varchar("remember_token", { length: 191 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
  },
  (table) => ({
    emailKey: uniqueIndex("users_email_key").on(table.email),
    usernameKey: uniqueIndex("users_username_key").on(table.username),
  })
);

// 4. Participants
export const participants = mysqlTable(
  "participants",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement().notNull(),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    instagram: varchar("instagram", { length: 191 }),
    asalSekolah: varchar("asal_sekolah", { length: 191 }),
    major: varchar("major", { length: 191 }),
    notelp: varchar("notelp", { length: 191 }),
    idline: varchar("idline", { length: 191 }),
    kampus: varchar("kampus", { length: 191 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
  },
  (table) => ({
    userKey: uniqueIndex("participants_user_id_key").on(table.userId),
  })
);

// 5. Junction Table: _groupparticipant
export const groupparticipant = mysqlTable(
  "_groupparticipant",
  {
    a: bigint("A", { mode: "number" })
      .notNull()
      .references(() => groups.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: bigint("B", { mode: "number" })
      .notNull()
      .references(() => participants.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    abUnique: uniqueIndex("_GroupParticipant_AB_unique").on(table.a, table.b),
    bIdx: index("_GroupParticipant_B_index").on(table.b),
  })
);

// 6. Junction Table: _groupuser
export const groupuser = mysqlTable(
  "_groupuser",
  {
    a: bigint("A", { mode: "number" })
      .notNull()
      .references(() => groups.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: bigint("B", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => ({
    abUnique: uniqueIndex("_GroupUser_AB_unique").on(table.a, table.b),
    bIdx: index("_GroupUser_B_index").on(table.b),
  })
);

// 7. Permissions
export const permissions = mysqlTable(
  "permissions",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    guardName: varchar("guard_name", { length: 191 }).notNull().default("web"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => ({
    nameKey: uniqueIndex("permissions_name_key").on(table.name),
  })
);

// 8. Roles
export const roles = mysqlTable(
  "roles",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    guardName: varchar("guard_name", { length: 191 }).notNull().default("web"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => ({
    nameKey: uniqueIndex("roles_name_key").on(table.name),
  })
);

// 9. Junction Table: _rolepermissions
export const rolepermissions = mysqlTable(
  "_rolepermissions",
  {
    a: bigint("A", { mode: "number" })
      .notNull()
      .references(() => permissions.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: bigint("B", { mode: "number" })
      .notNull()
      .references(() => roles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => ({
    abUnique: uniqueIndex("_RolePermissions_AB_unique").on(table.a, table.b),
    bIdx: index("_RolePermissions_B_index").on(table.b),
  })
);

// 10. Junction Table: _userroles
export const userroles = mysqlTable(
  "_userroles",
  {
    a: bigint("A", { mode: "number" })
      .notNull()
      .references(() => roles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    b: bigint("B", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => ({
    abUnique: uniqueIndex("_UserRoles_AB_unique").on(table.a, table.b),
    bIdx: index("_UserRoles_B_index").on(table.b),
  })
);

// 11. Assignments
export const assignments = mysqlTable("assignments", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement().notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "string" }),
  updatedAt: timestamp("updated_at", { mode: "string" }),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
});

// 12. Assignment Submissions
export const assignmentSubmissions = mysqlTable("assignment_submissions", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement().notNull(),
  assignmentId: bigint("assignment_id", { mode: "number" })
    .notNull()
    .references(() => assignments.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  participantId: bigint("participant_id", { mode: "number" })
    .notNull()
    .references(() => participants.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  gradedByUserId: bigint("graded_by_user_id", { mode: "number" }).references(
    () => users.id,
    { onDelete: "set null", onUpdate: "cascade" }
  ),
  score: int("score"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "string" }),
  updatedAt: timestamp("updated_at", { mode: "string" }),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
});

// 13. Attendance Sessions
export const attendanceSessions = mysqlTable("attendance_sessions", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement().notNull(),
  groupTypeId: bigint("group_type_id", { mode: "number" })
    .notNull()
    .references(() => groupTypes.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  name: varchar("name", { length: 191 }).notNull(),
  date: date("date", { mode: "string" }).notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }),
  updatedAt: timestamp("updated_at", { mode: "string" }),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
});

// 14. Attendances
export const attendances = mysqlTable(
  "attendances",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement().notNull(),
    participantId: bigint("participant_id", { mode: "number" })
      .notNull()
      .references(() => participants.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    attendanceSessionId: bigint("attendance_session_id", { mode: "number" })
      .notNull()
      .references(() => attendanceSessions.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    recordedByUserId: bigint("recorded_by_user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    status: mysqlEnum("status", ["present", "excused", "absent"])
      .notNull()
      .default("present"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => ({
    partSessionUnique: uniqueIndex(
      "attendances_participant_id_attendance_session_id_key"
    ).on(table.participantId, table.attendanceSessionId),
  })
);

// 15. Game Credentials
export const gameCredentials = mysqlTable("game_credentials", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement().notNull(),
  participantId: bigint("participant_id", { mode: "number" })
    .notNull()
    .references(() => participants.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  passwordEt: varchar("password_et", { length: 191 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }),
  updatedAt: timestamp("updated_at", { mode: "string" }),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
});

// 16. Password Changes
export const passwordChanges = mysqlTable(
  "password_changes",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement().notNull(),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    changedAt: timestamp("changed_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => ({
    userUnique: uniqueIndex("password_changes_user_id_key").on(table.userId),
  })
);

// 17. Violation Types
export const violationTypes = mysqlTable("violation_types", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement().notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  type: mysqlEnum("type", ["ringan", "sedang", "berat"]).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }),
  updatedAt: timestamp("updated_at", { mode: "string" }),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
});

// 18. Violations
export const violations = mysqlTable("violations", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement().notNull(),
  participantId: bigint("participant_id", { mode: "number" })
    .notNull()
    .references(() => participants.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  violationTypeId: bigint("violation_type_id", { mode: "number" })
    .notNull()
    .references(() => violationTypes.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  recordedByUserId: bigint("recorded_by_user_id", { mode: "number" })
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  notes: text("notes"),
  committedAt: datetime("committed_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }),
  updatedAt: timestamp("updated_at", { mode: "string" }),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
  createdBy: bigint("created_by", { mode: "number" }).references(
    () => users.id,
    { onDelete: "set null", onUpdate: "cascade" }
  ),
});
