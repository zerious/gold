var characterMap = {
  2: " '",
  3: "ijlf|!,./:;I[]t\\",
  4: "()-`r{}\"",
  5: "*",
  6: "^1Jcksvxyz",
  8: "&ABEKPSVXY",
  9: "CDHNRUwGOQ",
  10: "Mm",
  11: "%W",
  12: "@"
};

var characterWidths = {};
for (var characterWidth in characterMap) {
  var characterList = characterMap[characterWidth].split('');
  characterList.forEach(function (character) {
    characterWidths[character] = +characterWidth;
  });
}

function getTextWidth(text) {
  var width = 0;
  text.split('').forEach(function (character) {
    width += (characterWidths[character] || 7) * 1.1;
  });
  return width;
}
