# Foundation - User Module (MOB FT 2026)

Framework used: NextAuth.js (Credentials Provider) + Drizzle ORM.

## Roles, Permissions, and Access (Granular RBAC)

The system uses a granular permissions model. Instead of hardcoding role checks (e.g., `if (role === 'maping')`), the application MUST verify if the user possesses the specific permission (e.g., `if (permissions.includes('create_attendance'))`).

Roles are granted specific permissions via the `_rolepermissions` bridging table, and users are assigned roles via the `_userroles` table.

### Division Roles

The system contains 12 specific roles (divisions) stored in the `roles` table:

1. `super_admin` (ID 1): Full god-mode access.
2. `bph` (ID 2, Badan Pengurus Harian): Read-only global access, reporting, and statistics.
3. `itd` (ID 3, Information Technology Department): Full god-mode access, system maintenance.
4. `ad` (ID 4, Administration Department): Attendance session and schedule management.
5. `sfd` (ID 5, Security Force Department): Recording student violations.
6. `ed` (ID 6, Event Director): Game progression monitoring and assignment grading.
7. `maping` (ID 7, Mahasiswa Pendamping): Group specific access, student lookup within their group, and daily attendance recording.
8. `maharu` (ID 8, Mahasiswa Baru): Participant/Student role. Limited access to their own data.
9. `te` (ID 9, Technical Equipment): General committee access.
10. `hrd` (ID 10, Health Resource Department): Committee management and performance tracking.
11. `ddd` (ID 11, Design and Documentation Department): General committee access.
12. `sfd koorwa` (ID 22, Security Force Department Coordinator): Full violation master management, override capabilities.

### Permission Categories

There are 112 distinct permissions defined in the `permissions` table, falling into two main categories:

1. **Model CRUD Permissions:** Format `[action]_[model]` (e.g., `view_any_participant`, `create_violation`, `update_attendance::session`).
2. **Page/Feature Access Permissions:** - `access_admin_panel`: Gateway permission to enter the admin dashboard.
   - `page_AttendanceRecording`: Access to input daily attendance.
   - `page_AttendanceReport`: Access to view aggregate attendance data.
   - `page_ViolationRecording`: Access to input violations.
   - `page_ViolationReport`: Access to view aggregate violation data.
   - `page_FacilitatorGroups`: Access for `maping` to view their designated groups.

## Data Ownership

- `users` is the core authentication table holding credentials.
- `roles` and `permissions` are dynamic RBAC tables.
- `participants` is a custom extension table specifically containing "Mahasiswa Baru" (Maharu) details.
- Panitia (Committee) and Admins do not have a `participants` record; they only exist in `users` with their respective roles.

## Schema (Updated)

### Table `users`

This is the core table used by NextAuth Credentials Provider.

| Column                     | Description                                                |
| :------------------------- | :--------------------------------------------------------- |
| `id`                       | `bigint`, Primary Key, Auto Increment.                     |
| `name`                     | `varchar(191)`, Full name of the user (Panitia or Maharu). |
| `email`                    | `varchar(191)`, User's email address (Unique).             |
| `username`                 | `varchar(191)`, Primary login identifier (NRP) (Unique).   |
| `email_verified_at`        | `timestamp`, Nullable. For future verification features.   |
| `password`                 | `varchar(191)`, Bcrypt hashed password.                    |
| `remember_token`           | `varchar(191)`, Nullable. For "remember me" sessions.      |
| `created_at`, `updated_at` | `timestamp`, Nullable. Standard timestamps.                |
| `deleted_at`               | `timestamp`, Nullable. Soft delete marker.                 |

### Table `participants`

This table contains the extended profile information for Maharu. It is strictly tied to `users`.

| Column                     | Description                                                      |
| :------------------------- | :--------------------------------------------------------------- |
| `id`                       | `bigint`, Primary Key, Auto Increment.                           |
| `user_id`                  | `bigint`, Unique. FK referencing `users.id` (ON DELETE CASCADE). |
| `asal_sekolah`             | `varchar(191)`, High school origin (Nullable).                   |
| `major`                    | `varchar(191)`, University major/jurusan (Nullable).             |
| `kampus`                   | `varchar(191)`, Campus location (Nullable).                      |
| `notelp`                   | `varchar(191)`, Phone/WhatsApp number (Nullable).                |
| `idline`                   | `varchar(191)`, LINE Messenger ID (Nullable).                    |
| `instagram`                | `varchar(191)`, Instagram Handle (Nullable).                     |
| `created_at`, `updated_at` | `timestamp`, Nullable. Standard timestamps.                      |
| `deleted_at`               | `timestamp`, Nullable. Soft delete marker.                       |

### RBAC Bridging Tables

- `_userroles`: Implicit many-to-many bridging table (`A` = role_id, `B` = user_id) mapping users to their roles.
- `_rolepermissions`: Implicit many-to-many bridging table (`A` = permission_id, `B` = role_id) mapping roles to permissions.

## Validation and Data Rules

- **Foreign Key Strictness:** `participants.user_id` MUST use `ON DELETE CASCADE ON UPDATE CASCADE`. If a user is hard-deleted or updated, the participant record must follow.
- **Zod Validation:** Use a Zod object for `username` (NRP) validation (must be numeric, exactly 9 digits for Ubaya standard).
- **Phone Normalization:** The `notelp` input field should be normalized on the backend (e.g., converting leading `0` to `+62` or `62`).
- **1-to-1 Mapping:** `user_id` in `participants` must be strictly unique.
- **Password Strength:** Passwords must be validated during creation/change (minimum 8 characters).

## Profile & Form Rules

- **Participant Profile Form:** Should display `name`, `username` (NRP), and `email` as read-only.
- Editable participant fields: `notelp`, `idline`, `instagram`.
- `kampus`, `major`, and `asal_sekolah` are locked/read-only for students (managed by admin/imported via CSV).
- **Admin/Panitia Profile Form:** Only allows changing password and viewing their assigned division/role.

## Admin Operations

- `super_admin` or `itd` can create users and participants manually, but primary onboarding is via CSV Bulk Import (`npm run db:seed`).
- `super_admin` can reset a user's password to default (their NRP).
- Soft delete (`deleted_at`) is used instead of hard deletion to maintain relational integrity with `attendances` and `violations`.

## Lifecycle and Auth Rules

- Initial passwords for all users are generated using their `username` (NRP) hashed via Bcrypt during CSV import.
- Upon first login, `maharu` are encouraged to update their passwords. Password changes are logged in the `password_changes` table.
- Login exclusively uses `username` (NRP) and `password`.
- If an account is soft-deleted (`deleted_at` is not null), the NextAuth `authorize` callback MUST reject the login attempt.
- **Session Injection:** When a user logs in, the NextAuth authorize callback MUST fetch the user's roles AND perform a `JOIN` to fetch all their assigned `permissions.name` from `_rolepermissions`.
- **JWT & Session:** The `permissions` array (e.g., `['access_admin_panel', 'create_violation']`) must be injected into the JWT token and exported to the client session.

## API Surface

- `GET /api/account/profile` returns the logged-in user's data (joins `users` and `participants` if the user is `maharu`).
- `PATCH /api/account/password` updates the logged-in user's password and inserts a record into `password_changes`.
- `PATCH /api/account/socials` updates the `instagram`, `idline`, and `notelp` of the logged-in `maharu`.
- `GET /api/admin/participants` returns a paginated list of participants. Requires `view_any_participant` permission.
- `GET /api/admin/participants/:id` returns full details of a specific participant including their `group` (`_groupparticipant`).
- `POST /api/admin/users/:id/reset-password` resets password to NRP. Requires `update_user` permission.

## API Payloads

### Full Participant Response (For Admin/Panitia)

- `user`: `{ id, name, username, email, email_verified_at }`
- `participant`: `{ asal_sekolah, major, kampus, notelp, idline, instagram }`
- `group`: `{ id, name }` (Mapped from `_groupparticipant`)
- `roles`: `["maharu"]`

### Profile Response (For Maharu)

- `name`, `username`, `email`
- `asal_sekolah`, `major`, `kampus`
- `notelp`, `idline`, `instagram`
- `game_credentials`: `{ password_et }` (Hidden from panitia, only visible to the owner for Engineering Tour).

## UI Surface & Frontend Protections

- Login page (NRP & Password).
- Dashboard (Welcome page with role-based widgets).
- Logged-in profile settings page.
- **Middleware Protection:** `src/proxy.ts` should check route patterns against `token.permissions`. If a user tries to access `/admin/violations`, the middleware should verify `token.permissions.includes('page_ViolationRecording')`.
- **Component Hiding:** Use the session permissions array to conditionally render UI elements. Example: `<Button disabled={!session.permissions.includes('delete_violation')}>Delete</Button>`.
