(() => {
  const grid = document.getElementById('offersGrid');
  const empty = document.getElementById('emptyOffers');
  const toast = document.getElementById('toast');
  const catList = document.getElementById('categoriesList');
  let category = 'Todos';
  let query = '';

  const slugStore = s => ({
    'Amazon': 'store-amazon',
    'Mercado Livre': 'store-ml',
    'Shopee': 'store-shopee'
  }[s] || '');

  function showToast(text){
    if(!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'),1700);
  }

  async function copyCoupon(code){
    try { await navigator.clipboard.writeText(code); showToast(`Cupom ${code} copiado!`); }
    catch(e){ showToast(`Cupom: ${code}`); }
  }

  function renderOffers(){
    if(!grid) return;
    const items = window.OFFERS.filter(o => {
      const catOk = category === 'Todos' || o.category === category;
      const hay = `${o.title} ${o.store} ${o.category}`.toLowerCase();
      const qOk = !query || hay.includes(query.toLowerCase());
      return catOk && qOk;
    });

    grid.innerHTML = items.map(o => `
      <article class="offer-card">
        <div class="offer-image">
          <span class="discount">${o.discount}</span>
          <img src="${o.image}" alt="${o.title}" loading="lazy">
        </div>
        <div class="offer-body">
          <div class="store ${slugStore(o.store)}">${o.store}</div>
          <h3>${o.title}</h3>
          <div class="price-row"><span>${o.oldPrice}</span><strong>${o.price}</strong></div>
          ${o.coupon ? `<button class="coupon-code" data-code="${o.coupon}">CUPOM: ${o.coupon}</button>` : `<div class="coupon-code disabled">SEM CUPOM</div>`}
          <a class="offer-button" href="${o.link}" target="_blank" rel="nofollow sponsored noopener">Pegar oferta ↗</a>
        </div>
      </article>
    `).join('');

    empty.hidden = items.length > 0;
    document.querySelectorAll('[data-code]').forEach(b => b.addEventListener('click', () => copyCoupon(b.dataset.code)));
  }

  function renderCategories(){
    if(!catList) return;
    catList.innerHTML = window.CATEGORIES.map(([name,icon])=>`
      <button class="category-card ${name==='Todos'?'active':''}" data-category="${name}">
        <b>${icon}</b><span>${name}</span>
      </button>
    `).join('');
    catList.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
      category = btn.dataset.category;
      catList.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      renderOffers();
      document.getElementById('ofertas')?.scrollIntoView({behavior:'smooth'});
    }));
  }

  function hookSearch(id){
    const input = document.getElementById(id);
    if(!input) return;
    input.addEventListener('input', () => {
      query = input.value.trim();
      document.querySelectorAll('#headerSearch,#heroSearch').forEach(x => { if(x!==input) x.value=input.value; });
      renderOffers();
    });
  }

  hookSearch('headerSearch');
  hookSearch('heroSearch');
  ['headerSearchForm','heroSearchForm'].forEach(id => {
    document.getElementById(id)?.addEventListener('submit', e => {
      e.preventDefault();
      document.getElementById('ofertas')?.scrollIntoView({behavior:'smooth'});
    });
  });

  document.getElementById('showAllOffers')?.addEventListener('click', () => {
    category='Todos'; query='';
    document.querySelectorAll('#headerSearch,#heroSearch').forEach(x=>x.value='');
    renderCategories(); renderOffers();
  });

  document.getElementById('goCoupons')?.addEventListener('click', () => {
    const first = document.querySelector('.coupon-code:not(.disabled)');
    first?.scrollIntoView({behavior:'smooth', block:'center'});
    if(first) setTimeout(()=>first.classList.add('pulse'),400);
  });

  const wa = window.SITE_CONFIG?.whatsapp || '#';
  ['whatsappTop','whatsappFooter'].forEach(id => {
    const a = document.getElementById(id);
    if(a) a.href = wa;
  });

  renderCategories();
  renderOffers();
})();