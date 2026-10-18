import { Button } from '@/components/ui/button'

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, description }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-up">
      <div className="card w-full max-w-sm bg-surface border-border">
        <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
        <p className="text-sm text-text-secondary mb-6">{description}</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>បោះបង់</Button>
          <Button variant="danger" onClick={() => { onConfirm(); onClose(); }}>លុបចោល</Button>
        </div>
      </div>
    </div>
  )
}