

if (window.parent !== window) {// iframe
  console.log('In satochip-connect-iframe: IF BLOCK START')
  let obj_iframe={}
  //==================
  obj_iframe.setupListenersIframe= function() {
    console.log('In satochip-connect-iframe: setupListenersIframe START')
		//const tabDomain = 'https://coolbitx-technology.github.io/coolwallet-connect/#/';
    const tabDomain = 'http://localhost:3000'

		// Open as IFRAME
		onmessage = async ({ data, source, origin }) => {
      console.log('In satochip-connect-iframe: setupListenersIframe: onmessage START')
      console.log('In satochip-connect-iframe: setupListenersIframe: onmessage data:', data)
			if (data.target === 'CWS-IFRAME' && source === window.parent) {
        console.log('In satochip-connect-iframe: setupListenersIframe: onmessage: NEWTAB START')
				// Open CoolWalletConnect in new tab.
				const tab = obj_iframe.openOnce(tabDomain, 'coolwallets-tab');

				tab.onbeforeunload = () => {
					obj_iframe.tabReady = false;
				};
        
        console.log('In satochip-connect-iframe: setupListenersIframe: onmessage: NEWTAB MIDDLE1')
				if (!obj_iframe.tabReady) obj_iframe.pingTab();
				while (!obj_iframe.tabReady) {
					console.log(`blocking`);
					await obj_iframe.sleep(1000);
          
          if (!obj_iframe.tabReady) obj_iframe.pingTab();
          
          //console.log('In satochip-connect-iframe: setupListenersIframe: onmessage: in while: setting ready flag TRUE')
          //obj_iframe.tabReady = true;
          //obj_iframe.bc.postMessage({ target: 'CWS-TAB', action: 'coolwallet-connection-check' });
          //console.log('In satochip-connect-iframe: setupListenersIframe: onmessage: in while: setting ready flag done!')
          
				}
        
        console.log('In satochip-connect-iframe: setupListenersIframe: onmessage: NEWTAB MIDDLE2')
				data.target = 'CWS-TAB';
				obj_iframe.bc.postMessage(data, '*');
        
        console.log('In satochip-connect-iframe: setupListenersIframe: onmessage: NEWTAB END')
			}
      console.log('In satochip-connect-iframe: setupListenersIframe: onmessage END')
		};

		obj_iframe.bc.onmessage = ({ data, source }) => {
      console.log('In satochip-connect-iframe: setupListenersIframe: bc.onmessage START')
      console.log('In satochip-connect-iframe: setupListenersIframe: bc.onmessage data:', data)
			if (data.target === 'tab-status') {
				obj_iframe.tabReady = data.ready;
			} else {
        //console.log('In satochip-connect-iframe: setupListenersIframe: bc.onmessage FORWARD TO EXTENSION')
				obj_iframe.sendMessageToExtension(data);
			}
		};
    
    console.log('In satochip-connect-iframe: setupListenersIframe END')
	}

	obj_iframe.pingTab= function() {
    console.log('In satochip-connect-iframe: pingTab START')
		obj_iframe.bc.postMessage({ target: 'CWS-TAB', action: 'coolwallet-connection-check' });
    console.log('In satochip-connect-iframe: pingTab END')
	}

	obj_iframe.sendMessageToExtension= function(msg) {
    console.log('In satochip-connect-iframe: sendMessageToExtension START')
		window.parent.postMessage(msg, '*');
    console.log('In satochip-connect-iframe: sendMessageToExtension END')
	}

	obj_iframe.openOnce= function(url, target) {
    console.log('In satochip-connect-iframe: openOnce START')
		var winref = window.open('', target, '', true);

		// if the "target" window was just opened, change its url
		if (winref.location.href === 'about:blank') {
			winref.location.href = url;
		}
		winref.focus();
    console.log('In satochip-connect-iframe: openOnce END')
		return winref;
	}

	obj_iframe.sleep= function(ms) {
    console.log('In satochip-connect-iframe: sleep START')
		return new Promise((resolve) => setTimeout(resolve, ms));
    console.log('In satochip-connect-iframe: sleep END')
	}


  
  //==================
  
  obj_iframe.tabReady = false;
  obj_iframe.bc = new BroadcastChannel('coolwallets');
  obj_iframe.setupListenersIframe();
  console.log('In satochip-connect-iframe: IF BLOCK END')
}

	/* obj_iframe.setupListenersIframe= function() {
    console.log('In satochip-connect-iframe: setupListenersIframe START')
		//const tabDomain = 'https://coolbitx-technology.github.io/coolwallet-connect/#/';
    const tabDomain = 'http://localhost:3000'

		// Open as IFRAME
		onmessage = async ({ data, source, origin }) => {
      console.log('In satochip-connect-iframe: setupListenersIframe: onmessage START')
			if (data.target === 'CWS-IFRAME' && source === window.parent) {
        console.log('In satochip-connect-iframe: setupListenersIframe: onmessage: NEWTAB START')
				// Open CoolWalletConnect in new tab.
				const tab = obj_iframe.openOnce(tabDomain, 'coolwallets-tab');

				tab.onbeforeunload = () => {
					obj_iframe.tabReady = false;
				};
        
        console.log('In satochip-connect-iframe: setupListenersIframe: onmessage: NEWTAB MIDDLE1')
				if (!obj_iframe.tabReady) pingTab();
				while (!obj_iframe.tabReady) {
					console.log(`blocking`);
					await obj_iframe.sleep(1000);
				}
        
        console.log('In satochip-connect-iframe: setupListenersIframe: onmessage: NEWTAB MIDDLE2')
				data.target = 'CWS-TAB';
				obj_iframe.bc.postMessage(data, '*');
        
        console.log('In satochip-connect-iframe: setupListenersIframe: onmessage: NEWTAB END')
			}
      console.log('In satochip-connect-iframe: setupListenersIframe: onmessage END')
		};

		obj_iframe.bc.onmessage = ({ data, source }) => {
      console.log('In satochip-connect-iframe: setupListenersIframe: bc.onmessage START')
      console.log('In satochip-connect-iframe: setupListenersIframe: bc.onmessage data:', data)
			if (data.target === 'tab-status') {
				obj_iframe.tabReady = data.ready;
			} else {
				obj_iframe.sendMessageToExtension(data);
			}
		};
    
    console.log('In satochip-connect-iframe: setupListenersIframe END')
	}

	obj_iframe.pingTab= function() {
    console.log('In satochip-connect-iframe: pingTab START')
		obj_iframe.bc.postMessage({ target: 'CWS-TAB', action: 'coolwallet-connection-check' });
    console.log('In satochip-connect-iframe: pingTab END')
	}

	obj_iframe.sendMessageToExtension= function(msg) {
    console.log('In satochip-connect-iframe: sendMessageToExtension START')
		window.parent.postMessage(msg, '*');
    console.log('In satochip-connect-iframe: sendMessageToExtension END')
	}

	obj_iframe.openOnce= function(url, target) {
    console.log('In satochip-connect-iframe: openOnce START')
		var winref = window.open('', target, '', true);

		// if the "target" window was just opened, change its url
		if (winref.location.href === 'about:blank') {
			winref.location.href = url;
		}
		winref.focus();
    console.log('In satochip-connect-iframe: openOnce END')
		return winref;
	}

	obj_iframe.sleep= function(ms) {
    console.log('In satochip-connect-iframe: sleep START')
		return new Promise((resolve) => setTimeout(resolve, ms));
    console.log('In satochip-connect-iframe: sleep END')
	}

 */