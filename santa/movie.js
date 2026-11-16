/* Who Stole Santa? — the VHS home-video movie, round beats and asset paths. */
(function (root) {
'use strict';
var IMG = 'img/', AUD = 'audio/';
function scene(id) { return IMG + 'scene-' + id + '.jpg'; }
function charImg(id) { return IMG + 'char-' + id + '.jpg'; }
function evImg(trait, val) { return IMG + 'ev-' + trait + '-' + val + '.jpg'; }

// line start times (seconds) in audio/opening.mp3
var LINES = [[3.0,6.25],[10.0,23.85],[34.6,9.17],[44.52,18.97],[64.24,12.18],[77.17,8.85],[86.77,1.73],[90.1,12.31],[103.16,1.43],[106.19,7.23],[114.17,8.43],[123.35,10.47],[134.57,3.31]];
// what the camera shows, from time t
var SHOTS = [
  { t: 0, kind: 'blue' },
  { t: 3.0, img: 'village', clock: [20, 0] },
  { t: 10.0, img: 'workshop' }, { t: 16.0, img: 'kitchen' }, { t: 22.0, img: 'stables' }, { t: 28.0, img: 'wrapping' },
  { t: 34.6, img: 'sleigh' },
  { t: 44.52, img: 'santa', clock: [20, 3] },
  { t: 64.24, img: 'lantern', clock: [20, 31] },
  { t: 77.17, img: 'cocoa', clock: [21, 0] },
  { t: 86.77, img: 'empty', glitch: true },
  { t: 90.1, img: 'empty', zoom: true },
  { t: 103.16, kind: 'static' },
  { t: 104.4, img: 'empty', dark: true },
  { t: 106.19, img: 'sleigh' },
  { t: 114.17, img: 'hall', clock: [21, 4] },
  { t: 123.35, kind: 'montage' },
  { t: 134.57, kind: 'title' }
];
var BEATS = [
  { img: 'clock', clock: [22, 0] }, { img: 'lantern', clock: [23, 0] }, { img: 'sleigh', clock: [23, 30] },
  { img: 'hall', clock: [23, 50] }, { img: 'moon', clock: [23, 59] }
];

function pad(n) { return (n < 10 ? '0' : '') + n; }
function clockText(h, m, s) {
  var ap = h >= 12 ? 'PM' : 'AM', hh = h % 12 || 12;
  return hh + ':' + pad(m) + ':' + pad(s) + ' ' + ap;
}

function vhsHTML(extraClass) {
  return '<div class="vhs ' + (extraClass || '') + '">' +
    '<div class="vhs-img"><img class="a" alt=""><img class="b" alt=""></div>' +
    '<div class="vhs-montage"></div><div class="vhs-title"><span>WHO STOLE</span><b>SANTA?</b><small>A CHRISTMAS EVE MYSTERY</small></div>' +
    '<div class="vhs-blue"><b>PLAY ►</b></div>' +
    '<canvas class="vhs-noise" width="160" height="90"></canvas><div class="vhs-lines"></div><div class="vhs-vig"></div>' +
    '<div class="osd tl">PLAY ►</div><div class="osd tr"><i class="rec"></i>REC</div>' +
    '<div class="osd bl"><span class="date">DEC 24 1996</span><span class="clock"></span></div><div class="osd br">SP</div>' +
    '<div class="vhs-cap"></div></div>';
}

function Player(root, opts) {
  this.root = root; this.opts = opts || {};
  this.imgs = [root.querySelector('.vhs-img .a'), root.querySelector('.vhs-img .b')];
  this.front = 0; this.noiseLevel = 0.07; this.raf = 0; this.dead = false;
  this.cv = root.querySelector('.vhs-noise'); this.cx = this.cv.getContext('2d');
  this.clockEl = root.querySelector('.clock');
  var self = this;
  this.imgs.forEach(function (im) { im.onerror = function () { im.style.visibility = 'hidden'; }; });
  (function loop() { if (self.dead) return; self.noise(); self.raf = requestAnimationFrame(loop); })();
}
Player.prototype.noise = function () {
  var c = this.cx, d = c.createImageData(160, 90), a = d.data;
  for (var i = 0; i < a.length; i += 4) { var v = Math.random() * 255; a[i] = a[i + 1] = a[i + 2] = v; a[i + 3] = 255; }
  c.putImageData(d, 0, 0);
  this.cv.style.opacity = this.noiseLevel;
};
Player.prototype.show = function (shot) {
  var r = this.root;
  r.classList.remove('k-blue', 'k-static', 'k-montage', 'k-title', 'dark');
  this.noiseLevel = 0.07;
  if (shot.kind === 'blue') { r.classList.add('k-blue'); return; }
  if (shot.kind === 'static') { r.classList.add('k-static'); this.noiseLevel = 0.9; return; }
  if (shot.kind === 'title') { r.classList.add('k-title'); return; }
  if (shot.kind === 'montage') { r.classList.add('k-montage'); this.montage(); return; }
  if (shot.dark) r.classList.add('dark');
  var next = this.imgs[1 - this.front], cur = this.imgs[this.front];
  next.style.visibility = 'visible';
  next.src = scene(shot.img);
  var dirs = ['kb1', 'kb2', 'kb3', 'kb4'];
  next.className = (this.front ? 'a' : 'b') + ' on ' + (shot.zoom ? 'kbz' : dirs[Math.floor(Math.random() * 4)]);
  cur.className = (this.front ? 'b' : 'a');
  this.front = 1 - this.front;
  if (shot.glitch) this.glitch();
};
Player.prototype.glitch = function () {
  var r = this.root, self = this;
  r.classList.add('glitch'); this.noiseLevel = 0.5;
  setTimeout(function () { r.classList.remove('glitch'); self.noiseLevel = 0.07; }, 700);
};
Player.prototype.montage = function () {
  var m = this.root.querySelector('.vhs-montage');
  var ids = (root.WSS ? root.WSS.CAST_ORDER : []);
  m.innerHTML = ids.map(function (id, i) {
    var x = 8 + (i % 5) * 18 + (Math.random() * 6 - 3), y = 6 + Math.floor(i / 5) * 30 + (Math.random() * 6 - 3);
    return '<img src="' + charImg(id) + '" onerror="this.remove()" style="left:' + x + '%;top:' + y + '%;transform:rotate(' + (Math.random() * 16 - 8).toFixed(1) + 'deg);animation-delay:' + (i * 0.7).toFixed(1) + 's">';
  }).join('');
};
Player.prototype.caption = function (t) { this.root.querySelector('.vhs-cap').textContent = t || ''; this.root.querySelector('.vhs-cap').style.opacity = t ? 1 : 0; };
Player.prototype.clock = function (h, m, s) { this.clockEl.textContent = clockText(h, m, s); };
Player.prototype.destroy = function () { this.dead = true; cancelAnimationFrame(this.raf); };

var current = null;
function stopAll() {
  if (current) { try { current.audio.pause(); } catch (e) {} current.player.destroy(); clearInterval(current.timer); current = null; }
}

// full opening movie in a container element
function playOpening(box, lines, onDone) {
  stopAll();
  box.innerHTML = vhsHTML('big');
  var p = new Player(box.querySelector('.vhs'));
  var audio = new Audio(AUD + 'opening.mp3'); audio.preload = 'auto';
  var shotIdx = -1, lineIdx = -1, base = [20, 0], baseAt = 0;
  var useClock = false, t0 = Date.now(), seekBase = 0;
  function now() { return useClock ? seekBase + (Date.now() - t0) / 1000 : (audio.currentTime || 0); }
  current = { audio: audio, player: p };
  var lastT = -1, lastMove = Date.now();
  function tick() {
    var t = now();
    if (!useClock) { if (t !== lastT) { lastT = t; lastMove = Date.now(); } else if (Date.now() - lastMove > 2500 && !audio.ended) fallback(); }
    if (useClock && t > 143.5) { stopAll(); onDone && onDone(); return; }
    var si = 0; for (var i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i].t) si = i;
    if (si !== shotIdx) { shotIdx = si; var sh = SHOTS[si]; if (sh.clock) { base = sh.clock; baseAt = t; } p.show(sh); }
    var li = -1; for (i = 0; i < LINES.length; i++) if (t >= LINES[i][0] && t <= LINES[i][0] + LINES[i][1] + 0.4) li = i;
    var cap = '';
    if (li >= 0) {
      var parts = lines[li].match(/[^.!?]+[.!?]+["']?\s*/g) || [lines[li]], total = lines[li].length, frac = (t - LINES[li][0]) / LINES[li][1], acc = 0;
      for (var k = 0; k < parts.length; k++) { acc += parts[k].length / total; cap = parts[k].trim(); if (frac < acc) break; }
    }
    if (cap !== lineIdx) { lineIdx = cap; p.caption(cap); }
    var el = Math.max(0, Math.floor(t - baseAt)), mm = base[1] + Math.floor(el / 60), ss = el % 60;
    p.clock(base[0] + Math.floor(mm / 60), mm % 60, ss);
  }
  current.timer = setInterval(tick, 100);
  current.seek = function (t) { if (useClock) { seekBase = t; t0 = Date.now(); } else audio.currentTime = t; };
  root.__movie = current;
  tick();
  audio.onended = function () { setTimeout(function () { stopAll(); onDone && onDone(); }, 600); };
  function fallback() {
    if (useClock) return;
    useClock = true; seekBase = audio.currentTime || 0; t0 = Date.now();
    var b = document.createElement('button'); b.className = 'tapsound'; b.textContent = '🔇 Tap for sound';
    b.onclick = function () { var t = now(); audio.currentTime = t; var q = audio.play(); if (q && q.then) q.then(function () { useClock = false; b.remove(); }).catch(function () {}); };
    box.querySelector('.vhs').appendChild(b);
  }
  var pr = audio.play(); if (pr && pr.catch) pr.catch(fallback);
  return audio;
}

// a round beat: still shot with narration
function playBeat(box, i, text, audioName) {
  stopAll();
  var b = BEATS[i];
  box.innerHTML = vhsHTML('');
  var p = new Player(box.querySelector('.vhs'));
  p.show({ img: b.img, zoom: i === 4 });
  p.clock(b.clock[0], b.clock[1], 0);
  p.caption('');
  var audio = new Audio(AUD + (audioName || ('beat' + (i + 1))) + '.mp3');
  current = { audio: audio, player: p };
  var start = Date.now();
  current.timer = setInterval(function () { var s = Math.floor((Date.now() - start) / 1000); p.clock(b.clock[0] + Math.floor((b.clock[1] + Math.floor(s / 60)) / 60), (b.clock[1] + Math.floor(s / 60)) % 60, s % 60); }, 500);
  var pr = audio.play(); if (pr && pr.catch) pr.catch(function () {});
  return audio;
}

// a still (no sound) for player screens
function stillHTML(i) {
  var b = BEATS[i];
  return '<div class="vhs still"><div class="vhs-img"><img class="a on kb1" src="' + scene(b.img) + '" alt="" onerror="this.style.visibility=\'hidden\'"></div>' +
    '<div class="vhs-lines"></div><div class="vhs-vig"></div><div class="osd tr"><i class="rec"></i>REC</div>' +
    '<div class="osd bl"><span class="date">DEC 24 1996</span><span class="clock">' + clockText(b.clock[0], b.clock[1], 0) + '</span></div></div>';
}

root.Movie = { playOpening: playOpening, playBeat: playBeat, stillHTML: stillHTML, stop: stopAll,
               scene: scene, charImg: charImg, evImg: evImg, vhsHTML: vhsHTML };
})(this);
