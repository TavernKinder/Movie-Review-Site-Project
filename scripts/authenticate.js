const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ODExZmFlYmNmMDNhODk2ZjZiZGE5YWMxOWY3Nzk1ZCIsIm5iZiI6MTc3MjgwOTE2My40OCwic3ViIjoiNjlhYWViY2I2MzU2ZWI2OGMxNzdjODFhIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.B4n3DVcJ3Sg4ts7fddWM66kGCvnKXC3G3hDulq-7Al0'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ODExZmFlYmNmMDNhODk2ZjZiZGE5YWMxOWY3Nzk1ZCIsIm5iZiI6MTc3MjgwOTE2My40OCwic3ViIjoiNjlhYWViY2I2MzU2ZWI2OGMxNzdjODFhIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.B4n3DVcJ3Sg4ts7fddWM66kGCvnKXC3G3hDulq-7Al0'
  }
};

fetch('https://api.themoviedb.org/3/authentication', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));


  async function getPopularMovies() {
  const response = await fetch("https://api.themoviedb.org/3/movie/popular", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  console.log(data.results); // array of movies
}





async function getMovieDetails(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`
    }
  });

  const movie = await response.json();
  console.log(movie);
  return(movie)
}







async function displayMedia(mediaType, mediaID){
    let media = await getMovieDetails(mediaID)
    let isGood = false
    let title = document.getElementById('da-name')
    let poster = document.getElementById('poster-image')
    console.log(media)
    console.log(title)
    console.log(poster)
    title.innerHTML = media.title
    let posterURL = "https://image.tmdb.org/t/p/w500" + media.poster_path;
    poster.src = posterURL
}
let random = Math.floor(Math.random() * 10000)
console.log(random)
displayMedia('Movie', random)