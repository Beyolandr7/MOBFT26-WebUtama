/**
 * DashboardPage reads searchParams to check for ?error=unauthorized
 * In Next.js 16+, searchParams is a Promise and must be awaited.
 */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const showUnauthorizedToast = params.error === "unauthorized";

  // Use absolute URLs for subdomain-based navigation
  const pesanBajuUrl =
    process.env.PESAN_BAJU_URL || "https://pembelian.ubayamobft.com";
  const etUrl = process.env.ET_URL || "https://et.ubayamobft.com";

  return (
    <main className="min-h-screen bg-base-200">
      {/* DaisyUI Toast: Displayed only when unauthorized access is detected */}
      {showUnauthorizedToast && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-error text-white">
            <span>Akses Ditolak: Halaman tersebut khusus Panitia MOB.</span>
          </div>
        </div>
      )}

      {/* Main Dashboard Hero */}
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Halo, Mahasiswa Baru!</h1>
            <p className="py-6 text-lg">
              Selamat datang di Masa Orientasi Bersama (MOB) FT 2026.
            </p>
            <div className="flex gap-4 justify-center">
              {/* Using absolute URLs for subdomain-based routing */}
              <a href={pesanBajuUrl} className="btn btn-primary">
                Beli Baju
              </a>
              <a href={etUrl} className="btn btn-secondary">
                Kuis ET
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
