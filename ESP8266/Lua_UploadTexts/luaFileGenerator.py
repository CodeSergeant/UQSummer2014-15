with open('wifi.lua', 'rU') as fp:
	with open('output.txt', 'w') as fo:
		fo.write('file.open("init.lua", "w")\n')
		for line in iter(fp.readline, ''):
			fo.write('file.writeline([[{0}]])\n'.format(line.strip()))
		fo.write('file.close()\n')
