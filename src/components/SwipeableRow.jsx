import { useRef, useState, useEffect } from 'react'

const SwipeableRow = ({ children, className = '' }) => {
  const containerRef = useRef(null)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  // Minimum swipe distance (px)
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !containerRef.current) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe || isRightSwipe) {
      const scrollAmount = containerRef.current.offsetWidth * 0.8
      const currentScroll = containerRef.current.scrollLeft

      if (isLeftSwipe) {
        containerRef.current.scrollTo({
          left: currentScroll + scrollAmount,
          behavior: 'smooth'
        })
      } else if (isRightSwipe) {
        containerRef.current.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: 'smooth'
        })
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  // Mouse drag support
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [initialScrollLeft, setInitialScrollLeft] = useState(0)

  const handleMouseDown = (e) => {
    if (!containerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setInitialScrollLeft(containerRef.current.scrollLeft)
    e.preventDefault()
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 2
    containerRef.current.scrollLeft = initialScrollLeft - walk
    updateArrowVisibility()
  }

  const updateArrowVisibility = () => {
    if (!containerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
    setShowLeftArrow(scrollLeft > 10)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      updateArrowVisibility()
      container.addEventListener('scroll', updateArrowVisibility)
      // Check on resize as well
      window.addEventListener('resize', updateArrowVisibility)
      return () => {
        container.removeEventListener('scroll', updateArrowVisibility)
        window.removeEventListener('resize', updateArrowVisibility)
      }
    }
  }, [])

  const handleScrollLeft = () => {
    if (!containerRef.current) return
    const scrollAmount = containerRef.current.offsetWidth * 0.8
    containerRef.current.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    })
    setTimeout(updateArrowVisibility, 100)
  }

  const handleScrollRight = () => {
    if (!containerRef.current) return
    const scrollAmount = containerRef.current.offsetWidth * 0.8
    containerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })
    setTimeout(updateArrowVisibility, 100)
  }

  return (
    <div className="relative group">
      {/* Left Chevron */}
      {showLeftArrow && (
        <button
          onClick={handleScrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
          aria-label="Scroll left"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Right Chevron */}
      {showRightArrow && (
        <button
          onClick={handleScrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
          aria-label="Scroll right"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      <div
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onScroll={updateArrowVisibility}
        className={`overflow-x-auto scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing ${className}`}
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x'
        }}
      >
        <div className="inline-flex gap-6 md:gap-8 lg:gap-10">
          {children}
        </div>
      </div>
    </div>
  )
}

export default SwipeableRow

