import { useState, useEffect, useRef } from 'react'

const SearchHistory = ({ onSearchClick, onClearHistory }) => {
  const [searchHistory, setSearchHistory] = useState([])
  const [trendingBooks, setTrendingBooks] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)

   useEffect(() => {
    const saved = localStorage.getItem('bookSearchHistory')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
         const sorted = parsed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        setSearchHistory(sorted.slice(0, 10)) // Keep only last 10 searches
      } catch (e) {
        console.error('Error loading search history:', e)
      }
    }
  }, [])

  // Fetch trending books on mount
  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        // Fetch some popular books for trending section
        const response = await fetch('https://openlibrary.org/search.json?subject=best_sellers&limit=8&sort=rating desc')
        if (response.ok) {
          const data = await response.json()
          setTrendingBooks(data.docs || [])
        }
      } catch (error) {
        console.error('Error fetching trending books:', error)
      }
    }
    fetchTrendingBooks()
  }, [])

  const handleSearchClick = (query, type) => {
    // Update search history
    const newHistory = [
      { query, type, timestamp: new Date().toISOString() },
      ...searchHistory.filter(item => !(item.query === query && item.type === type))
    ].slice(0, 10)
    
    setSearchHistory(newHistory)
    localStorage.setItem('bookSearchHistory', JSON.stringify(newHistory))
    onSearchClick(query, type)
  }

  const handleClearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('bookSearchHistory')
    if (onClearHistory) {
      onClearHistory()
    }
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffInSeconds = Math.floor((now - past) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return past.toLocaleDateString()
  }

  const getSearchTypeEmoji = (type) => {
    switch(type) {
      case 'title': return '📖'
      case 'author': return '✍️'
      case 'subject': return '🏷️'
      default: return '🔍'
    }
  }

  const itemsPerPage = 4
  const maxIndex = Math.max(0, Math.ceil(trendingBooks.length / itemsPerPage) - 1)

  const scrollToSlide = (index) => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth / (trendingBooks.length / itemsPerPage)
      carouselRef.current.scrollTo({
        left: scrollWidth * index,
        behavior: 'smooth'
      })
    }
    setCurrentIndex(index)
  }

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      scrollToSlide(currentIndex + 1)
    } else {
      scrollToSlide(0)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollToSlide(currentIndex - 1)
    } else {
      scrollToSlide(maxIndex)
    }
  }

  // Auto-scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const scrollWidth = carouselRef.current.scrollWidth / (trendingBooks.length / itemsPerPage)
        const scrollLeft = carouselRef.current.scrollLeft
        const newIndex = Math.round(scrollLeft / scrollWidth)
        setCurrentIndex(Math.min(newIndex, maxIndex))
      }
    }

    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll)
      return () => carousel.removeEventListener('scroll', handleScroll)
    }
  }, [trendingBooks.length, maxIndex])

  if (searchHistory.length === 0 && trendingBooks.length === 0) {
    return null
  }

  return (
    <>
      {/* Recent Searches Section - Only show if user has history */}
      {searchHistory.length > 0 && (
    <div className="max-w-8xl mx-8 mb-8 relative">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Recent Searches</h3>
              </div>
              <button
                onClick={handleClearHistory}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Clear search history"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchClick(item.query, item.type)}
                  className="group px-4 py-2 bg-gradient-to-r from-blue-50 dark:from-blue-900/30 to-indigo-50 dark:to-indigo-900/30 hover:from-blue-100 dark:hover:from-blue-900/50 hover:to-indigo-100 dark:hover:to-indigo-900/50 border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 hover:shadow-md"
                >
                  <span className="flex items-center gap-2">
                    <span>{getSearchTypeEmoji(item.type)}</span>
                    <span className="max-w-[150px] truncate">{item.query}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{getTimeAgo(item.timestamp)}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trending Books Section */}
      {trendingBooks.length > 0 && (
    <div className="max-w-8xl mx-8 mb-8 relative">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.337 2.93l2.5 5.5h6.5l-5.3 4.6 2 6.5-5.7-4.2-5.7 4.2 2-6.5-5.3-4.6h6.5l2.5-5.5z"/>
                </svg>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">🔥 Trending Books</h3>
              </div>
            {/* Carousel Navigation Buttons */}
            {trendingBooks.length > itemsPerPage && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-all duration-200"
                  aria-label="Previous books"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-all duration-200"
                  aria-label="Next books"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div 
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitScrollbar: { display: 'none' }
              }}
            >
              {/* Gradient fade on left */}
              <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white dark:from-gray-800 to-transparent z-10 pointer-events-none"></div>
              {/* Gradient fade on right */}
              <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent z-10 pointer-events-none"></div>
              
              {trendingBooks.map((book, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 snap-center"
                  style={{ width: 'calc((100% - 48px) / 4)', minWidth: '180px' }}
                >
                  <button
                    onClick={() => handleSearchClick(book.title, 'title')}
                    className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 w-full flex flex-col h-full border border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500"
                  >
                    {/* Cover Image */}
                    <div className="w-full aspect-[2/3] bg-gradient-to-br from-slate-100 dark:from-gray-700 via-gray-50 dark:via-gray-800 to-slate-100 dark:to-gray-700 flex items-center justify-center overflow-hidden relative">
                      {book.cover_i ? (
                        <>
                          <img
                            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              const placeholder = e.target.parentElement.querySelector('.placeholder')
                              if (placeholder) placeholder.style.display = 'flex'
                            }}
                          />
                          <div className="absolute inset-0 hidden items-center justify-center placeholder">
                            <div className="text-5xl text-gray-400 dark:text-gray-500">📖</div>
                          </div>
                        </>
                      ) : (
                        <div className="text-5xl text-gray-400 dark:text-gray-500">📖</div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-3 flex-1 flex flex-col">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-tight">
                        {book.title}
                      </h4>
                      {book.author_name?.[0] && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 flex-1">
                          {book.author_name[0]}
                        </p>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel Indicators */}
          {trendingBooks.length > itemsPerPage && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? 'w-8 bg-orange-500'
                      : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
          </div>
        </div>
      )}
    </>
  )
}

export default SearchHistory

 