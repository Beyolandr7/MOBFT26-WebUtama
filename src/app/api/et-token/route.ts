import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { participants, gameCredentials } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/et-token
 *
 * Returns the ET game password for the authenticated maharu user.
 * This endpoint serves as the bridge for the ET sub-app to verify logins.
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "Autentikasi diperlukan" },
      { status: 401 }
    );
  }

  if (session.user.role !== "maharu") {
    return NextResponse.json(
      { error: "Hanya maharu yang dapat mengakses token ET" },
      { status: 403 }
    );
  }

  // Look up the participant record for this user
  const participantRows = await db
    .select({ id: participants.id })
    .from(participants)
    .where(eq(participants.userId, Number(session.user.id)))
    .limit(1);

  if (participantRows.length === 0) {
    return NextResponse.json(
      { error: "Data peserta tidak ditemukan" },
      { status: 404 }
    );
  }

  const participant = participantRows[0];

  // Fetch the ET game credential
  const credentialRows = await db
    .select({ passwordEt: gameCredentials.passwordEt })
    .from(gameCredentials)
    .where(eq(gameCredentials.participantId, participant.id))
    .limit(1);

  if (credentialRows.length === 0) {
    return NextResponse.json(
      { error: "Kredensial ET tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({ passwordEt: credentialRows[0].passwordEt });
}
