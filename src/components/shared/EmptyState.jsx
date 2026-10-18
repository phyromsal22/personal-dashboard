export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up">
      {Icon && <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"><Icon className="h-8 w-8 text-primary" /></div>}
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      {description && <p className="mt-1 text-sm text-text-secondary max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}