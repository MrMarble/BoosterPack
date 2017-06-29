/**
 *	Variables Globales
 **/
var xhttp = new XMLHttpRequest();
var id;
var running = true;
var index = 0;
/**
 *	Eventos de la Extension
 **/
chrome.tabs.onRemoved.addListener(
	function(tabId, removeInfo) {
		if (tabId == id) {
			running = false;
		}
	});

chrome.tabs.onUpdated.addListener(
	function(tabId, changeInfo, tab) {
		if (tabId == id) {
			running = false;
		}
	});

chrome.runtime.onMessage.addListener(
	function(request, sender) {
		id = sender.tab.id;
		running = true;
		obtain(request);
	});

chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [
				new chrome.declarativeContent.PageStateMatcher({
					pageUrl: {
						urlMatches: '(http|https)://(www.)*steamcommunity.com/id/.*(/badges)/'
					},
				})
			],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});

/**
 *	Registro del evento para XMLHttpRequest
 **/

xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var regEx = new RegExp("Owners</strong>(:\\s[0-9]*,[0-9]*,*[0-9]*)", "g");
		var match = regEx.exec(xhttp.responseText);
		if (match != null) {
			sendMessage({
				"id": xhttp.responseURL.split("/")[4],
				"owners": match[0].split(" ")[1].replace(",", "").replace(",", "")
			});
		}
	}
	if (this.readyState == 0) {
index--;
	}
};

/**
 *	Funciones
 **/

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function obtain(request) {
	for (index = 0; index < request.length; index++) {
		if (!running) {
			return;
		}
		xhttp.open("GET", "http://steamspy.com/app/" + request[index]);
		xhttp.onerror = function() {
		index--;
	}
	xhttp.send(null);
	await sleep(2500);
}
}

function sendMessage(data) {
	chrome.tabs.sendMessage(id, data);
}
