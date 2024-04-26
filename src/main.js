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
  },
});
k.loadSprite('water-ambience', './water-ambience.png', {
  sliceX: 8,
  sliceY: 5,
  anims: {
    'fish1': { from: 8, to: 15, loop: true, speed: 8 },
    'fish2': { from: 0, to: 7, loop: true, speed: 8 },
    'water1': { from: 16, to: 23, loop: true, speed: 8 },
    'water4': { from: 16, to: 23, loop: true, speed: 8 },
    'water2': { from: 24, to: 31, loop: true, speed: 8 },
    'water5': { from: 24, to: 31, loop: true, speed: 8 },
    'water3': { from: 32, to: 39, loop: true, speed: 8 },

  },
});

k.loadSprite('map', './map2.png');

k.setBackground(k.Color.fromHex('#000000'));

k.scene('main', async () => {
  const mapData = await (await fetch('./map2.json')).json();
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
    k.body({ isStatic: true }),
    k.anchor('center'),
    k.pos(),
    k.scale(scaleFactor),
    'bunny',
  ]);
  const fish1 = k.make([
    k.sprite('water-ambience', { anim: 'fish1' }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body({ isStatic: true }),
    k.anchor('center'),
    k.pos(),
    k.scale(scaleFactor),
    'fish1',
  ]);
  const fish2 = k.make([
    k.sprite('water-ambience', { anim: 'fish2' }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body({ isStatic: true }),
    k.anchor('center'),
    k.pos(),
    k.scale(scaleFactor),
    'fish2',
  ]);
  const water1 = k.make([
    k.sprite('water-ambience', { anim: 'water1' }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body({ isStatic: true }),
    k.anchor('center'),
    k.pos(),
    k.scale(scaleFactor),
    'water1',
  ]);
  const water4 = k.make([
    k.sprite('water-ambience', { anim: 'water4' }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body({ isStatic: true }),
    k.anchor('center'),
    k.pos(),
    k.scale(scaleFactor),
    'water4',
  ]);
  const water2 = k.make([
    k.sprite('water-ambience', { anim: 'water2' }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body({ isStatic: true }),
    k.anchor('center'),
    k.pos(),
    k.scale(scaleFactor),
    'water2',
  ]);
  const water5 = k.make([
    k.sprite('water-ambience', { anim: 'water5' }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body({ isStatic: true }),
    k.anchor('center'),
    k.pos(),
    k.scale(scaleFactor),
    'water5',
  ]);
  const water3 = k.make([
    k.sprite('water-ambience', { anim: 'water3' }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body({ isStatic: true }),
    k.anchor('center'),
    k.pos(),
    k.scale(scaleFactor),
    'water3',
  ]);

  for (const layer of layers) {
    if (layer.name === 'boundaries') {
      for (const boundary of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0, 6), boundary.width, boundary.height),
          }),
          k.body({ isStatic: true }),
          k.pos(boundary.x, boundary.y),
          boundary.name,
        ]);

        if(boundary.name) {
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
            ((map.pos.x) + entity.x) * scaleFactor,
            ((map.pos.y + 6) + entity.y) * scaleFactor
          );
          k.add(player);
          continue;
        }
        if (entity.name === 'bunny') {
          bunny.pos = k.vec2(
            ((map.pos.x) + entity.x) * scaleFactor,
            ((map.pos.y + 6) + entity.y) * scaleFactor
          );
          k.add(bunny);
          continue;
        }
        if (entity.name === 'fish1') {
          fish1.pos = k.vec2(
            ((map.pos.x) + entity.x) * scaleFactor,
            ((map.pos.y + 6) + entity.y) * scaleFactor
          );
          k.add(fish1);
          continue;
        }
        if (entity.name === 'fish2') {
          fish2.pos = k.vec2(
            ((map.pos.x) + entity.x) * scaleFactor,
            ((map.pos.y + 6) + entity.y) * scaleFactor
          );
          k.add(fish2);
          continue;
        }
        if (entity.name === 'water1') {
          water1.pos = k.vec2(
            ((map.pos.x) + entity.x) * scaleFactor,
            ((map.pos.y + 6) + entity.y) * scaleFactor
          );
          k.add(water1);
          continue;
        }
        if (entity.name === 'water4') {
          water4.pos = k.vec2(
            ((map.pos.x) + entity.x) * scaleFactor,
            ((map.pos.y + 6) + entity.y) * scaleFactor
          );
          k.add(water4);
          continue;
        }
        if (entity.name === 'water2') {
          water2.pos = k.vec2(
            ((map.pos.x) + entity.x) * scaleFactor,
            ((map.pos.y + 6) + entity.y) * scaleFactor
          );
          k.add(water2);
          continue;
        }
        if (entity.name === 'water5') {
          water5.pos = k.vec2(
            ((map.pos.x) + entity.x) * scaleFactor,
            ((map.pos.y + 6) + entity.y) * scaleFactor
          );
          k.add(water5);
          continue;
        }
        if (entity.name === 'water3') {
          water3.pos = k.vec2(
            ((map.pos.x) + entity.x) * scaleFactor,
            ((map.pos.y + 6) + entity.y) * scaleFactor
          );
          k.add(water3);
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

    if (player.curAnim() !== 'walk-left' && player.curAnim() !== 'walk-up' && player.curAnim() !== 'walk-down') player.play('walk-left');
      player.direction = 'left';
      player.move(-player.speed, 0);
    return
  });
  k.onKeyDown('right', () => {
    if (player.isInDialogue) return;

    if (player.curAnim() !== 'walk-right' && player.curAnim() !== 'walk-up' && player.curAnim() !== 'walk-down') player.play('walk-right');
    player.direction = 'right';
    player.move(player.speed, 0);
    return;
  });
  k.onKeyDown('up', () => {
    if (player.isInDialogue) return;

    if (player.curAnim() !== 'walk-up' && player.curAnim() !== 'walk-left' && player.curAnim() !== 'walk-right') player.play('walk-up');
    player.direction = 'up';
    player.move(0, -player.speed);
    return;
  });
  k.onKeyDown('down', () => {
    if (player.isInDialogue) return;

    if (player.curAnim() !== 'walk-down' && player.curAnim() !== 'walk-left' && player.curAnim() !== 'walk-right') player.play('walk-down');
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

// ------------ Start Page ----------------
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('start');
const ui = document.getElementById('ui');
const playMusic = document.getElementById('play');
const pauseMusic = document.getElementById('pause');
const music = document.getElementById("backgroundMusic"); 
const app = document.getElementById('app');



startButton.addEventListener('click', ()=>{
  startScreen.style.display = 'none';
  startScreen.setAttribute('aria-hidden', 'true');
  ui.style.display = 'block';
  app.setAttribute('aria-hidden', 'false');
  k.go('main');
  pauseMusic.classList.add('active');
  playMusic.classList.remove('active');
  music.play();
})

// ------------ Music ----------------
playMusic.addEventListener('click', ()=>{
  pauseMusic.classList.add('active');
  playMusic.classList.remove('active');
  music.play();
})
pauseMusic.addEventListener('click', ()=>{
  playMusic.classList.add('active');
  pauseMusic.classList.remove('active');
  music.pause();
})

// ------------ Weather Animation ----------------
const weather = document.getElementById('weather');
  const weatherSrcs = [
    '/day/1.png',
    '/day/2.png',
    '/day/3.png',
    '/day/4.png',
    '/day/5.png',
    '/day/6.png',
    '/day/7.png',
    '/day/8.png',
    '/day/9.png',
    '/day/10.png',
  ]

  weatherSrcs.forEach((src, index)=>{
      setTimeout(()=>{
        weather.src = src
      }, Number(index + '000') / 6)
    })
  setInterval(()=>{
    weatherSrcs.forEach((src, index)=>{
      setTimeout(()=>{
        weather.src = src
      }, Number(index + '000') / 6)
    })
  }, 2000);