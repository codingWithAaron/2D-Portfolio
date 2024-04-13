import { dialogueData, scaleFactor } from './constants';
import { k } from './kaboomCtx';
import { displayDialogue, setCamScale } from './utils';

k.loadSprite('spritesheet', './spritesheet.png', {
  sliceX: 39,
  sliceY: 31,
  anims: {
    'idle-down': 784,
    'walk-down': { from: 784, to: 785, loop: true, speed: 8 },
    'idle-right': 786,
    'walk-right': { from: 786, to: 787, loop: true, speed: 8 },
    'idle-left': 825,
    'walk-left': { from: 825, to: 826, loop: true, speed: 8 },
    'idle-up': 823,
    'walk-up': { from: 823, to: 824, loop: true, speed: 8 },
    'bunny-idle': { from: 780, to: 781, loop: true, speed: 2 },
    'slime-idle': { from: 858, to: 859, loop: true, speed: 2 },
    'frog-idle': { from: 788, to: 789, loop: true, speed: 2 },

  },
});

k.loadSprite('map', './map.png');

k.setBackground(k.Color.fromHex('#000000'));

k.scene('main', async () => {
  const mapData = await (await fetch('./map.json')).json();
  const layers = mapData.layers;

  const map = k.add([k.sprite('map'), k.pos(0), k.scale(scaleFactor)]);

  const player = k.make([
    k.sprite('spritesheet', { anim: 'idle-down' }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body(),
    k.anchor('center'),
    k.pos(),
    k.scale(scaleFactor),
    {
      speed: 250,
      direction: 'down',
      isInDialogue: false,
    },
    'player',
  ]);
  const bunny = k.make([
    k.sprite('spritesheet', { anim: 'bunny-idle' }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body(),
    k.anchor('center'),
    k.pos(),
    k.scale(scaleFactor),
    'bunny',
  ]);
  const slime = k.make([
    k.sprite('spritesheet', { anim: 'slime-idle' }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body(),
    k.anchor('center'),
    k.pos(),
    k.scale(scaleFactor),
    'slime',
  ]);
  const frog = k.make([
    k.sprite('spritesheet', { anim: 'frog-idle' }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body(),
    k.anchor('center'),
    k.pos(),
    k.scale(scaleFactor),
    'frog',
  ]);

  for (const layer of layers) {
    if (layer.name === 'boundaries') {
      for (const boundary of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(8), boundary.width, boundary.height),
          }),
          k.body({ isStatic: true }),
          k.pos(boundary.x, boundary.y),
          boundary.name,
        ]);

        if (boundary.name) {
          player.onCollide(boundary.name, () => {
            player.isInDialogue = true;
            displayDialogue(
              dialogueData[boundary.name],
              () => (player.isInDialogue = false)
            );
          });
        }
      }

      continue;
    }

    if (layer.name === 'spawnpoints') {
      for (const entity of layer.objects) {
        if (entity.name === 'player') {
          player.pos = k.vec2(
            ((map.pos.x + 8) + entity.x) * scaleFactor,
            (map.pos.y + entity.y) * scaleFactor
          );
          k.add(player);
          continue;
        }
        if (entity.name === 'bunny') {
          bunny.pos = k.vec2(
            ((map.pos.x + 8) + entity.x) * scaleFactor,
            (map.pos.y + entity.y) * scaleFactor
          );
          k.add(bunny);
          continue;
        }
        if (entity.name === 'slime') {
          slime.pos = k.vec2(
            ((map.pos.x + 8) + entity.x) * scaleFactor,
            ((map.pos.y + 8) + entity.y) * scaleFactor
          );
          k.add(slime);
          continue;
        }
        if (entity.name === 'frog') {
          frog.pos = k.vec2(
            ((map.pos.x + 8) + entity.x) * scaleFactor,
            ((map.pos.y + 8) + entity.y) * scaleFactor
          );
          k.add(frog);
          continue;
        }
      }
    }
  }

  setCamScale(k);

  k.onResize(() => {
    setCamScale(k);
  });

  k.onUpdate(() => {
    k.camPos(player.worldPos().x, player.worldPos().y - 100);
  });

  k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== 'left' || player.isInDialogue) return;

    const worldMousePos = k.toWorld(k.mousePos());
    player.moveTo(worldMousePos, player.speed);

    const mouseAngle = player.pos.angle(worldMousePos)

    const lowerBound = 50;
    const upperBound = 125;

    if (mouseAngle > lowerBound && mouseAngle < upperBound && player.curAnim() !== 'walk-up') {
      player.play('walk-up');
      player.direction = 'up';
      return;
    }

    if (mouseAngle < -lowerBound && mouseAngle > -upperBound && player.curAnim() !== 'walk-down') {
      player.play('walk-down');
      player.direction = 'down';
      return;
    }

    if (Math.abs(mouseAngle) > upperBound) {
      if (player.curAnim() !== 'walk-right') player.play('walk-right');
      player.direction = 'right';
      return;
    }

    if (Math.abs(mouseAngle) < lowerBound) {
      if (player.curAnim() !== 'walk-left') player.play('walk-left');
      player.direction = 'left';
      return;
    }

  });

  k.onMouseRelease(() => {
    if (player.direction === 'down') {
      player.play('idle-down');
      return;
    }
    if(player.direction === 'up') {
      player.play('idle-up')
      return;
    }
    if(player.direction === 'right') {
      player.play('idle-right')
      return;
    }
    if(player.direction === 'left') {
      player.play('idle-left')
      return;
    }
  });

  k.onKeyDown('left', () => {
    if (player.isInDialogue) return;

    if (player.curAnim() !== 'walk-left') player.play('walk-left');
      player.direction = 'left';
      player.move(-player.speed, 0);
    return
  });
  k.onKeyDown('right', () => {
    if (player.isInDialogue) return;

    if (player.curAnim() !== 'walk-right') player.play('walk-right');
    player.direction = 'right';
    player.move(player.speed, 0);
    return;
  });
  k.onKeyDown('up', () => {
    if (player.isInDialogue) return;

    if (player.curAnim() !== 'walk-up') player.play('walk-up');
    player.direction = 'up';
    player.move(0, -player.speed);
    return;
  });
  k.onKeyDown('down', () => {
    if (player.isInDialogue) return;

    if (player.curAnim() !== 'walk-down') player.play('walk-down');
    player.direction = 'down';
    player.move(0, player.speed);
    return;
  });

  k.onKeyRelease(() => {
    if (player.direction === 'down') {
      player.play('idle-down');
      return;
    }
    if(player.direction === 'up') {
      player.play('idle-up')
      return;
    }
    if(player.direction === 'right') {
      player.play('idle-right')
      return;
    }
    if(player.direction === 'left') {
      player.play('idle-left')
      return;
    }
  });

});

k.go('main');