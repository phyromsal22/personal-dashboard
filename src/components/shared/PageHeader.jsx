export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6 animate-fade-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}