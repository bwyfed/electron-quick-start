const { ipcRenderer } = require('electron');
const { $ } = require('./helper');
const path = require('path');

let musicFilePaths = [];
$('select-music').addEventListener('click', () => {
  ipcRenderer.send('open-music-file');
});

$('add-music').addEventListener('click', () => {
  ipcRenderer.send('add-tracks', musicFilePaths);
});

const renderListHTML = paths => {
  const musicList = $('musicList');
  const musicItemsHTML = paths.reduce((html, music) => {
    html += `<li class="list-group-item">${path.basename(music)}</li>`;
    return html;
  }, '');
  musicList.innerHTML = `<ul class="list-group">${musicItemsHTML}</ul>`;
};

ipcRenderer.on('selected-files', (event, path) => {
  if (Array.isArray(path)) {
    musicFilePaths = path;
    renderListHTML(musicFilePaths);
  }
});
