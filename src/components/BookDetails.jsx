import { useState, useEffect } from 'react'

const BookDetails = ({ book, onClose }) => {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
        >
          ×
        </button>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Cover */}
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center h-80">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={book.title}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <span className="text-8xl">📖</span>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">{book.title}</h2>

              {authors.length > 0 && (
                <div className="mb-4">
                  <span className="font-semibold text-gray-700">Author{authors.length > 1 ? 's' : ''}:</span>{' '}
                  <span className="text-gray-600">{authors.join(', ')}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                {firstPublished && (
                  <div>
                    <span className="font-semibold text-gray-700">Published:</span>{' '}
                    <span className="text-gray-600">{firstPublished}</span>
                  </div>
                )}

                {publisher && (
                  <div>
                    <span className="font-semibold text-gray-700">Publisher:</span>{' '}
                    <span className="text-gray-600">{publisher}</span>
                  </div>
                )}

                {pages && (
                  <div>
                    <span className="font-semibold text-gray-700">Pages:</span>{' '}
                    <span className="text-gray-600">{pages}</span>
                  </div>
                )}

                {book.language && book.language.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-700">Language:</span>{' '}
                    <span className="text-gray-600">{book.language.join(', ')}</span>
                  </div>
                )}

                {isbn && (
                  <div>
                    <span className="font-semibold text-gray-700">ISBN:</span>{' '}
                    <span className="text-gray-600">{isbn}</span>
                  </div>
                )}

                {editionCount && (
                  <div>
                    <span className="font-semibold text-gray-700">Editions:</span>{' '}
                    <span className="text-gray-600">{editionCount}</span>
                  </div>
                )}
              </div>

              {book.ratings_average && (
                <div className="mb-4">
                  <span className="font-semibold text-gray-700">Rating:</span>{' '}
                  <span className="text-blue-600">
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading additional details...</p>
            </div>
          ) : error ? (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-6">
              <p>{error}</p>
            </div>
          ) : null}

          {description && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            </div>
          )}

          {/* Subjects */}
          {subjects.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Subjects & Topics</h3>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Additional Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.subjects.slice(0, 10).map((subject, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {typeof subject === 'string' ? subject : subject.name || subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {details.first_publish_date && (
                <div>
                  <span className="font-semibold text-gray-700">First Published:</span>{' '}
                  <span className="text-gray-600">{details.first_publish_date}</span>
                </div>
              )}

              {details.key && (
                <div className="pt-4 border-t">
                  <a
                    href={`https://openlibrary.org${book.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
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
