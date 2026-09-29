# 🌌 Code Galaxy

An interactive web application that visualizes any GitHub profile as a galaxy of repositories.

**Live demo:** https://chalanapadpu.github.io/code-galaxy/

## Overview

Code Galaxy retrieves public repository data from the GitHub REST API and presents it as an animated, explorable galaxy. Each repository is represented as a planet, where size corresponds to star count and color represents the primary programming language. A summary of a developer's top languages provides a quick view of their technical focus.

## Features

- Dynamic visualization of repositories using the HTML Canvas API
- Interactive tooltips showing repository name, stars, language, and description
- Direct navigation to repositories by clicking a planet
- Shareable profile links using URL parameters (`?user=username`)
- Graceful error handling for invalid usernames and API rate limits

## Technologies

HTML5, CSS3, JavaScript (ES6), Canvas API, GitHub REST API, GitHub Pages

## Key Learnings

- Consuming and processing data from a REST API
- Building animated, interactive graphics with the Canvas API
- Implementing error handling and user feedback
- Deploying a static website with GitHub Pages

## Roadmap

- Commit activity visualization
- Timeline view of repository growth
- Multi-profile comparison for team formation

## Author

[@chalanapadpu](https://github.com/chalanapadpu)
