import { useState, useRef, useEffect } from 'react'

const BookCard = ({ book, onViewDetails, onToggleFavorite, onToggleReadLater, isFavorite = false, isReadLater = false }) => {
  const coverId = book.cover_i
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null

  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef(null)
  const cardRef = useRef(null)

   useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '50px' }  
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  const authors = book.author_name || []
  const firstPublished = book.first_publish_year
  const isbn = book.isbn?.[0] || null
  const subjects = book.subject?.slice(0, 3) || []
  const publisher = book.publisher?.[0] || book.publisher_facet?.[0] || null
  const pages = book.number_of_pages_median || book.number_of_pages || null
  const editionCount = book.edition_count || null
  const ratings = book.ratings_average ? book.ratings_average.toFixed(1) : null
  const ratingsCount = book.ratings_count || null

  return (
    <div 
      ref={cardRef}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/50 hover:shadow-2xl dark:hover:shadow-gray-900 transition-all duration-500 overflow-hidden flex flex-col h-full border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 hover:-translate-y-1"
    >
       <div className="h-80 bg-gradient-to-br from-slate-100 dark:from-gray-700 via-gray-50 dark:via-gray-800 to-slate-100 dark:to-gray-700 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 group-hover:from-blue-500/5 dark:group-hover:from-blue-500/10 group-hover:to-purple-500/5 dark:group-hover:to-purple-500/10 transition-all duration-500 z-10"></div>
        
         {(onToggleFavorite || onToggleReadLater) && (
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite()
                }}
                className={`p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
                  isFavorite
                    ? 'bg-yellow-400 dark:bg-yellow-500 text-yellow-900'
                    : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            )}
            {onToggleReadLater && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleReadLater()
                }}
                className={`p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
                  isReadLater
                    ? 'bg-indigo-400 dark:bg-indigo-500 text-indigo-900'
                    : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                }`}
                title={isReadLater ? 'Remove from read later' : 'Save for later'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}
          </div>
        )}
        
    
        {(isFavorite || isReadLater) && (
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
            {isFavorite && (
              <span className="px-2.5 py-1 bg-yellow-400 dark:bg-yellow-500 text-yellow-900 dark:text-yellow-900 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Favorite
              </span>
            )}
            {isReadLater && (
              <span className="px-2.5 py-1 bg-indigo-400 dark:bg-indigo-500 text-indigo-900 dark:text-indigo-900 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Read Later
              </span>
            )}
          </div>
        )}
        
         {(!isInView || !coverUrl || imageError || !imageLoaded) && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <div className="flex flex-col items-center gap-2">
              <span className="text-7xl opacity-40 dark:opacity-30 group-hover:opacity-60 dark:group-hover:opacity-50 transition-opacity duration-300">📖</span>
              {isInView && coverUrl && !imageError && !imageLoaded && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
              )}
            </div>
          </div>
        )}
        
         {isInView && coverUrl && !imageError && (
          <img
            ref={imgRef}
            src={coverUrl}
            alt={book.title}
            loading="lazy"
            className={`w-full h-full object-contain transform group-hover:scale-105 transition-all duration-500 z-0 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true)
              setImageLoaded(false)
            }}
          />
        )}
      </div>

       <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-white dark:from-gray-800 to-gray-50/30 dark:to-gray-900/30">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1.5 line-clamp-2 leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
          {book.title}
        </h3>

        {authors.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-4">
            <span className="text-gray-400 dark:text-gray-500 text-xs mr-1">by</span>
            {authors.slice(0, 2).join(', ')}
            {authors.length > 2 && <span className="text-gray-400 dark:text-gray-500"> +{authors.length - 2} more</span>}
          </p>
        )}

        <div className="mt-auto space-y-2.5 pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
           {ratings && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 dark:from-yellow-900/30 to-amber-50 dark:to-amber-900/30 px-3 py-2 rounded-lg border border-yellow-200/50 dark:border-yellow-700/50">
              <div className="flex items-center gap-1.5">
                <span className="text-yellow-500 dark:text-yellow-400 text-lg leading-none">⭐</span>
                <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">{ratings}</span>
                <span className="text-gray-400 dark:text-gray-500 text-xs">/ 5</span>
              </div>
              {ratingsCount && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                  {ratingsCount} {ratingsCount === 1 ? 'review' : 'reviews'}
                </span>
              )}
            </div>
          )}

           <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            {firstPublished && (
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                <span className="text-gray-400 dark:text-gray-500">📅</span>
                <span className="font-medium">{firstPublished}</span>
              </div>
            )}

            {pages && (
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                <span className="text-gray-400 dark:text-gray-500">📄</span>
                <span className="font-medium">{pages} pages</span>
              </div>
            )}
          </div>

           {subjects.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {subjects.map((subject, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1.5 bg-gradient-to-r from-purple-50 dark:from-purple-900/30 to-pink-50 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium border border-purple-200/30 dark:border-purple-700/50 hover:border-purple-300/50 dark:hover:border-purple-600/50 hover:from-purple-100 dark:hover:from-purple-900/50 hover:to-pink-100 dark:hover:to-pink-900/50 transition-all duration-200"
                >
                  {subject.length > 20 ? subject.substring(0, 20) + '...' : subject}
                </span>
              ))}
            </div>
          )}

           {onViewDetails && book.key && (
            <button
              onClick={() => onViewDetails(book)}
              className="mt-4 w-full px-5 py-3 bg-gradient-to-r from-blue-600 dark:from-blue-500 via-blue-600 dark:via-blue-500 to-indigo-600 dark:to-indigo-500 text-white text-sm font-bold rounded-xl hover:from-blue-700 dark:hover:from-blue-600 hover:via-blue-700 dark:hover:via-blue-600 hover:to-indigo-700 dark:hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2">
                View Details
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookCard
