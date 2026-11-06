// 确认稿恢复版：画面本身不做图层重排，交互只负责故事入口与同页导航。
const lyraDialog = document.querySelector('#lyra-dialog');
const closeDialog = document.querySelector('.dialog-close');
const lyraTriggers = document.querySelectorAll('.stage-lyra, .mobile-lyra');
const stageLyra = document.querySelector('.stage-lyra');
const lyraConstellation = document.querySelector('.lyra-constellation');
const lyraAnchor = { x: 1179, y: 147, width: 76, height: 80 };
const chapterDialog = document.querySelector('#chapter-dialog');
const chapterTriggers = document.querySelectorAll('.star-menu-trigger');
const chapterClose = document.querySelector('.chapter-dialog-close');

chapterTriggers.forEach((trigger) => trigger.addEventListener('click', () => {
  if (lyraDialog.open) lyraDialog.close();
  chapterDialog.showModal();
  document.body.classList.add('dialog-open');
  chapterTriggers.forEach((item) => item.setAttribute('aria-expanded', 'true'));
}));
chapterClose.addEventListener('click', () => chapterDialog.close());
chapterDialog.addEventListener('click', (event) => {
  if (event.target !== chapterDialog) return;
  const bounds = chapterDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) chapterDialog.close();
});
chapterDialog.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', () => chapterDialog.close()));
chapterDialog.addEventListener('close', () => {
  if (!lyraDialog.open && !impDialog.open) document.body.classList.remove('dialog-open');
  chapterTriggers.forEach((item) => item.setAttribute('aria-expanded', 'false'));
});

function openLyra(event) {
  event.preventDefault();
  hero.classList.add('is-lyra-active');
  lyraDialog.showModal();
  document.body.classList.add('dialog-open');
}
lyraTriggers.forEach((trigger) => trigger.addEventListener('click', openLyra));
closeDialog.addEventListener('click', () => lyraDialog.close());
lyraDialog.addEventListener('click', (event) => {
  if (event.target !== lyraDialog) return;
  const bounds = lyraDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) lyraDialog.close();
});
lyraDialog.addEventListener('close', () => {
  if (!chapterDialog.open && !impDialog.open) document.body.classList.remove('dialog-open');
  hero.classList.remove('is-lyra-active');
});

// 树灵热点按原画坐标定位，随桌面比例和手机裁切同步移动。
const hero = document.querySelector('.hero');
const approvedStage = document.querySelector('.approved-stage');
const stageImage = approvedStage.querySelector('img');
const treeHotspot = document.querySelector('.tree-hotspot');
const impHotspot = document.querySelector('.imp-hotspot');
const mobileImp = document.querySelector('.mobile-imp');
const impDialog = document.querySelector('#imp-dialog');
const impClose = document.querySelector('.imp-dialog-close');
const impFigure = { x: 670, y: 497, width: 75, height: 75 };
let impTimer;
let lastImpTrigger;
const treeStory = document.querySelector('#tree-story');
const treeSummary = treeStory.querySelector('summary');
const treeFace = { x: 758, y: 382 };
const seleneHotspot = document.querySelector('.selene-hotspot');
const seleneStory = document.querySelector('#selene-story');
const seleneSummary = seleneStory.querySelector('summary');
const seleneFigure = { x: 918, y: 465, width: 74, height: 150 };
let seleneSequenceTimer;

function positionTreeHotspot() {
  if (!stageImage.naturalWidth) return;
  const imageBounds = stageImage.getBoundingClientRect();
  const stageBounds = approvedStage.getBoundingClientRect();
  const scaleX = imageBounds.width / stageImage.naturalWidth;
  const scaleY = imageBounds.height / stageImage.naturalHeight;
  treeHotspot.style.left = `${imageBounds.left - stageBounds.left + treeFace.x * scaleX}px`;
  treeHotspot.style.top = `${imageBounds.top - stageBounds.top + treeFace.y * scaleY}px`;
  treeHotspot.style.width = `${130 * scaleX}px`;
  treeHotspot.style.height = `${150 * scaleY}px`;
}
function positionImpHotspot() {
  if (!stageImage.naturalWidth) return;
  const imageBounds = stageImage.getBoundingClientRect();
  const stageBounds = approvedStage.getBoundingClientRect();
  const scaleX = imageBounds.width / stageImage.naturalWidth;
  const scaleY = imageBounds.height / stageImage.naturalHeight;
  impHotspot.style.left = `${imageBounds.left - stageBounds.left + impFigure.x * scaleX}px`;
  impHotspot.style.top = `${imageBounds.top - stageBounds.top + impFigure.y * scaleY}px`;
  impHotspot.style.width = `${impFigure.width * scaleX}px`;
  impHotspot.style.height = `${impFigure.height * scaleY}px`;
}
function finishImpSequence() {
  impTimer = undefined;
  hero.classList.remove('is-imp-gathering');
  impHotspot.setAttribute('aria-busy', 'false');
  if (lyraDialog.open) lyraDialog.close();
  if (chapterDialog.open) chapterDialog.close();
  impDialog.showModal();
  document.body.classList.add('dialog-open');
}
function startImpSequence(event) {
  lastImpTrigger = event.currentTarget;
  if (impDialog.open) { impDialog.close(); return; }
  if (impTimer) return;
  treeStory.open = false;
  seleneStory.open = false;
  cancelSeleneSequence();
  if (lastImpTrigger === mobileImp || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finishImpSequence();
    return;
  }
  hero.classList.remove('is-imp-gathering');
  void hero.offsetWidth;
  hero.classList.add('is-imp-gathering');
  impHotspot.setAttribute('aria-busy', 'true');
  impTimer = window.setTimeout(finishImpSequence, 1500);
}
impHotspot.addEventListener('click', startImpSequence);
mobileImp.addEventListener('click', startImpSequence);
impClose.addEventListener('click', () => impDialog.close());
impDialog.addEventListener('click', (event) => {
  if (event.target !== impDialog) return;
  const bounds = impDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) impDialog.close();
});
impDialog.addEventListener('close', () => {
  if (!chapterDialog.open && !lyraDialog.open) document.body.classList.remove('dialog-open');
  lastImpTrigger?.focus({ preventScroll: true });
});
function positionSeleneHotspot() {
  if (!stageImage.naturalWidth) return;
  const imageBounds = stageImage.getBoundingClientRect();
  const stageBounds = approvedStage.getBoundingClientRect();
  const scaleX = imageBounds.width / stageImage.naturalWidth;
  const scaleY = imageBounds.height / stageImage.naturalHeight;
  seleneHotspot.style.left = `${imageBounds.left - stageBounds.left + seleneFigure.x * scaleX}px`;
  seleneHotspot.style.top = `${imageBounds.top - stageBounds.top + seleneFigure.y * scaleY}px`;
  seleneHotspot.style.width = `${seleneFigure.width * scaleX}px`;
  seleneHotspot.style.height = `${seleneFigure.height * scaleY}px`;
}
function cancelSeleneSequence() {
  window.clearTimeout(seleneSequenceTimer);
  seleneSequenceTimer = undefined;
  hero.classList.remove('is-selene-connecting');
  seleneHotspot.removeAttribute('aria-busy');
}
function startSeleneSequence(event) {
  event?.preventDefault();
  if (seleneSequenceTimer) return;
  if (seleneStory.open) {
    seleneStory.open = false;
    return;
  }
  treeStory.open = false;
  hero.classList.remove('is-selene-connected', 'is-selene-connecting');
  void hero.offsetWidth;
  hero.classList.add('is-selene-connecting');
  seleneHotspot.setAttribute('aria-busy', 'true');
  const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1250;
  seleneSequenceTimer = window.setTimeout(() => {
    seleneSequenceTimer = undefined;
    hero.classList.remove('is-selene-connecting');
    hero.classList.add('is-selene-connected');
    seleneHotspot.removeAttribute('aria-busy');
    seleneStory.open = true;
    seleneSummary.focus({ preventScroll: true });
  }, delay);
}
treeHotspot.addEventListener('click', () => { treeStory.open = !treeStory.open; });
treeStory.addEventListener('toggle', () => {
  hero.classList.toggle('is-tree-awake', treeStory.open);
  treeHotspot.setAttribute('aria-expanded', String(treeStory.open));
  if (treeStory.open) {
    cancelSeleneSequence();
    hero.classList.remove('is-selene-connected');
    seleneStory.open = false;
  }
});
seleneHotspot.addEventListener('click', startSeleneSequence);
seleneSummary.addEventListener('click', startSeleneSequence);
seleneStory.addEventListener('toggle', () => {
  seleneHotspot.setAttribute('aria-expanded', String(seleneStory.open));
  if (seleneStory.open) {
    treeStory.open = false;
    hero.classList.add('is-selene-connected');
  } else {
    cancelSeleneSequence();
    hero.classList.remove('is-selene-connected');
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && treeStory.open) {
    treeStory.open = false;
    treeSummary.focus({ preventScroll: true });
  }
  if (event.key === 'Escape' && seleneStory.open) {
    seleneStory.open = false;
    seleneSummary.focus({ preventScroll: true });
  } else if (event.key === 'Escape' && seleneSequenceTimer) {
    cancelSeleneSequence();
    seleneHotspot.focus({ preventScroll: true });
  }
});
document.addEventListener('click', (event) => {
  if (treeStory.open && !treeStory.contains(event.target) && !treeHotspot.contains(event.target)) treeStory.open = false;
  if (seleneStory.open && !seleneStory.contains(event.target) && !seleneHotspot.contains(event.target)) seleneStory.open = false;
  if (seleneSequenceTimer && !seleneStory.contains(event.target) && !seleneHotspot.contains(event.target)) cancelSeleneSequence();
});
function positionStoryHotspots() {
  if (!stageImage.naturalWidth) return;
  positionTreeHotspot();
  positionImpHotspot();
  positionSeleneHotspot();
  const imageBounds = stageImage.getBoundingClientRect();
  const stageBounds = approvedStage.getBoundingClientRect();
  const connection = document.querySelector('.selene-connection');
  connection.style.left = `${imageBounds.left - stageBounds.left}px`;
  connection.style.top = `${imageBounds.top - stageBounds.top}px`;
  connection.style.width = `${imageBounds.width}px`;
  connection.style.height = `${imageBounds.height}px`;
  const impSoundPath = document.querySelector('.imp-sound-path');
  impSoundPath.style.left = `${imageBounds.left - stageBounds.left}px`;
  impSoundPath.style.top = `${imageBounds.top - stageBounds.top}px`;
  impSoundPath.style.width = `${imageBounds.width}px`;
  impSoundPath.style.height = `${imageBounds.height}px`;
  lyraConstellation.style.left = `${imageBounds.left - stageBounds.left}px`;
  lyraConstellation.style.top = `${imageBounds.top - stageBounds.top}px`;
  lyraConstellation.style.width = `${imageBounds.width}px`;
  lyraConstellation.style.height = `${imageBounds.height}px`;
  const scaleX = imageBounds.width / stageImage.naturalWidth;
  const scaleY = imageBounds.height / stageImage.naturalHeight;
  stageLyra.style.left = `${imageBounds.left - stageBounds.left + (lyraAnchor.x - lyraAnchor.width / 2) * scaleX}px`;
  stageLyra.style.top = `${imageBounds.top - stageBounds.top + (lyraAnchor.y - lyraAnchor.height / 2) * scaleY}px`;
  stageLyra.style.width = `${lyraAnchor.width * scaleX}px`;
  stageLyra.style.height = `${lyraAnchor.height * scaleY}px`;
}
stageImage.addEventListener('load', positionStoryHotspots);
window.addEventListener('resize', positionStoryHotspots);
if ('ResizeObserver' in window) new ResizeObserver(positionStoryHotspots).observe(approvedStage);
positionStoryHotspots();

const navLinks = [...document.querySelectorAll('.mobile-header nav a, .mobile-header nav .star-menu-trigger')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const targetHash = link.hash || link.dataset.navTarget;
        if (targetHash === `#${entry.target.id}` || (targetHash === '#chapters' && ['untold', 'through-the-lens', 'echo-and-fuzz', 'their-headphones', 'next-encounter', 'take-home'].includes(entry.target.id))) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -45% 0px', threshold: 0 });
  document.querySelectorAll('main section[id], #chapters').forEach((section) => observer.observe(section));
}
