const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(isOpen));
  navigation.classList.toggle('is-open', isOpen);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    menuButton.focus();
  }
});

const scenes = {
  document: { image: 'assets/search-document.jpg', alt: '真实文档搜索结果：去欧洲要备哪些材料。' },
  image: { image: 'assets/search-image.jpg', alt: '真实图片搜索结果：歪着的那座白塔，结果中包含比萨斜塔照片。' },
  video: { image: 'assets/search-video.jpg', alt: '真实视频搜索结果：航拍公路穿过成排茶田，结果提供 00:04 时间位置。' }
};
const tabs = [...document.querySelectorAll('[role="tab"]')];
const sceneImage = document.querySelector('#search-scene');
function selectTab(tab) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  const scene = scenes[tab.id.replace('tab-', '')];
  sceneImage.src = scene.image;
  sceneImage.alt = scene.alt;
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectTab(tabs[next]);
      tabs[next].focus();
    }
  });
});

const dialog = document.querySelector('#video-dialog');
const video = dialog.querySelector('video');
let videoTrigger;
document.querySelectorAll('[data-video]').forEach((button) => {
  button.addEventListener('click', () => {
    videoTrigger = button;
    document.querySelector('#video-title').textContent = button.dataset.title;
    video.poster = button.dataset.poster;
    video.src = button.dataset.video;
    dialog.showModal();
  });
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => {
  video.pause();
  video.removeAttribute('src');
  video.load();
  videoTrigger?.focus();
});
