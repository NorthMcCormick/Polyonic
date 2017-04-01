# Polyonic v0.2.0

## The ultimate "Universal App"

> Now using the latest Ionic 2.2.0 release :tada:

> This was created from Paul Sutherland's Polyonic project, but has since merged off into its own codebase.

[![GitHub version](https://badge.fury.io/gh/paulsutherland%2FPolyonic.svg)](https://badge.fury.io/gh/paulsutherland%2FPolyonic)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badge/)

#### Build once using web technologies and deploy everywhere!

An Electron Ionic application shell for creating Web Apps, Progressive Mobile Web Apps, Native Mobile Apps and Desktop Apps.

This project combines the <a href="http://electron.atom.io/">Electron Framework</a> with <a href="http://ionicframework.com/docs/v2/">Ionic 2</a> and provides a starter for building out an app that can run on either the desktop (macOS, Windows and Linux), a browser or mobile devices (iOS, Android and Windows Phone).  You can use this application to build and run on one or even all of these platforms.

# How Does It Work?

Polyonic only makes *minimal* changes to your Ionic project. We add a couple of files (they are ignored on mobile platforms, so there's no extra bulk), update a setting, and ask you to put your ionic project **inside** of the polyonic shell.

Your development for mobile stays the same, and we provide a few extra commands and a way to kickstart the desktop version of your app!

Here's what it looks like side by side with your app in Cordova:

<img src="https://github.com/northmccormick/polyonic/blob/master/.github/res/Polyonic.png" width="70%" height="auto" style="display: inline-block;"/><img src="https://github.com/northmccormick/polyonic/blob/master/.github/res/Ionic.png" width="30%" height="auto" style="display: inline-block;"/>

# Electrolyte

The second piece to these projects is Electrolyte, my shim for Cordova plugins so that the native features available on desktop and mobile can work with minimal changes (if any) to your codebase. 

# Getting Started

1) Clone this repo

2) Overwrite the contents of the 'src' directory with the contents in the root directory of your ionic app

3) Run `npm run create` to copy the new build tools in and modify your package.json for electron

4) Run `npm run dev` to boot up your ionic app, the electron app, and start the live reload

# Building

Once you're ready to test out your app in a contained build just run `gulp build` and watch the magic happen. The build will create a binary for your current platform and architecture and place it in the `output` directory.

# Polyonic Config

When you create your project it will copy a config file (polyonic.config.json) as well. This is where you can modify and override settings for your project.

## Browser Windows

Configurations for each window in the application. (Currently only supports the default window)

### windows.default

The default window properties. 

#### windows.default.width

Window width in pixels. Default: 1200

#### windows.default.height

Window height in pixels. Default: 900

#### windows.default.fullscreen

Whether to start the window in full screen. Default: false

#### windows.default.resizeable

Should the user be able to resize the window? Default: true

## Platforms

Platform specific settings

#### platform.asar

Whether or not to archive the source to an asar or not. Default: true

### platform.macos

#### platform.macos.autoClose

Whether to close the entire application if there are no more windows avialable. Default: false

# Changelog

### 0.2.0

The build task now runs a very basic validation to check the project structure saving the developer a lot of time instead of waiting to know if something is wrong.

### 0.1.1

Fixing the build tools...

You can now clone this repo and run these commands to get an executable for MacOS (other platforms not tested)

`npm install && ionic start src --v2 && gulp create && gulp build`

### 0.1.0

Introducing the config file!

You can now include a config file that will help prepare your desktop apps. This will be added on as the platform tools are built but for now it should cover the basics. 

### 0.5.0

Reduced the binary size by ~100mb. No changes required on the developer's end. Polyonic will doesn't copy node_modules anymore but re-generates the package.json and installs only the required modules for release.

MacOS builds will now build with a custom icon.

### 0.0.4

This was the first public release so....

# Credits

This application was built using the <a href="https://github.com/szwacz/electron-boilerplate/blob/master/README.md">Electron Boilerplate Project</a> for scaffolding out the Electron application, the <a href="http://electron.atom.io/">Electron Framework</a> for creating desktop apps and <a href="http://ionicframework.com/">Ionic 2</a> for the UI and creating Native Mobile Applications, Progressive Mobile Web Applications and Web Applications. The original <a href="https://github.com/paulsutherland/Polyonic">polyonic</a> repo that helped kick start this.

# Todo/Wishlist/Roadmap

- Create a standardized CLI format for commands
- Clean up some other Electron Boilerplate code that we don't need
- Beef up the build process to configure the binaries for each platform with a universal set of settings
- More testing on other platforms. This is actively developed on MacOS
- Find ways to make the binaries smaller
- Expose the config variables to the Ionic app (or if Ionic does their own, work with that)
- Create an upgrade tool or guide

# Other, don't pay attention to this...

Test command for packaging:

 electron-packager build test --overwrite
