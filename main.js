
const url = window.location.href;
const moviesButton = document.getElementById("moviesButton");
const showsButton = document.getElementById("showsButton");

let user = ""

let movies = false;
let shows = false;
let seasons = false;
let episodes = false;





function enableMovies() {
	movies = true;
	moviesButton.style.color = "#eba0ac";
}

function enableShows() {
	shows = true;
	showsButton.style.color = "#eba0ac";
}
function enableSeasons() {
	seasons = true;
	seasonsButton.style.color = "#eba0ac";
}

function enableEpisodes() {
	episodes = true;
	episodesButton.style.color = "#eba0ac";
}




function reloadOptions() {
	let mainUrl = url.substring(0, hashtagPos) + '#';

	mainUrl += "user=" + user;

	if (movies) {
		mainUrl += "+movies";
	}
	if (shows) {
		mainUrl += "+shows";
	}
	if (seasons) {
		mainUrl += "+seasons";
	}
	if (episodes) {
		mainUrl += "+episodes";
	}

	location.href = mainUrl;
	location.reload();
}




async function main() {
	let hashtagPos = url.indexOf('#');

	if (hashtagPos == -1) {
		user = "";
		reloadOptions();
	}
	else if (url.indexOf('+') == -1) {
		user = url.substring(url.indexOf('=') + 1);
	} else {
		user = url.substring(url.indexOf('=') + 1, url.indexOf('+'));
	}
	
	
	
	if (url.substring(hashtagPos + 1).includes("movies")) {
		enableMovies();
	}
	if (url.substring(hashtagPos + 1).includes("shows")) {
		enableShows();
	}
	if (url.substring(hashtagPos + 1).includes("seasons")) {
		enableSeasons();
	}
	if (url.substring(hashtagPos + 1).includes("episodes")) {
		enableEpisodes();
	}
	
	
	
	
	
	moviesButton.addEventListener("click", function(e) {
		movies = !movies;
		reloadOptions();
	});
	
	showsButton.addEventListener("click", function(e) {
		shows = !shows;
		reloadOptions();
	});
	
	seasonsButton.addEventListener("click", function(e) {
		seasons = !seasons;
		reloadOptions();
	});
	
	episodesButton.addEventListener("click", function(e) {
		episodes = !episodes;
		reloadOptions();
	});
	
	
	
	
	
	
	
	let userPath = url.substring(0, hashtagPos).replace("/index.html", "");
	userPath += "/Database/Users/" + user;
	
	// https://stackoverflow.com/questions/49938266/how-to-return-values-from-async-functions-using-async-await-from-function
	const watchedShows = (await (await fetch(userPath + "/watched/shows.json")).json()).shows;
	
	console.log(watchedShows);
	

	watchedShows.sort((a, b) => a.rating - b.rating);



	for (const show of watchedShows) {

		

	}


}



main().catch(console.log);