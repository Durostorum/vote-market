export function TopicCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-16 h-6 bg-slate-800 rounded-full animate-pulse" />
        <div className="w-16 h-4 bg-slate-800 rounded animate-pulse" />
      </div>
      <div className="h-6 bg-slate-800 rounded mb-3 animate-pulse" />
      <div className="h-2 bg-slate-800 rounded mb-4 animate-pulse" />
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-slate-800 rounded-lg animate-pulse" />
        <div className="flex-1 h-10 bg-slate-800 rounded-lg animate-pulse" />
      </div>
    </div>
  )
}

export function NewsCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-12 h-5 bg-slate-800 rounded-full animate-pulse" />
        <div className="w-16 h-4 bg-slate-800 rounded animate-pulse" />
      </div>
      <div className="h-4 bg-slate-800 rounded mb-2 animate-pulse" />
      <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse" />
    </div>
  )
}

export function CommentSkeleton() {
  return (
    <div className="border-t border-border pt-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-slate-800 rounded w-24 mb-1 animate-pulse" />
          <div className="h-3 bg-slate-800 rounded w-16 animate-pulse" />
        </div>
      </div>
      <div className="h-4 bg-slate-800 rounded animate-pulse" />
      <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse" />
    </div>
  )
}
