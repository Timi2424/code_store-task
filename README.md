# Code.Store Backend Task

Welcome to the Code.Store Backend Task application. This project demonstrates the implementation of a backend service using NestJS to interact with the TMDB (The Movie Database) API. The application fetches popular movies and movie details, and generates PDF documents with this data.

## Features

- Fetch popular movies from TMDB.
- Fetch detailed information about a specific movie.
- Generate PDF documents containing movie information.

## Getting Started

### Prerequisites

- Node.js (version 14.x or later)
- npm (version 6.x or later)
- TMDB API Key and API Read Access Token

### TMDB API Key and API Read Access Token

To use the TMDB API, you need to register and obtain an API key and an API Read Access Token.

1. Go to the [TMDB website](https://www.themoviedb.org/).
2. Sign up for an account.
3. Navigate to the API section in your account settings.
4. Create an API key and generate an API Read Access Token.

### Environment Variables

Create a `.env` file in the root of your project directory and add the following:

TMDB_API_READ_ACCESS_TOKEN=your_api_read_access_token_here

### Installation

1. Clone the repository:
git clone https://github.com/Timi2424/code_store-task.git

2. Navigate to the project directory:
cd code-store-backend-task

3. Install the dependencies:
npm install

4. Start the application:
npm run start

The application will run on http://localhost:3000.

### Endpoints

- GET /movies - Generates a PDF of popular movies.
- GET /movies/:{id} - Generates a PDF of a specific movie's details

### Thank You
Thank you to the recruitment team at Code.Store for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.
