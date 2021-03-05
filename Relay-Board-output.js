module.exports = function(RED) {
    function RelayBoardOutputNode(config) {
        RED.nodes.createNode(this,config);
        this.board = config.board;
        this.MAC = config.MAC;
		this.state = config.state;
		this.relay = config.relay
		// this.ioplugin = RED.nodes.getNode(n.board);
        var node = this;
        this.on('input', function(msg) {
        	// {"model":"ioBoard","nFunction":"setRLY1","arguments":["IOBOARD-v1","MICROID-05RO",false]}
        	var state = config.state;
        	var board = node.board;
        	var MAC = node.MAC;
        	if(state == "boolean" || state == "msg.payload") state = msg.payload;

        	if(state =="ON" || state == true || state =="true" || state == 1){
        		state = true
			}else if(state =="OFF" || state == false || state =="false" || state == 0){
        		state = false
        	}else if(state == "STATUS"){
        		state = "STAT"
        	}

			var second = msg.sec || 5
			var minute = msg.min || ""
			var hour = msg.hr || ""

			
        	var relay = config.relay || "";
			var model = "relay16board"

			relay = {["relay"+relay]:true}

        	if(state=="STAT"){
				msg.payload = {model,nFunction:"getBoardStatus",arguments:[board,MAC]};
			}else if(state=="PULSE"){
				msg.payload = {model,nFunction:"setRelayPulse",arguments:[board,MAC,relay]};
			}else if(state=="TOGGLE"){
				msg.payload = {model,nFunction:"setRelayToggle",arguments:[board,MAC,relay]};
			}else if(state=="MOMENTARY"){	
				msg.payload = {model,nFunction:"setRelayTimerOn",arguments:[board,MAC,relay,second]};
				// msg.payload = {model,nFunction:"setRelayTimerOn",arguments:[board,MAC,relay,second,minute,hour]};
			// }else if(state=="LIFT-ON"){	
			// 	msg.payload = {model,nFunction:"setRelayLiftOn",arguments:[board,MAC,relay]};
			}else if(state=="LIFT-MOMENTARY"){	
				msg.payload = {model,nFunction:"setRelayLiftTimerOn",arguments:[board,MAC,relay,second]};
        	}else if(state==false){
        		msg.payload = {model,nFunction:"setRelayClose",arguments:[board,MAC,relay]};
        	}else {
        		msg.payload = {model,nFunction:"setRelayPlusOn",arguments:[board,MAC,relay]};
        	}
            
            msg.service = "socketiot/relay16boardApi/";
            // msg.payload = {name:node.name,board:node.board,state:node.state,MAC:node.MAC}
            node.send(msg);
        });
    }
    RED.nodes.registerType("Relay-Board-Output",RelayBoardOutputNode);
}