/*
var characters = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'.split('');
var widths = '33,43,67,67,107,80,23,40,40,47,70,33,40,33,33,67,59,67,67,67,67,67,67,67,67,33,33,70,70,70,67,122,80,80,87,87,80,73,93,87,33,60,80,67,100,87,93,80,93,87,80,73,87,80,113,80,80,73,33,33,33,56,67,40,67,67,60,67,67,31,67,67,27,27,60,27,100,67,67,67,67,40,60,33,67,60,87,60,60,60,40,31,40,70'.split(',');

var map = {};
widths.forEach(function (width, i) {
  map[width] = (map[width] || '') + characters[i];
});
*/

var characterMap = {
  23: " '",
  27: "ijl",
  31: "f|",
  33: "!,./:;I[]t\\",
  40: "()-`r{}",
  43: '"',
  47: "*",
  56: "^",
  59: "1",
  60: "Jcksvxyz",
  70: "+<=>~",
  73: "FTZ",
  80: "&ABEKPSVXY",
  87: "CDHNRUw",
  93: "GOQ",
  100: "Mm",
  107: "%",
  113: "W",
  122: "@"
};

var characterWidths = {};
for (var characterWidth in characterMap) {
  var characterList = characterMap[characterWidth].split('');
  characterList.forEach(function (character) {
    characterWidths[character] = +characterWidth;
  });
}

function getTextWidth(text, fontSize) {
  var width = 0;
  text.split('').forEach(function (character) {
    width += (characterWidths[character] || 67);
  });
  return Math.round(width / 100 * (fontSize || 12));
}

