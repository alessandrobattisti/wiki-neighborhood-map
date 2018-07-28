# Neighborhood Map - Wikipedia explorer
#### Front End Web Developer | Udacity
---

## Project Overview

This webapp has been developed as **capstone project** of **Front End Web Developer Nanodegree (Google scholarship)**.

A **single page web application** written from scratch using **React** and integrating **external APIs**.

This app is composed of two parts:
1. A full-screen map using the Google Maps API
2. A sidebar that list the places marked on the map

From the sidebar you can *select*, *filter* and *delete* the default places. When a place is selected on the map or in the sidebar an info-window will open on the map that will let you get more information about that place using **Wikipidia api**.

Using the sidebar **"Search for new places"** section it's also possible to find new places from wikipedia api that are inside the map extension.
Once you have found an interesting place you can save it to **"my places"** using the corresponding save button in the sidebar.
When you have finished searching for new places you can export all **"my places"** to a JSON file.

![Web app screenshot](/readme_img/neighborhood_map.jpg)

## How to run
1. Clone this repository or download a zip file (use the `Clone or download` green button)
2. `cd` in the downloaded folder
3. Install all project dependencies with `npm install`
4. Start the development server with `npm start`
3. With your server running, visit the site: `http://localhost:3000/`.
4. Or you can build the project using `npm run build`
5. `cd` in `build` folder and run a server like `python3 -m http.server 8000` then visit `http://localhost:8000`

## Icons
Icons come from https://materialdesignicons.com

## Live
A live version of this webapp, without service worker (no SSL) can be accessed [here](htthttp://alebat.atwebpages.com/).

## Important
This repository uses [Google Map](https://developers.google.com/). You need to replace `<your GOOGLE API KEY HERE>` in `src/keys.js` file with a token from [Google](https://developers.google.com/maps/documentation/javascript/get-api-key/).

## Create React App
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
