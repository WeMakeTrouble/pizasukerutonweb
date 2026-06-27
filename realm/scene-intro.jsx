// Scene 1: Claude the Tanuki introduces the story
// Black screen → Tanuki appears → characters drift in as named

const { Stage, Sprite, ImageSprite, useTime, useSprite, Easing, interpolate, animate, clamp } = window;
const { useState, useEffect, useRef, useMemo } = React;

/* ── Manga Speech Bubble ── */
function SpeechBubble({ text, x, y, width, tailX, tailY, style }) {
  const { progress } = useSprite();
  const scaleVal = interpolate([0, 0.08, 1], [0, 1.06, 1], Easing.easeOutBack)(progress);
  const opacityVal = interpolate([0, 0.06], [0, 1])(progress);

  const padding = 28;
  const fontSize = 30;
  const lineHeight = 1.45;

  return React.createElement('div', {
    style: {
      position: 'absolute',
      left: x,
      top: y,
      width: width || 520,
      transform: `scale(${scaleVal})`,
      transformOrigin: 'bottom center',
      opacity: opacityVal,
      zIndex: 100,
      filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.35))',
      ...style,
    }
  },
    // Bubble body
    React.createElement('div', {
      style: {
        background: '#ffffff',
        border: '4px solid #1a1a1a',
        borderRadius: 24,
        padding: `${padding}px ${padding + 6}px`,
        position: 'relative',
      }
    },
      React.createElement('div', {
        style: {
          fontFamily: "'Mochiy Pop One', sans-serif",
          fontSize,
          lineHeight,
          color: '#1a1a1a',
          textAlign: 'center',
          letterSpacing: '-0.01em',
        }
      }, text)
    ),
    // Tail (pointing down-right toward character)
    React.createElement('svg', {
      width: 50, height: 36,
      viewBox: '0 0 50 36',
      style: {
        position: 'absolute',
        bottom: -32,
        left: tailX || '70%',
        transform: `translateX(-50%)`,
      }
    },
      React.createElement('path', {
        d: 'M0,0 Q10,0 14,8 L28,34 Q18,20 25,8 Q28,2 50,0 Z',
        fill: '#ffffff',
        stroke: '#1a1a1a',
        strokeWidth: 4,
        strokeLinejoin: 'round',
      }),
      // White cover strip to hide top border of tail merging with bubble
      React.createElement('rect', {
        x: -2, y: -2, width: 54, height: 6,
        fill: '#ffffff',
      })
    )
  );
}

/* ── Floating particle dust (atmosphere) ── */
function FloatingDust({ count, color, areaWidth, areaHeight }) {
  const t = useTime();
  const particles = useMemo(() => {
    return Array.from({ length: count || 12 }, (_, i) => ({
      x: Math.random() * (areaWidth || 1920),
      y: Math.random() * (areaHeight || 1080),
      size: 2 + Math.random() * 4,
      speed: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      drift: 0.5 + Math.random() * 1.5,
    }));
  }, [count, areaWidth, areaHeight]);

  return React.createElement('div', {
    style: { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }
  },
    particles.map((p, i) => {
      const px = p.x + Math.sin(t * p.speed + p.phase) * 30 * p.drift;
      const py = p.y + Math.cos(t * p.speed * 0.7 + p.phase) * 20 * p.drift - t * 8 * p.speed;
      const wrappedY = ((py % (areaHeight || 1080)) + (areaHeight || 1080)) % (areaHeight || 1080);
      const opacity = 0.15 + Math.sin(t * p.speed * 2 + p.phase) * 0.12;
      return React.createElement('div', {
        key: i,
        style: {
          position: 'absolute',
          left: px,
          top: wrappedY,
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: color || 'rgba(255,194,51,0.5)',
          opacity,
        }
      });
    })
  );
}

/* ── Character with idle bob + drift entrance ── */
function Character({ src, x, y, width, height, enterFrom, enterDur, flipX, glowColor, bobAmount, zIndex }) {
  const { localTime, progress, duration } = useSprite();
  const entryDur = enterDur || 2.0;
  const entryProgress = clamp(localTime / entryDur, 0, 1);
  const entryEased = Easing.easeOutCubic(entryProgress);
  
  const bob = bobAmount || 8;
  const bobY = Math.sin(localTime * 1.8) * bob;
  
  let startX = x, startY = y;
  if (enterFrom === 'left') startX = -400;
  else if (enterFrom === 'right') startX = 1920 + 100;
  else if (enterFrom === 'above') startY = -500;
  else if (enterFrom === 'below') startY = 1080 + 200;

  const currentX = startX + (x - startX) * entryEased;
  const currentY = startY + (y - startY) * entryEased + bobY;
  const opacity = interpolate([0, 0.3], [0, 1])(entryProgress);
  const scale = interpolate([0, 0.6, 1], [0.85, 1.02, 1])(entryProgress);

  return React.createElement('div', {
    style: {
      position: 'absolute',
      left: currentX,
      top: currentY,
      width: width || 350,
      height: height || 450,
      opacity,
      transform: `scale(${scale})${flipX ? ' scaleX(-1)' : ''}`,
      transformOrigin: 'center bottom',
      zIndex: zIndex || 10,
      filter: glowColor ? `drop-shadow(0 0 30px ${glowColor}) drop-shadow(0 0 60px ${glowColor})` : 'drop-shadow(0 8px 20px rgba(0,0,0,0.5))',
    }
  },
    React.createElement('img', {
      src,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      }
    })
  );
}

/* ── Character that moves between position keyframes ── */
function MovingCharacter({ src, positions, width, height, enterFrom, enterDur, flipX, glowColor, bobAmount, zIndex }) {
  const { localTime } = useSprite();
  const entDur = enterDur || 2.0;
  const entryProgress = clamp(localTime / entDur, 0, 1);
  const entryEased = Easing.easeOutCubic(entryProgress);

  // Interpolate position from keyframes
  const times = positions.map(p => p.time);
  const xs = positions.map(p => p.x);
  const ys = positions.map(p => p.y);
  const baseX = interpolate(times, xs, Easing.easeInOutCubic)(localTime);
  const baseY = interpolate(times, ys, Easing.easeInOutCubic)(localTime);

  const bob = bobAmount || 8;
  const bobY = Math.sin(localTime * 1.8) * bob;

  // Entry animation from off-screen
  let startX = positions[0].x, startY = positions[0].y;
  if (enterFrom === 'left') startX = -400;
  else if (enterFrom === 'right') startX = 1920 + 100;
  else if (enterFrom === 'above') startY = -500;
  else if (enterFrom === 'below') startY = 1080 + 200;

  const currentX = entryProgress < 1 ? (startX + (baseX - startX) * entryEased) : baseX;
  const currentY = (entryProgress < 1 ? (startY + (baseY - startY) * entryEased) : baseY) + bobY;
  const opacity = interpolate([0, 0.3], [0, 1])(entryProgress);
  const scale = interpolate([0, 0.6, 1], [0.85, 1.02, 1])(entryProgress);

  return React.createElement('div', {
    style: {
      position: 'absolute',
      left: currentX,
      top: currentY,
      width: width || 350,
      height: height || 450,
      opacity,
      transform: `scale(${scale})${flipX ? ' scaleX(-1)' : ''}`,
      transformOrigin: 'center bottom',
      zIndex: zIndex || 10,
      filter: glowColor ? `drop-shadow(0 0 30px ${glowColor}) drop-shadow(0 0 60px ${glowColor})` : 'drop-shadow(0 8px 20px rgba(0,0,0,0.5))',
    }
  },
    React.createElement('img', {
      src,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      }
    })
  );
}

/* ── Screen label updater ── */
function ScreenLabel() {
  const t = useTime();
  useEffect(() => {
    const root = document.querySelector('[data-screen-label]');
    if (root) root.setAttribute('data-screen-label', `Scene 1 — ${Math.floor(t)}s`);
  }, [Math.floor(t)]);
  return null;
}

/* ── MAIN SCENE ── */
function IntroScene() {
  // Timeline (20s total):
  // 0-1s:    Pure black
  // 1-3s:    Claude fades up from below
  // 3-6s:    Bubble 1: "This is the story of a Skeleton who really loves Pizza..."
  // 4-7s:    Piza drifts in from left
  // 7-10s:   Bubble 2: "...and a Vengeful Pineapple Ghost..."
  // 8-11s:   Yurei drifts in from above
  // 11-14s:  Bubble 3: "...and a Mischievous Tanuki..."
  // 14-20s:  Bubble 4 + profile: "...just to let you know, that is me..."

  return React.createElement(Stage, {
    width: 1920,
    height: 1080,
    duration: 450,
    background: '#000000',
    autoplay: true,
  },
    React.createElement(ScreenLabel),

    // Subtle floating dust throughout
    React.createElement(Sprite, { start: 1, end: 450 },
      React.createElement(FloatingDust, { count: 20, color: 'rgba(255,194,51,0.3)', areaWidth: 1920, areaHeight: 1080 })
    ),

    // ── CLAUDE PROFILE — large background panel, behind Claude on the right ──
    React.createElement(Sprite, { start: 14, end: 19.5 },
      React.createElement(Character, {
        src: './assets/claude-profile.png',
        x: 900, y: -100,
        width: 1400, height: 1200,
        enterFrom: 'below',
        enterDur: 1.5,
        bobAmount: 0,
        zIndex: 2,
      })
    ),

    // ── CLAUDE THE TANUKI — continuous, slides from right to center at 19.5s ──
    React.createElement(Sprite, { start: 1, end: 450, keepMounted: true },
      React.createElement(MovingCharacter, {
        src: './assets/claude-tanuki.png',
        positions: [
          { time: 0, x: 1200, y: 280 },
          { time: 18, x: 1200, y: 280 },
          { time: 20.5, x: 750, y: 350 },
          { time: 258, x: 750, y: 350 },
          { time: 261, x: 1250, y: 300 },
          { time: 325, x: 1250, y: 300 },
          { time: 328, x: 1100, y: 300 },
          { time: 370, x: 1100, y: 300 },
          { time: 373, x: 750, y: 350 },
        ],
        width: 420, height: 530,
        enterFrom: 'below',
        enterDur: 2.0,
        bobAmount: 6,
        zIndex: 20,
      })
    ),

    // ── BUBBLE 1: "This is the story of a Skeleton..." ──
    React.createElement(Sprite, { start: 3, end: 6.5 },
      React.createElement(SpeechBubble, {
        text: "This is the story of a Skeleton who really loves Pizza...",
        x: 1100, y: 30,
        width: 500,
        tailX: '50%',
      })
    ),

    // ── PIZA SUKERUTON — drifts in from left at 4s ──
    React.createElement(Sprite, { start: 4, end: 19.5 },
      React.createElement(Character, {
        src: './assets/piza-sukeruton.png',
        x: 20, y: 10,
        width: 680, height: 1050,
        enterFrom: 'left',
        enterDur: 2,
        bobAmount: 5,
        zIndex: 20,
      })
    ),

    // ── BUBBLE 2: "...and a Vengeful Pineapple Ghost..." ──
    React.createElement(Sprite, { start: 7, end: 10.5 },
      React.createElement(SpeechBubble, {
        text: "...and a Vengeful Pineapple Ghost...",
        x: 1150, y: 30,
        width: 460,
        tailX: '50%',
      })
    ),

    // ── PINEAPLE YUREI — drifts in from above at 8s ──
    React.createElement(Sprite, { start: 8, end: 19.5 },
      React.createElement(Character, {
        src: './assets/pineaple-yurei.png',
        x: 420, y: 10,
        width: 700, height: 1000,
        enterFrom: 'above',
        enterDur: 2.5,
        glowColor: 'rgba(226,59,59,0.35)',
        bobAmount: 10,
        zIndex: 20,
      })
    ),

    // ── BUBBLE 3: "...and a Mischievous Tanuki..." ──
    React.createElement(Sprite, { start: 11, end: 13.5 },
      React.createElement(SpeechBubble, {
        text: "...and a Mischievous Tanuki...",
        x: 1180, y: 30,
        width: 420,
        tailX: '50%',
      })
    ),

    // ── BUBBLE 4: "...just to let you know, that is me..." ──
    React.createElement(Sprite, { start: 14, end: 19.5 },
      React.createElement(SpeechBubble, {
        text: "...just to let you know, that is me. I am the Mischievous Tanuki... Claude.",
        x: 1080, y: 30,
        width: 540,
        tailX: '50%',
      })
    ),

    // ── Subtle vignette overlay ──
    React.createElement(Sprite, { start: 0, end: 450, keepMounted: true },
      React.createElement('div', {
        style: {
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
          zIndex: 50,
        }
      })
    ),

    // ══════════════════════════════════════════════════════
    // SCENE 2: Claude center, Yurei backstory (20-55s)
    // ══════════════════════════════════════════════════════

    // (Claude is now continuous — Scene 2 bubbles use him in center position)

    // ── PINEAPLE YUREI — looms behind Claude during Scenes 2-3 ──
    React.createElement(Sprite, { start: 23, end: 105 },
      React.createElement(Character, {
        src: './assets/pineaple-yurei.png',
        x: 250, y: 50,
        width: 500, height: 700,
        enterFrom: 'above',
        enterDur: 3,
        glowColor: 'rgba(226,59,59,0.25)',
        bobAmount: 12,
        zIndex: 8,
      })
    ),

    // ── S2 BUBBLE 1: "Pineaple Yurei came to the Earth Realm..." ──
    React.createElement(Sprite, { start: 21.5, end: 25.5 },
      React.createElement(SpeechBubble, {
        text: "Pineaple Yurei came to the Earth Realm...",
        x: 710, y: 80,
        width: 500,
        tailX: '50%',
      })
    ),

    // ── DUNMORE PINEAPPLE — background for "sign of great wealth" ──
    React.createElement(Sprite, { start: 25.5, end: 30.5 },
      React.createElement(Character, {
        src: './assets/dunmore-pineapple.png',
        x: 60, y: 200,
        width: 700, height: 470,
        enterFrom: 'below',
        enterDur: 1.5,
        bobAmount: 2,
        zIndex: 8,
      })
    ),

    // ── S2 BUBBLE 2: "and found out that in olden times..." ──
    React.createElement(Sprite, { start: 26, end: 30.5 },
      React.createElement(SpeechBubble, {
        text: "...and found out that in olden times Pineapples were a sign of great wealth.",
        x: 680, y: 60,
        width: 560,
        tailX: '50%',
      })
    ),

    // ── S2 BUBBLE 3: "He thought Humans would worship him..." ──
    React.createElement(Sprite, { start: 31, end: 36 },
      React.createElement(SpeechBubble, {
        text: "He thought that Humans would worship him as a God, but they mocked him because of Pineapple on Pizza.",
        x: 650, y: 40,
        width: 620,
        tailX: '50%',
      })
    ),

    // ── S2 BUBBLE 4: "angered he began to Vanquish Cheese..." ──
    React.createElement(Sprite, { start: 36.5, end: 41 },
      React.createElement(SpeechBubble, {
        text: "Angered, he began to Vanquish Cheese out of Existence in the Realm.",
        x: 680, y: 60,
        width: 560,
        tailX: '50%',
      })
    ),

    // ── S2 BUBBLE 5: "with a snap of his Fingers..." ──
    React.createElement(Sprite, { start: 41.5, end: 46.5 },
      React.createElement(SpeechBubble, {
        text: "With a snap of his Fingers, Mozzarella had never existed... and then Cheddar... Haloumi... they all began to Vanish.",
        x: 630, y: 30,
        width: 660,
        tailX: '50%',
      })
    ),

    // ── S2 BUBBLE 6: "any Slice of Pizza..." ──
    React.createElement(Sprite, { start: 47, end: 51.5 },
      React.createElement(SpeechBubble, {
        text: "Any Slice of Pizza that had one of those Cheeses on it began to lose its Cheese Soul and turn into an Angry Slice of Pizza.",
        x: 610, y: 20,
        width: 700,
        tailX: '50%',
      })
    ),

    // ── SLICIFER — first appearance when named, stays longer ──
    React.createElement(Sprite, { start: 52, end: 61 },
      React.createElement(Character, {
        src: './assets/slicifer.png',
        x: 100, y: 200,
        width: 450, height: 580,
        enterFrom: 'below',
        enterDur: 1.5,
        bobAmount: 4,
        zIndex: 15,
      })
    ),

    // ── S2 BUBBLE 7: "the first Angry Slice..." ──
    React.createElement(Sprite, { start: 52, end: 56 },
      React.createElement(SpeechBubble, {
        text: "The first Angry Slice of Pizza was 'Slicifer' \u2014 who became Yurei\u2019s most trusted and loyal Soldier.",
        x: 630, y: 40,
        width: 660,
        tailX: '50%',
      })
    ),

    // ══════════════════════════════════════════════════════
    // SCENE 3: Yurei's true nature (57-105s)
    // ══════════════════════════════════════════════════════

    // ── SLICES ATTACK — full screen battlefield behind Claude ──
    React.createElement(Sprite, { start: 56.5, end: 66.5 },
      React.createElement(Character, {
        src: './assets/slices-attack.png',
        x: 0, y: 0,
        width: 1920, height: 1080,
        enterFrom: 'below',
        enterDur: 2,
        bobAmount: 0,
        glowColor: 'rgba(226,59,59,0.2)',
        zIndex: 8,
      })
    ),

    // ── S3 BUBBLE 1 ──
    React.createElement(Sprite, { start: 57, end: 61.5 },
      React.createElement(SpeechBubble, {
        text: "The Angry Slices of Pizza began to attack the Humans.",
        x: 680, y: 70,
        width: 560,
        tailX: '50%',
      })
    ),

    // ── S3 BUBBLE 2 ──
    React.createElement(Sprite, { start: 62, end: 66.5 },
      React.createElement(SpeechBubble, {
        text: "It became evident that Pineaple Yurei meant to do great harm to the entire Realm.",
        x: 660, y: 60,
        width: 600,
        tailX: '50%',
      })
    ),

    // ── S3 BUBBLE 3 ──
    React.createElement(Sprite, { start: 67, end: 72 },
      React.createElement(SpeechBubble, {
        text: "I will let you in on a little Secret that the Residents of the Earth Realm don't actually know yet...",
        x: 640, y: 50,
        width: 640,
        tailX: '50%',
      })
    ),

    // ── S3 BUBBLE 4 ──
    React.createElement(Sprite, { start: 72.5, end: 77 },
      React.createElement(SpeechBubble, {
        text: "Yurei isn't actually a Pineaple Ghost... he is a being made up of Pure Malevolence.",
        x: 650, y: 55,
        width: 620,
        tailX: '50%',
      })
    ),

    // ── S3 BUBBLE 5 ──
    React.createElement(Sprite, { start: 77.5, end: 81.5 },
      React.createElement(SpeechBubble, {
        text: "His only Purpose, His only Desire, is to feed on Despair.",
        x: 700, y: 80,
        width: 520,
        tailX: '50%',
      })
    ),

    // ── S3 BUBBLE 6 ──
    React.createElement(Sprite, { start: 82, end: 86.5 },
      React.createElement(SpeechBubble, {
        text: "To do this, He travels between Realms, draining them of anything that brings Joy.",
        x: 660, y: 60,
        width: 600,
        tailX: '50%',
      })
    ),

    // ── S3 BUBBLE 7 ──
    React.createElement(Sprite, { start: 87, end: 91.5 },
      React.createElement(SpeechBubble, {
        text: "He saw the simple Joy that Pizza and Cheese brought to the Humans and began his Brutality right there.",
        x: 640, y: 45,
        width: 640,
        tailX: '50%',
      })
    ),

    // ── S3 BUBBLE 8 ──
    React.createElement(Sprite, { start: 92, end: 96.5 },
      React.createElement(SpeechBubble, {
        text: "This Creature isn't another Thanos... in fact Yurei even mocked this Character...",
        x: 660, y: 55,
        width: 600,
        tailX: '50%',
      })
    ),

    // ── S3 BUBBLE 9 ──
    React.createElement(Sprite, { start: 97, end: 101 },
      React.createElement(SpeechBubble, {
        text: "\"Erasing Half the Universe? Not enough... Even Killing them all is too Merciful.\"",
        x: 660, y: 60,
        width: 600,
        tailX: '50%',
      })
    ),

    // ── S3 BUBBLE 10 ──
    React.createElement(Sprite, { start: 101.5, end: 105 },
      React.createElement(SpeechBubble, {
        text: "So as the Realm began to feed Yurei with its growing Despair, Yurei came and went as He pleased... the Earth Realm was nothing more than a Buffet of Horror for him to Graze upon.",
        x: 600, y: 20,
        width: 720,
        tailX: '50%',
      })
    ),

    // ══════════════════════════════════════════════════════════
    // SCENE 4: The Mutaibutsu split (106-135s)
    // ══════════════════════════════════════════════════════════

    // ── S4 BUBBLE 1 ──
    React.createElement(Sprite, { start: 106, end: 111 },
      React.createElement(SpeechBubble, {
        text: "Each time Yurei departed the Earth Realm, the Vacuum left in his wake would occasionally suck a Human into Yurei's Realm... 'The Expanse'.",
        x: 600, y: 15,
        width: 720,
        tailX: '50%',
      })
    ),

    // ── S4 BUBBLE 2 ──
    React.createElement(Sprite, { start: 111.5, end: 115.5 },
      React.createElement(SpeechBubble, {
        text: "The Trauma of this was too intense for Humans, and they were split apart.",
        x: 670, y: 65,
        width: 580,
        tailX: '50%',
      })
    ),

    // ── S4 BUBBLE 3 ──
    React.createElement(Sprite, { start: 116, end: 121 },
      React.createElement(SpeechBubble, {
        text: "Their Psyche and Emotional State carried across to the formless White Void of 'The Expanse' and they became 'Mutai'.",
        x: 620, y: 30,
        width: 680,
        tailX: '50%',
      })
    ),

    // ── S4 BUBBLE 4 ──
    React.createElement(Sprite, { start: 121.5, end: 126.5 },
      React.createElement(SpeechBubble, {
        text: "The Physicalness left in the Earth Realm got transferred to an Object or Thing that the Person had on them or was close to.",
        x: 610, y: 25,
        width: 700,
        tailX: '50%',
      })
    ),

    // ── S4 BUBBLE 5 ──
    React.createElement(Sprite, { start: 127, end: 131.5 },
      React.createElement(SpeechBubble, {
        text: 'These Things became "Butsu" with no Knowledge or Understanding of what had happened to them or even how they came into Existence.',
        x: 620, y: 30,
        width: 680,
        tailX: '50%',
      })
    ),

    // ── S4 BUBBLE 6 ──
    React.createElement(Sprite, { start: 132, end: 135 },
      React.createElement(SpeechBubble, {
        text: '"Mutaibutsu" (無体物 / むたいぶつ) translates to "intangible thing" or "incorporeal object" in Japanese.',
        x: 620, y: 40,
        width: 680,
        tailX: '50%',
      })
    ),

    // ══════════════════════════════════════════════════════════
    // SCENE 5: Claude's aside + The Cheese Wars (136-162s)
    // ══════════════════════════════════════════════════════════

    // ── S5 BUBBLE 1 ──
    React.createElement(Sprite, { start: 136, end: 140 },
      React.createElement(SpeechBubble, {
        text: "It was my idea to name them this... I thought that was pretty good right?",
        x: 660, y: 60,
        width: 600,
        tailX: '50%',
      })
    ),

    // ── S5 BUBBLE 2 ──
    React.createElement(Sprite, { start: 140.5, end: 146 },
      React.createElement(SpeechBubble, {
        text: "Anyway... back to the Story... The Earth Realm was plunged into 'The Cheese Wars'... the Darkest and most Desperate Time that this Tanuki can recall.",
        x: 590, y: 10,
        width: 740,
        tailX: '50%',
      })
    ),

    // ── S5 BUBBLE 3 ──
    React.createElement(Sprite, { start: 146.5, end: 150.5 },
      React.createElement(SpeechBubble, {
        text: "Yurei continued Plundering and Destroying anything He could find that brought Joy to the Realm.",
        x: 640, y: 50,
        width: 640,
        tailX: '50%',
      })
    ),

    // ── S5 BUBBLE 4 ──
    React.createElement(Sprite, { start: 151, end: 156 },
      React.createElement(SpeechBubble, {
        text: "Music, Art, Stories, Myths... even Gods... everything fell to the Unrelenting Nature of the Pineapple Ghost.",
        x: 630, y: 40,
        width: 660,
        tailX: '50%',
      })
    ),

    // ── S5 BUBBLE 5 ──
    React.createElement(Sprite, { start: 156.5, end: 162 },
      React.createElement(SpeechBubble, {
        text: "And just to let you know, yes... I have said Pineaple Yurei... and Pineapple Ghost... and there is the normal amount of p's in the latter... this will make sense later... maybe. hahahaha",
        x: 570, y: 5,
        width: 780,
        tailX: '50%',
      })
    ),

    // ══════════════════════════════════════════════════════════
    // SCENE 6: Piza Sukeruton arrives (163-210s)
    // ══════════════════════════════════════════════════════════

    // ── PIZA SUKERUTON — appears when Claude mentions his arrival ──
    React.createElement(Sprite, { start: 165, end: 210 },
      React.createElement(Character, {
        src: './assets/piza-sukeruton.png',
        x: 50, y: 80,
        width: 500, height: 780,
        enterFrom: 'left',
        enterDur: 3,
        bobAmount: 5,
        zIndex: 15,
      })
    ),

    // ── S6 BUBBLE 1 ──
    React.createElement(Sprite, { start: 163, end: 169 },
      React.createElement(SpeechBubble, {
        text: "I can't remember exactly when... but Piza Sukeruton arrived... He was \"Awakened In A World Of Ash & Bone\"... which is not a very subtle segue to you listening to a Song if you want hahahahah",
        x: 570, y: 5,
        width: 780,
        tailX: '50%',
      })
    ),

    // ── S6 BUBBLE 2 ──
    React.createElement(Sprite, { start: 169.5, end: 174 },
      React.createElement(SpeechBubble, {
        text: "The Humans don't know all of this, but I feel like I can share this with you...",
        x: 660, y: 55,
        width: 600,
        tailX: '50%',
      })
    ),

    // ── S6 BUBBLE 3 ──
    React.createElement(Sprite, { start: 174.5, end: 179 },
      React.createElement(SpeechBubble, {
        text: "Piza Sukeruton's Realm was the very first Realm that Yurei decimated...",
        x: 670, y: 65,
        width: 580,
        tailX: '50%',
      })
    ),

    // ── S6 BUBBLE 4 ──
    React.createElement(Sprite, { start: 179.5, end: 183.5 },
      React.createElement(SpeechBubble, {
        text: "He was sucked into Yurei's Realm, where they battled...",
        x: 700, y: 75,
        width: 520,
        tailX: '50%',
      })
    ),

    // ── S6 BUBBLE 5 ──
    React.createElement(Sprite, { start: 184, end: 189 },
      React.createElement(SpeechBubble, {
        text: '"Well why wasn\'t the Pizza Skeleton split in half like the Humans?"',
        x: 660, y: 55,
        width: 600,
        tailX: '50%',
      })
    ),

    // ── S6 BUBBLE 6 ──
    React.createElement(Sprite, { start: 189.5, end: 194 },
      React.createElement(SpeechBubble, {
        text: "Two reasons... firstly because it would have made this a very very short story and no fun at all...",
        x: 640, y: 45,
        width: 640,
        tailX: '50%',
      })
    ),

    // ── S6 BUBBLE 7 ──
    React.createElement(Sprite, { start: 194.5, end: 200 },
      React.createElement(SpeechBubble, {
        text: "Secondly... Yurei didn't actually know that Piza would be pulled into His Realm... it was his first time Joy Draining remember?",
        x: 610, y: 25,
        width: 700,
        tailX: '50%',
      })
    ),

    // ── S6 BUBBLE 8 ──
    React.createElement(Sprite, { start: 200.5, end: 205 },
      React.createElement(SpeechBubble, {
        text: "So Piza and Yurei battled... and Piza bested the Vengeful Fruit Head...",
        x: 670, y: 65,
        width: 580,
        tailX: '50%',
      })
    ),

    // ── S6 BUBBLE 9 ──
    React.createElement(Sprite, { start: 205.5, end: 210 },
      React.createElement(SpeechBubble, {
        text: "Once Piza had left 'The Expanse' Yurei swore He would never let a Being escape ever again and closed off the Realm.",
        x: 620, y: 30,
        width: 680,
        tailX: '50%',
      })
    ),

    // ══════════════════════════════════════════════════════════
    // SCENE 7: The Expanse reveal + Mutai cattle (211-258s)
    // ══════════════════════════════════════════════════════════

    // ── S7 BUBBLE 1 ──
    React.createElement(Sprite, { start: 211, end: 217 },
      React.createElement(SpeechBubble, {
        text: "So back to the Earth Realm... oh wait... remind me later to tell you another little bit of Information about Yurei and 'The Expanse'...",
        x: 590, y: 10,
        width: 740,
        tailX: '50%',
      })
    ),

    // ── S7 BUBBLE 2 ──
    React.createElement(Sprite, { start: 217.5, end: 224 },
      React.createElement(SpeechBubble, {
        text: "Actually I may as well tell you now because Honestly, I am amazed you have made it this far and I probably won't remember and you will be so far down the Rabbit Hole... you won't remember to even remind me.",
        x: 560, y: 5,
        width: 800,
        tailX: '50%',
      })
    ),

    // ── S7 BUBBLE 3 ──
    React.createElement(Sprite, { start: 224.5, end: 230 },
      React.createElement(SpeechBubble, {
        text: "'The Expanse' isn't just Yurei's Realm. It's the Physical Presence that represents His ever growing Malevolence and Insanity.",
        x: 610, y: 25,
        width: 700,
        tailX: '50%',
      })
    ),

    // ── S7 BUBBLE 4 ──
    React.createElement(Sprite, { start: 230.5, end: 235 },
      React.createElement(SpeechBubble, {
        text: "If it makes it easier to understand think of it as a Giant Angry Pineapple Ghost...",
        x: 650, y: 55,
        width: 620,
        tailX: '50%',
      })
    ),

    // ── S7 BUBBLE 5 ──
    React.createElement(Sprite, { start: 235.5, end: 239 },
      React.createElement(SpeechBubble, {
        text: "...but he isn't a Pineapple Ghost...",
        x: 730, y: 90,
        width: 460,
        tailX: '50%',
      })
    ),

    // ── S7 BUBBLE 6 ──
    React.createElement(Sprite, { start: 239.5, end: 246 },
      React.createElement(SpeechBubble, {
        text: "He is just a huge Jerk that Consumes Joy, Feeds on Despair and is actually a Formless White Void that Traps Fractured Emotional States of Beings within that Void.",
        x: 580, y: 5,
        width: 760,
        tailX: '50%',
      })
    ),

    // ── S7 BUBBLE 7 ──
    React.createElement(Sprite, { start: 246.5, end: 250 },
      React.createElement(SpeechBubble, {
        text: "Way easier to grasp right?",
        x: 760, y: 100,
        width: 400,
        tailX: '50%',
      })
    ),

    // ── S7 BUBBLE 8 ──
    React.createElement(Sprite, { start: 250.5, end: 258 },
      React.createElement(SpeechBubble, {
        text: "Every Mutai that was formed in Yurei's Realm becomes like Stock Cattle for him... Grazing on Nothingness and any time even a hint of Joy appears He Consumes it and leaves them sinking into deeper and deeper Despair.",
        x: 560, y: 5,
        width: 800,
        tailX: '50%',
      })
    ),

    // ══════════════════════════════════════════════════════════
    // SCENE 8: Tenka Goken + Cheese Fang (259-325s)
    // ══════════════════════════════════════════════════════════

    // ── S8 BUBBLE 1 ──
    React.createElement(Sprite, { start: 259, end: 264.5 },
      React.createElement(SpeechBubble, {
        text: "So one of the things that Yurei destroyed was the 'Tenka Goken' or 'Five Swords Under Heaven'...",
        x: 1050, y: 30,
        width: 580,
        tailX: '50%',
      })
    ),

    // ── SWORD CARD 1: Dōjigiri ──
    React.createElement(Sprite, { start: 264.5, end: 269 },
      React.createElement(Character, {
        src: './assets/swords/dojigiri.png',
        x: 80, y: 80,
        width: 420, height: 630,
        enterFrom: 'below',
        enterDur: 1.2,
        bobAmount: 3,
        zIndex: 30,
      })
    ),

    // ── S8 BUBBLE 2 ──
    React.createElement(Sprite, { start: 265, end: 269 },
      React.createElement(SpeechBubble, {
        text: "童子切安綱 (Dōjigiri Yasutsuna) — The Demon Cutter",
        x: 1100, y: 30,
        width: 520,
        tailX: '50%',
      })
    ),

    // ── SWORD CARD 2: Mikazuki ──
    React.createElement(Sprite, { start: 269, end: 273.5 },
      React.createElement(Character, {
        src: './assets/swords/mikazuki.png',
        x: 80, y: 80,
        width: 420, height: 630,
        enterFrom: 'below',
        enterDur: 1.2,
        bobAmount: 3,
        zIndex: 30,
      })
    ),

    // ── S8 BUBBLE 3 ──
    React.createElement(Sprite, { start: 269.5, end: 273.5 },
      React.createElement(SpeechBubble, {
        text: "三日月宗近 (Mikazuki Munechika) — The Crescent Moon",
        x: 1100, y: 30,
        width: 520,
        tailX: '50%',
      })
    ),

    // ── SWORD CARD 3: Onimaru ──
    React.createElement(Sprite, { start: 273.5, end: 278 },
      React.createElement(Character, {
        src: './assets/swords/onimaru.png',
        x: 80, y: 80,
        width: 420, height: 630,
        enterFrom: 'below',
        enterDur: 1.2,
        bobAmount: 3,
        zIndex: 30,
      })
    ),

    // ── S8 BUBBLE 4 ──
    React.createElement(Sprite, { start: 274, end: 278 },
      React.createElement(SpeechBubble, {
        text: "鬼丸国綱 (Onimaru Kunitsuna) — The Demon Maru",
        x: 1100, y: 30,
        width: 520,
        tailX: '50%',
      })
    ),

    // ── SWORD CARD 4: Ōdenta ──
    React.createElement(Sprite, { start: 278, end: 282.5 },
      React.createElement(Character, {
        src: './assets/swords/odenta.png',
        x: 80, y: 80,
        width: 420, height: 630,
        enterFrom: 'below',
        enterDur: 1.2,
        bobAmount: 3,
        zIndex: 30,
      })
    ),

    // ── S8 BUBBLE 5 ──
    React.createElement(Sprite, { start: 278.5, end: 282.5 },
      React.createElement(SpeechBubble, {
        text: "大典太光世 (Ōdenta Mitsuyo) — The Great Odenta",
        x: 1100, y: 30,
        width: 520,
        tailX: '50%',
      })
    ),

    // ── SWORD CARD 5: Juzumaru ──
    React.createElement(Sprite, { start: 282.5, end: 287 },
      React.createElement(Character, {
        src: './assets/swords/juzumaru.png',
        x: 80, y: 80,
        width: 420, height: 630,
        enterFrom: 'below',
        enterDur: 1.2,
        bobAmount: 3,
        zIndex: 30,
      })
    ),

    // ── S8 BUBBLE 6 ──
    React.createElement(Sprite, { start: 283, end: 287 },
      React.createElement(SpeechBubble, {
        text: "数珠丸恒次 (Juzumaru Tsunetsugu) — The Prayer Beads Maru",
        x: 1100, y: 30,
        width: 560,
        tailX: '50%',
      })
    ),

    // ── S8 BUBBLE 7 ──
    React.createElement(Sprite, { start: 287.5, end: 293 },
      React.createElement(SpeechBubble, {
        text: "These are... well in this version of the Earth Realm... were... Real Swords that were wielded in Real Battles in Old Japan.",
        x: 1050, y: 30,
        width: 600,
        tailX: '50%',
      })
    ),

    // ── S8 BUBBLE 8 ──
    React.createElement(Sprite, { start: 293.5, end: 298 },
      React.createElement(SpeechBubble, {
        text: "They achieved Mythological Status and were revered as National Treasures.",
        x: 1100, y: 50,
        width: 540,
        tailX: '50%',
      })
    ),

    // ── S8 BUBBLE 9 ──
    React.createElement(Sprite, { start: 298.5, end: 304 },
      React.createElement(SpeechBubble, {
        text: 'Now take note... there was "Five Swords Under Heaven" and I\'m going to let you into another little Secret...',
        x: 1050, y: 30,
        width: 580,
        tailX: '50%',
      })
    ),

    // ── S8 BUBBLE 10 ──
    React.createElement(Sprite, { start: 304.5, end: 310 },
      React.createElement(SpeechBubble, {
        text: 'Part of Piza Sukeruton\'s Quest here on Earth is to help create "The Sixth Sword Under Heaven..."',
        x: 1050, y: 30,
        width: 580,
        tailX: '50%',
      })
    ),

    // ── CHEESE FANG CARD — dramatic reveal ──
    React.createElement(Sprite, { start: 310, end: 325, keepMounted: true },
      React.createElement(Character, {
        src: './assets/swords/cheesefang.png',
        x: 80, y: 50,
        width: 480, height: 720,
        enterFrom: 'below',
        enterDur: 2,
        bobAmount: 4,
        glowColor: 'rgba(255,194,51,0.4)',
        zIndex: 30,
      })
    ),

    // ── S8 BUBBLE 11 ──
    React.createElement(Sprite, { start: 310.5, end: 316 },
      React.createElement(SpeechBubble, {
        text: "Which will be called 'Chīzu no Kiba' (チーズの牙) or 'Cheese Fang'",
        x: 1100, y: 30,
        width: 540,
        tailX: '50%',
      })
    ),

    // ── S8 BUBBLE 12 ──
    React.createElement(Sprite, { start: 316.5, end: 320.5 },
      React.createElement(SpeechBubble, {
        text: "Now who could this potentially be used against???",
        x: 1150, y: 60,
        width: 480,
        tailX: '50%',
      })
    ),

    // ── S8 BUBBLE 13 ──
    React.createElement(Sprite, { start: 321, end: 325 },
      React.createElement(SpeechBubble, {
        text: "I'll give you a hint... he is a Yurei who looks like a Pineapple.",
        x: 1100, y: 40,
        width: 540,
        tailX: '50%',
      })
    ),

    // ══════════════════════════════════════════════════════════
    // SCENE 9: Slicifer + the Angry Slices (326-370s)
    // ══════════════════════════════════════════════════════════

    // ── S9 BUBBLE 1 ──
    React.createElement(Sprite, { start: 326, end: 331 },
      React.createElement(SpeechBubble, {
        text: "So where was I? Despair... No Joy... No Cheese... ah the Angry Slices of Pizza.",
        x: 1000, y: 40,
        width: 580,
        tailX: '50%',
      })
    ),

    // ── SLICIFER — stomps in from the left ──
    React.createElement(Sprite, { start: 331, end: 370, keepMounted: true },
      React.createElement(Character, {
        src: './assets/slicifer.png',
        x: 100, y: 180,
        width: 500, height: 650,
        enterFrom: 'left',
        enterDur: 2,
        bobAmount: 4,
        zIndex: 15,
      })
    ),

    // ── S9 BUBBLE 2 ──
    React.createElement(Sprite, { start: 331.5, end: 335.5 },
      React.createElement(SpeechBubble, {
        text: "Let's meet Slicifer... the first Angry Slice of Pizza.",
        x: 1050, y: 50,
        width: 520,
        tailX: '50%',
      })
    ),

    // ── S9 BUBBLE 3 ──
    React.createElement(Sprite, { start: 336, end: 340 },
      React.createElement(SpeechBubble, {
        text: "Yurei's first and most fearsome Soldier...",
        x: 1080, y: 60,
        width: 480,
        tailX: '50%',
      })
    ),

    // ── S9 BUBBLE 4 ──
    React.createElement(Sprite, { start: 340.5, end: 345.5 },
      React.createElement(SpeechBubble, {
        text: "Loyal and Brutal... he obeys Yurei and commands an Army of other Angry Slices.",
        x: 1000, y: 40,
        width: 580,
        tailX: '50%',
      })
    ),

    // ── S9 BUBBLE 5 ──
    React.createElement(Sprite, { start: 346, end: 351.5 },
      React.createElement(SpeechBubble, {
        text: 'Each a strange photocopy of the one before... not quite... um... right in the head? Am I allowed to say that?',
        x: 980, y: 30,
        width: 620,
        tailX: '50%',
      })
    ),

    // ── S9 BUBBLE 6 ──
    React.createElement(Sprite, { start: 352, end: 356 },
      React.createElement(SpeechBubble, {
        text: "Am I being Slicist?",
        x: 1200, y: 80,
        width: 340,
        tailX: '50%',
      })
    ),

    // ── S9 BUBBLE 7 ──
    React.createElement(Sprite, { start: 356.5, end: 362 },
      React.createElement(SpeechBubble, {
        text: "One of the Problems with each one being a bad copy of the last is that they became more and more irrational and unstable...",
        x: 960, y: 20,
        width: 660,
        tailX: '50%',
      })
    ),

    // ── S9 BUBBLE 8 ──
    React.createElement(Sprite, { start: 362.5, end: 370 },
      React.createElement(SpeechBubble, {
        text: "They started killing Humans and Yurei needed the Humans to farm for their Despair.",
        x: 1000, y: 40,
        width: 580,
        tailX: '50%',
      })
    ),

    // ══════════════════════════════════════════════════════════
    // SCENE 10: The Prophecy + The Quest (371-450s)
    // ══════════════════════════════════════════════════════════

    // ── S10 BUBBLE 1 ──
    React.createElement(Sprite, { start: 371, end: 375.5 },
      React.createElement(SpeechBubble, {
        text: "So not everything ran perfectly for the Pineapple Ghost.",
        x: 700, y: 75,
        width: 520,
        tailX: '50%',
      })
    ),

    // ── S10 BUBBLE 2 ──
    React.createElement(Sprite, { start: 376, end: 380 },
      React.createElement(SpeechBubble, {
        text: "Back to the 'Five Swords Under Heaven'.......",
        x: 720, y: 85,
        width: 480,
        tailX: '50%',
      })
    ),

    // ── PIZA SUKERUTON — reappears for the quest ──
    React.createElement(Sprite, { start: 380, end: 450, keepMounted: true },
      React.createElement(Character, {
        src: './assets/piza-sukeruton.png',
        x: 50, y: 120,
        width: 450, height: 700,
        enterFrom: 'left',
        enterDur: 2.5,
        bobAmount: 5,
        zIndex: 15,
      })
    ),

    // ── S10 BUBBLE 3 ──
    React.createElement(Sprite, { start: 380.5, end: 385.5 },
      React.createElement(SpeechBubble, {
        text: "I told the Pizza Skeleton of a Legend that I had heard across the Whispers of Time...",
        x: 650, y: 55,
        width: 620,
        tailX: '50%',
      })
    ),

    // ── S10 BUBBLE 4 ──
    React.createElement(Sprite, { start: 386, end: 392 },
      React.createElement(SpeechBubble, {
        text: "The Winds carried the Story that when everything seemed impossible for the Realm, and the Horror of a Great Monster threatened every part of Humanity...",
        x: 590, y: 10,
        width: 740,
        tailX: '50%',
      })
    ),

    // ── S10 BUBBLE 5 ──
    React.createElement(Sprite, { start: 392.5, end: 396.5 },
      React.createElement(SpeechBubble, {
        text: "A Mysterious Skeleton who Loved Pizza would appear.",
        x: 710, y: 80,
        width: 500,
        tailX: '50%',
      })
    ),

    // ── S10 BUBBLE 6 ──
    React.createElement(Sprite, { start: 397, end: 400.5 },
      React.createElement(SpeechBubble, {
        text: "How well does that fit right???",
        x: 770, y: 100,
        width: 380,
        tailX: '50%',
      })
    ),

    // ── S10 BUBBLE 7 ──
    React.createElement(Sprite, { start: 401, end: 406 },
      React.createElement(SpeechBubble, {
        text: "And if this Skeletal Saviour found the Forges where the 'Tenka Goken' were made...",
        x: 650, y: 55,
        width: 620,
        tailX: '50%',
      })
    ),

    // ── S10 BUBBLE 8 ──
    React.createElement(Sprite, { start: 406.5, end: 411 },
      React.createElement(SpeechBubble, {
        text: "And found Remnants of the Mystical Metals that became the Swords...",
        x: 670, y: 65,
        width: 580,
        tailX: '50%',
      })
    ),

    // ── S10 BUBBLE 9 ──
    React.createElement(Sprite, { start: 411.5, end: 415.5 },
      React.createElement(SpeechBubble, {
        text: "And those Metals were taken to 'The Deathwitch Forge'...",
        x: 700, y: 75,
        width: 520,
        tailX: '50%',
      })
    ),

    // ── S10 BUBBLE 10 ──
    React.createElement(Sprite, { start: 416, end: 422 },
      React.createElement(SpeechBubble, {
        text: "The Master Swordmaker there would create... THE SIXTH SWORD UNDER HEAVEN... which could dispatch the Threat the Earth Realm faced...",
        x: 600, y: 15,
        width: 720,
        tailX: '50%',
      })
    ),

    // ── S10 BUBBLE 11 ──
    React.createElement(Sprite, { start: 422.5, end: 427 },
      React.createElement(SpeechBubble, {
        text: "Again... what are the chances of the Gods foretelling this exact series of events????",
        x: 650, y: 55,
        width: 620,
        tailX: '50%',
      })
    ),

    // ── S10 BUBBLE 12 ──
    React.createElement(Sprite, { start: 427.5, end: 432 },
      React.createElement(SpeechBubble, {
        text: "So I began collecting the Myths about the Locations of the Forges...",
        x: 670, y: 65,
        width: 580,
        tailX: '50%',
      })
    ),

    // ── S10 BUBBLE 13 ──
    React.createElement(Sprite, { start: 432.5, end: 437 },
      React.createElement(SpeechBubble, {
        text: "To protect the Myths from The Pineapple Ghost I taught tiny Fragments to the Butsu...",
        x: 650, y: 55,
        width: 620,
        tailX: '50%',
      })
    ),

    // ── S10 BUBBLE 14 ──
    React.createElement(Sprite, { start: 437.5, end: 442 },
      React.createElement(SpeechBubble, {
        text: "Together they carried the Information camouflaged and hidden...",
        x: 680, y: 70,
        width: 560,
        tailX: '50%',
      })
    ),

    // ── S10 BUBBLE 15 ──
    React.createElement(Sprite, { start: 442.5, end: 450 },
      React.createElement(SpeechBubble, {
        text: "And together we will rid this Realm of the scourge of Pineaple Yurei forever.",
        x: 650, y: 55,
        width: 620,
        tailX: '50%',
      })
    )
  );
}

window.IntroScene = IntroScene;
