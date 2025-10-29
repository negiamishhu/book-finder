import { useState, useEffect } from 'react'
import SwipeableRow from './SwipeableRow'

const SwipeableBookGrid = ({ children }) => {
  const [columns, setColumns] = useState(4)
  const childrenArray = Array.isArray(children) ? children : [children]

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1280) setColumns(4) // xl
      else if (window.innerWidth >= 1024) setColumns(3) // lg
      else if (window.innerWidth >= 768) setColumns(2) // md
      else setColumns(1) // sm and below
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  // Group children into rows based on columns
  const chunkArray = (array, chunkSize) => {
    const chunks = []
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
  }

  const rows = chunkArray(childrenArray, columns)

  return (
    <div className="space-y-6 md:space-y-8">
      {rows.map((row, rowIndex) => (
        <SwipeableRow 
          key={rowIndex} 
          className="px-2"
        >
          {row}
        </SwipeableRow>
      ))}
    </div>
  )
}

export default SwipeableBookGrid
