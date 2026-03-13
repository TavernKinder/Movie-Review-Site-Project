let cachedContentRows = [];
let activePostersPerSlide = 0;
let resizeTimerId;
let isResizeListenerBound = false;

// Ensures the root container for all dynamic content rows exists.
function ensureRowsRoot() {
	let rowsRoot = document.getElementById('content-rows-root');
	if (!rowsRoot) {
		const indexMain = document.getElementById('indexMain');
		rowsRoot = document.createElement('div');
		rowsRoot.id = 'content-rows-root';
		indexMain.appendChild(rowsRoot);
	}
	return rowsRoot;
}

// Gets an existing row container or creates a new one by id.
function getOrCreateRowContainer(rowId) {
	const rowsRoot = ensureRowsRoot();
	let rowContainer = document.getElementById(rowId);
	if (!rowContainer) {
		rowContainer = document.createElement('div');
		rowContainer.id = rowId;
		rowContainer.className = 'content-row';
		rowsRoot.appendChild(rowContainer);
	}
	return rowContainer;
}

// Stores row data so all rows can be rebuilt on breakpoint changes.
function updateCachedContentRow(rowId, heading, contentArr, rowClass) {
	const existingIndex = cachedContentRows.findIndex((row) => row.rowId === rowId);
	const payload = {
		rowId,
		heading,
		contentArr: [...contentArr],
		rowClass
	};

	if (existingIndex === -1) {
		cachedContentRows.push(payload);
		return;
	}

	cachedContentRows[existingIndex] = payload;
}

// Returns how many posters each slide should show at current viewport width.
function getPostersPerSlide() {
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

// Renders one movie row carousel with heading, nav controls, and poster slides.
export async function renderContentRow(contentArr, heading = 'Content', rowId = 'new-content', rowClass = 'poster-row-a') {
	const rowContainer = getOrCreateRowContainer(rowId);
	if (!rowContainer || !Array.isArray(contentArr) || contentArr.length === 0) {
		return;
	}

	rowContainer.className = `content-row ${rowClass}`;

	const postersPerSlide = getPostersPerSlide();
	updateCachedContentRow(rowId, heading, contentArr, rowClass);
	activePostersPerSlide = postersPerSlide;
	const carouselId = `${rowId}-carousel`;
	const prevButtonId = `${carouselId}Prev`;
	const nextButtonId = `${carouselId}Next`;

	rowContainer.innerHTML = `
		<h3>${heading}</h3>
		<div class="d-flex align-items-center gap-2">
			<button id="${prevButtonId}" class="btn btn-outline-dark row-carousel-btn row-carousel-btn-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev" aria-label="Previous">
				&lsaquo;
			</button>
			<div id="${carouselId}" class="carousel slide flex-grow-1" data-bs-interval="false">
				<div class="carousel-inner"></div>
			</div>
			<button id="${nextButtonId}" class="btn btn-outline-dark row-carousel-btn row-carousel-btn-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next" aria-label="Next">
				&rsaquo;
			</button>
		</div>
	`;

	const carouselInner = rowContainer.querySelector('.carousel-inner');

	for (let i = 0; i < contentArr.length; i += postersPerSlide) {
		const chunk = contentArr.slice(i, i + postersPerSlide);
		const activeClass = i === 0 ? 'active' : '';

		const postersHtml = chunk.map((movie) => {
			const posterPath = movie?.poster_path;
			const title = movie?.title || movie?.name || 'Movie Poster';
			const imgSrc = posterPath
				? `https://image.tmdb.org/t/p/w500/${posterPath}`
				: 'img/examplePoster.png';

			return `
				<div class="content-row-item">
					<img src="${imgSrc}" alt="${title}" class="poster-in-row">
				</div>
			`;
		}).join('');

		carouselInner.innerHTML += `
			<div class="carousel-item ${activeClass}">
				<div class="content-row-slide">
					${postersHtml}
				</div>
			</div>
		`;
	}
}

// Re-renders cached rows when viewport crosses poster-per-slide breakpoints.
export function setupContentRowResizeRerender() {
	if (isResizeListenerBound) {
		return;
	}

	isResizeListenerBound = true;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimerId);
		resizeTimerId = setTimeout(() => {
			const nextPostersPerSlide = getPostersPerSlide();
			if (nextPostersPerSlide === activePostersPerSlide || cachedContentRows.length === 0) {
				return;
			}

			cachedContentRows.forEach((row) => {
				renderContentRow(row.contentArr, row.heading, row.rowId, row.rowClass);
			});
		}, 150);
	});
}
