import { useState, useEffect } from 'react'

const BookDetails = ({ book, onClose }) => {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const fetchDetails = async () => {
      if (!book.key) return

      setLoading(true)
      setError(null)

      try {
        // Extract work key if it's an edition key
        let workKey = book.key
        if (workKey.startsWith('/works/')) {
          workKey = workKey
        } else if (workKey.startsWith('/books/')) {
          // Try to get work key from edition
          const editionKey = workKey.replace('/books/', '')
          const editionUrl = `https://openlibrary.org/books/${editionKey}.json`
          const editionRes = await fetch(editionUrl)
          if (editionRes.ok) {
            const editionData = await editionRes.json()
            if (editionData.works) {
              workKey = editionData.works[0].key
            }
          }
        }

        if (workKey.startsWith('/works/')) {
          const workId = workKey.replace('/works/', '')
          const url = `https://openlibrary.org/works/${workId}.json`
          const response = await fetch(url)
          if (response.ok) {
            const data = await response.json()
            setDetails(data)
          }
        }
      } catch (err) {
        setError('Failed to load additional details')
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [book.key])

  const coverId = book.cover_i
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null

  const authors = book.author_name || []
  const firstPublished = book.first_publish_year
  const isbn = book.isbn?.[0] || null
  const publisher = book.publisher?.[0] || book.publisher_facet?.[0] || null
  const pages = book.number_of_pages_median || book.number_of_pages || null
  const editionCount = book.edition_count || null
  const subjects = book.subject || []

  const description = details?.description
    ? typeof details.description === 'string'
      ? details.description
      : details.description.value || ''
    : null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold bg-white dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
          aria-label="Close"
        >
          ×
        </button>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Cover */}
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-gray-200 dark:from-gray-700 to-gray-300 dark:to-gray-800 rounded-lg flex items-center justify-center h-80 relative overflow-hidden">
                {/* Placeholder */}
                {(!coverUrl || imageError || !imageLoaded) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl opacity-40 dark:opacity-30">📖</span>
                    {coverUrl && !imageError && !imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Lazy-loaded image */}
                {coverUrl && !imageError && (
                  <img
                    src={coverUrl}
                    alt={book.title}
                    loading="lazy"
                    className={`w-full h-full object-contain rounded-lg transition-opacity duration-300 ${
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
            </div>

            {/* Basic Info */}
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">{book.title}</h2>

              {authors.length > 0 && (
                <div className="mb-4">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Author{authors.length > 1 ? 's' : ''}:</span>{' '}
                  <span className="text-gray-600 dark:text-gray-400">{authors.join(', ')}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                {firstPublished && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Published:</span>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{firstPublished}</span>
                  </div>
                )}

                {publisher && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Publisher:</span>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{publisher}</span>
                  </div>
                )}

                {pages && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Pages:</span>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{pages}</span>
                  </div>
                )}

                {book.language && book.language.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Language:</span>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{book.language.join(', ')}</span>
                  </div>
                )}

                {isbn && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">ISBN:</span>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{isbn}</span>
                  </div>
                )}

                {editionCount && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Editions:</span>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{editionCount}</span>
                  </div>
                )}
              </div>

              {book.ratings_average && (
                <div className="mb-4">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Rating:</span>{' '}
                  <span className="text-blue-600 dark:text-blue-400">
                    ⭐ {book.ratings_average.toFixed(1)}
                    {book.ratings_count && ` (${book.ratings_count} reviews)`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Loading additional details...</p>
            </div>
          ) : error ? (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 dark:border-yellow-400 text-yellow-700 dark:text-yellow-300 p-4 rounded mb-6">
              <p>{error}</p>
            </div>
          ) : null}

          {description && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Description</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            </div>
          )}

          {/* Subjects */}
          {subjects.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Subjects & Topics</h3>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details from Works API */}
          {details && (
            <div className="space-y-4">
              {details.subjects && details.subjects.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Additional Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.subjects.slice(0, 10).map((subject, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                      >
                        {typeof subject === 'string' ? subject : subject.name || subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {details.first_publish_date && (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">First Published:</span>{' '}
                  <span className="text-gray-600 dark:text-gray-400">{details.first_publish_date}</span>
                </div>
              )}

              {details.key && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href={`https://openlibrary.org${book.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                  >
                    View on Open Library →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookDetails
