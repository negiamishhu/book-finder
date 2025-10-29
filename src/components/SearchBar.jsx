import { useState, useEffect, useRef } from 'react'

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('title')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [popularSearches, setPopularSearches] = useState([])
  const suggestionRef = useRef(null)
  const inputRef = useRef(null)

  // Popular search terms based on search type
  const popularSearchOptions = {
    title: [
      'Harry Potter', 'The Great Gatsby', '1984', 'To Kill a Mockingbird',
      'Pride and Prejudice', 'The Catcher in the Rye', 'Lord of the Rings',
      'Jane Eyre', 'Animal Farm', 'The Hobbit'
    ],
    author: [
      'Stephen King', 'J.K. Rowling', 'Agatha Christie', 'Ernest Hemingway',
      'Jane Austen', 'Charles Dickens', 'Mark Twain', 'George Orwell',
      'F. Scott Fitzgerald', 'Virginia Woolf'
    ],
    subject: [
      'Fiction', 'Mystery', 'Science Fiction', 'Romance', 'Fantasy',
      'Thriller', 'Biography', 'History', 'Philosophy', 'Poetry'
    ]
  }

  // Fetch popular searches when search type changes or component mounts
  useEffect(() => {
    const fetchPopularSearches = async () => {
      try {
        const popularTerms = popularSearchOptions[searchType]
        // Optionally fetch trending searches from API
        // For now, use predefined popular searches
        setPopularSearches(popularTerms)
      } catch (error) {
        setPopularSearches(popularSearchOptions[searchType])
      }
    }
    fetchPopularSearches()
  }, [searchType])

  const handlePopularSearchClick = (term) => {
    setSearchQuery(term)
    onSearch(term, searchType)
  }

  // Debounced search for suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      setLoadingSuggestions(true)
      try {
        const query = encodeURIComponent(searchQuery.trim())
        let url = ''

        switch (searchType) {
          case 'title':
            url = `https://openlibrary.org/search.json?title=${query}&limit=5`
            break
          case 'author':
            url = `https://openlibrary.org/search.json?author=${query}&limit=5`
            break
          case 'subject':
            url = `https://openlibrary.org/search.json?subject=${query}&limit=5`
            break
          default:
            url = `https://openlibrary.org/search.json?q=${query}&limit=5`
        }

        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          const books = data.docs?.slice(0, 5) || []
          
          // Format suggestions based on search type
          const formatted = books.map(book => {
            if (searchType === 'title') {
              return {
                text: book.title,
                subtitle: book.author_name?.[0] || '',
                type: 'title'
              }
            } else if (searchType === 'author') {
              return {
                text: book.author_name?.[0] || '',
                subtitle: `${book.title} (${book.first_publish_year || ''})`,
                type: 'author'
              }
            } else {
              return {
                text: book.title,
                subtitle: book.author_name?.[0] || '',
                type: 'subject'
              }
            }
          })
          
          setSuggestions(formatted)
          setShowSuggestions(formatted.length > 0)
        }
      } catch (error) {
        setSuggestions([])
      } finally {
        setLoadingSuggestions(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchType])

  // Reset suggestions when search type changes
  useEffect(() => {
    setSuggestions([])
    setShowSuggestions(false)
  }, [searchType])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery, searchType)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text)
    setShowSuggestions(false)
    onSearch(suggestion.text, searchType)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSuggestionClick(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="max-w-4xl mx-auto mb-8 relative">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Type Selector */}
          <div className="flex gap-2 md:w-auto">
            <button
              type="button"
              onClick={() => setSearchType('title')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                searchType === 'title'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📖 Title
            </button>
            <button
              type="button"
              onClick={() => setSearchType('author')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                searchType === 'author'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✍️ Author
            </button>
            <button
              type="button"
              onClick={() => setSearchType('subject')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                searchType === 'subject'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏷️ Subject
            </button>
          </div>

          {/* Search Input with Suggestions */}
          <div className="flex-1 flex gap-2 relative">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSelectedIndex(-1)
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true)
                }}
                onKeyDown={handleKeyDown}
                placeholder={`Search by ${searchType}...`}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700"
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div
                  ref={suggestionRef}
                  className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto"
                >
                  {loadingSuggestions ? (
                    <div className="p-3 text-center text-gray-500 text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                          selectedIndex === index
                            ? 'bg-blue-50 border-l-4 border-l-blue-600'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{suggestion.text}</div>
                        {suggestion.subtitle && (
                          <div className="text-xs text-gray-500 mt-0.5">{suggestion.subtitle}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500 text-sm">
                      No suggestions found
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Search
            </button>
          </div>
        </div>
        
        {/* Popular Search Bubbles */}
        {!searchQuery && popularSearches.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Popular {searchType === 'title' ? 'Titles' : searchType === 'author' ? 'Authors' : 'Subjects'}
            </div>
            <div className="relative">
              {/* Gradient fade on left */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              {/* Gradient fade on right */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
              
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3 snap-x snap-mandatory scroll-smooth">
                {popularSearches.slice(0, 8).map((term, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handlePopularSearchClick(term)}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-gray-700 text-sm font-medium rounded-full border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95 whitespace-nowrap flex-shrink-0 snap-center"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchBar
