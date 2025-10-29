const WelcomePage = () => {
  const features = [
    {
      icon: '📖',
      title: 'Search by Title',
      description: 'Find any book quickly by searching its title',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '✍️',
      title: 'Find by Author',
      description: 'Discover all books written by your favorite authors',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: '🏷️',
      title: 'Browse by Subject',
      description: 'Explore books by genre, topic, or subject matter',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: '📚',
      title: 'Rich Details',
      description: 'View book covers, descriptions, and publication info',
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-block mb-6">
          <div className="text-8xl animate-bounce" style={{ animationDuration: '2s' }}>
            📚
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome to Book Finder
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Your gateway to discovering millions of books from the Open Library collection.
          Start your reading adventure today!
        </p>
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V7z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">Search above to get started</span>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className={`text-5xl mb-4 flex justify-center`}>
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 text-center">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

       

      {/* Fun Stats */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md">
          <span className="text-2xl">🌟</span>
          <span className="text-gray-700">
            <strong>Millions</strong> of books at your fingertips
          </span>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
