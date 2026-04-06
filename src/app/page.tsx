import Link from "next/link";

/**
 * DashboardPage reads searchParams to check for ?error=unauthorized
 * which is appended by the middleware when a non-panitia user 
 * tries to access restricted routes.
 */
export default function DashboardPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const showUnauthorizedToast = (searchParams as any).error === "unauthorized";

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
              Selamat datang di portal Masa Orientasi Bersama (MOB) FT 2026.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/pembelian-baju" className="btn btn-primary">
                Beli Baju
              </Link>
              <Link href="/engineering-tour" className="btn btn-secondary">
                Kuis ET
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
