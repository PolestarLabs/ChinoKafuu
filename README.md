# Hey there! Welcome to my official GitHub repository!
<p align="center">
  <a href="https://jetbrains.com/?from=ChinoKafuu">
    <img src="https://img.shields.io/badge/Powered_by_WebStorm-gray.svg?logo=webstorm&style=for-the-badge" />
  </a>
  <a href="https://crowdin.com/project/chinokafuu">
    <img src="https://img.shields.io/badge/Powered_by_Crowdin-gray.svg?logo=crowdin&style=for-the-badge" />
    <img src="https://badges.crowdin.net/chinokafuu/localized.svg">
  </a>
</p>

### Greetings! I'm Chino Kafuu and I'm just another simple Discord bot.
### Well... As you can see, I'm a bot with many features like fun, moderation and utility.
#### You can find out my commands using *k.help*, and if you get any issue, please join my [support server](https://discord.gg/Jr57UrsXeC)!

## Self-hosted instances
As Chino has grown over the time, the repository became open, meaning everyone can see the source code, open issues, etc, and as you may expect, copies were created.
For that reason, we are **NOT** providing any kind of support for unoriginal self-hosted instances in our support server. Please **DO NOT ASK FOR SELF-HOSTED INSTANCES SUPPORT IN OUR SUPPORT SERVER.**
### How to self hosting
> Install nodejs 14 or higher. You can download and install here: https://nodejs.org

> Create a file named `.env` and fill with the informations included in [.env.example](https://github.com/RabbitHouseCorp/ChinoKafuu/blob/dev/.env.example) (the DISCORD_TOKEN can't be prefix-less, you need put Bot on the start.)

> Use that commands in your terminal
```
yarn install
yarn start --force-install
```
```
yarn start
```
### How to connect a Lavalink
> Create a file named `LavalinkConfig.json` in the folder `lavalink` and input this informations on this file

> Download the Lavalink jar in: https://github.com/freyacodes/Lavalink/blob/master/README.md (Please read with attention)
```json
{
  "connect": [{
    "id": "1",
    "host": "your lavalink ip",
    "port": "your lavalink port",
    "password": "your lavalink password"
  }]
}
```
## Contributing
### Source Code
Ah! So you would like to contribute to my repository, right? Great! We love new contributors who help us, and *perhaps if you be an active contributor you may get a little fancy badge in your profile...*

Ah, sure, you wanna know how to, don't ya? Sure, I'll explain:
- Fork this repository and make your desired changes
- Once they're done, make a pull request to the `dev` branch *if you are contributing to the new version*
- Once the pull request is opened, wait our development team review the changes

### Translating
Of course we do not support only English. We're looking to expand to a variety of new languages and for such thing we need your help!
We are now working with Crowdin. Please check out our [Crowdin repo](https://crowdin.com/project/chinokafuu)!

We are looking for high-experienced people in these languages on our Crowdin

Isn't your languages listed above? Join our [support server](https://discord.gg/Jr57UrsXeC) and talk to us.

### For issues, please [open an issue](https://github.com/RabbitHouseCorp/ChinoKafuu/issues/new/choose)

### See you! And have fun using me!

![Chino Kafuu](https://cdn.discordapp.com/attachments/481807707066859530/784903189136801852/c3377764d7d7cdcdcb98c466ce341c61.png)
