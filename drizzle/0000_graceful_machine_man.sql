-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `assignments` (
	`id` bigint(20) AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text DEFAULT 'NULL',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`deleted_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `assignment_submissions` (
	`id` bigint(20) AUTO_INCREMENT NOT NULL,
	`assignment_id` bigint(20) NOT NULL,
	`participant_id` bigint(20) NOT NULL,
	`graded_by_user_id` bigint(20) DEFAULT 'NULL',
	`score` int(11) DEFAULT 'NULL',
	`notes` text DEFAULT 'NULL',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`deleted_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `attendances` (
	`id` bigint(20) AUTO_INCREMENT NOT NULL,
	`participant_id` bigint(20) NOT NULL,
	`attendance_session_id` bigint(20) NOT NULL,
	`recorded_by_user_id` bigint(20) NOT NULL,
	`status` enum('present','excused','absent') NOT NULL DEFAULT '''present''',
	`notes` text DEFAULT 'NULL',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	CONSTRAINT `attendances_participant_id_attendance_session_id_key` UNIQUE(`participant_id`,`attendance_session_id`)
);
--> statement-breakpoint
CREATE TABLE `attendance_sessions` (
	`id` bigint(20) AUTO_INCREMENT NOT NULL,
	`group_type_id` bigint(20) NOT NULL,
	`name` varchar(191) NOT NULL,
	`date` date NOT NULL,
	`start_time` time NOT NULL,
	`end_time` time NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`deleted_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `game_credentials` (
	`id` bigint(20) AUTO_INCREMENT NOT NULL,
	`participant_id` bigint(20) NOT NULL,
	`password_et` varchar(191) NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`deleted_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` bigint(20) AUTO_INCREMENT NOT NULL,
	`group_type_id` bigint(20) NOT NULL,
	`name` varchar(191) NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`deleted_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `group_types` (
	`id` bigint(20) AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`deleted_at` timestamp DEFAULT 'NULL',
	CONSTRAINT `group_types_name_key` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `participants` (
	`id` bigint(20) AUTO_INCREMENT NOT NULL,
	`user_id` bigint(20) NOT NULL,
	`instagram` varchar(191) DEFAULT 'NULL',
	`asal_sekolah` varchar(191) DEFAULT 'NULL',
	`major` varchar(191) DEFAULT 'NULL',
	`notelp` varchar(191) DEFAULT 'NULL',
	`idline` varchar(191) DEFAULT 'NULL',
	`kampus` varchar(191) DEFAULT 'NULL',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`deleted_at` timestamp DEFAULT 'NULL',
	CONSTRAINT `participants_user_id_key` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `password_changes` (
	`id` bigint(20) AUTO_INCREMENT NOT NULL,
	`user_id` bigint(20) NOT NULL,
	`changed_at` timestamp NOT NULL DEFAULT 'current_timestamp()',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	CONSTRAINT `password_changes_user_id_key` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` bigint(20) AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`guard_name` varchar(191) NOT NULL DEFAULT '''web''',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	CONSTRAINT `permissions_name_key` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` bigint(20) AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`guard_name` varchar(191) NOT NULL DEFAULT '''web''',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	CONSTRAINT `roles_name_key` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint(20) AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`username` varchar(191) NOT NULL,
	`email_verified_at` timestamp DEFAULT 'NULL',
	`password` varchar(191) NOT NULL,
	`remember_token` varchar(191) DEFAULT 'NULL',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`deleted_at` timestamp DEFAULT 'NULL',
	CONSTRAINT `users_email_key` UNIQUE(`email`),
	CONSTRAINT `users_username_key` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `violations` (
	`id` bigint(20) AUTO_INCREMENT NOT NULL,
	`participant_id` bigint(20) NOT NULL,
	`violation_type_id` bigint(20) NOT NULL,
	`recorded_by_user_id` bigint(20) NOT NULL,
	`notes` text DEFAULT 'NULL',
	`committed_at` datetime DEFAULT 'NULL',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`deleted_at` timestamp DEFAULT 'NULL',
	`created_by` bigint(20) DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `violation_types` (
	`id` bigint(20) AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`type` enum('ringan','sedang','berat') NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`deleted_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `_groupparticipant` (
	`A` bigint(20) NOT NULL,
	`B` bigint(20) NOT NULL,
	CONSTRAINT `_GroupParticipant_AB_unique` UNIQUE(`A`,`B`)
);
--> statement-breakpoint
CREATE TABLE `_groupuser` (
	`A` bigint(20) NOT NULL,
	`B` bigint(20) NOT NULL,
	CONSTRAINT `_GroupUser_AB_unique` UNIQUE(`A`,`B`)
);
--> statement-breakpoint
CREATE TABLE `_rolepermissions` (
	`A` bigint(20) NOT NULL,
	`B` bigint(20) NOT NULL,
	CONSTRAINT `_RolePermissions_AB_unique` UNIQUE(`A`,`B`)
);
--> statement-breakpoint
CREATE TABLE `_userroles` (
	`A` bigint(20) NOT NULL,
	`B` bigint(20) NOT NULL,
	CONSTRAINT `_UserRoles_AB_unique` UNIQUE(`A`,`B`)
);
--> statement-breakpoint
ALTER TABLE `assignment_submissions` ADD CONSTRAINT `assignment_submissions_assignment_id_fkey` FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `assignment_submissions` ADD CONSTRAINT `assignment_submissions_graded_by_user_id_fkey` FOREIGN KEY (`graded_by_user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `assignment_submissions` ADD CONSTRAINT `assignment_submissions_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_attendance_session_id_fkey` FOREIGN KEY (`attendance_session_id`) REFERENCES `attendance_sessions`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_recorded_by_user_id_fkey` FOREIGN KEY (`recorded_by_user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `attendance_sessions` ADD CONSTRAINT `attendance_sessions_group_type_id_fkey` FOREIGN KEY (`group_type_id`) REFERENCES `group_types`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `game_credentials` ADD CONSTRAINT `game_credentials_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `groups` ADD CONSTRAINT `groups_group_type_id_fkey` FOREIGN KEY (`group_type_id`) REFERENCES `group_types`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `participants` ADD CONSTRAINT `participants_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `password_changes` ADD CONSTRAINT `password_changes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `violations` ADD CONSTRAINT `violations_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `violations` ADD CONSTRAINT `violations_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `violations` ADD CONSTRAINT `violations_recorded_by_user_id_fkey` FOREIGN KEY (`recorded_by_user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `violations` ADD CONSTRAINT `violations_violation_type_id_fkey` FOREIGN KEY (`violation_type_id`) REFERENCES `violation_types`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_groupparticipant` ADD CONSTRAINT `_GroupParticipant_A_fkey` FOREIGN KEY (`A`) REFERENCES `groups`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_groupparticipant` ADD CONSTRAINT `_GroupParticipant_B_fkey` FOREIGN KEY (`B`) REFERENCES `participants`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_groupuser` ADD CONSTRAINT `_GroupUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `groups`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_groupuser` ADD CONSTRAINT `_GroupUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_rolepermissions` ADD CONSTRAINT `_RolePermissions_A_fkey` FOREIGN KEY (`A`) REFERENCES `permissions`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_rolepermissions` ADD CONSTRAINT `_RolePermissions_B_fkey` FOREIGN KEY (`B`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_userroles` ADD CONSTRAINT `_UserRoles_A_fkey` FOREIGN KEY (`A`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_userroles` ADD CONSTRAINT `_UserRoles_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `_GroupParticipant_B_index` ON `_groupparticipant` (`B`);--> statement-breakpoint
CREATE INDEX `_GroupUser_B_index` ON `_groupuser` (`B`);--> statement-breakpoint
CREATE INDEX `_RolePermissions_B_index` ON `_rolepermissions` (`B`);--> statement-breakpoint
CREATE INDEX `_UserRoles_B_index` ON `_userroles` (`B`);
*/