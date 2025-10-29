import { useState } from 'react'
import BookCard from './components/BookCard'
import SearchBar from './components/SearchBar'
import WelcomePage from './components/WelcomePage'
import BookDetails from './components/BookDetails'
import RotatingQuotes from './components/RotatingQuotes'
import SwipeableBookGrid from './components/SwipeableBookGrid'

function App() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)

  const searchBooks = async (searchQuery, searchType) => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term')
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      let url = ''
      const query = encodeURIComponent(searchQuery.trim())

      switch (searchType) {
        case 'title':
          url = `https://openlibrary.org/search.json?title=${query}`
          break
        case 'author':
          url = `https://openlibrary.org/search.json?author=${query}`
          break
        case 'subject':
          url = `https://openlibrary.org/search.json?subject=${query}`
          break
        default:
          url = `https://openlibrary.org/search.json?q=${query}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }

      const data = await response.json()
      setBooks(data.docs || [])
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            📚 Book Finder
          </h1>
          <p className="text-lg text-gray-600">
            Discover your next great read
          </p>
        </header>

        {/* Rotating Quotes */}
        <RotatingQuotes />

        {/* Search Bar */}
        <SearchBar onSearch={searchBooks} />

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 max-w-2xl mx-auto">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && (
          <div className="mt-8 px-4 md:px-6 lg:px-8">
            {books.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No books found. Try a different search term.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 px-2">
                  Found {books.length} book{books.length !== 1 ? 's' : ''}
                </h2>
                <SwipeableBookGrid>
                  {books.map((book, index) => (
                    <BookCard
                      key={`${book.key}-${index}`}
                      book={book}
                      onViewDetails={setSelectedBook}
                    />
                  ))}
                </SwipeableBookGrid>
              </>
            )}
          </div>
        )}

        {/* Welcome Page */}
        {!hasSearched && !loading && <WelcomePage />}

        {/* Book Details Modal */}
        {selectedBook && (
          <BookDetails
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
          />
        )}
      </div>
    </div>
  )
}

export default App
