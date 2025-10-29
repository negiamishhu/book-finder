import { useState, useEffect } from 'react'

const RotatingQuotes = () => {
  const quotes = [
    {
      emoji: "✨",
      text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
      author: "George R.R. Martin"
    },
    {
      emoji: "🌟",
      text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
      author: "Dr. Seuss"
    },
    {
      emoji: "🔮",
      text: "Books are a uniquely portable magic.",
      author: "Stephen King"
    },
    {
      emoji: "💫",
      text: "Reading is to the mind what exercise is to the body.",
      author: "Joseph Addison"
    },
    {
      emoji: "⭐",
      text: "There is no friend as loyal as a book.",
      author: "Ernest Hemingway"
    },
    {
      emoji: "📖",
      text: "The best books are those that tell you what you already know.",
      author: "George Orwell"
    },
    {
      emoji: "🧙‍♂️",
      text: "You can never get a cup of tea large enough or a book long enough to suit me.",
      author: "C.S. Lewis"
    },
    {
      emoji: "🚀",
      text: "Today a reader, tomorrow a leader.",
      author: "Margaret Fuller"
    },
    {
      emoji: "💎",
      text: "Books are the quietest and most constant of friends; they are the most accessible and wisest of counselors.",
      author: "Charles W. Eliot"
    },
    {
      emoji: "🌈",
      text: "Reading gives us someplace to go when we have to stay where we are.",
      author: "Mason Cooley"
    },
    {
      emoji: "🌙",
      text: "A book is a dream that you hold in your hand.",
      author: "Neil Gaiman"
    },
    {
      emoji: "⭐",
      text: "So many books, so little time.",
      author: "Frank Zappa"
    },
    {
      emoji: "🎭",
      text: "Reading is escape, and the opposite of escape; it's a way to make contact with reality after a day of making things up.",
      author: "Nora Ephron"
    },
    {
      emoji: "🦋",
      text: "I find television very educating. Every time somebody turns on the set, I go into the other room and read a book.",
      author: "Groucho Marx"
    },
    {
      emoji: "🎨",
      text: "The person who deserves most pity is a lonesome one on a rainy day who doesn't know how to read.",
      author: "Benjamin Franklin"
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length)
        setFade(true)
      }, 300)  
    }, 10000) 

    return () => clearInterval(interval)
  }, [quotes.length])

  return (
    <div className="max-w-4xl mx-auto ">
      <div className={`transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center">
          <div className="text-2xl mb-2">
            {quotes[currentIndex].emoji}
          </div>
          <blockquote className="text-sm md:text-base italic text-gray-600 mb-2 leading-relaxed">
            "{quotes[currentIndex].text}"
          </blockquote>
          <p className="text-xs md:text-sm text-gray-500 italic">
            — {quotes[currentIndex].author}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RotatingQuotes
