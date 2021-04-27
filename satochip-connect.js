

// FROM collwallet-connect iframeScript.js
console.log('In satochip-connect.js: START')
let tabReady = false;
let bc = new BroadcastChannel('coolwallets');
//setupListeners();

if (window.parent !== window) { // for the iframe
      console.log('In satochip-connect.js: TO SETUPLISTENERSIFRAME(): START')
			tabReady = false;
			bc = new BroadcastChannel('coolwallets');
			this.setupListenersIframe();
}
if (window.parent === window) { // for the tab window?
      console.log('In satochip-connect.js: SETUPLISTENERSTAB(): START')
			bc = new BroadcastChannel('coolwallets');
			// Tab or open directly. Listen CWS-TAB message from BroadCastChannel
			this.setUpListenersTab();
} 

function	setupListenersIframe() {
    console.log('In satochip-connect.js: setupListeners(): START')
		//const tabDomain = 'https://coolbitx-technology.github.io/coolwallet-connect/#/';
    const tabDomain = 'http://localhost:8080'

		// Open as IFRAME
		onmessage = async ({ data, source, origin }) => {
      console.log('In satochip-connect.js: setupListeners(): onmessage: START')
      console.log('In satochip-connect.js: setupListeners(): onmessage: DATA', data)
      console.log('In satochip-connect.js: setupListeners(): onmessage: SOURCE', source)
      console.log('In satochip-connect.js: setupListeners(): onmessage: ORIGIN', origin)
      //console.log('In satochip-connect.js: setupListeners(): onmessage: WINDOW.PARENT', window.parent)
			if (data.target === 'CWS-IFRAME' && source === window.parent) {
        console.log('In satochip-connect.js: setupListeners(): onmessage: open in newtab START')
				// Open CoolWalletConnect in new tab.
				const tab = openOnce(tabDomain, 'coolwallets-tab');

				tab.onbeforeunload = () => {
					tabReady = false;
				};

				if (!tabReady) pingTab();
				while (!tabReady) {
					console.log(`blocking`);
					await sleep(1000);
				}
        
        //debugSatochip
        console.log('In satochip-connect.js: setupListeners(): onmessage: open in newtab TABREADY true')
        tabReady = true;

				data.target = 'CWS-TAB';
				bc.postMessage(data, '*');
        console.log('In satochip-connect.js: setupListeners(): onmessage: open in newtab END')
			//}
		};

		bc.onmessage = ({ data, source }) => {
      console.log('In satochip-connect.js: setupListeners(): BC.onmessage: START')
			if (data.target === 'tab-status') {
				tabReady = data.ready;
			} else {
				sendMessageToExtension(data);
			}
      console.log('In satochip-connect.js: setupListeners(): BC.onmessage: END')
		};
    
    console.log('In satochip-connect.js: setupListeners(): END')
	}

	function pingTab() {
    console.log('In satochip-connect.js: pingTab(): START')
		bc.postMessage({ target: 'CWS-TAB', action: 'coolwallet-connection-check' });
    console.log('In satochip-connect.js: pingTab(): END')
	}

	function sendMessageToExtension(msg) {
    console.log('In satochip-connect.js: sendMessageToExtension(): START')
		window.parent.postMessage(msg, '*');
    console.log('In satochip-connect.js: sendMessageToExtension(): END')
	}

	function openOnce(url, target) {
    console.log('In satochip-connect.js: openOnce(): START')
		var winref = window.open('', target, ''); //var winref = window.open('', target, '', true);

		// if the "target" window was just opened, change its url
		if (winref.location.href === 'about:blank') {
			winref.location.href = url;
		}
		winref.focus();
    console.log('In satochip-connect.js: openOnce(): END')
		return winref;
	}

	function sleep(ms) {
    console.log('In satochip-connect.js: sleep(): START')
		return new Promise((resolve) => setTimeout(resolve, ms));
    console.log('In satochip-connect.js: sleep(): END')
	}

	function render() {
    console.log('In satochip-connect.js: render(): START')
		return null;
	}

//======================================

	setUpListenersTab() {
		window.onbeforeunload = () => {
      console.log('In satochip-connect.js: onbeforeunload(): START')
			bc.postMessage({ target: 'tab-status', ready: false });
      console.log('In satochip-connect.js: onbeforeunload(): END')
		};

		bc.onmessage = async ({ data }) => {
      console.log('In satochip-connect.js: bc.onmessage(): START')
      console.log('In satochip-connect.js: bc.onmessage(): data:', data)
			if (data && data.target === 'CWS-TAB') {
				const { action, params } = data;
				const replyAction = `${action}-reply`;
				//await waitForConnection();
        console.log('In satochip-connect.js: bc.onmessage(): MIDDLE')
        sendMessageToIframe(replyAction, false, { error: 'Not supported' });
				/*
        switch (action) {
					case 'coolwallet-connection-check':
						checkReadyForCommand();
						break;
					case 'coolwallet-unlock':
						this.props.openModal(processingContent('Deriving...'));
						this.unlock(replyAction, params.addrIndex);
						break;
					case 'coolwallet-sign-transaction':
						this.props.openModal(processingContent('Processing Transaction...'));
						this.signTransaction(replyAction, params.addrIndex, params.tx, params.publicKey);
						break;
					case 'coolwallet-sign-personal-message':
						this.props.openModal(processingContent('Processing Message...'));
						this.signPersonalMessage(replyAction, params.addrIndex, params.message, params.publicKey);
						break;
					case 'coolwallet-sign-typed-data':
						this.props.openModal(processingContent('Processing Typed Data...'));
						this.signTypedData(replyAction, params.addrIndex, params.typedData, params.publicKey);
						break;
					default:
						this.sendMessageToIframe(replyAction, false, { error: 'Not supported' });
						break;
          */
				}
        console.log('In satochip-connect.js: bc.onmessage(): END')
			}
		};
	}


/* console.log('Satochip-connect.js: START');
var websocket = new WebSocket('ws://localhost:8397/');
console.log('Satochip-connect.js: websocket created!');

websocket.onopen = function() {
  
  const msg = { requestID: 1, action: 'get_status' };
  console.log('Satochip-connect.js: msg:' + msg);
  const data = JSON.stringify(msg);
  console.log('Satochip-connect.js: onopen: sending:' + data);
  websocket.send(data);
  console.log('Satochip-connect.js: onopen: sent:' + data);
};

websocket.onmessage = function (event) {
  
  console.log('Satochip-connect.js: onmessage!'); //debugSatochip
  console.log('Reply:' + event.data); // should be string
  const response = JSON.parse(event.data);
  console.log('Reply JSON:', response);
  console.log('Reply requestID:', response.requestID);
  
  // forward response to eth-satochip-keyring script
  console.log('Satochip-connect.js: onmessage: forward msg to satochip-keyring'); //debugSatochip
  //window.postMessage(event.data, "*");
  console.log('Satochip-connect.js: onmessage: msg forwarded!'); //debugSatochip
};

//If the websocket is closed but the session is still active, create new connection again
websocket.onclose = function() {
    console.log('Satochip-connect.js: onclose');
    websocket = undefined;
} */


console.log('In satochip-connect.js: END')