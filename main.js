
const url = window.location.href;


let username = ""

let movies = false;
let shows = false;
let seasons = false;
let episodes = false;
let sauces = false;

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

function enableSauces() {
	sauces = true;
	saucesButton.style.color = "#eba0ac";
}


function reloadOptions() {
	let mainUrl = url.substring(0, questionPos);
	mainUrl += "?user=" + username;

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
	if (sauces) {
		mainUrl += "+sauces";
	}

	location.href = mainUrl;
	location.reload();
}

function toTitleCase(str) {
	return str.replace(
	  /\w\S*/g,
	  function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	  }
	);
  }




async function main() {

	questionPos = url.indexOf('?');

	if (questionPos == -1) {
		username = "Klaymore";
		reloadOptions();
	}
	else if (url.indexOf('#') == -1) {
		username = url.substring(url.indexOf('=') + 1);
	} else {
		username = url.substring(url.indexOf('=') + 1, url.indexOf('#'));
	}
	userSelect.value = username
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
	if (url.substring(hashtagPos + 1).includes("sauces")) {
		enableSauces();
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

	saucesButton.addEventListener("click", function(e) {
		sauces = !sauces;
		reloadOptions();
	});
	

	
	let databasePath = url.substring(0, questionPos).replace("/index.html", "");
	databasePath += "/Database";
	
	
	let userPath = databasePath + "/Users/" + username;
	

	// https://stackoverflow.com/questions/49938266/how-to-return-values-from-async-functions-using-async-await-from-function

	let items = [];

	if (shows || seasons) {
		const watchedShows = (await (await fetch(userPath + "/watched/shows.json")).json()).shows;

		for (let s = 0; s < watchedShows.length; s++) {
			watchedShows[s].name = (await (await fetch(databasePath + "/Shows/" + watchedShows[s].id + ".json")).json()).name;
		}

		if (shows) {
			for (let s = 0; s < watchedShows.length; s++) {
				let show = watchedShows[s];
				items.push(show);
			}
		}
		
		//console.log(watchedShows);
		if (seasons) {
			for (let s = 0; s < watchedShows.length; s++) {
				let show = watchedShows[s];
				for (let i = 0; i < show.seasons.length; i++) {
					let season = show.seasons[i];
					season.name = show.name + " Season " + (i+1);
					items.push(season); 
				}
			}
		}

	}
	

	if (sauces) {
		const saucesData = (await (await fetch(userPath + "/sauces.json")).json()).sauces;

		console.log(saucesData);

		for (let i = 0; i < saucesData.length; i++) {
			items.push(saucesData[i]);
		}

	}



	items.sort((a, b) => b.rating - a.rating);
	console.log(items);

	table.textContent = "+----------------------------------------------------------------------------------------------------------------------------------------+\n"

	for (let i = 0; i < items.length; i++) {
		let item = items[i];

		table.textContent += "| " + item.name.padEnd(50)
			+ " | " + (String(item.rating).padEnd(3))
			+ " | " + (item.review.padEnd(75))
			+ " |" + "\n"
			+ "+----------------------------------------------------------------------------------------------------------------------------------------+\n"
		
	}


	table.textContent += "\n\n\n\n"
}



main().catch(console.log);