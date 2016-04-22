# A Framing of Election Data
For Interactive System Design course. Using `backbone.js`, `D3.js`.

## Introduction

What topics are people caring about during the election campaign? For a specific topic, what positions do the two parties or candidates stand for? How do citizens or supporters think of and react to these viewpoints and speeches? This is a webpage summarizing and answering these questions, and demonstrating the results to the public for an overview of the election campaign. This is the presentation tier, which built with `backbone.js` and `D3.js`.

## Installation

- With [npm](https://www.npmjs.com/) do:

    ```bash
    npm install
    ```

- With [webpack](https://webpack.github.io/) do:

    ```
    webpack
    ```

    or for development:

    ```
    webpack --process --color --watch
    ```

- To generate sample data, switch to `/data` do: 

    ```bash
    python generator.py
    ```

## Notes

- python http server

    ```
    python -m SimpleHTTPServer 8080
    ```
