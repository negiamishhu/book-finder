import { useState } from 'react'

const BookCard = ({ book, onViewDetails }) => {
  const coverId = book.cover_i
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null

  const [imageError, setImageError] = useState(false)

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
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full border border-gray-200/50 hover:border-blue-300/50 hover:-translate-y-1">
      {/* Book Cover */}
      <div className="h-80 bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 z-10"></div>
        
        {coverUrl && !imageError ? (
          <img
            src={coverUrl}
            alt={book.title}
            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 z-0"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-7xl opacity-40 group-hover:opacity-60 transition-opacity duration-300">📖</span>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/30">
        <h3 className="text-xl font-bold text-gray-900 mb-1.5 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors duration-300">
          {book.title}
        </h3>

        {authors.length > 0 && (
          <p className="text-sm text-gray-600 font-medium mb-4">
            <span className="text-gray-400 text-xs mr-1">by</span>
            {authors.slice(0, 2).join(', ')}
            {authors.length > 2 && <span className="text-gray-400"> +{authors.length - 2} more</span>}
          </p>
        )}

        <div className="mt-auto space-y-2.5 pt-3 border-t border-gray-200/60">
          {/* Ratings - Prominent if available */}
          {ratings && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-amber-50 px-3 py-2 rounded-lg border border-yellow-200/50">
              <div className="flex items-center gap-1.5">
                <span className="text-yellow-500 text-lg leading-none">⭐</span>
                <span className="font-bold text-gray-900 text-sm">{ratings}</span>
                <span className="text-gray-400 text-xs">/ 5</span>
              </div>
              {ratingsCount && (
                <span className="text-xs text-gray-500 ml-auto">
                  {ratingsCount} {ratingsCount === 1 ? 'review' : 'reviews'}
                </span>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            {firstPublished && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <span className="text-gray-400">📅</span>
                <span className="font-medium">{firstPublished}</span>
              </div>
            )}

            {pages && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <span className="text-gray-400">📄</span>
                <span className="font-medium">{pages} pages</span>
              </div>
            )}
          </div>

          {/* Subjects */}
          {subjects.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {subjects.map((subject, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-full font-medium border border-purple-200/30 hover:border-purple-300/50 hover:from-purple-100 hover:to-pink-100 transition-all duration-200"
                >
                  {subject.length > 20 ? subject.substring(0, 20) + '...' : subject}
                </span>
              ))}
            </div>
          )}

          {/* View Details Button */}
          {onViewDetails && book.key && (
            <button
              onClick={() => onViewDetails(book)}
              className="mt-4 w-full px-5 py-3 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:via-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]"
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
