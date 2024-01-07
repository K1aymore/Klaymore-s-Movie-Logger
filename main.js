
const url = window.location.href;


let username = ""

let movies = false;
let shows = false;
let seasons = false;
let episodes = false;

let questionPos = 0;
let hashtagPos = 0;



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
	let mainUrl = url.substring(0, hashtagPos);

	mainUrl += '#';

	if (movies) {
		mainUrl += "movies";
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

	let questionPos = url.indexOf('?');

	if (questionPos == -1) {
		username = "";
		reloadOptions();
	}
	else if (url.indexOf('#') == -1) {
		username = url.substring(url.indexOf('=') + 1);
	} else {
		username = url.substring(url.indexOf('=') + 1, url.indexOf('#'));
	}
	userSelect.value += username
	username = username.toLowerCase();
	

	let hashtagPos = url.indexOf('#');
	
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
	
	
	
	
	
	
	
	let userPath = url.substring(0, questionPos).replace("/index.html", "");
	userPath += "/Database/Users/" + username;
	
	// https://stackoverflow.com/questions/49938266/how-to-return-values-from-async-functions-using-async-await-from-function
	const watchedShows = (await (await fetch(userPath + "/watched/shows.json")).json()).shows;
	
	console.log(watchedShows);
	

	watchedShows.sort((a, b) => a.rating - b.rating);

	table.textContent = "+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+\n"

	for (const show of watchedShows) {
		table.textContent += "| " + show.id.padEnd(40)
			+ " | " + (String(show.rating).padEnd(3))
			+ " | " + (show.review.padEnd(75))
			+ " |" + "\n"
			+ "+------------------------------------------------------------------------------------------------------------------------------+"
		
	}


}



main().catch(console.log);