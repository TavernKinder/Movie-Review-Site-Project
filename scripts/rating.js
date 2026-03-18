import Storage from '../storage/storage.js';

// Loads and visually displays the saved rating for the current movie.
export function displayCurrentRating(currentMovie) {
    if (!currentMovie) return;

    const savedRating = Storage.getMovieRating(currentMovie.id);
    const starButtons = document.querySelectorAll('#starRating button');

    starButtons.forEach((btn) => {
        const value = Number(btn.dataset.value);
        const star = btn.querySelector('.star');
        if (savedRating && value <= savedRating) {
            star.classList.add('filled');
            star.classList.remove('hollow');
        } else {
            star.classList.remove('filled');
            star.classList.add('hollow');
        }
    });
}

// Loads and displays the saved comment for the current movie.
export function displayCurrentComment(currentMovie) {
    if (!currentMovie) return;

    const savedComment = Storage.getMovieComment(currentMovie.id);
    const commentInput = document.getElementById('commentInput');
    if (commentInput) {
        commentInput.value = savedComment;
    }
}

// Wires star buttons to save ratings and update visual feedback.
export function setupRatingListeners(currentMovie) {
    const starButtons = document.querySelectorAll('#starRating button');
    starButtons.forEach((btn) => {
        btn.addEventListener('click', function() {
            if (!currentMovie) return;

            const rating = Number(this.dataset.value);
            Storage.setMovieRating(currentMovie.id, rating);
            displayCurrentRating(currentMovie);
        });
    });
}

// Wires the save comment button to persist text to Storage.
export function setupCommentListener(currentMovie) {
    const saveCommentBtn = document.getElementById('saveCommentBtn');
    if (saveCommentBtn) {
        saveCommentBtn.addEventListener('click', function() {
            if (!currentMovie) return;

            const commentInput = document.getElementById('commentInput');
            if (commentInput) {
                const comment = commentInput.value.trim();
                Storage.setMovieComment(currentMovie.id, comment);
                alert('Comment saved!');
            }
        });
    }
}

// Sets up all rating and comment interactions for a movie.
export function setupRatings(currentMovie) {
    setupRatingListeners(currentMovie);
    setupCommentListener(currentMovie);
}
