# Simple AlphaZero by Surag Nair at Stanford applied to the Connect4 game

In December 2017 Surag Nair published a simple implementation of the AlphaZero algorithm by DeepMind that defeated AlphaGo Zero and the world champion Chess and Shogi programs.

*Pages:*

https://web.stanford.edu/~surag/posts/alphazero.html

https://github.com/suragnair/alpha-zero-general

In this repository Simple AlphaZero was used to train a neural network to play Connect4, that means without any knowledge of the game except for the final states and the outcomes, then the model was exported, converted for Tensorflow.js and used on the browser to implement a pixelated/retro version of Connect4. Here the Monte Carlo Tree Search, the game and the prediction algorithm were reimplemented in Typescript.

The training time was of about 1 day on a GeForce GT 750M, with different restarts.

## Technologies:

- Tensorflow.js
- Phaser 3
- Typescript
- Webpack
- Jest
- Eslint

*See it in action on Github Pages*

https://emasab.github.io/simple-alpha-zero-connect4/dist/

![Preview of the game](doc/screen.png?raw=true "Preview of the game")

## Notes

Works on Chrome and Firefox desktop but not on their mobile counterparts

## Acknowledgements:

- Surag Nair for Simple AlphaZero
- Photon Storm for the Phaser 3 game engine
- Pizzadude for the Arcade Classic font
