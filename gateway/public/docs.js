 function toggle(header) {
    const card = header.parentElement;
    card.classList.toggle('open');
    // update nav active
    const id = card.id;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const match = document.querySelector(`.nav-item[onclick="scrollTo('${id}')"]`);
    if (match) match.classList.add('active');
  }

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (!el.classList.contains('open')) {
      el.querySelector('.endpoint-header').click();
    }
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    event.currentTarget.classList.add('active');
  }

  async function tryIt(id, method) {
    const urlInput = document.getElementById('url-' + id);
    const bodyInput = document.getElementById('body-input-' + id);
    const resEl    = document.getElementById('res-' + id);
    const statusEl = document.getElementById('status-' + id);
    const bodyEl   = document.getElementById('body-' + id);

    if (!urlInput) return;
    const url = urlInput.value.trim();

    const opts = { method, credentials: 'include', headers: {} };
    if (bodyInput && bodyInput.value.trim()) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = bodyInput.value.trim();
    }

    statusEl.textContent = 'Loading…';
    statusEl.style.color = 'var(--muted)';
    resEl.classList.add('visible');
    bodyEl.textContent = '';

    try {
      const r = await fetch(url, opts);
      const text = await r.text();
      let pretty = text;
      try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch {}

      statusEl.textContent = r.status + ' ' + r.statusText;
      statusEl.style.color = r.ok ? 'var(--teal)' : 'var(--red)';
      bodyEl.textContent = pretty;
    } catch (e) {
      statusEl.textContent = 'Network Error';
      statusEl.style.color = 'var(--red)';
      bodyEl.textContent = e.message;
    }
  }