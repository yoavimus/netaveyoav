const PAYBOX_URL = 'https://links.payboxapp.com/mfGthuLma2b';

async function loadCatalog() {
  const res = await fetch('/catalog.json');
  const data = await res.json();
  renderCatalog(data);
}

function getImagePath(designId, styleShort, colorId, suffix) {
  const base = `${designId}_${styleShort}_${colorId}`;
  const filename = suffix ? `${base}_${suffix}.jpg` : `${base}.jpg`;
  return `/static/images/${designId}/${filename}`;
}

function renderCatalog(data) {
  const catalog = document.getElementById('catalog');
  catalog.innerHTML = '';

  const styleMap = Object.fromEntries(data.styles.map(s => [s.id, s.label]));
  const styleShortMap = Object.fromEntries(data.styles.map(s => [s.id, s.short]));
  const priceMap = Object.fromEntries(data.styles.map(s => [s.id, s.price]));
  const colorMap = Object.fromEntries(data.colors.map(c => [c.id, c]));

  data.designs.forEach(design => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden flex flex-col';

    // State
    let selectedStyle = design.styles[0].id;
    let selectedColor = getColorIds(design.styles[0].colors)[0];
    let selectedSize = data.sizes[0];
    let imageIndex = 0;
    let rotationTimer = null;

    function getColorIds(colors) {
      return colors.map(c => typeof c === 'string' ? c : c.id);
    }

    function colorsForStyle(styleId) {
      return design.styles.find(s => s.id === styleId)?.colors || [];
    }

    // Returns array of suffixes, e.g. ["front","back"] or [null] for single image
    function currentImages() {
      const styleObj = design.styles.find(s => s.id === selectedStyle);
      if (!styleObj?.images) return [null];
      return styleObj.images;
    }

    function buildImageEl() {
      const images = currentImages();
      const suffix = images[imageIndex];
      const src = getImagePath(design.id, styleShortMap[selectedStyle], selectedColor, suffix);
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${design.name} - ${styleMap[selectedStyle]} in ${colorMap[selectedColor]?.label}`;
      img.className = 'product-image';
      if (images.length > 1) img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        if (currentImages().length <= 1) return;
        imageIndex = (imageIndex + 1) % currentImages().length;
        refreshImage();
        restartTimer();
      });
      img.onerror = () => {
        const ph = document.createElement('div');
        ph.className = 'img-placeholder';
        ph.textContent = src.replace('/static/images/', '');
        img.replaceWith(ph);
      };
      return img;
    }

    function refreshImage() {
      const current = imageContainer.querySelector('.product-image, .img-placeholder');
      const next = buildImageEl();
      if (current) current.replaceWith(next);
      else imageContainer.appendChild(next);
      updateDots();
    }

    function updateDots() {
      const images = currentImages();
      dotsWrap.innerHTML = '';
      if (images.length <= 1) return;
      images.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'w-2 h-2 rounded-full transition-colors ' +
          (i === imageIndex ? 'bg-stone-700' : 'bg-stone-300');
        dot.addEventListener('click', () => {
          imageIndex = i;
          refreshImage();
          restartTimer();
        });
        dotsWrap.appendChild(dot);
      });
    }

    function restartTimer() {
      clearInterval(rotationTimer);
      if (currentImages().length <= 1) return;
      rotationTimer = setInterval(() => {
        imageIndex = (imageIndex + 1) % currentImages().length;
        refreshImage();
      }, 3000);
    }

    function onSelectionChange() {
      imageIndex = 0;
      refreshImage();
      restartTimer();
    }

    // Image area
    const imgWrap = document.createElement('div');
    imgWrap.className = 'p-4 pb-2';

    const imageContainer = document.createElement('div');
    imageContainer.appendChild(buildImageEl());
    imgWrap.appendChild(imageContainer);

    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'flex justify-center gap-1.5 mt-2';
    updateDots();
    imgWrap.appendChild(dotsWrap);

    card.appendChild(imgWrap);
    restartTimer();

    // Info
    const info = document.createElement('div');
    info.className = 'px-4 pb-4 flex flex-col gap-3 flex-1';

    // Name
    const name = document.createElement('h2');
    name.className = 'font-semibold text-base';
    name.dir = 'rtl';
    name.textContent = design.name_he || design.name;
    info.appendChild(name);

    // Style selector
    const styleWrap = document.createElement('div');
    styleWrap.className = 'flex flex-wrap gap-2';
    design.styles.forEach(style => {
      const btn = document.createElement('button');
      btn.className = 'style-btn' + (style.id === selectedStyle ? ' selected' : '');
      btn.textContent = styleMap[style.id] || style.id;
      btn.addEventListener('click', () => {
        selectedStyle = style.id;
        styleWrap.querySelectorAll('.style-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        const available = getColorIds(colorsForStyle(selectedStyle));
        if (!available.includes(selectedColor)) {
          selectedColor = available[0];
        }
        buildColorSwatches();
        onSelectionChange();
        orderBtn.textContent = orderBtnLabel();
      });
      styleWrap.appendChild(btn);
    });
    info.appendChild(styleWrap);

    // Color selector
    const colorWrap = document.createElement('div');
    colorWrap.className = 'flex flex-wrap gap-2 items-center';

    function buildColorSwatches() {
      colorWrap.innerHTML = '';
      const colorLabel = document.createElement('span');
      colorLabel.className = 'text-xs text-stone-400 mr-1';
      colorLabel.textContent = colorMap[selectedColor]?.label || selectedColor;
      colorWrap.appendChild(colorLabel);

      getColorIds(colorsForStyle(selectedStyle)).forEach(colorId => {
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
          onSelectionChange();
        });
        colorWrap.appendChild(swatch);
      });
    }

    buildColorSwatches();
    info.appendChild(colorWrap);

    // Size selector
    const sizeWrap = document.createElement('div');
    sizeWrap.className = 'flex flex-wrap gap-2';
    data.sizes.forEach(size => {
      const btn = document.createElement('button');
      btn.className = 'style-btn' + (size === selectedSize ? ' selected' : '');
      btn.textContent = size;
      btn.addEventListener('click', () => {
        selectedSize = size;
        sizeWrap.querySelectorAll('.style-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
      sizeWrap.appendChild(btn);
    });
    info.appendChild(sizeWrap);

    // Order button
    function orderBtnLabel() {
      const price = priceMap[selectedStyle];
      return price != null ? `Order via Paybox · ₪${price}` : 'Order via Paybox';
    }

    const orderBtn = document.createElement('button');
    orderBtn.className = 'order-btn mt-auto';
    orderBtn.textContent = orderBtnLabel();
    orderBtn.addEventListener('click', () => {
      const details = `${design.name_he || design.name} | ${styleMap[selectedStyle]} | ${colorMap[selectedColor]?.label} | ${selectedSize}`;
      navigator.clipboard.writeText(details).catch(() => {});
      window.open(PAYBOX_URL, '_blank');
      orderBtn.textContent = 'Copied! Opening Paybox...';
      orderBtn.disabled = true;
      setTimeout(() => {
        orderBtn.textContent = 'Order via Paybox';
        orderBtn.disabled = false;
      }, 2500);
    });
    info.appendChild(orderBtn);

    card.appendChild(info);
    catalog.appendChild(card);
  });
}

loadCatalog();
