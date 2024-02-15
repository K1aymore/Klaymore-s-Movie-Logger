

let url = window.location.href;


let user = "";
let showID = "";

let urlParams;




function reloadOptions() {
	window.history.replaceState({}, '', `${location.pathname}?${urlParams}`);
	location.reload()
}




async function main() {

	urlParams = new URLSearchParams(window.location.search);


	if (urlParams.has("user")) {
		user = urlParams.get("user");
	}
	else {
		urlParams.set("user", "Klaymore");
		reloadOptions();
	}

	userSelect.value = user
	user = user.toLowerCase();

	if (urlParams.has("show")) {
		showID = urlParams.get("show");
	}
	else {
		return;
	}

	showSelect.value = showID
	showID = showID.toLowerCase();



	let databasePath = window.location.href.split('?')[0];
	databasePath = databasePath.replace("/show/", "");
	databasePath = databasePath.replace("index.html", "");
	databasePath += "/Database";


	let userPath = databasePath + "/Users/" + user;


	// https://stackoverflow.com/questions/49938266/how-to-return-values-from-async-functions-using-async-await-from-function

	

	const episodes = (await (await fetch(userPath + "/episodes.json")).json());
	let show = episodes[showID];

	let showData = (await fetch(databasePath + "/SHOW/" + showID + ".json"));

	if (typeof showData !== "undefined") {
		showData = (await showData.json());
		showLabel.innerHTML += showData.name;
	}

	// each season
	for (let s = 0; s < show.length; s++) {

		table.innerHTML += "Season " + (s+1) + "\n";
		table.innerHTML += "------------\n";

		// each episode
		for (let e = 0; e < show[s].length; e++) {
			let episode = show[s][e];
			
			table.innerHTML += "Ep." + (e+1).toString().padStart(3) + " ";

			let bar = document.createElement("span");
			bar.id = "S"+ s + "E" + e;

			// draw bar
			for (let r = 0; r < 10; r += 0.5) {
				let section = document.createElement("span");
				
				if (r < episode.rating) {
					section.innerHTML = "####";
					section.className = "sectionFull";
				}
				else if (r == episode.rating) {
					section.innerHTML = episode.rating.toString().padStart(2).padEnd(3);
					section.className = "sectionEmpty";
				}
				else {
					section.innerHTML = "    ";
					section.className = "sectionEmpty";
				}


				bar.appendChild(section);
			}

			table.appendChild(bar)


			if (typeof showData !== "undefined") {
				table.innerHTML += "  " + showData.seasons[s].episodes[e];
			}
			
			
			table.innerHTML += "\n";	
		}

		
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