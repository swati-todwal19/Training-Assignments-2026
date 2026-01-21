export function initPagination(data, renderFn, perPage = 6) {
  let current = 1;
  const total = Math.ceil(data.length / perPage);

  const pagesDiv = document.getElementById("pages") || document.body.appendChild(Object.assign(document.createElement("div"), { id: "pages" }));
  const prevBtn = document.getElementById("prev") || createBtn("Prev", pagesDiv, true);
  const nextBtn = document.getElementById("next") || createBtn("Next", pagesDiv);

  function createBtn(txt, parent, before) {
    const b = document.createElement("button"); b.textContent = txt; b.id = txt.toLowerCase();
    before ? parent.parentNode.insertBefore(b, parent) : parent.parentNode?.appendChild(b);
    return b;
  }

  function render() {
    const slice = data.slice((current-1)*perPage, current*perPage);
    renderFn(slice);
    drawButtons();
  }

  function drawButtons() {
    pagesDiv.innerHTML = "";
    const range = 2;
    const pages = [];

    if(current > range+1) pages.push(1);
    if(current > range+2) pages.push("...");
    for(let i=current-range; i<=current+range; i++) if(i>0 && i<=total) pages.push(i);
    if(current < total-range-1) pages.push("...");
    if(current < total-range) pages.push(total);

    pages.forEach(p => {
      const btn = document.createElement("button");
      btn.textContent = p;
      if(p===current) btn.classList.add("active");
      if(p!=="...") btn.onclick = ()=>{current=p; render();}
      else btn.disabled = true;
      pagesDiv.appendChild(btn);
    });

    prevBtn.disabled = current===1;
    nextBtn.disabled = current===total;
  }

  prevBtn.onclick = ()=>{if(current>1){current--;render();}};
  nextBtn.onclick = ()=>{if(current<total){current++;render();}};
  render();
}
