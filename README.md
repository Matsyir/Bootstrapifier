# Bootstrapifier
Parse HTML and add simple [Bootstrap](https://getbootstrap.com/) classes to make the page look nicer at the click of a button. The dark theme it offers is not a part of Bootstrap, it is merely some simple CSS on the following elements: `body`, `li`, `textarea`, and `input[type="text"]`. The style tag is clearly written at the top of the `Bootstrapifier.js` class.

You don't need to download any of the source to parse your HTML, simply paste your HTML in the github site and copy the output, or just have your source copied and use the one-click button: https://matsyir.github.io/Bootstrapifier/

Big thanks to Twitter/[Bootstrap](https://getbootstrap.com/) contributors for making this great framework that is easy to use, doubt I'd have made anything like this without it.

## Examples:
The first one is the actual Bootstrapifier page (in an early stage, been updated since then).
![Bootstrapifier demo 1](./demoImages/bootstrapifierDemo1.jpg)
![Bootstrapifier demo 2](./demoImages/bootstrapifierDemo2.jpg)

Very much a WIP right now, but its core functionality is there.

Currently uses jQuery for ease of implementation, but it could easily be taken out to be pure JavaScript.

Using the very permissive [MIT License](./LICENSE). Feel free to omit any copyright notices from pages generated using Bootstrapifier. You must only keep the copyright notice around the actual Bootstrapifier.js class, whether you are simply using it in a page or creating your own version/fork (not expecting people to use it that way). Feel free to make a pull request or open an issue to suggest improvements.
