# cleverbot-reddit
Cleverly answer to people on reddit
## How to setup 
1. Install [node js](https://nodejs.org/)
2. When node is installed, open powershell or wathever your terminal is where the code is located
3. Type this on your terminal:
`npm i -g ts-node typescript`
4. Type this command on the terminal:
`npm i`
5. Generate the api keys using the generate-api-file.ts utility:
`ts-node ./src/generate-api-file.ts`
6. Follow the instruction of the utility
7. Once you got the api apikeys.jsonc file setup, you can take a look at the config file if you want to turn all of the bot reply into a emojipasta
8. Type `ts-node ./src/`
9. You should see this after 1 seconds or so:
![](https://i.imgur.com/Ej1QrDx.png)
10. If it say "logged in as THE ACCOUNT YOU SETED UP" it should be working
(with `THE ACCOUNT YOU SETED UP` being the account you seted up. in my case it's `cummming_on_puppies`)
