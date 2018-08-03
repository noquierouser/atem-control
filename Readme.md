# ATEM Control

A simple `express`-based NodeJS server for controlling an ATEM Switcher through a REST API.

This app is far from a complete solution for controlling an ATEM switcher, as it was designed for a very particular use case: **switching cameras connected to an ATEM switcher from inside [vMix](https://www.vmix.com/)**.

## Requirements

* **NodeJS**. Tested with NodeJS 10.1
* **vMix 16** or later. Tested with vMix 20 and 21.
* A **Blackmagic Design ATEM Switcher**. Tested with a [Production Studio 4K](https://www.blackmagicdesign.com/products/atem/techspecs/W-APS-04).

This package makes intensive use of [vMix scripting capabilities](https://www.vmix.com/help21/ScriptingandAutomation.html), which are present in [4K and Pro versions only](https://www.vmix.com/purchase/#comparisontable). If you want to test this package before purchasing vMix, you can [download it](https://www.vmix.com/Software/Download.aspx) and use their free 60-day trial period with complete functionality.

## Installation

1. [Download the latest release](https://github.com/noquierouser/atem-control/releases/latest) and unzip it.
2. Run `npm install` to install dependencies.
3. To start the server run `npm start`

To integrate with vMix you also need to install the scripts that will interface with the server. These scripts are located inside the `vmix_scripts` folder and to install follow this:

1. In vMix, go to `Settings` > `Scripting` > `Add` > `Import`.
2. In the Open dialog, search for `*.vb`. Select a file and open.
3. Name your script and `Save`.

Once you've added the scripts, you can use them with keybindings and the `Run script` command. Check below for more details about this part.

## Usage

Before starting the server, you must set the switcher's IP address. In the `config.json` file you can set it, alongside a couple of options.

* `options`
  * `max_listeners` sets how many listeners are available for communication with the ATEM switcher. Default value is 3.
  * `port` sets the port the server will use to listen for commands. By default it will use port 8080.
  * `title` sets the figlet text when starting the server. The default is *ATEM Control*.
* `switcher`
  * `address` sets the ATEM switcher address to connect. **This value is required.**

### Commands

The server is a REST API that will be located at `http://localhost:<port>/api/` and, depending on the command, it will accept JSON formatted values as input.

#### `POST changePreviewInput`

Sets the input as a preview. The following example sets the first input as the preview.

```json
{
  "input": 1
}
```

#### `POST changeProgramInput`

Sets the input as program. The following will set the fifth input as program.

```json
{
  "input": 5
}
```

#### `POST autoTransition`

Will execute an automatic transition. Equivalent to press AUTO TRANS in the switcher application.

#### `POST cutTransition`

Will execute a cut transition. Equivalent to press CUT in the switcher application.

### vMix scripts

As mentioned, these scripts leverage the scripting capabilities of vMix, [as stated in the manufacturer's documentation](https://www.vmix.com/help21/ScriptingandAutomation.html). They are Visual Basic.NET scripts and are quite limited in scope and functionality. **Scripts can't take parameters**, so when setting up camera related scripts, as in `ATEMPrevCam.vb` and `ATEMCutCam.vb`, you'll have to import as many scripts as cameras you have connected to your ATEM switcher.

For example, if you have cameras 1, 2, 5 and 7 connected to your ATEM, you need to import `ATEMPrevCam.vb` 4 times and modify the `camera` variable in the script. **You will also need to change the server address and port.**

```vbnet
Dim client As New System.Net.WebClient
' Change address and port
Dim api = "http://localhost:8090/api/changePreviewInput"

' This sets camera 1
Dim camera = 1
Dim data = "{""input"": " & camera & "}"

client.Headers.Add("Content-Type", "application/json")
client.UploadString(api, "POST", data)
```
