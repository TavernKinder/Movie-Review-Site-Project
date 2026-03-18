let cachedGridPayload = null;
let activeGridColumns = 0;
let gridResizeTimerId;
let isGridResizeListenerBound = false;

// Ensures the shared content root exists for injecting the grid section.
function ensureGridRoot() {
	let rowsRoot = document.getElementById('content-rows-root');
	if (!rowsRoot) {
		const indexMain = document.getElementById('indexMain');
		rowsRoot = document.createElement('div');
		rowsRoot.id = 'content-rows-root';
		indexMain.appendChild(rowsRoot);
	}
	return rowsRoot;
}

// Returns responsive column count using the same breakpoints as row rendering.
function getGridColumns() {
	const width = window.innerWidth;
	if (width <= 540) {
		return 3;
	}
	if (width <= 1080) {
		return 4;
	}
	if (width < 1560) {
		return 5;
	}
	if (width < 1770) {
		return 6;
	}
	return 7;
}

// Caches the latest grid payload so it can be re-rendered on breakpoint changes.
function updateCachedGrid(payload) {
	cachedGridPayload = {
		...payload,
		contentArr: [...payload.contentArr]
	};
}

// Renders up to 50 movies in a responsive left-to-right wrapping poster grid.
export async function renderMovieGrid(contentArr, heading = 'Content', gridId = 'movie-grid-results', gridClass = 'poster-row-a') {
	const rowsRoot = ensureGridRoot();
	if (!rowsRoot || !Array.isArray(contentArr) || contentArr.length === 0) {
		return;
	}

	const limitedContent = contentArr.slice(0, 50);
	const columns = getGridColumns();
	activeGridColumns = columns;

	updateCachedGrid({
		contentArr: limitedContent,
		heading,
		gridId,
		gridClass
	});

	let gridSection = document.getElementById(gridId);
	if (!gridSection) {
		gridSection = document.createElement('section');
		gridSection.id = gridId;
		rowsRoot.appendChild(gridSection);
	}

	gridSection.className = `movie-grid-section ${gridClass}`;
	gridSection.innerHTML = `
		<h3>${heading}</h3>
		<div class="movie-grid" style="--grid-columns: ${columns};"></div>
	`;

	const movieGrid = gridSection.querySelector('.movie-grid');
	for (let i = 0; i < limitedContent.length; i++) {
		const movie = limitedContent[i];
		const posterPath = movie?.poster_path;
		const title = movie?.title || movie?.name || 'Movie Poster';
		const imgSrc = posterPath
			? `https://image.tmdb.org/t/p/w500/${posterPath}`
			: 'img/poster_backup.png';
		const movieId = movie?.id;
		const detailsHref = `details.html?id=${encodeURIComponent(movieId)}`;

		movieGrid.innerHTML += `
			<div class="movie-grid-item">
				<a href="${detailsHref}" aria-label="View details for ${title}">
					<img src="${imgSrc}" alt="${title}" class="poster-in-grid" onerror="this.onerror=null;this.src='img/poster_backup.png';">
				</a>
			</div>
		`;
	}
}

// Re-renders the active grid when viewport changes require a new column count.
export function setupMovieGridResizeRerender() {
	if (isGridResizeListenerBound) {
		return;
	}

	isGridResizeListenerBound = true;
	window.addEventListener('resize', () => {
		clearTimeout(gridResizeTimerId);
		gridResizeTimerId = setTimeout(() => {
			const nextColumns = getGridColumns();
			if (!cachedGridPayload || nextColumns === activeGridColumns) {
				return;
			}

			renderMovieGrid(
				cachedGridPayload.contentArr,
				cachedGridPayload.heading,
				cachedGridPayload.gridId,
				cachedGridPayload.gridClass
			);
		}, 150);
	});
}
