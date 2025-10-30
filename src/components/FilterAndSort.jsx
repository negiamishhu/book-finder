import { useState, useMemo } from 'react'

const FilterAndSort = ({ books, onFilterChange, onSortChange }) => {
  const [authorFilter, setAuthorFilter] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [yearMin, setYearMin] = useState('')
  const [yearMax, setYearMax] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [isExpanded, setIsExpanded] = useState(true)

  // Extract unique authors and subjects from books
  const uniqueAuthors = useMemo(() => {
    const authors = new Set()
    books.forEach(book => {
      if (book.author_name && Array.isArray(book.author_name)) {
        book.author_name.forEach(author => authors.add(author))
      }
    })
    return Array.from(authors).sort()
  }, [books])

  const uniqueSubjects = useMemo(() => {
    const subjects = new Set()
    books.forEach(book => {
      if (book.subject && Array.isArray(book.subject)) {
        book.subject.forEach(subject => {
          if (subject && subject.length < 50) { // Filter out very long subjects
            subjects.add(subject)
          }
        })
      }
    })
    return Array.from(subjects).sort()
  }, [books])

  // Get min and max years from books
  const yearRange = useMemo(() => {
    const years = books
      .map(book => book.first_publish_year)
      .filter(year => year && year > 0)
    if (years.length === 0) return { min: 0, max: new Date().getFullYear() }
    return {
      min: Math.min(...years),
      max: Math.max(...years)
    }
  }, [books])

  const handleAuthorChange = (e) => {
    const value = e.target.value
    setAuthorFilter(value)
    onFilterChange({
      author: value,
      subject: subjectFilter,
      yearMin,
      yearMax
    })
  }

  const handleSubjectChange = (e) => {
    const value = e.target.value
    setSubjectFilter(value)
    onFilterChange({
      author: authorFilter,
      subject: value,
      yearMin,
      yearMax
    })
  }

  const handleYearMinChange = (e) => {
    const value = e.target.value
    setYearMin(value)
    onFilterChange({
      author: authorFilter,
      subject: subjectFilter,
      yearMin: value,
      yearMax
    })
  }

  const handleYearMaxChange = (e) => {
    const value = e.target.value
    setYearMax(value)
    onFilterChange({
      author: authorFilter,
      subject: subjectFilter,
      yearMin,
      yearMax: value
    })
  }

  const handleSortChange = (e) => {
    const value = e.target.value
    setSortBy(value)
    onSortChange(value)
  }

  const clearFilters = () => {
    setAuthorFilter('')
    setSubjectFilter('')
    setYearMin('')
    setYearMax('')
    setSortBy('relevance')
    onFilterChange({ author: '', subject: '', yearMin: '', yearMax: '' })
    onSortChange('relevance')
  }

  const activeFilterCount = [
    authorFilter,
    subjectFilter,
    yearMin,
    yearMax,
    sortBy !== 'relevance' ? sortBy : null
  ].filter(Boolean).length

  const hasActiveFilters = activeFilterCount > 0

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg dark:shadow-gray-900/50 mb-6 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-800 transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Filters & Sort</h3>
            {activeFilterCount > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearFilters()
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg transition-all duration-200 border border-red-200 dark:border-red-800"
            >
              Clear All
            </button>
          )}
          <svg 
            className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-6 space-y-6 overflow-visible">
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Active:</span>
            {authorFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                {authorFilter.length > 25 ? `${authorFilter.substring(0, 25)}...` : authorFilter}
              </span>
            )}
            {subjectFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5a.997.997 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {subjectFilter.length > 25 ? `${subjectFilter.substring(0, 25)}...` : subjectFilter}
              </span>
            )}
            {(yearMin || yearMax) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {yearMin || yearRange.min || '?'} - {yearMax || yearRange.max || '?'}
              </span>
            )}
            {sortBy !== 'relevance' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
                </svg>
                {sortBy === 'newest' ? 'Newest First' : sortBy === 'oldest' ? 'Oldest First' : 'Alphabetical'}
              </span>
            )}
          </div>
          )}

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Author Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Author
              </label>
              <div className="relative">
                <select
                  value={authorFilter}
                  onChange={handleAuthorChange}
                  className={`w-full px-4 py-2.5 pl-10 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all text-sm ${
                    authorFilter 
                      ? 'border-blue-500 dark:border-blue-400 shadow-sm' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">All Authors</option>
                  {uniqueAuthors.slice(0, 100).map((author, index) => (
                    <option key={index} value={author}>
                      {author}
                    </option>
                  ))}
                </select>
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Subject Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5a.997.997 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Subject/Genre
              </label>
              <div className="relative">
                <select
                  value={subjectFilter}
                  onChange={handleSubjectChange}
                  className={`w-full px-4 py-2.5 pl-10 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all text-sm ${
                    subjectFilter 
                      ? 'border-purple-500 dark:border-purple-400 shadow-sm' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">All Subjects</option>
                  {uniqueSubjects.slice(0, 100).map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject.length > 40 ? `${subject.substring(0, 40)}...` : subject}
                    </option>
                  ))}
                </select>
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Year Range */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Year Range
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={yearMin}
                    onChange={handleYearMinChange}
                    placeholder={yearRange.min ? String(yearRange.min) : 'From'}
                    min={yearRange.min || 0}
                    max={yearMax ? parseInt(yearMax) : (yearRange.max || new Date().getFullYear())}
                    className={`w-full px-3 py-2.5 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all text-sm ${
                      yearMin 
                        ? 'border-green-500 dark:border-green-400 shadow-sm' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                </div>
                <div className="flex items-center text-gray-400 dark:text-gray-500 pt-6">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={yearMax}
                    onChange={handleYearMaxChange}
                    placeholder={yearRange.max ? String(yearRange.max) : 'To'}
                    min={yearMin ? parseInt(yearMin) : (yearRange.min || 0)}
                    max={yearRange.max || new Date().getFullYear()}
                    className={`w-full px-3 py-2.5 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all text-sm ${
                      yearMax 
                        ? 'border-green-500 dark:border-green-400 shadow-sm' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
                </svg>
                Sort By
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className={`w-full px-4 py-2.5 pl-10 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all text-sm ${
                    sortBy !== 'relevance' 
                      ? 'border-amber-500 dark:border-amber-400 shadow-sm' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alphabetical">Alphabetical (A-Z)</option>
                </select>
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterAndSort

