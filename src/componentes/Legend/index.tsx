import * as React from 'react'
import './index.css'

interface LegendProps {
  legend: string
}

export const Legend: React.FC<LegendProps> = (props: any) => {
  const { legend } = props
  return (
  <div className='Legend'>{legend}</div>
  )
}
