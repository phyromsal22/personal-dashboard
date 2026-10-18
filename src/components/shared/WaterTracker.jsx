import { useState, useEffect } from 'react'
import { Droplets, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useWaterStore } from '@/store/waterStore'

export function WaterTracker() {
  const { waterAmount, fetchWater, addWater } = useWaterStore()
  const target = 8 // គោលដៅ ៨ កែវ
  const percent = Math.min((waterAmount / target) * 100, 100)

  useEffect(() => { fetchWater() }, [fetchWater])

  return (
    <Card className="flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-text">ការផឹកទឹក</h3>
        </div>
        <span className="text-sm font-bold text-blue-500">{waterAmount} / {target} កែវ</span>
      </div>
      
      <div className="h-3 w-full bg-surface-hover rounded-full overflow-hidden mb-4">
        <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs text-text-muted">{percent.toFixed(0)}% សម្រេច</p>
        <Button size="sm" variant="secondary" onClick={() => addWater(1)}>
          <Plus className="h-4 w-4 mr-1" /> ផឹក ១ កែវ
        </Button>
      </div>
    </Card>
  )
}