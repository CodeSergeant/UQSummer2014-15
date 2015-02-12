print("WIFI control")
wifi.setmode(wifi.SOFTAP)
print("ESP8266 mode is: " .. wifi.getmode())
cfg={}
cfg.ssid="eduroam"
cfg.pwd="100%4Hisglory"
if ssid and password then
	print("ESP8266 SSID is: " .. cfg.ssid .. " and PASSWORD is: " .. cfg.password)
end
wifi.ap.config(cfg)
ap_mac = wifi.ap.getmac()
sv=net.createServer(net.TCP,30)
sv:listen(80,function(c)
	c:on("receive", function(c, pl)
		print(string.len(pl))
		print(string.match(pl,"GET"))
		ssid_start,ssid_end=string.find(pl,"SSID=")
		if ssid_start and ssid_end then
			amper1_start, amper1_end =string.find(pl,"&", ssid_end+1)
			if amper1_start and amper1_end then
				http_start, http_end =string.find(pl,"HTTP/1.1", ssid_end+1)
				if http_start and http_end then
					ssid=string.sub(pl,ssid_end+1, amper1_start-1)
					password=string.sub(pl,amper1_end+10, http_start-2)
					print("ESP8266 connecting to SSID: " .. ssid .. " with PASSWORD: " .. password)
					if ssid and password then
						sv:close()
						wifi.setmode(wifi.STATIONAP)
						print("ESP8266 mode now is: " .. wifi.getmode())
						wifi.sta.config(ssid,password)
						print("Setting up ESP8266 for station mode…Please wait.")
						tmr.delay(10000000)
						print("ESP8266 STATION IP now is: " .. wifi.sta.getip())
						print("ESP8266 AP IP now is: " .. wifi.ap.getip())
						gpio.mode(8,gpio.OUTPUT)
						gpio.mode(9,gpio.OUTPUT)
						tmr.delay(10)
						gpio.write(8,gpio.HIGH)
						tmr.delay(10)
						gpio.write(8,gpio.LOW)
						sv=net.createServer(net.TCP, 30)
						sv:listen(9999,function(c)
							c:on("receive", function(c, pl)
								if tonumber(pl) ~= nil then
									if tonumber(pl) >= 1 and tonumber(pl) <= 16 then
										print(tonumber(pl))
										tmr.delay(10)
										gpio.write(8,gpio.HIGH)
										tmr.delay(10)
										gpio.write(8,gpio.LOW)
										for count =1,tonumber(pl) do
											print(count)
											tmr.delay(10) 
											gpio.write(9,gpio.LOW)
											tmr.delay(10)
											gpio.write(9,gpio.HIGH)
											c:send("Sequence finished") 
										end
									end
								end
								print("ESP8266 STATION IP now is: " .. new_ip)
								c:send("ESP8266 STATION IP now is: " .. new_ip) 
								c:send("Action completed") 
							end)
						end)
					end
				end
			end
		end
		c:send("<!DOCTYPE html> ")
		c:send("<html lang='en'> ")
		c:send("<body> ")
		c:send("<h1>ESP8266 Wireless control setup</h1> ")
		mac_mess1 = "The module MAC address is: " .. ap_mac
		mac_mess2 = "You will need this MAC address to find the IP address of the module, please take note of it."
		c:send("<h2>" .. mac_mess1 .. "</h2> ")
		c:send("<h2>" .. mac_mess2 .. "</h2> ")
		c:send("<h2>Enter SSID and Password for your WIFI router</h2> ")
		c:send("</form> </body> </html>")
		c:send("<form action=\" method='get'>")
		c:send("SSID:")
		c:send("<input type='text' name='SSID' value=\" maxlength='100' />")
		c:send("<br />")
		c:send("Password:")
		c:send("<input type='text' name='Password' value=\" maxlength='100' />")
		c:send("<input type='submit' value='Submit' />")
	end)
end)