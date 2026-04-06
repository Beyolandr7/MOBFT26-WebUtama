import { relations } from "drizzle-orm/relations";
import {
  assignments,
  assignmentSubmissions,
  users,
  participants,
  attendanceSessions,
  attendances,
  groupTypes,
  gameCredentials,
  groups,
  passwordChanges,
  violations,
  violationTypes,
  groupparticipant,
  groupuser,
  permissions,
  rolepermissions,
  roles,
  userroles,
} from "./schema";

export const assignmentSubmissionsRelations = relations(
  assignmentSubmissions,
  ({ one }) => ({
    assignment: one(assignments, {
      fields: [assignmentSubmissions.assignmentId],
      references: [assignments.id],
    }),
    user: one(users, {
      fields: [assignmentSubmissions.gradedByUserId],
      references: [users.id],
    }),
    participant: one(participants, {
      fields: [assignmentSubmissions.participantId],
      references: [participants.id],
    }),
  })
);

export const assignmentsRelations = relations(assignments, ({ many }) => ({
  assignmentSubmissions: many(assignmentSubmissions),
}));

export const usersRelations = relations(users, ({ many }) => ({
  assignmentSubmissions: many(assignmentSubmissions),
  attendances: many(attendances),
  participants: many(participants),
  passwordChanges: many(passwordChanges),
  violations_createdBy: many(violations, {
    relationName: "violations_createdBy_users_id",
  }),
  violations_recordedByUserId: many(violations, {
    relationName: "violations_recordedByUserId_users_id",
  }),
  groupusers: many(groupuser),
  userroles: many(userroles),
}));

export const participantsRelations = relations(
  participants,
  ({ one, many }) => ({
    assignmentSubmissions: many(assignmentSubmissions),
    attendances: many(attendances),
    gameCredentials: many(gameCredentials),
    user: one(users, {
      fields: [participants.userId],
      references: [users.id],
    }),
    violations: many(violations),
    groupparticipants: many(groupparticipant),
  })
);

export const attendancesRelations = relations(attendances, ({ one }) => ({
  attendanceSession: one(attendanceSessions, {
    fields: [attendances.attendanceSessionId],
    references: [attendanceSessions.id],
  }),
  participant: one(participants, {
    fields: [attendances.participantId],
    references: [participants.id],
  }),
  user: one(users, {
    fields: [attendances.recordedByUserId],
    references: [users.id],
  }),
}));

export const attendanceSessionsRelations = relations(
  attendanceSessions,
  ({ one, many }) => ({
    attendances: many(attendances),
    groupType: one(groupTypes, {
      fields: [attendanceSessions.groupTypeId],
      references: [groupTypes.id],
    }),
  })
);

export const groupTypesRelations = relations(groupTypes, ({ many }) => ({
  attendanceSessions: many(attendanceSessions),
  groups: many(groups),
}));

export const gameCredentialsRelations = relations(
  gameCredentials,
  ({ one }) => ({
    participant: one(participants, {
      fields: [gameCredentials.participantId],
      references: [participants.id],
    }),
  })
);

export const groupsRelations = relations(groups, ({ one, many }) => ({
  groupType: one(groupTypes, {
    fields: [groups.groupTypeId],
    references: [groupTypes.id],
  }),
  groupparticipants: many(groupparticipant),
  groupusers: many(groupuser),
}));

export const passwordChangesRelations = relations(
  passwordChanges,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordChanges.userId],
      references: [users.id],
    }),
  })
);

export const violationsRelations = relations(violations, ({ one }) => ({
  user_createdBy: one(users, {
    fields: [violations.createdBy],
    references: [users.id],
    relationName: "violations_createdBy_users_id",
  }),
  participant: one(participants, {
    fields: [violations.participantId],
    references: [participants.id],
  }),
  user_recordedByUserId: one(users, {
    fields: [violations.recordedByUserId],
    references: [users.id],
    relationName: "violations_recordedByUserId_users_id",
  }),
  violationType: one(violationTypes, {
    fields: [violations.violationTypeId],
    references: [violationTypes.id],
  }),
}));

export const violationTypesRelations = relations(
  violationTypes,
  ({ many }) => ({
    violations: many(violations),
  })
);

export const groupparticipantRelations = relations(
  groupparticipant,
  ({ one }) => ({
    group: one(groups, {
      fields: [groupparticipant.a],
      references: [groups.id],
    }),
    participant: one(participants, {
      fields: [groupparticipant.b],
      references: [participants.id],
    }),
  })
);

export const groupuserRelations = relations(groupuser, ({ one }) => ({
  group: one(groups, {
    fields: [groupuser.a],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupuser.b],
    references: [users.id],
  }),
}));

export const rolepermissionsRelations = relations(
  rolepermissions,
  ({ one }) => ({
    permission: one(permissions, {
      fields: [rolepermissions.a],
      references: [permissions.id],
    }),
    role: one(roles, {
      fields: [rolepermissions.b],
      references: [roles.id],
    }),
  })
);

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolepermissions: many(rolepermissions),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  rolepermissions: many(rolepermissions),
  userroles: many(userroles),
}));

export const userrolesRelations = relations(userroles, ({ one }) => ({
  role: one(roles, {
    fields: [userroles.a],
    references: [roles.id],
  }),
  user: one(users, {
    fields: [userroles.b],
    references: [users.id],
  }),
}));
