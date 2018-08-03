Dim client As New System.Net.WebClient
Dim api = "http://localhost:8090/api/changeProgramInput"

Dim camera = 1
Dim data = "{""input"": " & camera & "}"

client.Headers.Add("Content-Type", "application/json")
client.UploadString(api, "POST", data)