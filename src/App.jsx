import { useState, useEffect, useMemo, useCallback } from 'react'
import BookCard from './components/BookCard'
import SearchBar from './components/SearchBar'
import WelcomePage from './components/WelcomePage'
import BookDetails from './components/BookDetails'
import RotatingQuotes from './components/RotatingQuotes'
import FilterAndSort from './components/FilterAndSort'
import SearchHistory from './components/SearchHistory'

function App() {
  const [books, setBooks] = useState([]) // Original books from API
  const [filters, setFilters] = useState({
    author: '',
    subject: '',
    yearMin: '',
    yearMax: ''
  })
  const [sortBy, setSortBy] = useState('relevance')
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [activeTab, setActiveTab] = useState('search') // 'search', 'favorites', 'readLater'
  const [favorites, setFavorites] = useState([])
  const [readLater, setReadLater] = useState([])
  const [currentQuery, setCurrentQuery] = useState('')
  const [currentSearchType, setCurrentSearchType] = useState('title')
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or default to dark mode
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      return saved === 'true'
    }
    return true // Default to dark mode
  })

  // Load favorites and readLater from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('bookFavorites')
    const savedReadLater = localStorage.getItem('bookReadLater')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (e) {
        console.error('Error loading favorites:', e)
      }
    }
    if (savedReadLater) {
      try {
        setReadLater(JSON.parse(savedReadLater))
      } catch (e) {
        console.error('Error loading read later:', e)
      }
    }
  }, [])

  // Update dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Favorites management
  const toggleFavorite = (book) => {
    const bookKey = book.key || JSON.stringify(book)
    const isFavorite = favorites.some(fav => (fav.key || JSON.stringify(fav)) === bookKey)
    
    let newFavorites
    if (isFavorite) {
      newFavorites = favorites.filter(fav => (fav.key || JSON.stringify(fav)) !== bookKey)
    } else {
      newFavorites = [...favorites, book]
    }
    
    setFavorites(newFavorites)
    localStorage.setItem('bookFavorites', JSON.stringify(newFavorites))
  }

  const isFavorite = (book) => {
    const bookKey = book.key || JSON.stringify(book)
    return favorites.some(fav => (fav.key || JSON.stringify(fav)) === bookKey)
  }

  // Read Later management
  const toggleReadLater = (book) => {
    const bookKey = book.key || JSON.stringify(book)
    const isInReadLater = readLater.some(item => (item.key || JSON.stringify(item)) === bookKey)
    
    let newReadLater
    if (isInReadLater) {
      newReadLater = readLater.filter(item => (item.key || JSON.stringify(item)) !== bookKey)
    } else {
      newReadLater = [...readLater, book]
    }
    
    setReadLater(newReadLater)
    localStorage.setItem('bookReadLater', JSON.stringify(newReadLater))
  }

  const isReadLater = (book) => {
    const bookKey = book.key || JSON.stringify(book)
    return readLater.some(item => (item.key || JSON.stringify(item)) === bookKey)
  }

  // Filter books based on filters
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // Author filter - exact match since we're using dropdown
      if (filters.author) {
        const bookAuthors = book.author_name || []
        if (!bookAuthors.some(author => author === filters.author)) {
          return false
        }
      }

      // Subject filter - exact match since we're using dropdown
      if (filters.subject) {
        const bookSubjects = book.subject || []
        if (!bookSubjects.some(subject => subject === filters.subject)) {
          return false
        }
      }

      // Year range filter
      const publishYear = book.first_publish_year
      if (filters.yearMin && filters.yearMin.trim() !== '' && publishYear) {
        const minYear = parseInt(filters.yearMin)
        if (!isNaN(minYear) && publishYear < minYear) {
          return false
        }
      }
      if (filters.yearMax && filters.yearMax.trim() !== '' && publishYear) {
        const maxYear = parseInt(filters.yearMax)
        if (!isNaN(maxYear) && publishYear > maxYear) {
          return false
        }
      }

      return true
    })
  }, [books, filters])

  // Sort filtered books
  const sortedBooks = useMemo(() => {
    const filtered = [...filteredBooks]

    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => {
          const yearA = a.first_publish_year || 0
          const yearB = b.first_publish_year || 0
          return yearB - yearA // Descending (newest first)
        })

      case 'oldest':
        return filtered.sort((a, b) => {
          const yearA = a.first_publish_year || 9999
          const yearB = b.first_publish_year || 9999
          return yearA - yearB // Ascending (oldest first)
        })

      case 'alphabetical':
        return filtered.sort((a, b) => {
          const titleA = (a.title || '').toLowerCase()
          const titleB = (b.title || '').toLowerCase()
          return titleA.localeCompare(titleB)
        })

      case 'relevance':
      default:
        // Keep original order (from API relevance)
        return filtered
    }
  }, [filteredBooks, sortBy])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
  }

  const searchBooks = useCallback(async (searchQuery, searchType, pageOffset = 0, append = false) => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term')
      return
    }

    if (!append) {
    setLoading(true)
    } else {
      setLoadingMore(true)
    }
    setError(null)
    setHasSearched(true)

    try {
      let url = ''
      const query = encodeURIComponent(searchQuery.trim())
      const limit = 50 // Results per page
      const offset = pageOffset

      switch (searchType) {
        case 'title':
          url = `https://openlibrary.org/search.json?title=${query}&limit=${limit}&offset=${offset}`
          break
        case 'author':
          url = `https://openlibrary.org/search.json?author=${query}&limit=${limit}&offset=${offset}`
          break
        case 'subject':
          url = `https://openlibrary.org/search.json?subject=${query}&limit=${limit}&offset=${offset}`
          break
        default:
          url = `https://openlibrary.org/search.json?q=${query}&limit=${limit}&offset=${offset}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }

      const data = await response.json()
      const newBooks = data.docs || []
      const total = data.numFound || 0
      
      if (append) {
        setBooks(prevBooks => {
          const updated = [...prevBooks, ...newBooks]
          const currentCount = updated.length
          setHasMore(currentCount < total)
          return updated
        })
      } else {
        setBooks(newBooks)
        setCurrentQuery(searchQuery)
        setCurrentSearchType(searchType)
        setOffset(limit)
        const currentCount = newBooks.length
        setHasMore(currentCount < total)
      }

      setTotalResults(total)
      
      // Reset filters and sort when new search is performed
      if (!append) {
        setFilters({ author: '', subject: '', yearMin: '', yearMax: '' })
        setSortBy('relevance')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      if (!append) {
      setBooks([])
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  const loadMoreBooks = () => {
    if (currentQuery && !loadingMore && hasMore) {
      const nextOffset = offset
      setOffset(prev => prev + 50)
      searchBooks(currentQuery, currentSearchType, nextOffset, true)
    }
  }

  // Infinite scroll effect
  useEffect(() => {
    let timeoutId = null
    
    const handleScroll = () => {
      // Debounce scroll events
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(() => {
        // Calculate when user is near bottom (within 200px)
        const scrollPosition = window.innerHeight + window.scrollY
        const documentHeight = document.documentElement.scrollHeight
        
        if (documentHeight - scrollPosition < 200) {
          // Auto-load more books when near bottom
          if (activeTab === 'search' && hasMore && !loadingMore && currentQuery) {
            const nextOffset = offset
            setOffset(prev => prev + 50)
            searchBooks(currentQuery, currentSearchType, nextOffset, true)
          }
        }
      }, 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [activeTab, hasMore, loadingMore, currentQuery, currentSearchType, offset, searchBooks])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 dark:from-gray-900 via-white dark:via-gray-900 to-purple-50 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Navigation Bar */}
        <div className="flex justify-end items-center gap-2 mb-6">
          {/* Tab Navigation */}
          <div className="fixed top-6 right-32 md:right-40 lg:right-44 z-50 flex items-center gap-1 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-1">
             
               
            <button
              onClick={() => setActiveTab('favorites')}
              className={`relative px-3 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === 'favorites'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              title="My Favorites"
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill={activeTab === 'favorites' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="hidden sm:inline"> My Favorites</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('readLater')}
              className={`relative px-3 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === 'readLater'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              title="Read Later"
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline"> Read Later</span>
              </span>
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-110 active:scale-95"
            aria-label="Toggle dark mode"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>

        {/* Header */}
        <header className="text-center mb-8">
          <h1 
            className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-3 transition-all cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => {
              setHasSearched(false)
              setActiveTab('search')
              setBooks([])
              setError(null)
            }}
            title="Click to go to welcome page"
          >
            📚 Book Finder
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors">
            Discover your next great read
          </p>
        </header>

        {/* Rotating Quotes */}
        {activeTab === 'search' && <RotatingQuotes />}

        {/* Search Bar - Always visible */}
        <SearchBar onSearch={(query, type) => {
          setActiveTab('search')
          searchBooks(query, type)
        }} />

        {/* Search History - Show only when no search results or on welcome screen */}
        {activeTab === 'search' && !hasSearched && !loading && (
          <SearchHistory 
            onSearchClick={(query, type) => searchBooks(query, type)}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 p-4 rounded mb-6 max-w-2xl mx-auto">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'search' && !loading && hasSearched && (
          <div className="mt-8 px-4 md:px-6 lg:px-8">
            {books.length === 0 ? (
              <div className="text-center py-12">
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                  No books found. Try a different search term.
                </p>
              </div>
            ) : (
              <>
                  {/* Filter and Sort */}
                  <FilterAndSort
                    books={books}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                  />

                  {/* Results Count */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                      {sortedBooks.length === 0 ? (
                        <span>No books match your filters</span>
                      ) : (
                        <span>
                          Showing {sortedBooks.length} of {totalResults} book{totalResults !== 1 ? 's' : ''}
                          {sortedBooks.length !== books.length && (
                            <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-2">
                              (filtered from {books.length})
                            </span>
                          )}
                        </span>
                      )}
                </h2>
                  </div>

                  {/* Books Grid */}
                  {sortedBooks.length > 0 ? (
                    <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10 px-2">
                        {sortedBooks.map((book, index) => (
                    <BookCard
                      key={`${book.key}-${index}`}
                      book={book}
                      onViewDetails={setSelectedBook}
                            onToggleFavorite={() => toggleFavorite(book)}
                            onToggleReadLater={() => toggleReadLater(book)}
                            isFavorite={isFavorite(book)}
                            isReadLater={isReadLater(book)}
                    />
                  ))}
                </div>

                      {/* Load More Button - Hidden when infinite scroll is active */}
                      {/* {hasMore && !loadingMore && sortedBooks.length === books.length && (
                        <div className="flex justify-center mt-10 mb-6">
                          <button
                            onClick={loadMoreBooks}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 dark:from-blue-500 via-blue-600 dark:via-blue-500 to-indigo-600 dark:to-indigo-500 text-white text-base font-semibold rounded-xl hover:from-blue-700 dark:hover:from-blue-600 hover:via-blue-700 dark:hover:via-blue-600 hover:to-indigo-700 dark:hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                          >
                            <span className="flex items-center gap-2">
                              Load More Books
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </span>
                          </button>
                        </div>
                      )} */}

                      {/* Loading More Indicator */}
                      {loadingMore && (
                        <div className="flex justify-center items-center py-8">
                          <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                            <span className="text-gray-600 dark:text-gray-400">Loading more books...</span>
                          </div>
                        </div>
                      )}

                      {/* End of Results Message */}
                      {!hasMore && books.length > 0 && (
                        <div className="text-center py-6">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            You've reached the end of the results
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                        No books match your current filters.
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Try adjusting your filter criteria above.
                      </p>
                    </div>
                  )}
                </>
              )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="mt-8 px-4 md:px-6 lg:px-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                ⭐ My Favorites ({favorites.length})
              </h2>
              {favorites.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 mt-2">Start adding books to your favorites!</p>
              )}
            </div>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10 px-2">
                {favorites.map((book, index) => (
                  <BookCard
                    key={`fav-${book.key}-${index}`}
                    book={book}
                    onViewDetails={setSelectedBook}
                    onToggleFavorite={() => toggleFavorite(book)}
                    onToggleReadLater={() => toggleReadLater(book)}
                    isFavorite={true}
                    isReadLater={isReadLater(book)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <svg className="w-20 h-20 mx-auto text-yellow-400 dark:text-yellow-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No favorites yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Search for books and mark them as favorites to see them here
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'readLater' && (
          <div className="mt-8 px-4 md:px-6 lg:px-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                ⏰ Read Later ({readLater.length})
              </h2>
              {readLater.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 mt-2">Save books to read later!</p>
              )}
            </div>
            {readLater.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10 px-2">
                {readLater.map((book, index) => (
                  <BookCard
                    key={`read-${book.key}-${index}`}
                    book={book}
                    onViewDetails={setSelectedBook}
                    onToggleFavorite={() => toggleFavorite(book)}
                    onToggleReadLater={() => toggleReadLater(book)}
                    isFavorite={isFavorite(book)}
                    isReadLater={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <svg className="w-20 h-20 mx-auto text-indigo-400 dark:text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No books saved</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mark books as "Read Later" to save them for later reading
                </p>
              </div>
            )}
          </div>
        )}

        {/* Welcome Page */}
        {activeTab === 'search' && !hasSearched && !loading && <WelcomePage />}

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
