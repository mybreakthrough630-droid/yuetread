(function (root) {
  'use strict';

  function normalize(text, toTraditional = value => value) {
    return toTraditional(String(text)).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  }

  // Align a spoken prefix with the script, tolerating a small number of filler,
  // omitted and misrecognized characters. A band bounds work for long scripts.
  function align(heardText, expectedText, soundFor = () => '') {
    const expected = Array.from(expectedText);
    const heard = Array.from(heardText).slice(0, expected.length + 24);
    if (!heard.length || !expected.length) return { covered: 0, consumed: 0, confidence: 0, exact: 0, utility: 0 };
    let previous = Array.from({ length: expected.length + 1 }, (_, j) => ({ cost: j * 1.1, evidence: 0, exact: 0 }));
    let best = { covered: 0, consumed: 0, confidence: 0, exact: 0, utility: 0 };
    for (let i = 1; i <= heard.length; i++) {
      const row = [];
      row[0] = { cost: i * .85, evidence: 0, exact: 0 };
      for (let j = Math.max(1, i - 24); j <= Math.min(expected.length, i + 12); j++) {
        const exact = heard[i - 1] === expected[j - 1];
        const heardSound = exact ? '' : soundFor(heard[i - 1]);
        const homophone = !exact && heardSound && heardSound === soundFor(expected[j - 1]);
        const diagonal = previous[j - 1];
        const choices = [];
        if (diagonal) choices.push({ cost: diagonal.cost + (exact ? 0 : homophone ? .3 : 1), evidence: diagonal.evidence + (exact ? 1 : homophone ? .75 : 0), exact: diagonal.exact + Number(exact) });
        if (previous[j]) choices.push({ ...previous[j], cost: previous[j].cost + .85 });
        if (row[j - 1]) choices.push({ ...row[j - 1], cost: row[j - 1].cost + 1.1 });
        const cell = choices.sort((a, b) => a.cost - b.cost || b.evidence - a.evidence)[0];
        if (!cell) continue;
        row[j] = cell;
        const utility = cell.evidence * 2 - cell.cost * 1.25;
        const confidence = cell.evidence / Math.max(i, j);
        if (confidence >= .6 && (utility > best.utility || (utility === best.utility && j > best.covered))) {
          best = { covered: j, consumed: i, confidence, exact: cell.exact, utility };
        }
      }
      previous = row;
    }
    return best;
  }

  const api = { normalize, align };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SpeechTracking = api;
})(globalThis);
