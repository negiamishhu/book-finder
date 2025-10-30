# Book Finder 📚

A modern React application for finding books using the Open Library Search API. Built for Alex, a college student who wants to search for books in multiple ways.

🌐 **Live Demo**: [https://book-finder-git-main-amishus-projects.vercel.app/](https://book-finder-git-main-amishus-projects.vercel.app/)

## Features

- 🔍 **Multiple Search Options**: Search by title, author, or subject
- 📖 **Rich Book Details**: View book covers, authors, publication dates, and subjects
- 🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS and dark mode by default
- ⚡ **Fast Performance**: Built with Vite for optimal performance
- 📱 **Responsive**: Works great on desktop, tablet, and mobile devices
- 📊 **Search History**: View your recent searches with timestamps and trending books carousel
- ⭐ **Favorites**: Save your favorite books for easy access (stored in localStorage)
- ⏰ **Read Later**: Bookmark books to read later (stored in localStorage)
- 🌙 **Dark Mode**: Toggle between light and dark themes (dark by default)
- 🔄 **Infinite Scroll**: Automatically loads more results as you scroll
- 🔎 **Advanced Filters**: Filter by author, subject, and year range
- 📈 **Smart Sorting**: Sort by relevance, newest, oldest, or alphabetical
- 🎠 **Trending Books Carousel**: Swipeable carousel with navigation controls

## Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **API**: Open Library Search API (no authentication required)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. Select a search type (Title, Author, or Subject)
2. Enter your search query in the search bar
3. Click "Search" to find books
4. Browse through the results - scroll down for infinite loading
5. Use the Filters & Sort panel to refine your results
6. Click on any book to view detailed information
7. Star ⭐ books to save to favorites or clock ⏰ to save for later
8. View your search history and trending books on the welcome page
9. Toggle dark mode using the moon/sun icon in the top right

## API

This application uses the [Open Library Search API](https://openlibrary.org/dev/docs/api/search):
- Title search: `https://openlibrary.org/search.json?title={query}`
- Author search: `https://openlibrary.org/search.json?author={query}`
- Subject search: `https://openlibrary.org/search.json?subject={query}`

## Project Structure

```
book-finder/
├── src/
│   ├── components/
│   │   ├── BookCard.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SearchHistory.jsx
│   │   ├── BookDetails.jsx
│   │   ├── FilterAndSort.jsx
│   │   ├── RotatingQuotes.jsx
│   │   └── WelcomePage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```
 