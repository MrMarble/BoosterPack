/**
 *	Variables Globales
 **/
var ids;

/**
 *	Creacion del boton
 **/
var level = document.getElementsByClassName("friendPlayerLevelNum")[0].innerHTML * 2;
var parent = document.getElementsByClassName("profile_badges_header_title");
var button = document.createElement("button");
var text = document.createTextNode("Booster Odds");

button.setAttribute("class", "pagebtn");
button.appendChild(text);
parent[0].appendChild(button);

button.addEventListener('click', function() {
	calcularOdds();
})

/**
 *	Eventos de la Extension
 **/

chrome.runtime.onMessage.addListener(
	function(request, sender) {
		var all = document.getElementsByClassName("badge_row_overlay");
		for (var i = 0; i < all.length; i++) {
			if (all[i].getAttribute("href").includes(request.id)) {
				var element = document.createElement("p");
				var elementText = document.createTextNode(round(((((level / 100) + 1) / request.owners) * 100), 4) + "%");
				element.appendChild(elementText);
				element.setAttribute("class", "badge_title");
				element.setAttribute("style", "padding-left: 100px;padding-top: 10px;");
				all[i].appendChild(element);
			}
		}
		console.log(request);
	});


/**
 * Funciones
 **/
function calcularOdds() {
	var all = document.getElementsByClassName("badge_row_overlay");
	ids = [];

	for (var i = 0, max = all.length; i < max; i++) {
		var id = all[i].getAttribute("href");
		id = id.split("/")[6];
		ids.push(id);
	}

	chrome.runtime.sendMessage(ids, function(response) {
		console.log(response);
	});

}

function round(value, exp) {
	if (typeof exp === 'undefined' || +exp === 0)
		return Math.round(value);

	value = +value;
	exp = +exp;

	if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
		return NaN;

	// Shift
	value = value.toString().split('e');
	value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

	// Shift back
	value = value.toString().split('e');
	return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}
