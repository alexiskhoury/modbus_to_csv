# About
A contribution to [Telemetery Viewer][1] software in order to plot Modbus data registers.

# Telemetry Viewer
Telemetry Viewer is a neat piece of software written by [FARELL][1] which is used to trace and plot data from microprocessors (mainly AVR and ESP8266 microchips). The software can receive data in csv format using serial communications. Recently the Author added a UDP server functionality allowing data to be received over Ethernet networks. The software can be configured easily and have several types of data visualization graphics. A simple demonstration can be found on the [Author's website][1].

# Tracing Modbus Data
Telemetry Viewer cannot communicate natively with Modbus slaves/clients. The idea is to have a kind of connector allowing to bridge Modbus clients with Telemetry Viewer. For this purpose, I have created a Nodejs application which sits in between Telemetry Viewer and the Modbus clients. The application polls data registers from Modbus clients, converts the received data to csv format and push it to Telemetry Viewer using UDP datagrams.

The application uses [dgram sockets][2] for data transmission to UDP server and the famous [jsmodbus library][3] for data acquisition from Modbus slaves/clients. Only TCP connection has been implemented using function code 03. The application is in early stage of development but is operational. One needs to modify the config.json file prior to launching the application.

This config file specifies the Telemetry Viewer address, port and sampling interval of Modbus slaves under the host section. The mapping section specifies the Modbus clients addresses and data registers. You can poll data from several slaves/clients but must keep the timeout parameter to a reasonable value (not less than 100ms). This parameter determines the frequency of data polling from Modbus clients.

```json
{
  "host": {
      "ip": "192.168.1.144", //TelemetryViewer address
      "port": "60967", //TelemetryViewer port
      "timeout": "1000" //frequency of polling
  },

  "mapping": [
    {
      "id": "1",
      "description": "example 1",
      "ip": "192.168.1.144", //Modbus client address
      "port": "502", //Modbus client port
      "register": "1", //start register
      "no": "3" //no of registers to poll
    } //add Modbus clients sections below
  ]
}
```
# Usage
A pre-compiled win32 binary was created from Nodejs sources and can be used on any Windows platform. Although, sources can be used using Nodejs, issue npm install command first to install dependencies.

# Improvements
* Add other Modbus function codes (01, 02 and 04)
* Enable serial communications (RTU)
* Implement a keep alive connection with Modbus clients: Actually, a TCP connection is established with the corresponding client and closed upon data reception

# Links
[Author's website][4]

[1]: http://www.farrellf.com/TelemetryViewer/
[2]: https://nodejs.org/api/dgram.html
[3]: https://www.npmjs.com/package/jsmodbus
[4]: http://akconcept.epizy.com
