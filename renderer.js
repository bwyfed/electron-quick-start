// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// 可以使用DOM API和Node.js的API
alert(process.versions.node)
window.addEventListener('DOMContentLoaded', () => {
  alert('greetging from the DOM side')
})