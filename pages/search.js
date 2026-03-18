import { renderMovieGrid, setupMovieGridResizeRerender } from '../scripts/grid.js';

const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ODExZmFlYmNmMDNhODk2ZjZiZGE5YWMxOWY3Nzk1ZCIsIm5iZiI6MTc3MjgwOTE2My40OCwic3ViIjoiNjlhYWViY2I2MzU2ZWI2OGMxNzdjODFhIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.B4n3DVcJ3Sg4ts7fddWM66kGCvnKXC3G3hDulq-7Al0';

// Normalizes titles and queries so comparisons are case-insensitive and punctuation-safe.
function normalizeTitle(value) {
	return String(value || '')
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

// Computes edit distance to estimate how closely two strings match.
function levenshteinDistance(a, b) {
	const left = normalizeTitle(a);
	const right = normalizeTitle(b);

	if (!left.length) {
		return right.length;
	}
	if (!right.length) {
		return left.length;
	}

	const row = new Array(right.length + 1);
	for (let j = 0; j <= right.length; j++) {
		row[j] = j;
	}

	for (let i = 1; i <= left.length; i++) {
		let prevDiagonal = row[0];
		row[0] = i;

		for (let j = 1; j <= right.length; j++) {
			const tmp = row[j];
			const cost = left[i - 1] === right[j - 1] ? 0 : 1;

			row[j] = Math.min(
				row[j] + 1,
				row[j - 1] + 1,
				prevDiagonal + cost
			);

			prevDiagonal = tmp;
		}
	}

	return row[right.length];
}

// Produces a ranking score where lower values mean a better title match.
function scoreMovieTitle(query, movie) {
	const title = movie?.title || movie?.name || '';
	const normalizedQuery = normalizeTitle(query);
	const normalizedTitle = normalizeTitle(title);

	if (!normalizedQuery || !normalizedTitle) {
		return Number.POSITIVE_INFINITY;
	}

	if (normalizedTitle === normalizedQuery) {
		return 0;
	}

	const startsWithBonus = normalizedTitle.startsWith(normalizedQuery) ? -0.35 : 0;
	const includesBonus = normalizedTitle.includes(normalizedQuery) ? -0.15 : 0;
	const distance = levenshteinDistance(normalizedQuery, normalizedTitle);

	return distance + startsWithBonus + includesBonus;
}

// Fetches paginated TMDB movie search results until the requested amount is reached.
async function fetchSearchPages(query, amount) {
	const requestedAmount = Number.isFinite(Number(amount)) ? Math.max(1, Math.floor(Number(amount))) : 20;
	const collected = [];
	let page = 1;
	let totalPages = 1;

	while (collected.length < requestedAmount && page <= totalPages) {
		const params = new URLSearchParams({
			language: 'en-US',
			include_adult: 'false',
			query,
			page: String(page)
		});

		const response = await fetch(`https://api.themoviedb.org/3/search/movie?${params.toString()}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${API_TOKEN}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`TMDB search request failed (${response.status})`);
		}

		const data = await response.json();
		totalPages = data?.total_pages || 1;

		if (Array.isArray(data?.results) && data.results.length > 0) {
			collected.push(...data.results);
		} else {
			break;
		}

		page += 1;
	}

	return collected.slice(0, requestedAmount);
}

// Escapes user-provided text before inserting it into HTML.
function escapeHtml(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

// Returns the closest matching movies for a query, sorted by custom relevance scoring.
export async function getClosestMatchingMovies(query, amount = 50) {
	const normalizedQuery = normalizeTitle(query);
	if (!normalizedQuery) {
		return [];
	}

	const candidates = await fetchSearchPages(query, Math.max(amount * 2, amount));
	return candidates
		.sort((a, b) => scoreMovieTitle(normalizedQuery, a) - scoreMovieTitle(normalizedQuery, b))
		.slice(0, amount);
}

// Renders the search view, toggles featured content, and displays results in the movie grid.
export async function renderSearch(query) {
	const trimmedQuery = String(query || '').trim();
	const featuredRoot = document.getElementById('featured-content');
	const rowsRoot = document.getElementById('content-rows-root');

	if (!rowsRoot) {
		return;
	}

	rowsRoot.innerHTML = '';

	if (!trimmedQuery) {
		if (featuredRoot) {
			featuredRoot.style.display = '';
		}
		return;
	}

	if (featuredRoot) {
		featuredRoot.style.display = 'none';
	}

	const results = await getClosestMatchingMovies(trimmedQuery, 50);
	const safeQuery = escapeHtml(trimmedQuery);

	if (results.length === 0) {
		rowsRoot.innerHTML = `<div class="empty-list-msg">No movies found for "${safeQuery}".</div>`;
		return;
	}

	await renderMovieGrid(results, `Results for "${safeQuery}"`, 'movie-grid-search-results', 'poster-row-a');
	setupMovieGridResizeRerender();
}
