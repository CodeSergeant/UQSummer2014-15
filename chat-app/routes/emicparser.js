modules.exports = function (io) {
	var emic = require('./emic.js')(io);
	emic.init();

	return {
		parse: function (msg) {
			msgEdit = msg.toString('ascii').trim();
			args = msg.split(' ');
			if (args[0].search(':') == -1) {
				emic.speak(msgEdit);
			} else {
				switch(args[0].split(':')[0].toLowerCase()) {
					case 'demo':
						emic.demo(args[1]);
						args.splice(0,2);
						break;
					case 'stopnow':
						emic.stopNow();
						args.splice(0,1);
						break;
					case 'pause':
						emic.pause();
						args.splice(0,1);
						break;
					case 'voice':
						emic.voice(args[1]);
						args.splice(0,2);
						break;
					
				}

				if (command == 'demo') {
					emic.demo(args[1]);
				}
			}

		}
	}

}