async function loadCatalog() {
  const res = await fetch('/catalog.json');
  const data = await res.json();
  renderCatalog(data);
}

function getImagePath(designId, styleId, colorId) {
  return `/static/images/${designId}/${styleId}_${colorId}.jpg`;
}

function renderCatalog(data) {
  const catalog = document.getElementById('catalog');
  catalog.innerHTML = '';

  const styleMap = Object.fromEntries(data.styles.map(s => [s.id, s.label]));
  const colorMap = Object.fromEntries(data.colors.map(c => [c.id, c]));

  data.designs.forEach(design => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden flex flex-col';

    // State
    let selectedStyle = design.styles[0];
    let selectedColor = design.colors[0];

    function imageEl() {
      const src = getImagePath(design.id, selectedStyle, selectedColor);
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${design.name} - ${styleMap[selectedStyle]} in ${colorMap[selectedColor]?.label}`;
      img.className = 'product-image';
      img.onerror = () => {
        // Fallback to placeholder
        const ph = document.createElement('div');
        ph.className = 'img-placeholder';
        ph.textContent = src.replace('/static/images/', '');
        img.replaceWith(ph);
      };
      return img;
    }

    function updateImage() {
      const current = card.querySelector('.product-image, .img-placeholder');
      const next = imageEl();
      if (current) current.replaceWith(next);
      else imgWrap.appendChild(next);
    }

    // Image area
    const imgWrap = document.createElement('div');
    imgWrap.className = 'p-4 pb-2';
    imgWrap.appendChild(imageEl());
    card.appendChild(imgWrap);

    // Info
    const info = document.createElement('div');
    info.className = 'px-4 pb-4 flex flex-col gap-3 flex-1';

    // Name
    const name = document.createElement('h2');
    name.className = 'font-semibold text-base';
    name.textContent = design.name;
    info.appendChild(name);

    // Style selector
    const styleWrap = document.createElement('div');
    styleWrap.className = 'flex flex-wrap gap-2';
    design.styles.forEach(styleId => {
      const btn = document.createElement('button');
      btn.className = 'style-btn' + (styleId === selectedStyle ? ' selected' : '');
      btn.textContent = styleMap[styleId] || styleId;
      btn.addEventListener('click', () => {
        selectedStyle = styleId;
        styleWrap.querySelectorAll('.style-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        updateImage();
      });
      styleWrap.appendChild(btn);
    });
    info.appendChild(styleWrap);

    // Color selector
    const colorWrap = document.createElement('div');
    colorWrap.className = 'flex flex-wrap gap-2 items-center';

    const colorLabel = document.createElement('span');
    colorLabel.className = 'text-xs text-stone-400 mr-1';
    colorLabel.textContent = colorMap[selectedColor]?.label || selectedColor;

    colorWrap.appendChild(colorLabel);

    design.colors.forEach(colorId => {
      const color = colorMap[colorId];
      if (!color) return;
      const swatch = document.createElement('button');
      swatch.className = 'color-swatch' + (colorId === selectedColor ? ' selected' : '');
      swatch.setAttribute('data-color', colorId);
      swatch.style.background = color.hex;
      swatch.title = color.label;
      swatch.addEventListener('click', () => {
        selectedColor = colorId;
        colorLabel.textContent = color.label;
        colorWrap.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');
        updateImage();
      });
      colorWrap.appendChild(swatch);
    });

    info.appendChild(colorWrap);
    card.appendChild(info);
    catalog.appendChild(card);
  });
}

loadCatalog();
