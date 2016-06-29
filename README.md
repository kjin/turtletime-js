# Turtle Time

A mobile/web game about turtles eating things turtles should not be eating.

As this project is made with [TypeScript](http://www.typescriptlang.org/), at the bare minimum you need either:

* [Visual Studio 2013/2015](https://www.visualstudio.com/) (VS Code also works, but we don't have project files for it) - Windows only
* [node.js](https://nodejs.org/) to install the TypeScript compiler through `npm install -g typescript` - Any platform

I highly recommend [WebStorm](https://www.jetbrains.com/webstorm/) as an IDE. It should work on any platform.

You also need [Git LFS](https://git-lfs.github.com/), where we store binary assets and external libraries.

## Building & Running

In either of the below IDE's, building is automatic.

### Visual Studio

**Note**: Visual Studio project files may not be up-to-date.

Open TurtleTime.sln in Visual Studio. The current version should be available at *(todo)*.

### WebStorm / IntelliJ IDEA Ultimate

**Note**: IntelliJ IDEA Ultimate with web development add-ons is equivalent in almost every way to WebStorm, except that you can't change the port number (default is 63342). This can be problematic if you want to do quick remote testing (on a mobile device, etc.)

Open the root folder in WebStorm. While WebStorm is open, you should be able to access the current version of the game at `http://localhost:63342/turtletime/`.

You'll likely need to set your node.js path first in `File > Settings > Languages & Frameworks > TypeScript > Compiler`.

