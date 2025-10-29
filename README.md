# Book Finder 📚

A modern React application for finding books using the Open Library Search API. Built for Alex, a college student who wants to search for books in multiple ways.

🌐 **Live Demo**: [https://book-finder-git-main-amishus-projects.vercel.app/](https://book-finder-git-main-amishus-projects.vercel.app/)

## Features

- 🔍 **Multiple Search Options**: Search by title, author, or subject
- 📖 **Rich Book Details**: View book covers, authors, publication dates, and subjects
- 🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS
- ⚡ **Fast Performance**: Built with Vite for optimal performance
- 📱 **Responsive**: Works great on desktop, tablet, and mobile devices

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
2. Enter your search query
3. Click "Search" to find books
4. Browse through the results

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
│   │   └── SearchBar.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## License

MIT
