const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const phraseMap = new Map([
  ['歡迎嚟到', '歡迎來到'], ['我想同大家講下', '我想和大家談談'], ['點樣可以', '怎樣可以'],
  ['自己嘅', '自己的'], ['最緊要嘅', '最重要的'], ['唔係', '不是'], ['講得', '說得'],
  ['而係', '而是'], ['搵到', '找到'], ['啱自己嘅', '適合自己的'], ['每一句說話', '每一句話'],
  ['更加', '更'], ['喺度', '在這裡'], ['你嘅', '你的'], ['佢哋', '他們'], ['我哋', '我們'],
  ['你哋', '你們'], ['同埋', '以及'], ['因為', '因為'], ['所以', '所以'], ['冇', '沒有'],
  ['唔', '不'], ['嘅', '的'], ['咗', '了'], ['緊', '正在'], ['嚟', '來'], ['講', '說'], ['睇', '看'],
  ['聽日', '明天'], ['尋日', '昨天'], ['今日', '今天'], ['而家', '現在'], ['呢個', '這個'], ['嗰個', '那個'],
  ['邊個', '誰'], ['乜嘢', '什麼'], ['點解', '為什麼'], ['點樣', '怎樣'], ['幾時', '何時'], ['可以畀', '可以讓'],
  ['係咪', '是否'], ['咁樣', '這樣'], ['有啲', '有些'], ['好多', '很多'], ['一齊', '一起'], ['屋企', '家裡'],
  ['即係', '也就是'], ['好似', '好像'], ['做嘢', '工作'], ['食嘢', '吃東西'], ['返嚟', '回來'], ['今次', '這次'],
  ['仲有', '還有'], ['可唔可以', '可不可以'], ['有冇', '有沒有'], ['係唔係', '是不是'], ['使唔使', '需不需要'],
  ['要唔要', '要不要'], ['知唔知', '知不知道'], ['識唔識', '會不會'], ['鍾唔鍾意', '喜不喜歡'],
  ['搞唔掂', '無法完成'], ['唔記得', '忘記'], ['唔知道', '不知道'], ['唔鍾意', '不喜歡'], ['唔需要', '不需要'],
  ['等陣', '稍後'], ['陣間', '稍後'], ['一陣間', '一會兒'], ['即刻', '立刻'], ['依家', '現在'],
  ['朝早', '早上'], ['晏晝', '下午'], ['夜晚', '晚上'], ['返工', '上班'], ['收工', '下班'], ['放工', '下班'],
  ['返學', '上學'], ['揸車', '開車'], ['搭車', '坐車'], ['落車', '下車'], ['行路', '走路'], ['過嚟', '過來'],
  ['幫手', '幫忙'], ['搞掂', '完成'], ['諗住', '打算'], ['諗下', '想一想'], ['諗', '想'], ['記唔記得', '記不記得'],
  ['鍾意', '喜歡'], ['唔該', '請'], ['俾我', '讓我'], ['畀我', '讓我'], ['淨係', '只是'], ['仲要', '還要'],
  ['呢啲', '這些'], ['嗰啲', '那些'], ['呢度', '這裡'], ['嗰度', '那裡'], ['邊度', '哪裡'], ['邊一個', '哪一個'],
  ['幾多', '多少'], ['幾錢', '多少錢'], ['咁多', '這麼多'], ['咁快', '這麼快'], ['咁慢', '這麼慢'],
  ['少少', '一點'], ['一啲', '一些'], ['好攰', '很累'], ['肚餓', '餓了'], ['好嬲', '很生氣'], ['好驚', '很害怕'],
  ['細路', '小孩'], ['靚', '漂亮'], ['飲', '喝'], ['食', '吃'], ['瞓覺', '睡覺'], ['起身', '起床'], ['沖涼', '洗澡'],
  ['咁', '那麼'], ['仲', '還'], ['俾', '讓'], ['畀', '讓'], ['佢', '他'], ['嘢', '東西'], ['喺', '在'], ['係', '是']
]);

const writtenToCantoneseMap = new Map([
  ['歡迎來到', '歡迎嚟到'], ['我想和大家談談', '我想同大家講下'], ['怎樣可以', '點樣可以'],
  ['適合自己的', '啱自己嘅'], ['最重要的', '最緊要嘅'], ['每一句話', '每一句說話'],
  ['也就是', '即係'], ['為什麼', '點解'], ['什麼', '乜嘢'], ['是否', '係咪'], ['這樣', '咁樣'],
  ['有些', '有啲'], ['很多', '好多'], ['一起', '一齊'], ['家裡', '屋企'], ['好像', '好似'],
  ['工作', '做嘢'], ['吃東西', '食嘢'], ['回來', '返嚟'], ['這次', '今次'], ['還有', '仲有'],
  ['明天', '聽日'], ['昨天', '尋日'], ['今天', '今日'], ['現在', '而家'], ['這個', '呢個'], ['那個', '嗰個'],
  ['誰', '邊個'], ['怎樣', '點樣'], ['何時', '幾時'], ['不是', '唔係'], ['而是', '而係'],
  ['找到', '搵到'], ['說得', '講得'], ['沒有', '冇'], ['讓', '畀'], ['的', '嘅'], ['了', '咗'],
  ['可不可以', '可唔可以'], ['有沒有', '有冇'], ['是不是', '係唔係'], ['需不需要', '使唔使'], ['要不要', '要唔要'],
  ['知不知道', '知唔知'], ['會不會', '識唔識'], ['喜不喜歡', '鍾唔鍾意'], ['無法完成', '搞唔掂'], ['忘記', '唔記得'],
  ['不知道', '唔知道'], ['不喜歡', '唔鍾意'], ['不需要', '唔需要'], ['稍後', '等陣'], ['一會兒', '一陣間'],
  ['立刻', '即刻'], ['早上', '朝早'], ['下午', '晏晝'], ['晚上', '夜晚'], ['上班', '返工'], ['下班', '收工'],
  ['上學', '返學'], ['開車', '揸車'], ['坐車', '搭車'], ['下車', '落車'], ['走路', '行路'], ['過來', '過嚟'],
  ['幫忙', '幫手'], ['完成', '搞掂'], ['打算', '諗住'], ['想一想', '諗下'], ['記不記得', '記唔記得'],
  ['喜歡', '鍾意'], ['只是', '淨係'], ['還要', '仲要'], ['這些', '呢啲'], ['那些', '嗰啲'], ['這裡', '呢度'],
  ['那裡', '嗰度'], ['哪裡', '邊度'], ['哪一個', '邊一個'], ['多少錢', '幾錢'], ['多少', '幾多'],
  ['這麼多', '咁多'], ['這麼快', '咁快'], ['這麼慢', '咁慢'], ['一點', '少少'], ['一些', '一啲'],
  ['很累', '好攰'], ['餓了', '肚餓'], ['很生氣', '好嬲'], ['很害怕', '好驚'], ['小孩', '細路'], ['漂亮', '靚'],
  ['喝', '飲'], ['吃', '食'], ['睡覺', '瞓覺'], ['起床', '起身'], ['洗澡', '沖涼'], ['東西', '嘢'],
  ['我們', '我哋'], ['你們', '你哋'], ['他們', '佢哋'], ['但是', '但係'], ['還是', '仲係'], ['非常', '好'], ['他', '佢'], ['在', '喺'], ['是', '係'],
  ['正在', '緊'], ['來', '嚟'], ['說', '講'], ['看', '睇'], ['還', '仲'], ['不', '唔']
]);

const mandarinPinyin = {
  大:'dà',家:'jiā',好:'hǎo',歡:'huān',迎:'yíng',來:'lái',到:'dào',今:'jīn',天:'tiān',的:'de',分:'fēn',享:'xiǎng',這:'zhè',次:'cì',我:'wǒ',想:'xiǎng',和:'hé',同:'tóng',談:'tán',講:'jiǎng',怎:'zěn',樣:'yàng',可:'kě',以:'yǐ',讓:'ràng',令:'lìng',自:'zì',己:'jǐ',表:'biǎo',達:'dá',更:'gèng',加:'jiā',然:'rán',其:'qí',實:'shí',最:'zuì',重:'zhòng',要:'yào',不:'bù',是:'shì',說:'shuō',得:'de',快:'kuài',而:'ér',找:'zhǎo',適:'shì',合:'hé',節:'jié',奏:'zòu',當:'dāng',你:'nǐ',慢:'màn',建:'jiàn',立:'lì',信:'xìn',心:'xīn',每:'měi',一:'yī',句:'jù',話:'huà',都:'dōu',會:'huì',有:'yǒu',力:'lì',量:'liàng',在:'zài',裡:'lǐ',們:'men',他:'tā',她:'tā',現:'xiàn',沒:'méi',看:'kàn',明:'míng',昨:'zuó',為:'wèi',什:'shén',麼:'me',誰:'shéi',時:'shí',也:'yě',就:'jiù',如:'rú',果:'guǒ',那:'nà',麼:'me',還:'hái',回:'huí',工:'gōng',作:'zuò',吃:'chī',東:'dōng',西:'xī'
};

const cantoneseJyutping = {
  大:'daai6',家:'gaa1',好:'hou2',歡:'fun1',迎:'jing4',嚟:'lai4',來:'loi4',到:'dou3',今:'gam1',日:'jat6',天:'tin1',嘅:'ge3',的:'dik1',分:'fan1',享:'hoeng2',次:'ci3',我:'ngo5',想:'soeng2',同:'tung4',和:'wo4',講:'gong2',談:'taam4',下:'haa5',點:'dim2',怎:'zam2',樣:'joeng6',可:'ho2',以:'ji5',畀:'bei2',讓:'joeng6',令:'ling6',自:'zi6',己:'gei2',表:'biu2',達:'daat6',更:'gang3',加:'gaa1',然:'jin4',其:'kei4',實:'sat6',最:'zeoi3',緊:'gan2',重:'zung6',要:'jiu3',唔:'m4',不:'bat1',係:'hai6',是:'si6',說:'syut3',得:'dak1',快:'faai3',而:'ji4',搵:'wan2',找:'zaau2',適:'sik1',合:'hap6',啱:'ngaam1',節:'zit3',奏:'zau3',當:'dong1',你:'nei5',慢:'maan6',建:'gin3',立:'lap6',信:'seon3',心:'sam1',每:'mui5',一:'jat1',句:'geoi3',話:'waa6',都:'dou1',會:'wui5',有:'jau5',力:'lik6',量:'loeng6',喺:'hai2',在:'zoi6',度:'dou6',哋:'dei6',佢:'keoi5',而:'ji4',家:'gaa1',冇:'mou5',咗:'zo2',睇:'tai2',聽:'teng1',尋:'cam4',邊:'bin1',個:'go3',乜:'mat1',嘢:'je5',解:'gaai2',幾:'gei2',時:'si4',仲:'zung6',返:'faan1',屋:'uk1',即:'zik1',似:'ci5',做:'zou6',食:'sik6',齊:'cai4'
};

const state = {
  segments: [], current: 0, listening: false, recognition: null,
  startedAt: 0, heardChars: 0, speed: 0, theme: 'light', position: 'center', frequency: 2,
  fontSize: 42, showNext: true, audioUrl: null,
  matchedChars: 0, matchConfidence: 0, segmentStartAt: 0, lastTranscriptLength: 0,
  pendingAdvance: false, scripts: [], renderedSignature: '', subtitleLanguage: 'cantonese', lineFrame: 0
};

const SCRIPT_LIBRARY_KEY = 'yuetread_scripts_v1';

try {
  if (globalThis.pinyinPro && globalThis.PinyinTraditionalDict) pinyinPro.addTraditionalDict(PinyinTraditionalDict);
  if (globalThis.pinyinPro && globalThis.PinyinModernDict) pinyinPro.addDict(PinyinModernDict, 'modern-chinese');
} catch (error) {
  console.warn('Unable to initialize extended Mandarin dictionaries', error);
}

const simplifiedToTraditionalDict = new Map();
if (globalThis.PinyinTraditionalDict) {
  Object.entries(PinyinTraditionalDict).forEach(([traditional, simplified]) => {
    if (!simplifiedToTraditionalDict.has(simplified)) simplifiedToTraditionalDict.set(simplified, traditional);
  });
}

const simplifiedToTraditionalConverter = globalThis.OpenCC?.Converter
  ? OpenCC.Converter({ from: 'cn', to: 't' })
  : null;

function normalizeToTraditional(text) {
  if (simplifiedToTraditionalConverter) return simplifiedToTraditionalConverter(text);
  return [...text].map(char => simplifiedToTraditionalDict.get(char) || char).join('');
}

function toMandarin(text) {
  let result = text;
  [...phraseMap.entries()].sort((a,b) => b[0].length-a[0].length).forEach(([from,to]) => result = result.split(from).join(to));
  return result
    .replace(/([\u3400-\u9fff])[㗎喇啫咋囉喎嗱嘞吖](?=[，。！？!?]|$)/g, '$1')
    .replace(/呀(?=[，。！？!?]|$)/g, '啊')
    .replace(/啦(?=[，。！？!?]|$)/g, '吧')
    .replace(/([，。！？])\1+/g, '$1')
    .replace(/\s+([，。！？])/g, '$1')
    .trim();
}

function toCantonese(text) {
  let result = normalizeToTraditional(text);
  [...writtenToCantoneseMap.entries()].sort((a,b) => b[0].length-a[0].length).forEach(([from,to]) => result = result.split(from).join(to));
  return result
    .replace(/嗎(?=[，。！？!?]|$)/g, '呀')
    .replace(/吧(?=[，。！？!?]|$)/g, '啦')
    .replace(/([，。！？])\1+/g, '$1')
    .replace(/\s+([，。！？])/g, '$1')
    .trim();
}

function getDisplayText(segment) { return state.subtitleLanguage === 'cantonese' ? segment.source : segment.text; }

function romanizeText(text, language) {
  return getPronunciations(text, language).filter((_, index) => isSpokenChar([...text][index])).join(' ');
}

function pronunciationForChar(char, language = state.subtitleLanguage) {
  const dictionary = language === 'cantonese' ? cantoneseJyutping : mandarinPinyin;
  return dictionary[char] || '·';
}

function getPronunciations(text, language = state.subtitleLanguage) {
  const characters = [...text];
  try {
    if (language === 'cantonese' && globalThis.ToJyutping?.getJyutpingList) {
      const list = ToJyutping.getJyutpingList(text);
      return characters.map((char, index) => isSpokenChar(char) ? (list[index]?.[1] || pronunciationForChar(char, language)) : '');
    }
    if (language === 'mandarin' && globalThis.pinyinPro?.pinyin) {
      const list = pinyinPro.pinyin(text, { type: 'array', toneType: 'symbol', traditional: true });
      return characters.map((char, index) => isSpokenChar(char) ? (list[index] || pronunciationForChar(char, language)) : '');
    }
  } catch (error) {
    console.warn('Pronunciation engine fallback', error);
  }
  return characters.map(char => pronunciationForChar(char, language));
}

function splitSentences(text) {
  const cleaned = text.replace(/\r/g, '').replace(/^\d+\s*\n\d{2}:.*\n/gm, '').replace(/\n{2,}/g, '\n').trim();
  return (cleaned.match(/[^。！？!?\n]+[。！？!?]?/g) || []).map(s => s.trim()).filter(Boolean);
}

function updateWrittenMandarin(showMessage = false) {
  $('#convertedText').value = toMandarin($('#sourceText').value);
  if (showMessage) toast('已生成普通話口稿，你可以繼續修改');
}

function updateCantoneseDraft() {
  const written = $('#convertedText').value.trim();
  if (!written) return toast('請先輸入普通話書面語');
  $('#sourceText').value = toCantonese(written);
  $('#charCount').textContent = $('#sourceText').value.length;
  toast('已生成粵語口語稿，你可以繼續修改');
}

function setSubtitleLanguage(language) {
  if (!['cantonese', 'mandarin'].includes(language) || language === state.subtitleLanguage) return;
  const current = state.segments[state.current];
  const oldLength = current ? [...getDisplayText(current)].filter(isSpokenChar).length : 1;
  const progress = state.matchedChars / Math.max(1, oldLength);
  state.subtitleLanguage = language;
  const newLength = current ? [...getDisplayText(current)].filter(isSpokenChar).length : 0;
  state.matchedChars = Math.round(progress * newLength); state.renderedSignature = '';
  $$('#subtitleLanguage button').forEach(button => button.classList.toggle('active', button.dataset.language === language));
  renderPrompt();
}

function scoreVoice(voice, language) {
  const identity = `${voice.name} ${voice.lang}`;
  if (language === 'mandarin') {
    if (/cantonese|粵語|粤语|yue[-_]|sin[- ]?ji|zh[-_]HK/i.test(identity)) return -1000;
    if (/mandarin|putonghua|普通話|普通话|國語|国语|ting[- ]?ting|huihui|yaoyao|lili|zhiyu/i.test(identity)) return 120;
    if (/^cmn[-_]/i.test(voice.lang)) return 110;
    if (/^zh[-_]CN/i.test(voice.lang)) return 100;
    if (/^zh[-_]TW/i.test(voice.lang)) return 65;
    return /^zh/i.test(voice.lang) ? 20 : -1;
  }
  if (/mandarin|putonghua|普通話|普通话|國語|国语|ting[- ]?ting|cmn[-_]|zh[-_]CN/i.test(identity)) return -1000;
  if (/cantonese|粵語|粤语|sin[- ]?ji|yue[-_]/i.test(identity)) return 120;
  if (/^zh[-_]HK/i.test(voice.lang)) return 100;
  return -1;
}

async function availableSpeechVoices() {
  let voices = window.speechSynthesis.getVoices();
  if (voices.length) return voices;
  await new Promise(resolve => {
    const timer = setTimeout(resolve, 700);
    window.speechSynthesis.addEventListener('voiceschanged', () => { clearTimeout(timer); resolve(); }, { once: true });
  });
  return window.speechSynthesis.getVoices();
}

async function speakCurrent(language) {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return toast('此瀏覽器不支援電腦朗讀');
  const segment = state.segments[state.current];
  if (!segment) return toast('請先生成字幕');
  window.speechSynthesis.cancel();
  const text = language === 'cantonese' ? segment.source : segment.text;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'cantonese' ? 'yue-HK' : 'cmn-CN';
  const voices = await availableSpeechVoices();
  const ranked = voices.map(voice => ({ voice, score: scoreVoice(voice, language) })).filter(item => item.score >= 0).sort((a,b) => b.score-a.score);
  const selectedVoice = ranked[0]?.voice;
  if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
  const button = language === 'cantonese' ? $('#speakCantoneseBtn') : $('#speakMandarinBtn');
  $$('.speech-actions button').forEach(item => item.classList.remove('speaking'));
  button.classList.add('speaking');
  utterance.onstart = () => toast(`${language === 'cantonese' ? '粵語' : '普通話'}朗讀${selectedVoice ? ` · ${selectedVoice.name}` : ''}`);
  utterance.onend = () => button.classList.remove('speaking');
  utterance.onerror = () => { button.classList.remove('speaking'); toast(`${language === 'cantonese' ? '粵語' : '普通話'}朗讀失敗，請檢查系統語音設定`); };
  window.speechSynthesis.speak(utterance);
  window.speechSynthesis.resume();
}

function generateSegments(shouldScroll = true) {
  const text = $('#sourceText').value.trim();
  if (!text) return toast('請先貼上稿件或匯入文字');
  const convert = $('#convertMandarin').checked;
  const writtenLines = splitSentences($('#convertedText').value.trim());
  state.segments = splitSentences(text).map((line, i) => ({ id: Date.now()+i, source: line, text: convert ? (writtenLines[i] || toMandarin(line)) : line }));
  state.current = 0; resetWordTracking();
  renderPrompt(); renderEditor();
  toast(`已生成 ${state.segments.length} 句可編輯字幕`);
  if (shouldScroll) $('#prompterSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderPrompt() {
  const wrap = $('#promptCopy');
  if (!state.segments.length) {
    wrap.innerHTML = '<div class="prompt-line current">準備好之後，你的字幕會在這裡出現。</div>';
    wrap.style.setProperty('--line-shift', '0px');
    state.renderedSignature = '';
    $('#progressBar').style.width = '0%'; return;
  }
  const current = state.segments[state.current];
  const next = state.segments[state.current + 1];
  const currentDisplay = getDisplayText(current), nextDisplay = next ? getDisplayText(next) : '';
  const signature = `${current.id}|${currentDisplay}|${next?.id || ''}|${nextDisplay}|${state.showNext}|${state.subtitleLanguage}`;
  if (state.renderedSignature !== signature) {
    wrap.style.setProperty('--line-shift', '0px');
    wrap.innerHTML = `<div class="prompt-line current segment-enter" aria-label="${escapeHtml(currentDisplay)}">${renderHighlightedText(currentDisplay, state.matchedChars)}</div>${state.showNext && next ? `<div class="prompt-line next">${escapeHtml(nextDisplay)}</div>` : ''}`;
    state.renderedSignature = signature;
  } else {
    updateCharacterStates($('.prompt-line.current', wrap), state.matchedChars);
  }
  const displayLength = Math.max(1, [...currentDisplay].filter(isSpokenChar).length);
  const readingProgress = state.matchedChars / displayLength;
  const nextLine = $('.prompt-line.next', wrap);
  if (nextLine) {
    const readiness = state.listening ? Math.max(.12, Math.min(1, readingProgress)) : .26;
    nextLine.style.opacity = String(.15 + readiness * .48);
    nextLine.style.transform = `translateY(${Math.round(12 - readiness * 12)}px) scale(${.97 + readiness * .03})`;
    nextLine.style.filter = `blur(${Math.max(0, 1.4 - readiness * 1.4)}px)`;
  }
  scheduleActiveLineToTop();
  $('#progressBar').style.width = `${((state.current + 1) / state.segments.length) * 100}%`;
}

function isSpokenChar(char) { return !/[\s，。！？,.!?、：:；;「」『』"'（）()—…]/.test(char); }

function renderHighlightedText(text, matched) {
  let spokenIndex = 0;
  const pronunciations = getPronunciations(text);
  return [...text].map((char, characterIndex) => {
    if (!isSpokenChar(char)) {
      const punctuationState = spokenIndex <= matched && matched > 0 ? 'read' : 'pending';
      return `<span class="prompt-char punctuation ${punctuationState}" data-boundary="${spokenIndex}">${escapeHtml(char)}</span>`;
    }
    const status = spokenIndex < matched ? 'read' : spokenIndex === matched && state.listening ? 'active' : 'pending';
    const index = spokenIndex++;
    return `<ruby class="char-unit"><span class="prompt-char ${status}" data-index="${index}">${escapeHtml(char)}</span><rt>${escapeHtml(pronunciations[characterIndex] || pronunciationForChar(char))}</rt></ruby>`;
  }).join('');
}

function updateCharacterStates(line, matched) {
  if (!line) return;
  $$('.prompt-char', line).forEach(char => {
    const isPunctuation = char.classList.contains('punctuation');
    const index = +(isPunctuation ? char.dataset.boundary : char.dataset.index);
    const status = isPunctuation ? (index <= matched && matched > 0 ? 'read' : 'pending') : (index < matched ? 'read' : index === matched && state.listening ? 'active' : 'pending');
    char.classList.remove('read', 'active', 'pending'); char.classList.add(status);
  });
}

function scheduleActiveLineToTop() {
  cancelAnimationFrame(state.lineFrame);
  state.lineFrame = requestAnimationFrame(() => {
    const wrap = $('#promptCopy');
    const units = $$('.prompt-line.current .char-unit', wrap);
    if (!units.length) return wrap.style.setProperty('--line-shift', '0px');
    const activeIndex = Math.min(state.matchedChars, units.length - 1);
    const firstRowTop = units[0].offsetTop;
    const activeRowTop = units[activeIndex].offsetTop;
    const rowShift = Math.max(0, activeRowTop - firstRowTop);
    wrap.style.setProperty('--line-shift', `${-rowShift}px`);
  });
}

function resetWordTracking() {
  state.matchedChars = 0; state.matchConfidence = 0; state.segmentStartAt = 0;
  state.lastTranscriptLength = 0; state.pendingAdvance = false;
}

function navigate(delta) {
  if (!state.segments.length) return;
  state.current = Math.max(0, Math.min(state.segments.length - 1, state.current + delta));
  state.matchedChars = 0; state.matchConfidence = 0; state.segmentStartAt = state.lastTranscriptLength;
  renderPrompt();
}

function setupRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;
  const recognition = new SpeechRecognition();
  recognition.lang = 'yue-Hant-HK'; recognition.continuous = true; recognition.interimResults = true;
  recognition.onresult = event => {
    let transcript = '';
    for (let i = 0; i < event.results.length; i++) transcript += event.results[i][0].transcript;
    trackSpeech(transcript);
  };
  recognition.onerror = event => {
    if (event.error !== 'aborted') toast(event.error === 'not-allowed' ? '請允許瀏覽器使用麥克風' : '語音辨識暫時中斷');
    stopListening(false);
  };
  recognition.onend = () => { if (state.listening) try { recognition.start(); } catch (_) {} };
  return recognition;
}

function normalize(s) { return s.replace(/[\s，。！？,.!?、：:；;「」『』"']/g, '').toLowerCase(); }
function similarity(a, b) {
  a = normalize(a); b = normalize(b); if (!a || !b) return 0;
  let hits = 0, cursor = 0;
  for (const c of a) { const found = b.indexOf(c, cursor); if (found >= 0) { hits++; cursor = found + 1; } }
  return hits / Math.min(a.length, b.length);
}

function matchReadingProgress(spoken, target) {
  const heard = normalize(spoken), expected = normalize(target);
  if (!heard || !expected) return { covered: 0, confidence: 0 };
  let cursor = 0, matches = 0;
  for (const char of heard) {
    if (cursor >= expected.length) break;
    if (char === expected[cursor]) { cursor++; matches++; continue; }
    const nearby = expected.indexOf(char, cursor + 1);
    if (nearby >= 0 && nearby - cursor <= 3) { cursor = nearby + 1; matches++; }
  }
  return { covered: cursor, confidence: matches / Math.max(1, Math.min(heard.length, cursor)) };
}

function trackSpeech(transcript) {
  if (!state.segments.length || state.pendingAdvance) return;
  const normalizedTranscript = normalize(transcript);
  if (normalizedTranscript.length < state.lastTranscriptLength) state.segmentStartAt = 0;
  const addedChars = normalizedTranscript.length >= state.lastTranscriptLength ? normalizedTranscript.length - state.lastTranscriptLength : normalizedTranscript.length;
  state.heardChars += addedChars;
  state.lastTranscriptLength = normalizedTranscript.length;
  const current = state.segments[state.current];
  const currentSpeech = normalizedTranscript.slice(Math.min(state.segmentStartAt, normalizedTranscript.length));
  const sourceMatch = matchReadingProgress(currentSpeech, current.source);
  const displayMatch = matchReadingProgress(currentSpeech, current.text);
  const sourceProgress = sourceMatch.covered / Math.max(1, normalize(current.source).length);
  const textProgress = displayMatch.covered / Math.max(1, normalize(current.text).length);
  const bestProgress = Math.max(sourceProgress, textProgress);
  const bestConfidence = sourceProgress >= textProgress ? sourceMatch.confidence : displayMatch.confidence;
  const displayLength = [...getDisplayText(current)].filter(isSpokenChar).length;
  state.matchedChars = Math.max(state.matchedChars, Math.min(displayLength, Math.round(bestProgress * displayLength)));
  state.matchConfidence = bestConfidence;
  const threshold = state.frequency === 1 ? 1 : state.frequency === 2 ? .96 : .9;
  if (bestProgress >= threshold && bestConfidence >= .55 && state.current < state.segments.length - 1) {
    state.pendingAdvance = true; state.matchedChars = displayLength; renderPrompt();
    setTimeout(() => {
      state.current++; state.matchedChars = 0; state.matchConfidence = 0;
      state.segmentStartAt = state.lastTranscriptLength; state.pendingAdvance = false; renderPrompt();
    }, 60);
  }
  const mins = Math.max((Date.now() - state.startedAt) / 60000, .05);
  state.speed = Math.min(500, Math.round(state.heardChars / mins));
  $('#speedStat').textContent = `${state.speed} 字/分鐘`;
  $('#trackingStatus').textContent = `跟到 ${state.matchedChars}/${displayLength} 字 · ${Math.round(bestConfidence * 100)}%`;
  renderPrompt();
}

function startListening() {
  if (!state.segments.length) generateSegments();
  if (!state.segments.length) return;
  if (!state.recognition) state.recognition = setupRecognition();
  if (!state.recognition) return toast('此瀏覽器不支援語音辨識，請使用 Chrome 或手動切換字幕');
  state.listening = true; state.startedAt = Date.now(); state.heardChars = 0;
  state.lastTranscriptLength = 0; state.segmentStartAt = 0;
  try { state.recognition.start(); } catch (_) {}
  $('#micBtn').classList.add('listening'); $('#micLabel').textContent = '暫停追蹤';
  $('.live-stats').classList.add('active'); $('#trackingStatus').textContent = '正在跟隨語速';
}

function stopListening(showToast = true) {
  state.listening = false;
  if (state.recognition) try { state.recognition.stop(); } catch (_) {}
  $('#micBtn').classList.remove('listening'); $('#micLabel').textContent = '繼續朗讀';
  $('.live-stats').classList.remove('active'); $('#trackingStatus').textContent = '已暫停';
  if (showToast) toast('進度已保留');
}

function renderEditor() {
  $('#editorList').innerHTML = state.segments.map((seg, i) => `<div class="editor-row" data-id="${seg.id}"><span>${String(i+1).padStart(2,'0')}</span><textarea aria-label="第 ${i+1} 句字幕">${escapeHtml(seg.text)}</textarea><button class="delete-line" aria-label="刪除">×</button></div>`).join('') || '<p class="drawer-copy">尚未生成字幕。你可以先加入稿件，再按「生成字幕」。</p>';
}

function saveEditor() {
  $$('.editor-row').forEach(row => {
    const seg = state.segments.find(s => String(s.id) === row.dataset.id);
    if (seg) seg.text = $('textarea', row).value.trim();
  });
  state.segments = state.segments.filter(s => s.text);
  state.current = Math.min(state.current, Math.max(0, state.segments.length - 1));
  renderPrompt(); closeEditor(); toast('字幕修改已儲存');
}

function openEditor() { renderEditor(); $('#editorDrawer').classList.add('open'); $('#drawerBackdrop').classList.add('open'); $('#editorDrawer').setAttribute('aria-hidden','false'); }
function closeEditor() { $('#editorDrawer').classList.remove('open'); $('#drawerBackdrop').classList.remove('open'); $('#editorDrawer').setAttribute('aria-hidden','true'); }
function escapeHtml(s='') { return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
let toastTimer; function toast(msg) { const el=$('#toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),2500); }

function handleAudio(file) {
  if (!file || !file.type.startsWith('audio/')) return toast('請選擇有效的音訊檔案');
  if (state.audioUrl) URL.revokeObjectURL(state.audioUrl);
  state.audioUrl = URL.createObjectURL(file); $('#audioPlayer').src = state.audioUrl;
  $('#audioName').textContent = file.name; $('#audioSize').textContent = `${(file.size/1024/1024).toFixed(1)} MB`;
  $('#dropzone').hidden = true; $('#audioReady').hidden = false;
}

async function transcribeUploadedAudio() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const player = $('#audioPlayer');
  if (!state.audioUrl) return toast('請先選擇音訊檔案');
  if (!SpeechRecognition || typeof player.captureStream !== 'function') return toast('此瀏覽器未支援音訊檔辨識；可播放音訊並用麥克風擷取');
  const button = $('#audioTranscribeBtn');
  button.disabled = true; button.textContent = '正在辨識…';
  const recognition = new SpeechRecognition();
  recognition.lang = 'yue-Hant-HK'; recognition.continuous = true; recognition.interimResults = false;
  let transcript = '';
  recognition.onresult = event => {
    for (let i = event.resultIndex; i < event.results.length; i++) if (event.results[i].isFinal) transcript += event.results[i][0].transcript + '。';
    $('#sourceText').value = transcript.trim(); $('#sourceText').dispatchEvent(new Event('input'));
  };
  recognition.onerror = () => toast('音訊檔辨識未能啟動，請改用播放＋麥克風模式');
  recognition.onend = () => {
    button.disabled = false; button.textContent = '◎ 從音訊辨識粵語字幕';
    if (transcript.trim()) { generateSegments(); toast('音訊字幕已生成，可隨時修改'); }
  };
  try {
    player.currentTime = 0; await player.play();
    const track = player.captureStream().getAudioTracks()[0];
    if (!track) throw new Error('No audio track');
    recognition.start(track);
    player.onended = () => { try { recognition.stop(); } catch (_) {} };
  } catch (_) {
    player.pause(); button.disabled = false; button.textContent = '◎ 從音訊辨識粵語字幕';
    toast('此瀏覽器未開放音訊軌辨識，請使用播放＋麥克風模式');
  }
}

function loadScriptLibrary() {
  try { state.scripts = JSON.parse(localStorage.getItem(SCRIPT_LIBRARY_KEY) || '[]'); }
  catch (_) { state.scripts = []; }
  if (!Array.isArray(state.scripts)) state.scripts = [];
  renderScriptLibrary();
}

function persistScriptLibrary() {
  try { localStorage.setItem(SCRIPT_LIBRARY_KEY, JSON.stringify(state.scripts)); return true; }
  catch (_) { toast('瀏覽器未能儲存文稿，請檢查私隱或儲存設定'); return false; }
}

function saveCurrentScript() {
  const source = $('#sourceText').value.trim();
  if (!source) return toast('請先輸入粵語口語稿');
  const converted = $('#convertedText').value.trim() || toMandarin(source);
  const fallbackTitle = source.replace(/[\n。！？!?]/g, ' ').trim().slice(0, 18) || '未命名文稿';
  const script = { id: String(Date.now()), title: $('#scriptTitle').value.trim() || fallbackTitle, source, converted, savedAt: new Date().toISOString() };
  state.scripts.unshift(script);
  if (persistScriptLibrary()) {
    $('#scriptTitle').value = ''; renderScriptLibrary(); toast(`已儲存「${script.title}」`);
  }
}

function renderScriptLibrary() {
  $('#scriptCount').textContent = `${state.scripts.length} 份文稿`;
  $('#scriptList').innerHTML = state.scripts.map(script => {
    const date = new Date(script.savedAt).toLocaleDateString('zh-HK', { year: 'numeric', month: 'short', day: 'numeric' });
    return `<article class="script-item" data-id="${escapeHtml(script.id)}"><div><strong>${escapeHtml(script.title)}</strong><small>${date} · ${script.source.length} 字</small></div><div class="script-actions"><button class="load-script">載入</button><button class="delete-script" aria-label="刪除 ${escapeHtml(script.title)}">刪除</button></div></article>`;
  }).join('');
}

function loadScript(id) {
  const script = state.scripts.find(item => item.id === id);
  if (!script) return;
  $('#sourceText').value = script.source; $('#convertedText').value = script.converted || toMandarin(script.source);
  $('#charCount').textContent = script.source.length; $('#scriptTitle').value = script.title;
  toast(`已載入「${script.title}」`); $('#sourceText').focus();
}

function deleteScript(id) {
  const script = state.scripts.find(item => item.id === id);
  state.scripts = state.scripts.filter(item => item.id !== id);
  if (persistScriptLibrary()) { renderScriptLibrary(); toast(`已刪除「${script?.title || '文稿'}」`); }
}

function init() {
  $('#charCount').textContent = $('#sourceText').value.length; updateWrittenMandarin(); loadScriptLibrary();
  $$('.tab').forEach(btn => btn.addEventListener('click', () => {
    $$('.tab').forEach(b=>b.classList.toggle('active',b===btn));
    $$('.tab-panel').forEach(p=>p.classList.remove('active')); $(`#${btn.dataset.tab}Panel`).classList.add('active');
  }));
  $('#sourceText').addEventListener('input', e => { $('#charCount').textContent=e.target.value.length; updateWrittenMandarin(); });
  $('#reconvertBtn').addEventListener('click', () => updateWrittenMandarin(true));
  $('#toMandarinBtn').addEventListener('click', () => updateWrittenMandarin(true));
  $('#toCantoneseBtn').addEventListener('click', updateCantoneseDraft);
  $('#saveScriptBtn').addEventListener('click', saveCurrentScript);
  $('#scriptTitle').addEventListener('keydown', e => { if (e.key === 'Enter') saveCurrentScript(); });
  $('#scriptList').addEventListener('click', e => {
    const item = e.target.closest('.script-item'); if (!item) return;
    if (e.target.closest('.load-script')) loadScript(item.dataset.id);
    if (e.target.closest('.delete-script')) deleteScript(item.dataset.id);
  });
  $('#generateBtn').addEventListener('click', () => generateSegments());
  $('#micBtn').addEventListener('click', () => state.listening ? stopListening() : startListening());
  $('#prevBtn').addEventListener('click',()=>navigate(-1)); $('#nextBtn').addEventListener('click',()=>navigate(1));
  $('#subtitleLanguage').addEventListener('click', e => { const button=e.target.closest('button'); if(button) setSubtitleLanguage(button.dataset.language); });
  $('#speakCantoneseBtn').addEventListener('click', () => speakCurrent('cantonese'));
  $('#speakMandarinBtn').addEventListener('click', () => speakCurrent('mandarin'));
  $('#closeEditorBtn').addEventListener('click',closeEditor); $('#drawerBackdrop').addEventListener('click',closeEditor); $('#saveEditorBtn').addEventListener('click',saveEditor);
  $('#addLineBtn').addEventListener('click',()=>{ state.segments.push({id:Date.now(),source:'',text:'新增字幕'}); renderEditor(); $('#editorList').scrollTop=$('#editorList').scrollHeight; });
  $('#editorList').addEventListener('click',e=>{ if(e.target.classList.contains('delete-line')) { const row=e.target.closest('.editor-row'); state.segments=state.segments.filter(s=>String(s.id)!==row.dataset.id); renderEditor(); }});
  $('#fontSize').addEventListener('input',e=>{state.fontSize=+e.target.value;$('#fontSizeOutput').textContent=`${state.fontSize} px`;$('#promptCopy').style.fontSize=`${state.fontSize}px`;renderPrompt();});
  $('#frequency').addEventListener('input',e=>{state.frequency=+e.target.value;$('#frequencyOutput').textContent=['','較慢','適中','靈敏'][state.frequency];});
  $('#showNext').addEventListener('change',e=>{state.showNext=e.target.checked;renderPrompt();});
  $('#themePicker').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('button',$('#themePicker')).forEach(x=>x.classList.toggle('active',x===b));$('#prompter').classList.remove('light','dark','focus');$('#prompter').classList.add(b.dataset.value);});
  $('#positionPicker').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('button',$('#positionPicker')).forEach(x=>x.classList.toggle('active',x===b));$('#prompter').classList.remove('top','center','bottom');$('#prompter').classList.add(b.dataset.value);});
  $('#resetSettingsBtn').addEventListener('click',()=>{ $('#fontSize').value=42;$('#fontSize').dispatchEvent(new Event('input'));$('#frequency').value=2;$('#frequency').dispatchEvent(new Event('input'));$('#showNext').checked=true;state.showNext=true;$('#themePicker [data-value="light"]').click();$('#positionPicker [data-value="center"]').click();renderPrompt();toast('已重設提詞設定');});
  $('#importTextBtn').addEventListener('click',()=>$('#textFileInput').click());
  $('#textFileInput').addEventListener('change',async e=>{const f=e.target.files[0];if(f){$('#sourceText').value=await f.text();$('#sourceText').dispatchEvent(new Event('input'));toast(`已匯入 ${f.name}`);}});
  $('#chooseAudioBtn').addEventListener('click',()=>$('#audioFileInput').click()); $('#audioFileInput').addEventListener('change',e=>handleAudio(e.target.files[0]));
  $('#audioTranscribeBtn').addEventListener('click', transcribeUploadedAudio);
  const dz=$('#dropzone'); ['dragenter','dragover'].forEach(type=>dz.addEventListener(type,e=>{e.preventDefault();dz.classList.add('dragover')})); ['dragleave','drop'].forEach(type=>dz.addEventListener(type,e=>{e.preventDefault();dz.classList.remove('dragover')})); dz.addEventListener('drop',e=>handleAudio(e.dataTransfer.files[0])); dz.addEventListener('click',e=>{if(e.target===dz||e.target.tagName==='STRONG'||e.target.tagName==='P')$('#audioFileInput').click()});
  $('#removeAudioBtn').addEventListener('click',()=>{if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);state.audioUrl=null;$('#audioPlayer').removeAttribute('src');$('#dropzone').hidden=false;$('#audioReady').hidden=true;});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeEditor();if((e.key==='ArrowRight'||e.key==='ArrowDown')&&!e.target.matches('textarea,input'))navigate(1);if((e.key==='ArrowLeft'||e.key==='ArrowUp')&&!e.target.matches('textarea,input'))navigate(-1);});
  window.addEventListener('resize', renderPrompt);
  generateSegments(false);
}
init();
