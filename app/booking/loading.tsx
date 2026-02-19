export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-orange border-t-transparent rounded-full animate-spin" />
        <p className="text-foreground/60">加载中... / Loading...</p>
      </div>
    </div>
  )
}
