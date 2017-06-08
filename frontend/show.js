
'use strict';

const common = require('./common.js');

function renderData(data, ctrl) {
  const doc = window.document;
  const header = doc.createElement('h1');
    header.innerHTML = data.title;
    ctrl.appendChild(header);
  const length = data.items.length;
    for (let i = 0; i < length; i++) {
      const pdiv = doc.createElement('div');
        pdiv.className = 'post_conteiner';
        ctrl.appendChild(pdiv);

      let div = doc.createElement('div');
        div.className = 'post_date';
        div.innerHTML = common.convertDate(data.items[i].date);
        pdiv.appendChild(div);

        div = doc.createElement('div');
        div.className = 'post_content';
        pdiv.appendChild(div);

      const pre = doc.createElement('pre');
        pre.innerHTML = data.items[i].text;
        div.appendChild(pre);
    }
}

 

module.exports.renderGroupWallContent = function (ctrl) {
    common.get({ type: 'vkGroupWallData' })
        .then((data) => {
            const jData = JSON.parse(data);
    window.document.title = jData.title;
    renderData(jData, ctrl);
});
 }


 

