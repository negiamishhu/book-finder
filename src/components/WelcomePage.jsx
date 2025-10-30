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
       
    
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-md dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
          <span className="text-2xl">🌟</span>
          <span className="text-gray-700 dark:text-gray-300 transition-colors">
            <strong>Millions</strong> of books at your fingertips
          </span>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
