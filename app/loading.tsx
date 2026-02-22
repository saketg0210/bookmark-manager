export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        {/* Simple CSS Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
        <p className="text-sm font-medium text-gray-500">Checking session...</p>
      </div>
    </div>
  )
}