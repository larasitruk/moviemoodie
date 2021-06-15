import "./style.css";
import qs from "qs";

/**
 * 1. Read https://developers.themoviedb.org/3/getting-started/introduction and get API KEY
 * 2. Find in the docs, the endpoint that might return movies
 * 3. Use fetch to retrieve this data https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 * 4. Console log the movie data (remember to open the developer console in the browser)
 *  fetch endpoint is adjusted to "url" + "search criterium"
 * all additional parameters added to endpoint
 */

function getRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getFormData() {
  //
  let form = document.querySelector("#movie-filter");
  let formData = new FormData(form);
  let criteria = {};
  for (let pair of formData.entries()) {
    // create an object with elements in the loop (key -  value pairs)

    let key = pair[0];
    let value = pair[1];
    criteria[key] = value;
  }
  console.log(criteria);
  return criteria;
}

function generateUrl(criteria) {
  let baseUrl = "https://api.themoviedb.org/3/discover/movie?";
  let newCriteria = {
    api_key: "3a2c3a6a4ed554ae8f475e65fefbe05a",
    language: "en-US",
    // add more sorting categories in random mix.
    sort_by: getRandom(["popularity.desc", "vote_average.desc", "primary_release_date.asc", "vote_count.desc"]),
    page: "1",
    "vote_count.gte": "100",
  };

  if (criteria.genre !== "") {
    newCriteria.with_genres = criteria.genre;
  }
  if (criteria.score !== "") {
    newCriteria["vote_average.gte"] = criteria.score;
  }
  if (criteria.yearstart !== "") {
    newCriteria["primary_release_date.gte"] = criteria.yearstart + "-12-31";
  }
  if (criteria.yearend !== "") {
    newCriteria["primary_release_date.lte"] = criteria.yearend + "-01-01";
  }

  console.log(newCriteria);
  let queryString = qs.stringify(newCriteria);
  return baseUrl + queryString;
}

function retrieveMovie(movieUrl) {
  fetch(movieUrl, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((jsonData) => {
      let movie = getRandom(jsonData.results);
      console.log(movie);
      // if not movie/ no result, use query selector to add an html error for the user. 
      // and then return, so rest of code does not get executed.

      if (movie === undefined){
        return document.querySelector("#movie-display").innerHTML = 
       `<div id="no-results-style">No results found for this search</div>`
      }

      const imageUrl = `https://image.tmdb.org/t/p/w200/${movie.poster_path}`;

      document.querySelector("#movie-display").innerHTML = `
  <div>${movie.title}</div>
  <div>${movie.vote_average}</div>
  <div>${movie.release_date}</div>
  <img class="image" src="${imageUrl}"/>
  <div class="movie-overview">${movie.overview}</div>
  `;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function onButtonClick() {
  let button = document.querySelector("#suggest-button");
  button.addEventListener("click", (evt) => {
    evt.preventDefault();
    let criteria = getFormData();
    let url = generateUrl(criteria);
    retrieveMovie(url);
    console.log(url);
  });
}

onButtonClick();
