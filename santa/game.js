/* Who Stole Santa? — game data and logic.
   Every device rebuilds the same game from the game code, so no server is needed. */
(function (root) {
'use strict';

var LOC = {
  W: { name: 'Toy Workshop', short: 'Workshop', emoji: '🔩',
       desc: 'Long wooden benches, the whir of tiny drills, sawdust on every surface and a mountain of half-painted toys.' },
  K: { name: 'Cookie Kitchen', short: 'Kitchen', emoji: '🍪',
       desc: 'Three ovens going at once, flour in the air like snow, and trays of gingerbread cooling on every windowsill.' },
  S: { name: 'Reindeer Stables', short: 'Stables', emoji: '🌾',
       desc: 'Warm and smelling of hay, with harness bells on hooks and a big barrel of carrots by the door. It is across the snowy yard.' },
  R: { name: 'Wrapping Room', short: 'Wrapping Room', emoji: '🎁',
       desc: 'Rolls of shiny paper taller than an elf, ribbon everywhere and the snip-snip of scissors that never stops.' }
};
var FEET = {
  B: { name: 'boots', emoji: '🥾' },
  L: { name: 'slippers', emoji: '🥿' }
};
var POCKET = {
  C: { name: 'a candy cane', short: 'Candy cane', emoji: '🍬' },
  J: { name: 'a jingle bell', short: 'Jingle bell', emoji: '🔔' },
  G: { name: 'a golden key', short: 'Golden key', emoji: '🔑' },
  T: { name: 'a carrot', short: 'Carrot', emoji: '🥕' }
};

var CHARS = [
  { id: 'holly', name: 'Holly Sprigsworth', job: 'Head Elf', emoji: '📋', loc: 'W', feet: 'B', pocket: 'G',
    pers: 'Bossy, and never without her clipboard.',
    secret: 'You lost the Nice List for ten whole minutes tonight. Nobody can find out.',
    secretG: 'You secretly applied for Santa\'s job last year. If that comes out tonight, it looks very bad.',
    why: 'I wanted to prove the North Pole could run without Santa, just once', hide: 'in the supply closet, holding a clipboard' },
  { id: 'tinsel', name: 'Tinsel McTwinkle', job: 'Toy Tester', emoji: '🪀', loc: 'W', feet: 'L', pocket: 'J',
    pers: 'Bouncy, and talks way too fast.',
    secret: 'You broke a toy robot today and hid it under your bed.',
    secretG: 'You "borrowed" Santa\'s spare hat to try it on. It is in your locker right now.',
    why: 'I needed Santa to test-ride the new rocket sled before anyone else', hide: 'in the Toy Testing Room, wearing a helmet' },
  { id: 'sprocket', name: 'Sprocket Tinkerton', job: 'Gadget Inventor', emoji: '⚙️', loc: 'W', feet: 'B', pocket: 'J',
    pers: 'Explains everything with diagrams.',
    secret: 'Your robot elf ran away this afternoon and you have not told anyone.',
    secretG: 'Your runaway robot elf looks a lot like a small Santa from behind. Awkward.',
    why: 'I was building a robot Santa and needed real measurements', hide: 'in the Gadget Lab, covered in tape measures' },
  { id: 'dot', name: 'Dot Paintwell', job: 'Toy Painter', emoji: '🎨', loc: 'W', feet: 'L', pocket: 'C',
    pers: 'Dreamy, with paint on everything.',
    secret: 'You painted a rocking horse purple by mistake and hid it behind the others.',
    secretG: 'You painted a portrait of yourself dressed as Santa. Nobody can ever see it.',
    why: 'I was painting Santa\'s portrait and needed him to sit still', hide: 'in the Art Studio, posing by the window' },
  { id: 'ginger', name: 'Ginger Snapwell', job: 'Cookie Baker', emoji: '🧁', loc: 'K', feet: 'L', pocket: 'C',
    pers: 'Proud, and very competitive.',
    secret: 'You ate Santa\'s cookies. Every single one.',
    secretG: 'You ate Santa\'s cookies, all of them, and there are still crumbs on your sleeve.',
    why: 'I wanted Santa to taste my new cookie before anyone else', hide: 'in the walk-in pantry, mouth full' },
  { id: 'cocoa', name: 'Cocoa Mallowby', job: 'Hot Cocoa Maker', emoji: '☕', loc: 'K', feet: 'B', pocket: 'J',
    pers: 'Cozy, and calls everyone "sweetie".',
    secret: 'You ran out of marshmallows and used cotton balls on one mug. Oops.',
    secretG: 'You put a sleepy-time herb in one cocoa tonight, and you cannot remember whose mug.',
    why: 'I thought Santa looked tired, so I tucked him in for a nap', hide: 'in the cocoa nook, under a blanket' },
  { id: 'mrsclaus', name: 'Mrs. Claus', job: 'Runs the North Pole', emoji: '👵', loc: 'K', feet: 'L', pocket: 'G',
    pers: 'Warm, and knows everyone\'s business.',
    secret: 'You already peeked at your Christmas present.',
    secretG: 'You swapped Santa\'s cookies for a salad this year. He does not know yet.',
    why: 'I planned one quiet surprise date before the busiest night of the year', hide: 'on the rooftop, sharing cocoa under the stars' },
  { id: 'buck', name: 'Buck Hollowhoof', job: 'Reindeer Trainer', emoji: '🦌', loc: 'S', feet: 'B', pocket: 'T',
    pers: 'Loud, and loves his reindeer more than anything.',
    secret: 'You let the reindeer take a nap when they should have been practicing.',
    secretG: 'You let one reindeer take the sleigh for a joyride at 8:15. Nobody saw. You hope.',
    why: 'the reindeer wanted to say a proper goodbye before the big flight', hide: 'in the hayloft, surrounded by reindeer' },
  { id: 'nell', name: 'Nell Snowdrift', job: 'Sleigh Mechanic', emoji: '🔧', loc: 'S', feet: 'B', pocket: 'G',
    pers: 'Grease on her nose, and very few words.',
    secret: 'The sleigh brakes still squeak and you did not fix them.',
    secretG: 'You have a spare key to Santa\'s study that nobody knows about.',
    why: 'I needed Santa to sit in the sleigh for one last brake test', hide: 'in the sleigh garage, buckled in' },
  { id: 'frost', name: 'Frost Featherby', job: 'Letter Carrier', emoji: '✉️', loc: 'S', feet: 'L', pocket: 'T',
    pers: 'Nervous, and always carrying a mail sack.',
    secret: 'You lost one letter to Santa and you have been searching for it all day.',
    secretG: 'You have been reading other people\'s letters to Santa. Just a few. Okay, a lot.',
    why: 'I found a lost letter and Santa had to read it before he left', hide: 'in the Mail Room, reading by candlelight' },
  { id: 'juniper', name: 'Juniper Starlight', job: 'Sleigh Navigator', emoji: '🧭', loc: 'S', feet: 'L', pocket: 'J',
    pers: 'Calm, and always staring at the sky.',
    secret: 'You got lost on the practice flight last week.',
    secretG: 'You have been planning to quit and fly south for the winter.',
    why: 'I discovered a shortcut and needed Santa to check the map', hide: 'in the Map Tower, looking through a telescope' },
  { id: 'ribbon', name: 'Ribbon Lacewell', job: 'Head Wrapper', emoji: '🎀', loc: 'R', feet: 'L', pocket: 'J',
    pers: 'A perfectionist who ties bows on everything.',
    secret: 'You wrapped the cat by accident. It is fine. The cat is fine.',
    secretG: 'You wrapped something Santa-shaped this afternoon. It was a pillow. Probably.',
    why: 'Santa never gets a present, so I wrapped one for him', hide: 'inside a giant gift box with a bow on top' },
  { id: 'pip', name: 'Pip Tagsworth', job: 'Gift Tag Writer', emoji: '🏷️', loc: 'R', feet: 'B', pocket: 'C',
    pers: 'Chatty, and writes notes on everything.',
    secret: 'You spelled "Christmas" wrong on 200 gift tags.',
    secretG: 'You copied Santa\'s signature on 300 tags to save time.',
    why: 'I wanted Santa to sign every single gift tag himself', hide: 'in the Tag Room, signing tag number 1,000' },
  { id: 'grandpa', name: 'Grandpa Gumdrop', job: 'Retired Elf', emoji: '🧓', loc: 'R', feet: 'L', pocket: 'T',
    pers: 'Sleepy, and tells very long stories.',
    secret: 'You napped through your whole shift.',
    secretG: 'You were the last one to talk to Santa tonight, and you have not told anyone.',
    why: 'I wanted to hear Santa\'s old stories one more time', hide: 'in the rocking chair by the old fireplace' }
];
var CAST_ORDER = ['holly', 'ginger', 'buck', 'ribbon', 'tinsel', 'cocoa', 'nell', 'pip',
                  'sprocket', 'mrsclaus', 'frost', 'grandpa', 'dot', 'juniper'];
var BY_ID = {};
CHARS.forEach(function (c) { BY_ID[c.id] = c; });

var MISSIONS = [
  'Get two different people to accuse the same innocent person.',
  'Make someone laugh while you stay completely in character.',
  'Get someone to show you what is in their pocket.',
  'Start a rumor that Mrs. Claus knows more than she is saying.',
  'Get three people to tell you where they were at 8:30.',
  'Say the word "suspicious" five times without anyone noticing.',
  'Convince someone to change who they suspect.',
  'Get someone to say the word "jingle".',
  'Make a toast to Santa and get everyone to raise a glass.',
  'Find out someone else\'s secret.',
  'Accuse yourself dramatically, then take it back.',
  'Get someone to describe their shoes in detail.',
  'Sing one line of a Christmas song when nobody asked.',
  'Get someone to defend themselves for a full minute.'
];

var TRAITS = ['loc', 'feet', 'pocket'];

var EVIDENCE = {
  loc: {
    W: { f: 'Sawdust and a tiny screw on Santa\'s armchair. The thief came from the Toy Workshop.',
         g: 'Curls of wood on the cushion, and a screw that fell loose. The thief came from where toys are put together.' },
    K: { f: 'Flour and cookie crumbs on Santa\'s armchair. The thief came from the Cookie Kitchen.',
         g: 'A dusting of white on the red velvet, and it is not snow. Something was baking where the thief just was.' },
    S: { f: 'Hay on Santa\'s armchair. The thief came from the Reindeer Stables.',
         g: 'Dry golden straw on the seat. Someone came from where the sleigh team sleeps.' },
    R: { f: 'Shiny scraps of wrapping paper on the armchair. The thief came from the Wrapping Room.',
         g: 'Glittering scraps, cut neat and square. The thief had been making things look like something else.' }
  },
  feet: {
    B: { f: 'Big, wet boot prints by the back door. The thief wears boots.',
         g: 'Melting snow in heavy treads by the back door. Whoever left was dressed for outside.' },
    L: { f: 'Soft slipper scuffs on the rug, and no boot prints anywhere. The thief wears slippers.',
         g: 'Not one wet footprint, only fuzz on the rug. The thief never planned to go outside.' }
  },
  pocket: {
    C: { f: 'A candy cane wrapper under the armchair. The thief has a candy cane.',
         g: 'Red and white plastic, crinkled and sticky. Someone has a sweet tooth and a hook-shaped snack.' },
    J: { f: 'A jingle bell rolled under the sofa. The thief has a jingle bell.',
         g: 'One tiny chime under the sofa. Someone could not sneak in silence.' },
    G: { f: 'Santa\'s study door was opened with a golden key. The thief has a golden key.',
         g: 'The study lock was not broken. It was opened. Only a few people carry gold in their pocket.' },
    T: { f: 'A half-eaten carrot on the windowsill. The thief has a carrot.',
         g: 'Something orange was nibbled and left behind. Snack or reindeer treat? The thief carried one.' }
  }
};

var STORY = {
  opening: [
    'It\'s Christmas Eve at the North Pole, and the snow is falling so thick you can\'t see the stars.',
    'Inside the Toy Workshop, the last wooden trains are getting their final coat of red paint. The Cookie Kitchen smells like gingerbread and warm cinnamon. Out in the Reindeer Stables, the reindeer stamp their hooves and shake their harnesses, ready to fly. And in the Wrapping Room, the very last bow is being tied on the very last present.',
    'The sleigh is packed so full that its runners creak. The big clock in the Great Hall says eight o\'clock. Four hours until midnight.',
    'Santa settles into his big red armchair by the crackling fire. He slides his glasses down his nose, unrolls the Nice List, all forty feet of it, and starts checking it one last time. He hums "Jingle Bells" under his breath. Every few names, he chuckles.',
    'For the next hour, everyone is busy. Elves hurry up and down the halls. Doors open and close. Somewhere a bell jingles. Somewhere a door creaks. Nobody looks up.',
    'At nine o\'clock, Mrs. Claus carries in a steaming mug of hot cocoa with three marshmallows, just the way Santa likes it.',
    'The armchair is empty.',
    'Santa\'s hat is lying on the cushion. The Nice List is unrolled across the floor, all the way to the back door. The fire is still crackling. His glasses are still warm.',
    'Santa is gone.',
    'The sleigh leaves at midnight. No Santa means no sleigh ride. And no sleigh ride means... no Christmas.',
    'Mrs. Claus rings the big brass bell, and every worker at the North Pole comes running into the Great Hall. That\'s you.',
    'Every one of you was somewhere between eight and nine. Every one of you says you didn\'t do it. But one of you is fibbing. One of you knows exactly where Santa is.',
    'Find the thief. Find Santa. Save Christmas.'
  ],
  beats: [
    { time: '10:00 PM', title: 'The search begins',
      text: 'The clock in the Great Hall strikes ten. Two hours left. The elves search Santa\'s study from top to bottom, and someone finds the first clue the thief left behind...' },
    { time: '11:00 PM', title: 'The trail',
      text: 'Eleven o\'clock. The reindeer are restless and the elves are whispering. Mrs. Claus searches every corner of the Great Hall with a lantern, and she finds something new...' },
    { time: '11:30 PM', title: 'The last clue',
      text: 'Thirty minutes to midnight. Sleigh bells are ringing out in the launch yard. There\'s time for one last clue. Look closely. The thief is standing right here in this room.' },
    { time: '11:50 PM', title: 'Name the thief',
      text: 'Ten minutes to midnight. The reindeer are buckled in. The sleigh is waiting. It\'s time to name the thief.' },
    { time: 'Midnight', title: 'The reveal',
      text: 'The clock begins to strike twelve. Everyone turns to look. The thief slowly stands up...' }
  ],
  ending: 'Santa brushes off his coat, picks up his hat and climbs into the sleigh. The reindeer leap into the sky as the clock strikes twelve. Christmas is saved, thanks to all of you.'
};

var PASS_PICS = ['🎄', '⛄', '🦌', '🍪', '🎁', '🔔', '⭐', '🧦', '🕯️'];
var PASS_WORDS = ['JINGLE', 'TINSEL', 'COCOA', 'SLEIGH', 'HOLLY', 'SNOWMAN', 'MITTEN', 'CANDLE',
                  'PUDDING', 'GARLAND', 'NUTMEG', 'FROSTY', 'ICICLE', 'REINDEER', 'SPRINKLE', 'TWINKLE'];

/* ---------- random numbers (same on every device) ---------- */
function rng(seed) {
  var a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    var t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function mix(seed, salt) { return (Math.imul(seed ^ 0x9E3779B9, 2654435761) + Math.imul(salt + 1, 40503)) >>> 0; }
function shuffle(arr, r) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
function pick(arr, r) { return arr[Math.floor(r() * arr.length)]; }

/* ---------- game code: 8 characters, no 0/O/1/I ---------- */
var ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
// layout (40 bits): seed 16 | mode 1 | count 4 | secret mask 14 | check 5
function checksum(bits) {
  var c = 0;
  for (var i = 0; i < 35; i++) if (bits[i]) c += (2 * i + 1) * (i % 5 + 3);
  return c % 32;
}
function encode(g) {
  var mask = 0;
  for (var i = 0; i < g.count; i++) if (g.keep[i]) mask |= (1 << i);
  var bits = [], b;
  var seed = g.seed & 0xFFFF;
  for (b = 15; b >= 0; b--) bits.push((seed >> b) & 1);
  bits.push(g.mode === 'g' ? 1 : 0);
  for (b = 3; b >= 0; b--) bits.push((g.count >> b) & 1);
  for (b = 13; b >= 0; b--) bits.push((mask >> b) & 1);
  var c = checksum(bits);
  for (b = 4; b >= 0; b--) bits.push((c >> b) & 1);
  var out = '';
  for (var k = 0; k < 40; k += 5) {
    var v = 0; for (var m = 0; m < 5; m++) v = v * 2 + bits[k + m];
    out += ALPHA[v];
  }
  return out;
}
function decode(code) {
  code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (code.length !== 8) return null;
  var bits = [], i, b;
  for (i = 0; i < 8; i++) {
    var v = ALPHA.indexOf(code[i]); if (v < 0) return null;
    for (b = 4; b >= 0; b--) bits.push((v >> b) & 1);
  }
  var c = 0; for (b = 35; b < 40; b++) c = c * 2 + bits[b];
  if (c !== checksum(bits)) return null;
  var seed = 0; for (b = 0; b < 16; b++) seed = seed * 2 + bits[b];
  var mode = bits[16] ? 'g' : 'f';
  var count = 0; for (b = 17; b < 21; b++) count = count * 2 + bits[b];
  var mask = 0; for (b = 21; b < 35; b++) mask = mask * 2 + bits[b];
  if (count < 4 || count > 14 || mask >> count) return null;
  var keep = []; for (i = 0; i < count; i++) keep.push(!!(mask & (1 << i)));
  if (!keep.some(Boolean)) return null;
  return { seed: seed, mode: mode, count: count, keep: keep };
}
function prettyCode(c) { return c.slice(0, 4) + '-' + c.slice(4); }

/* ---------- build the whole game from the setup ---------- */
function build(setup) {
  var n = setup.count, mode = setup.mode, seed = setup.seed;
  var castIds = CAST_ORDER.slice(0, n);
  var r = rng(mix(seed, 1));
  var chars = shuffle(castIds, r);                      // chars[playerIndex] = character id
  var eligible = [];
  for (var i = 0; i < n; i++) if (setup.keep[i]) eligible.push(i);
  var thief = pick(eligible, rng(mix(seed, 2)));
  var T = BY_ID[chars[thief]];

  // evidence order: keep as many suspects in play as long as possible
  var perms = [['loc','feet','pocket'],['loc','pocket','feet'],['feet','loc','pocket'],
               ['feet','pocket','loc'],['pocket','loc','feet'],['pocket','feet','loc']];
  var r3 = rng(mix(seed, 3));
  var scored = perms.map(function (p) {
    var after1 = chars.filter(function (id) { return BY_ID[id][p[0]] === T[p[0]]; }).length;
    var after2 = chars.filter(function (id) { var c = BY_ID[id]; return c[p[0]] === T[p[0]] && c[p[1]] === T[p[1]]; }).length;
    return { p: p, s: after1 * 100 + after2 * 10 + r3() };
  }).sort(function (a, b) { return b.s - a.s; });
  var order = scored[0].p;

  // suspects left after each round
  var left = [];
  for (var rd = 0; rd < 3; rd++) {
    left.push(chars.map(function (id, idx) { return idx; }).filter(function (idx) {
      var c = BY_ID[chars[idx]];
      for (var k = 0; k <= rd; k++) if (c[order[k]] !== T[order[k]]) return false;
      return true;
    }));
  }

  // witness tips: tips[round][player] = { target, decoy? }
  var need = mode === 'f' ? 2 : 1;
  var tips = [];
  for (rd = 0; rd < 3; rd++) {
    var rr = rng(mix(seed, 10 + rd));
    var others = shuffle(chars.map(function (_, idx) { return idx; }).filter(function (idx) { return idx !== thief; }), rr);
    var t = [];
    others.forEach(function (p, k) {
      var target;
      if (k < Math.min(need, others.length)) target = thief;
      else {
        var pool = chars.map(function (_, idx) { return idx; }).filter(function (idx) { return idx !== p && idx !== thief; });
        target = pool.length ? pick(pool, rr) : thief;
      }
      t[p] = { target: target };
    });
    var tpool = chars.map(function (_, idx) { return idx; }).filter(function (idx) { return idx !== thief; });
    t[thief] = { target: pick(tpool, rr) };
    if (mode === 'g') { // partial tips: two names, one of them is the true one
      for (var p = 0; p < n; p++) {
        var dpool = chars.map(function (_, idx) { return idx; }).filter(function (idx) { return idx !== p && idx !== t[p].target; });
        var d = pick(dpool, rr);
        t[p].decoy = d;
        t[p].decoyFirst = rr() < 0.5;
      }
    }
    tips.push(t);
  }

  // thief's cover story
  var rc = rng(mix(seed, 20));
  var otherLocs = chars.filter(function (id, idx) { return idx !== thief && BY_ID[id].loc !== T.loc; })
                       .map(function (id) { return BY_ID[id].loc; });
  var cover = { loc: otherLocs.length ? pick(otherLocs, rc) : pick(['W','K','S','R'].filter(function (l) { return l !== T.loc; }), rc) };
  if (mode === 'g') {
    cover.feet = T.feet === 'B' ? 'L' : 'B';
    var otherPockets = chars.filter(function (id, idx) { return idx !== thief && BY_ID[id].pocket !== T.pocket; })
                            .map(function (id) { return BY_ID[id].pocket; });
    cover.pocket = otherPockets.length ? pick(otherPockets, rc) : pick(['C','J','G','T'].filter(function (x) { return x !== T.pocket; }), rc);
  }

  // mischief missions (grown-ups)
  var missions = shuffle(MISSIONS, rng(mix(seed, 30))).slice(0, n);

  // elf passwords for stages 1..5 (round 1, round 2, round 3, accuse, reveal)
  var rp = rng(mix(seed, 40));
  var pics = shuffle(PASS_PICS, rp).slice(0, 5);
  var words = shuffle(PASS_WORDS, rp).slice(0, 5);

  return { setup: setup, chars: chars, thief: thief, order: order, left: left, tips: tips,
           cover: cover, missions: missions, pics: pics, words: words };
}

function traitText(trait, value) {
  if (trait === 'loc') return LOC[value].name;
  if (trait === 'feet') return FEET[value].name;
  return POCKET[value].name;
}

function tipText(game, round, player, names) {
  var t = game.tips[round][player];
  var trait = game.order[round];
  var who = function (idx) { return BY_ID[game.chars[idx]].name + (names && names[idx] ? ' (' + names[idx] + ')' : ''); };
  var c = BY_ID[game.chars[t.target]];
  if (game.setup.mode === 'f') {
    if (trait === 'loc') return 'At 8:30 you saw ' + who(t.target) + ' in the ' + LOC[c.loc].name + '.';
    if (trait === 'feet') return 'You noticed ' + who(t.target) + ' was wearing ' + FEET[c.feet].name + ' tonight.';
    return 'You saw ' + who(t.target) + ' with ' + POCKET[c.pocket].name + ' in their pocket.';
  }
  var a = who(t.target), b = who(t.decoy);
  var pair = t.decoyFirst ? (b + ' or ' + a) : (a + ' or ' + b);
  if (trait === 'loc') return 'At 8:30 someone went into the ' + LOC[c.loc].name + '. It was either ' + pair + ', but you could not see which.';
  if (trait === 'feet') return 'You heard ' + (c.feet === 'B' ? 'heavy boots' : 'soft slippers') + ' in the hallway. It was either ' + pair + '.';
  return 'Someone dropped ' + POCKET[c.pocket].name + ' and quickly picked it up. It was either ' + pair + '.';
}

var api = { LOC: LOC, FEET: FEET, POCKET: POCKET, CHARS: CHARS, BY_ID: BY_ID, CAST_ORDER: CAST_ORDER,
            EVIDENCE: EVIDENCE, STORY: STORY, TRAITS: TRAITS, PASS_PICS: PASS_PICS,
            encode: encode, decode: decode, prettyCode: prettyCode, build: build,
            tipText: tipText, traitText: traitText, rng: rng };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
else root.WSS = api;
})(this);
