#!/usr/bin/env node

import { auto, forever } from 'async';

import robot from 'robotjs';

const moveDelayMs = 1000 * 20;

const moveAround = async () => {
  try {
    return await auto({
      // Initial movement
      initialMove: cbk => {
        console.log('\nStarting mouse movement...');

        let y = 0;
        robot.setMouseDelay(2);

        const twoPI = Math.PI * 2.0;
        const screenSize = robot.getScreenSize();
        const height = screenSize.height / 2 - 10;
        const width = screenSize.width;

        for (let x = 0; x < width; x++) {
          y = height * Math.sin((twoPI * x) / width) + height;
          robot.moveMouse(x, y);
        }

        return cbk();
      },

      // Move every 20 seconds
      start: [
        'initialMove',
        ({}, cbk) => {
          console.log(`\n\nMouse will now move every ${moveDelayMs / 1000} seconds...`);

          forever(
            () => {
              const moveMouse = () => {
                robot.setMouseDelay(2);

                let y = 0;
                const twoPI = Math.PI * 2.0;
                const screenSize = robot.getScreenSize();
                const height = screenSize.height / 2 - 10;
                const width = screenSize.width;

                for (let x = 0; x < width; x++) {
                  y = height * Math.sin((twoPI * x) / width) + height;
                  robot.moveMouse(x, y);
                }
              };

              setInterval(moveMouse, moveDelayMs);
            },
            err => {
              return cbk(err);
            }
          );
          return cbk();
        },
      ],
    });
  } catch (err) {
    throw new Error(err);
  }
};

moveAround();
