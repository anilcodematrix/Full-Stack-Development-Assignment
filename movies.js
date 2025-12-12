// movies.js - Updated to work with new CSS and animations

const API_URL = 'http://localhost:3000/movies';
const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('add-movie-form');
const movieCountElement = document.getElementById('movie-count');
const toastElement = document.getElementById('toast');

let allMovies = []; // Stores the full, unfiltered list of movies

// Function to show toast notifications
function showToast(message, isError = false) {
    toastElement.textContent = message;
    toastElement.className = 'toast';
    
    if (isError) {
        toastElement.classList.add('error');
    }
    
    toastElement.classList.add('show');
    
    setTimeout(() => {
        toastElement.classList.remove('show');
    }, 3000);
}

// Function to update movie count
function updateMovieCount(count) {
    movieCountElement.textContent = `${count} movie${count !== 1 ? 's' : ''}`;
}

// Function to dynamically render movies to the HTML
function renderMovies(moviesToDisplay) {
    movieListDiv.innerHTML = '';  
    
    if (moviesToDisplay.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.classList.add('empty-state');
        emptyState.innerHTML = `
            <i class="fas fa-film"></i>
            <h3>No movies found</h3>
            <p>Try a different search or add a new movie to your collection</p>
        `;
        movieListDiv.appendChild(emptyState);
        updateMovieCount(0);
        return;
    }
    
    // Add staggered animation delay
    moviesToDisplay.forEach((movie, index) => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-item');
        movieElement.style.animationDelay = `${index * 0.05}s`;
        
        movieElement.innerHTML = `
            <div class="movie-title">
                ${movie.title}
                <span class="movie-year">${movie.year}</span>
            </div>
            <div class="movie-genre">${movie.genre || 'Uncategorized'}</div>
            <div class="movie-actions">
                <button class="edit-btn" onclick="editMoviePrompt('${movie.id}', '${movie.title.replace(/'/g, "\\'")}', ${movie.year}, '${movie.genre.replace(/'/g, "\\'")}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete-btn" onclick="deleteMovie('${movie.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        movieListDiv.appendChild(movieElement);
    });
    
    updateMovieCount(moviesToDisplay.length);
}

// Function to fetch all movies and store them (READ)
function fetchMovies() {
    // Show loading state
    movieListDiv.innerHTML = '<div class="empty-state"><div class="loading"></div><p>Loading movies...</p></div>';
    
    fetch(API_URL)
        .then(response => response.json())
        .then(movies => {
            allMovies = movies; // Store the full list
            renderMovies(allMovies); // Display the full list
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            movieListDiv.innerHTML = '<div class="empty-state error"><i class="fas fa-exclamation-circle"></i><h3>Error loading movies</h3><p>Please check your server connection</p></div>';
            showToast('Failed to load movies. Check server connection.', true);
        });
}

// Initial load
fetchMovies();

// Search Functionality
searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();
 
    // Filter the global 'allMovies' array based on title or genre match
    const filteredMovies = allMovies.filter(movie => {
        const titleMatch = movie.title.toLowerCase().includes(searchTerm);
        const genreMatch = movie.genre && movie.genre.toLowerCase().includes(searchTerm);
         
        return titleMatch || genreMatch;
    });
 
    renderMovies(filteredMovies); // Display the filtered results
});

// CREATE Operation (POST Method)
form.addEventListener('submit', function(event) {
    event.preventDefault();
 
    const title = document.getElementById('title').value.trim();
    const genre = document.getElementById('genre').value.trim();
    const year = parseInt(document.getElementById('year').value);
    
    // Basic validation
    if (!title || !year || year < 1900 || year > 2030) {
        showToast('Please enter a valid title and year (1900-2030)', true);
        return;
    }
 
    const newMovie = {
        title: title,
        genre: genre || 'Uncategorized',
        year: year
    };
 
    // Show loading state on button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div> Adding...';
    submitBtn.disabled = true;
 
    fetch(API_URL, {
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie),
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to add movie');
        return response.json();
    })
    .then(() => {
        showToast(`"${title}" added successfully!`);
        form.reset();
        fetchMovies(); // Refresh the list
    })
    .catch(error => {
        console.error('Error adding movie:', error);
        showToast('Failed to add movie. Please try again.', true);
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
});

// UPDATE Operation (PUT Method)
function editMoviePrompt(id, currentTitle, currentYear, currentGenre) {
    const newTitle = prompt('Enter new Title:', currentTitle);
    if (newTitle === null) return; // User cancelled
    
    const newYearStr = prompt('Enter new Year:', currentYear);
    if (newYearStr === null) return;
    
    const newGenre = prompt('Enter new Genre:', currentGenre);
    if (newGenre === null) return;
 
    if (newTitle && newYearStr && newGenre) {
        const newYear = parseInt(newYearStr);
        
        // Validate year
        if (newYear < 1900 || newYear > 2030 || isNaN(newYear)) {
            showToast('Please enter a valid year (1900-2030)', true);
            return;
        }
        
        const updatedMovie = {
            id: id,
            title: newTitle,
            year: newYear,
            genre: newGenre
        };
        updateMovie(id, updatedMovie);
    } else {
        showToast('All fields are required for editing', true);
    }
}
 
// Function to send PUT request
function updateMovie(movieId, updatedMovieData) {
    fetch(`${API_URL}/${movieId}`, {
        method: 'PUT',  
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovieData),
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to update movie');
        return response.json();
    })
    .then(() => {
        showToast(`"${updatedMovieData.title}" updated successfully!`);
        fetchMovies(); // Refresh list
    })
    .catch(error => {
        console.error('Error updating movie:', error);
        showToast('Failed to update movie. Please try again.', true);
    });
}

// DELETE Operation (DELETE Method)
function deleteMovie(movieId) {
    const movieToDelete = allMovies.find(m => m.id === movieId);
    const movieTitle = movieToDelete ? movieToDelete.title : 'Movie';
    
    if (!confirm(`Are you sure you want to delete "${movieTitle}"?`)) {
        return;
    }
    
    fetch(`${API_URL}/${movieId}`, {
        method: 'DELETE',  
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to delete movie');
        showToast(`"${movieTitle}" deleted successfully!`);
        fetchMovies(); // Refresh list
    })
    .catch(error => {
        console.error('Error deleting movie:', error);
        showToast('Failed to delete movie. Please try again.', true);
    });
}