modules.exports = function (io) {
	var emic = require('./emic.js')(io);
	emic.init();

	return {
		parser: function (msg) {
			msgEdit = msg.toString('ascii').trim();
			args = msg.split(' ');
			while ((args.length != 0) && (args[0].search(':') != -1)) {
				switch(args[0].split(':')[0].toLowerCase()) {
					case 'demo':
						emic.demo(args[1]);
						args.splice(0,2);
						break;
					case 'stop':
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
					case 'volume':
						emic.volume(args[1]);
						args.splice(0,2);
						break;
					case 'rate':
						emic.rate(args[1]);
						args.splice(0,2);
						break;
					case 'parser':
						emic.parser(args[1]);
						args.splice(0,2);
						break;
					case 'revert':
						emic.revert();
						args.splice(0,1);
						break;
					case 'settings':
						emic.callCurrentSettings();
						args.splice(0,1);
						break;
					case 'version':
						emic.callVersionInfo();
						args.splice(0,1);
						break;
					case 'commands':
						emic.callCommands();
						args.splice(0,1);
						break;
					default:
						emic.report('Invalid Command');
						emic.speak(args.join(''));
						args = [];
						break;
				}
			}
			emic.speak(args.join(''));
			args = [];
		}

	}
}