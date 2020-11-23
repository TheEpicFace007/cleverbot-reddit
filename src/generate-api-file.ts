import { jsonc } from "jsonc";
import { readFileSync, writeFileSync } from "fs";

console.log("Writting the bot api key file . . .");
const template = [
  {
    "username": "PLACE THE USERNAME HERE",
    "password": "PLACE THE PASSWORD HERE",
    "clientId": "PLACE YOUR CLIENT ID HERE",
    "clientSecret": "PLACE YOUR CLIENT SECRET HERE",
    "userAgent": `node ${process.version}`
  }
];

jsonc.write("./src/apikeys.jsonc", template, {
  space: 2
})
  .then(() =>
  {
    console.log("Sucesfully written the api key file! The config file should be located in the src folder");
    console.log("Generate an script api keys  here: https://www.reddit.com/prefs/apps");
    console.log("When it's done open the apikeys.jsonc file on the editor of your choice");
    console.log("Edit the apikeys.jsonc file with your username, password and client id, client secret to setup the bot.");
  })
  .catch(console.error);