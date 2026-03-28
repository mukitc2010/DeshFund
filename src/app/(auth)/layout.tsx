export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary-600 text-white font-bold text-xl mb-3 shadow-sm">
            F
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">FundBD</h1>
          <p className="text-sm text-secondary-500 mt-1">Crowdfunding for Bangladesh</p>
        </div>
        {children}
      </div>
    </div>
  );
}
