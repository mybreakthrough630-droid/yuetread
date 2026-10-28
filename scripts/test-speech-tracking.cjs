const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const tracking = require('../speech-tracking.js');

assert.equal(tracking.normalize(' 大家好，１２３！ '), '大家好123');
assert.equal(tracking.align('大家好歡迎嚟到今日嘅分享', '大家好歡迎嚟到今日嘅分享').covered, 12);
assert.equal(tracking.align('大家好啊歡迎嚟到今日嘅分享', '大家好歡迎嚟到今日嘅分享').covered, 12);
assert.equal(tracking.align('大家好歡迎到今日嘅分享', '大家好歡迎嚟到今日嘅分享').covered, 12);
const sounds = { 喺: 'hai2', 係: 'hai2' };
assert.equal(tracking.align('我係香港生活', '我喺香港生活', char => sounds[char] || '').covered, 6);
const unrelated = tracking.align('今晚想食魚蛋粉', '大家好歡迎嚟到今日嘅分享');
assert.ok(unrelated.covered < 5, 'unrelated speech must not finish a script');

function element() {
  const classes = new Set();
  return {
    hidden: false, value: '', textContent: '', innerHTML: '', disabled: false,
    style: { values: {}, setProperty(key, value) { this.values[key] = value; } }, classList: { add: x => classes.add(x), remove: x => classes.delete(x), contains: x => classes.has(x), toggle() {} },
    querySelector() { return null; }, querySelectorAll() { return []; }, setAttribute() {}, focus() {}
  };
}
const nodes = new Map();
const getNode = selector => { if (!nodes.has(selector)) nodes.set(selector, element()); return nodes.get(selector); };
const timers = [];
class Recognition {
  start() { this.starts = (this.starts || 0) + 1; this.onstart?.(); }
  stop() { this.onend?.(); }
}
const context = vm.createContext({
  console, SpeechTracking: tracking,
  document: { querySelector: getNode, querySelectorAll: () => [], body: element() },
  window: { SpeechRecognition: Recognition, isSecureContext: true },
  screen: { orientation: {} },
  navigator: { userAgent: 'Mozilla/5.0 Android Chrome/138.0 Mobile Safari/537.36', platform: 'Linux', maxTouchPoints: 1 },
  requestAnimationFrame: () => 1, cancelAnimationFrame() {},
  setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; }, clearTimeout() {},
  Map, Date
});
const app = fs.readFileSync(require.resolve('../app.js'), 'utf8').replace(/init\(\);\s*initAuth\(\);\s*$/, '');
vm.runInContext(app, context);
vm.runInContext(`
  state.segments = [
    {id:1, source:'大家好', text:'大家好'},
    {id:2, source:'歡迎嚟到', text:'歡迎來到'},
    {id:3, source:'今日分享', text:'今天分享'}
  ];
  state.listening = true; state.startedAt = Date.now();
  trackSpeech('大家好歡迎嚟到今');
`, context);
assert.equal(vm.runInContext('state.current', context), 2, 'a single event must preserve overflow across sentences');
assert.equal(vm.runInContext('state.matchedChars', context), 1);
vm.runInContext(`navigate(-1); trackSpeech('大家好歡迎嚟到');`, context);
assert.equal(vm.runInContext('state.current', context), 1, 'shrinking interim results must not undo a manual boundary');
assert.equal(vm.runInContext('state.matchedChars', context), 0);
vm.runInContext(`
  resetWordTracking(); state.current = 0; state.recognitionTranscript = '';
  state.recognition = setupRecognition(); state.recognition.start();
`, context);
assert.equal(vm.runInContext('state.recognition.interimResults', context), true);
assert.equal(vm.runInContext('state.recognition.continuous', context), false);
vm.runInContext(`
  state.recognition.onresult({results:[Object.assign([{transcript:'大家好歡迎嚟到',confidence:.9}],{isFinal:true})]});
  state.recognition.onend();
`, context);
assert.equal(vm.runInContext('state.current', context), 2);
assert.equal(timers.at(-1).ms, 120, 'Android reconnect delay must be bounded at 120 ms');
vm.runInContext(`stopListening(false)`, context);
timers.at(-1).fn();
assert.equal(vm.runInContext('state.recognition', context), null, 'a pending restart must not resume after pause');
assert.ok(vm.runInContext(`scoreVoice({name:'Google 普通話',lang:'zh-CN'},'cantonese')`, context) < 0);
assert.ok(vm.runInContext(`scoreVoice({name:'Hong Kong',lang:'zh-Hant-HK'},'cantonese')`, context) > 0);
async function checkReaderMode() {
  vm.runInContext(`window.innerWidth = 768; window.innerHeight = 1024`, context);
  await vm.runInContext(`toggleReaderMode()`, context);
  assert.equal(vm.runInContext('state.readerMode', context), true);
  assert.equal(getNode('#readerModeBtn').textContent, '⤡ 退出橫向');
  await vm.runInContext(`toggleReaderMode()`, context);
  assert.equal(vm.runInContext('state.readerMode', context), false);
  let layoutFrame;
  context.requestAnimationFrame = callback => { layoutFrame = callback; return 1; };
  const units = [0, 0, 80, 80].map(offsetTop => ({ offsetTop, offsetHeight: 52 }));
  getNode('#promptCopy').querySelectorAll = () => units;
  getNode('.prompt-content').clientHeight = 300;
  vm.runInContext('state.matchedChars = 2; setReaderPosition("top")', context); layoutFrame();
  assert.equal(getNode('#promptMirror').style.top, '0px');
  vm.runInContext('setReaderPosition("center")', context); layoutFrame();
  assert.equal(getNode('#promptMirror').style.top, '114px');
  vm.runInContext('setReaderPosition("bottom")', context); layoutFrame();
  assert.equal(getNode('#promptMirror').style.top, '227px');
  assert.equal(getNode('#promptCopy').style.values['--line-shift'], '-80px');
  vm.runInContext('setArticleWidth(60); setMirrorMode("both")', context); layoutFrame();
  assert.equal(getNode('#prompter').style.values['--article-width'], '60%');
  assert.equal(getNode('#readerWidthOutput').textContent, '60%');
  assert.equal(getNode('#promptMirror').style.values['--mirror-x'], -1);
  assert.equal(getNode('#promptMirror').style.values['--mirror-y'], -1);
  console.log('PASS: speech tracking, iPad rotation fallback, active-row top/centre/bottom anchors, width synchronization and mirroring');
}
checkReaderMode().catch(error => { console.error(error); process.exitCode = 1; });
