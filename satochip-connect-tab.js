

if (window.parent === window) {
  console.log('In satochip-connect-tab: IF BLOCK START')
  console.log('In satochip-connect-tab: VERSION 0.3')
  let obj_tab={}
  obj_tab.bc = new BroadcastChannel('coolwallets');
  
  
  
  
  //obj_tab.hdPath = `m/44'/60'/0'/0`;
  obj_tab.requestID=0;
  obj_tab.resolveMap= new Map();
  obj_tab.isConnected= false;
  obj_tab.reconnectInterval = (1 * 1000 * 60) / 4;
  //obj_tab.ws= new WebSocket('ws://localhost:8397/');
  console.log('In satochip-connect-tab: websocket created!');
  
  obj_tab.connect = function() {
    console.log('In satochip-connect-tab: connect()');

    return new Promise((resolve) => {
      if (!obj_tab.isConnected) {
        console.log('In satochip-connect-tab: connect(): creating WebSocket...');
        obj_tab.ws = new WebSocket('ws://localhost:8397/');

        obj_tab.ws.onopen = function open() {
          console.log('In satochip-connect-tab: connect() onopen');
          obj_tab.isConnected = true;
          //TODO: remove get_status as it is not used?
          let msg = { requestID: obj_tab.requestID++, action: 'get_status' };
          let data = JSON.stringify(msg);

          obj_tab.ws.send(data);
          console.log('Request:' + data);
          
          // update satochip logo
          document.getElementById('satochip_logo').src='satochip.png';
          
          resolve(obj_tab.ws);
        };

        obj_tab.ws.onmessage = function incoming(data) {
          console.log('In satochip-connect-tab: connect(): onmessage data: ', data);
          //console.log('Reply:' + data); // should be string

          let response = JSON.parse(data.data);
          console.log('Reply JSON:', response);
          console.log('Reply requestID:', response.requestID);

          try {
            console.log('Assert: resolveMap has key: ' + response.requestID + '?' + obj_tab.resolveMap.has(response.requestID) );
            if (obj_tab.resolveMap.has(response.requestID)) {
              console.log('typeof(resolveMap.get()):' + typeof obj_tab.resolveMap.get(response.requestID));
              obj_tab.resolveMap.get(response.requestID)(response);
              obj_tab.resolveMap.delete(response.requestID);
            }
          } catch (error) {
            console.error(error);
          }
        };

        obj_tab.ws.onclose = function close(event) {
          console.log('In satochip-connect-tab: connect() onclose: event.code: ', event.code);
          //console.log('disconnected with code:' + event.code);
          obj_tab.isConnected = false;
          
          // update satochip logo
          document.getElementById('satochip_logo').src='satochip-unpaired.png';
          
          setTimeout(obj_tab.connect, obj_tab.reconnectInterval);
        };

        obj_tab.ws.onerror = function error() {
          console.log('In satochip-connect-tab: connect() onerror: disconnected with error!' );
          obj_tab.isConnected = false;
        };
        
      } else {
        console.log('In satochip-connect-tab: connect(): websocket already exists!');
        resolve(obj_tab.ws);
      }
    });
  }; //end connect()
    
  
  
  
  /* obj_tab.setUpWebsocket= function() {
      obj_tab.websocket.onopen = function() {
    
        const msg = { requestID: 1, action: 'get_status' };
        console.log('Satochip-connect.js: msg:' + msg);
        const data = JSON.stringify(msg);
        console.log('Satochip-connect.js: onopen: sending:' + data);
        obj_tab.websocket.send(data);
        console.log('Satochip-connect.js: onopen: sent:' + data);
      };

      obj_tab.websocket.onmessage = function (event) {
        
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
      obj_tab.websocket.onclose = function() {
          console.log('Satochip-connect.js: onclose');
          obj_tab.websocket = undefined;
      } 
    
  } //end setUpWebsocket */
  
  //=====================
  obj_tab.setUpListeners= function() {
    console.log('In satochip-connect-tab: setUpListeners START')
    //obj_tab.bc.postMessage({ target: 'tab-status', ready: true });
    //console.log('In satochip-connect-tab: setUpListeners READY!')
    
    //debug
    window.onload = (event) => {
      console.log('In satochip-connect-tab: setUpListeners: onload START');
      //obj_tab.bc.postMessage({ target: 'tab-status', ready: true });
      console.log('In satochip-connect-tab: setUpListeners: onload END');
    };
    
		window.onbeforeunload = () => {
      console.log('In satochip-connect-tab: setUpListeners: onbeforeunload START')
			obj_tab.bc.postMessage({ target: 'tab-status', ready: false });
      console.log('In satochip-connect-tab: setUpListeners: onbeforeunload END')
		};

		obj_tab.bc.onmessage = async ({ data }) => {
      console.log('In satochip-connect-tab: setUpListeners: onmessage START')
      console.log('In satochip-connect-tab: setUpListeners: onmessage data:', data)
			if (data && data.target === 'CWS-TAB') {
        //console.log('In satochip-connect-tab: setUpListeners: onmessage data:', data)
				const { action, params } = data;
        console.log('In satochip-connect-tab: setUpListeners: onmessage action:', action)
				const replyAction = `${action}-reply`;
				//await obj_tab.waitForConnection(); //TODO?
				switch (action) {
					case 'coolwallet-connection-check':
						//obj_tab.sendMessageToIframe(replyAction, false, { error: 'echo: satochip-connection-check' });
            // TODO: check websocket is ready
            obj_tab.bc.postMessage({ target: 'tab-status', ready: true });
						break;
					case 'coolwallet-unlock':
            obj_tab.getChainCode(replyAction, params.path)
            //obj_tab.sendMessageToIframe(replyAction, false, { error: 'echo: satochip-unlock' });
						break;
					case 'coolwallet-sign-transaction':
            obj_tab.signRawTransaction(replyAction, params.path, params.tx, params.tx_info);
						//obj_tab.sendMessageToIframe(replyAction, false, { error: 'echo: satochip-sign-tx' });
						break;
					case 'coolwallet-sign-personal-message':
            obj_tab.signPersonalMessage(replyAction, params.path, params.message, params.hash)
						//obj_tab.sendMessageToIframe(replyAction, false, { error: 'echo: satochip-sign-perso' });
						break;
					case 'coolwallet-sign-typed-data':
						obj_tab.sendMessageToIframe(replyAction, false, { error: 'echo: satochip-typed' });
						break;
					default:
						obj_tab.sendMessageToIframe(replyAction, false, { error: 'Not supported' });
						break;
				}
			}
      console.log('In satochip-connect-tab: setUpListeners: onmessage END')
		};
    
    console.log('In satochip-connect-tab: setUpListeners END')
	} //end setUpListeners

	/**
   *
   * @param {String} action
   * @param {Boolean} success
   * @param {any} payload
   */
	obj_tab.sendMessageToIframe= function(action, success, payload) {
    console.log('In satochip-connect-tab: sendMessageToIframe START')
    console.log('In satochip-connect-tab: sendMessageToIframe action: ', action)
    console.log('In satochip-connect-tab: sendMessageToIframe success: ', success)
    console.log('In satochip-connect-tab: sendMessageToIframe payload: ', payload)
		obj_tab.bc.postMessage({ action, success, payload });
    console.log('In satochip-connect-tab: sendMessageToIframe END')
	}
  
  //=============================================================
  
  obj_tab.getChainCode= function(replyAction, path) {
    console.log('In satochip-connect-tab: getChainCode: replyAction: ', replyAction); //debugSatochip

    obj_tab.connect().then((ws) => {
      //const fullpath= dpath+"/0";
      console.log('In satochip-connect-tab: getChainCode: connect().then()'); //debugSatochip
      const msg = {
        requestID: obj_tab.requestID++,
        action: 'get_chaincode',
        path: path
      };
      const request = JSON.stringify(msg);

      //new Promise((resolve) => {
        
        // send request to device and keep a ref of the resolve function in a map
        const response = new Promise((resolve2) => {
          console.log('Satochip: resolveMap.size - before:' + obj_tab.resolveMap.size);
          obj_tab.resolveMap.set(msg.requestID, resolve2);
          //obj_tab.ws.send(request);
          ws.send(request);
          console.log('Satochip: request sent:' + request);
          console.log('Satochip: typeof(resolve2):' + typeof resolve2);
          console.log('Satochip: resolveMap.size - after:' + obj_tab.resolveMap.size);
        }).then((res) => {
          // return answers to iframe
          console.log('In satochip-connect-tab: getChainCode: res: ', res);
          let payload={ parentPublicKey: res.pubkey, parentChainCode: res.chaincode}
          obj_tab.sendMessageToIframe(replyAction, true, payload); // TODO: check for error
        });
      //});
    });  
  }// end getChainCode

  obj_tab.signRawTransaction= function(replyAction, path, tx, tx_info) {
    console.log('In satochip-connect-tab: signRawTransaction(): START');
    console.log('In satochip-connect-tab: signRawTransaction(): replyAction', replyAction);
    console.log('In satochip-connect-tab: signRawTransaction(): path', path);
    console.log('In satochip-connect-tab: signRawTransaction(): tx', tx);
    console.log('In satochip-connect-tab: signRawTransaction(): tx_info', tx_info);

    if (!obj_tab.isConnected) {
      obj_tab.connect();
    }

/*     // Disable EIP155 in Ethereumjs-tx
    const transaction = new EthTx(tx, { chain: tx.getChainId(), hardfork: 'tangerineWhistle' });
    const txFields = getTransactionFields(transaction);
    transaction.v = toBuffer(transaction.getChainId());
    transaction.r = toBuffer(0);
    transaction.s = toBuffer(0);
    console.log('transaction: ' + transaction.toJSON());
    console.log('transaction: ' + transaction.toJSON(true)); */

    const msg = {
      requestID: obj_tab.requestID++,
      action: 'sign_tx_hash',
      tx: tx_info.tx_serialized, //tx: transaction.serialize().toString('hex'), //tx.serialize().toString('hex'), //DEBUGTMP
      hash: tx_info.tx_hash_false, //hash: transaction.hash(true).toString('hex'), //hash: transaction.hash(false).toString('hex'),
      //hash: tx_info.tx_hash_true, //hash: transaction.hash(true).toString('hex'), //hash: transaction.hash(false).toString('hex'),
      path: path //this.getPath()
    };
    const request = JSON.stringify(msg);
    const chainId= tx_info.chainId;
    
    //return new Promise((resolve) => {
      // send request to device and keep a ref of the resolve function in a map
      const response = new Promise((resolve2) => {
        console.log('Satochip: resolveMap.size - before:' + obj_tab.resolveMap.size);
        obj_tab.resolveMap.set(msg.requestID, resolve2);
        obj_tab.ws.send(request);
        console.log('Satochip: request sent:' + request);
        console.log('Satochip: resolveMap.size - after:' + obj_tab.resolveMap.size);
      }).then((res) => {
        // extracts usefull data from device response and resolve original promise
        console.log('In satochip-connect-tab: signRawTransaction: res: ', res);
        let payload={ v: (res.v+chainId*2+35), r:res.r, s:res.s}
        obj_tab.sendMessageToIframe(replyAction, true, payload); // TODO: check for error
      });
    //});
  } // end signRawTransaction

  obj_tab.signPersonalMessage= function(replyAction, path, message, hash) {
		console.log('In satochip-connect-tab: signPersonalMessage(): START');
    console.log('In satochip-connect-tab: signRawTransaction(): replyAction', replyAction);
    console.log('In satochip-connect-tab: signRawTransaction(): path', path);
    console.log('In satochip-connect-tab: signRawTransaction(): message', message);
    
    if (!obj_tab.isConnected) {
      obj_tab.connect();
    }

    const data = {
      requestID: obj_tab.requestID++,
      action: 'sign_msg_hash',
      msg: message,
      hash: hash,
      path: path
    };
    const request = JSON.stringify(data);

    //return new Promise((resolve) => {
      // send request to device and keep a ref of the resolve function in a map
      const response = new Promise((resolve2) => {
        obj_tab.resolveMap.set(data.requestID, resolve2);
        obj_tab.ws.send(request);
        console.log('Satochip: request sent:' + request);
      }).then((res) => {
        // extracts usefull data from device response and resolve original promise
        const r = res.r;
        const s = res.s;
        const v = ('0' + res.v.toString(16)).slice(-2); //padd with '0'
        //const sig = addHexPrefix(r + s + v);
        const sig = '0x' + (r + s + v);
        
        console.log('In satochip-connect-tab: signRawTransaction(): sig', sig);
        obj_tab.sendMessageToIframe(replyAction, true, sig);
      });
    //});
	}
  //=============================================================
  
  //obj_tab.connect()
  //obj_tab.setUpWebsocket();
  // Tab or open directly. Listen CWS-TAB message from BroadCastChannel
  obj_tab.setUpListeners();
  console.log('In satochip-connect-tab: IF BLOCK END')
}
	
