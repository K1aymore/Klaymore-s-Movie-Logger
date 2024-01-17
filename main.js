
let url = window.location.href;



let user = ""

let urlParams;

let filters = [];

let questionPos = 0;
let hashtagPos = 0;

let buttons = {
	"movies": moviesButton,
	"shows": showsButton,
	"seasons": seasonsButton,
	"episodes": episodesButton,
	"sauces": saucesButton
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
		button.addEventListener("click", function(e) {
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
		console.log(urlParams)
		reloadOptions();
	}
	

	userSelect.value = user
	user = user.toLowerCase();
	

	filters = urlParams.getAll("f");
	
	console.log(filters);



	setupButtons();
	


	
	let databasePath = url.substring(0, questionPos).replace("/index.html", "");
	databasePath += "/Database";
	
	
	let userPath = databasePath + "/Users/" + user;
	

	// https://stackoverflow.com/questions/49938266/how-to-return-values-from-async-functions-using-async-await-from-function

	let items = [];

	if (filters.includes("shows") || filters.includes("seasons")) {
		const watchedShows = (await (await fetch(userPath + "/watched/shows.json")).json()).shows;

		for (let s = 0; s < watchedShows.length; s++) {
			watchedShows[s].name = (await (await fetch(databasePath + "/Shows/" + watchedShows[s].id + ".json")).json()).name;
		}

		if (filters.includes("shows")) {
			for (let s = 0; s < watchedShows.length; s++) {
				let show = watchedShows[s];
				items.push(show);
			}
		}
		
		//console.log(watchedShows);
		if (filters.includes("seasons")) {
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
	

	if (filters.includes("sauces")) {
		const saucesData = (await (await fetch(userPath + "/sauces.json")).json()).sauces;

		console.log(saucesData);
		items = items.concat(saucesData);

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





function toTitleCase(str) {
	return str.replace(
	  /\w\S*/g,
	  function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	  }
	);
  }



main().catch(console.log);