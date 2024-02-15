

let url = window.location.href;



let user = ""

let urlParams;

let filters = [];


let buttons = {
	"movies": moviesButton,
	"shows": showsButton,
	"seasons": seasonsButton,
	"episodes": episodesButton,
	"sauces": saucesButton,
	"dews": dewsButton,
	"doritos": doritosButton
}




function reloadOptions() {
	window.history.replaceState({}, '', `${location.pathname}?${urlParams}`);
	location.reload()
}


function toggleFilter(filter) {
	if (urlParams.has("f", filter)) {
		urlParams.delete("f", filter);
	} else {
		urlParams.append("f", filter);
	}

	reloadOptions();
}


function setupButtons() {
	for (let i = 0; i < filters.length; i++) {
		buttons[filters[i]].style.color = "#eba0ac";
	}

	for (let buttonName in buttons) {
		let button = buttons[buttonName];
		button.addEventListener("click", function (e) {
			toggleFilter(buttonName);
		});
	}

}






async function main() {

	urlParams = new URLSearchParams(window.location.search);

	if (urlParams.has("user")) {
		user = urlParams.get("user");
	}
	else {
		urlParams.set("user", "Klaymore");
		console.log(urlParams);
		reloadOptions();
	}


	userSelect.value = user
	user = user.toLowerCase();


	filters = urlParams.getAll("f");

	console.log(filters);



	setupButtons();




	let databasePath = window.location.href.split('?')[0].replace("/index.html", "");
	databasePath += "/Database";


	let userPath = databasePath + "/Users/" + user;


	// https://stackoverflow.com/questions/49938266/how-to-return-values-from-async-functions-using-async-await-from-function

	let items = [];

	if (filters.includes("shows") || filters.includes("seasons")) {
		const shows = (await (await fetch(userPath + "/shows.json")).json());

		for (let showID in shows) {
			let show = shows[showID];
			show.name = (await (await fetch(databasePath + "/SHOW/" + showID + ".json")).json()).name;
		
		
			if (filters.includes("shows")) {
				items.push(show);
			}
	
			if (filters.includes("seasons")) {
				for (let seasonNum in show.seasons) {
					let season = show.seasons[seasonNum];
					season.name = show.name + " S" + seasonNum;
					items.push(season);
				}
			}
		}

	}

	if (filters.includes("episodes")) {
		const episodes = (await (await fetch(userPath + "/episodes.json")).json());

		for (let showID in episodes) {
			let show = episodes[showID];

			let showName = (await (await fetch(databasePath + "/SHOW/" + showID + ".json")).json()).name;

			for (let s = 0; s < show.length; s++) {
				for (let i = 0; i < show[s].length; i++) {
					let episode = show[s][i];
					episode.name = showName + " S" + (s+1) + "E" + (i + 1);
					console.log(episode);
					items.push(episode);
				}
			}

		}
	}

	if (filters.includes("movies")) {
		const movies = (await (await fetch(userPath + "/movies.json")).json())
		for (let movieID in movies) {
			let movie = movies[movieID];
			movie.name = (await (await fetch(databasePath + "/MOVIE/" + movieID + ".json")).json()).name;
			items.push(sauce);
		}
	}



	if (filters.includes("sauces")) {
		const sauces = (await (await fetch(userPath + "/sauces.json")).json());
		for (let sauceName in sauces) {
			let sauce = sauces[sauceName];
			sauce.name = sauceName;
			items.push(sauce);
		}
	}


	if (filters.includes("dews")) {
		const dews = (await (await fetch(userPath + "/dews.json")).json());
		for (let dewName in dews) {
			let dew = dews[dewName];
			dew.name = dewName;
			items.push(dew);
		}
	}

	if (filters.includes("doritos")) {
		const doritos = (await (await fetch(userPath + "/doritos.json")).json());
		for (let doritoName in doritos) {
			let dorito = doritos[doritoName];
			dorito.name = doritoName;
			items.push(dorito);
		}
	}


	items.sort((a, b) => b.rating - a.rating);
	console.log(items);





	table.textContent = "+-----------------------------------------------------------------------------------------------------------------------------------------+\n"

	for (let i = 0; i < items.length; i++) {
		let item = items[i];

		let rating = String(item.rating);
		if (item.rating == 0) {
			rating = "";
		}

		let review = "";
		if (Object.hasOwn(item, "review")) {
			review = item.review;
		}

		table.textContent += "| " + item.name.padEnd(50)
			+ " | " + (rating.padEnd(3))
			+ " |  " + (review.padEnd(75))
			+ " |" + "\n"
			+ "+-----------------------------------------------------------------------------------------------------------------------------------------+\n"

	}


}





function toTitleCase(str) {
	return str.replace(
		/\w\S*/g,
		function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		}
	);
}



main().catch(console.log);