if (typeof browser === 'undefined') throw new Error('Firefox extension API not found.');

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.query === 'poe-ninja') {
    fetch('https://poe.ninja/api' + request.resource)
      .then(function(response) { return response.json() })
      .then(function(payload) { sendResponse(payload) })
      .catch(function(_error) { sendResponse(null) });

    return true;
  }
});
