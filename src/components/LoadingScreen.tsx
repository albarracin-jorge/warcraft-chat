export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-3xl fantasy text-amber-200 mb-4 [text-shadow:0_0_12px_rgba(251,191,36,0.5)]">
          Warcraft Chat
        </h1>
        <p className="text-amber-100/60 mb-6">
          Preparing the battlefield...
        </p>
        <div className="flex gap-2 justify-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse delay-100"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  )
}
