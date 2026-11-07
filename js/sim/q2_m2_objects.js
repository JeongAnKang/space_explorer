// 퀘스트 2 · 미션 2 우리은하의 구성 천체 — 성운과 성단 관찰, 내용정리(분류)
(function () {
    function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
    function gauss(r) { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    function blob(ctx, x, y, rad, color, a) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, color.replace('A', a)); g.addColorStop(1, color.replace('A', 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    }
    function stars(ctx, s, r, n, color = '#dfe6ff', max = 1.3) {
        for (let i = 0; i < n; i++) { ctx.globalAlpha = .3 + r() * .7; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(r() * s, r() * s, r() * max + .3, 0, 7); ctx.fill(); }
        ctx.globalAlpha = 1;
    }
    function bright(ctx, x, y, size, color) {
        blob(ctx, x, y, size * 4, color.replace(')', ', A)').replace('rgb', 'rgba'), .5);
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, size, 0, 7); ctx.fill();
    }

    const OBJECTS = [
        { id: 'emission', name: '방출 성운', kind: '성운',
          facts: ['가스와 티끌이 모인 성간 물질이에요.', '근처의 뜨거운 별에서 에너지를 받아 가스가 스스로 빛을 내요.', '주로 붉은색으로 보여요. 예: 오리온자리 대성운'],
          draw(ctx, s) { const r = rng(5); stars(ctx, s, r, 60); for (let i = 0; i < 26; i++) blob(ctx, s * (.3 + r() * .4), s * (.3 + r() * .4), s * (.12 + r() * .2), 'rgba(255, 90, 120, A)', .28); for (let i = 0; i < 8; i++) blob(ctx, s * (.35 + r() * .3), s * (.35 + r() * .3), s * .08, 'rgba(255, 190, 200, A)', .35); bright(ctx, s * .5, s * .52, 2.4, 'rgb(220, 230, 255)'); } },
        { id: 'reflection', name: '반사 성운', kind: '성운',
          facts: ['가스와 티끌이 모인 성간 물질이에요.', '스스로 빛을 내지 않고, 주변 별빛을 반사해서 빛나요.', '주로 파란색으로 보여요. 예: 플레이아데스 성단 주변의 성운'],
          draw(ctx, s) { const r = rng(9); stars(ctx, s, r, 70); for (let i = 0; i < 22; i++) blob(ctx, s * (.25 + r() * .5), s * (.25 + r() * .5), s * (.1 + r() * .2), 'rgba(110, 160, 255, A)', .22); bright(ctx, s * .42, s * .45, 3, 'rgb(200, 220, 255)'); bright(ctx, s * .6, s * .58, 2.2, 'rgb(200, 220, 255)'); } },
        { id: 'dark', name: '암흑 성운', kind: '성운',
          facts: ['가스와 티끌이 모인 성간 물질이에요.', '뒤에서 오는 별빛을 가려서 어둡게 보여요.', '예: 오리온자리의 말머리 성운'],
          draw(ctx, s) { const r = rng(21); for (let i = 0; i < 18; i++) blob(ctx, r() * s, r() * s, s * .25, 'rgba(255, 120, 140, A)', .1); stars(ctx, s, r, 260, '#e6ecff', 1.1); ctx.fillStyle = '#05070f'; ctx.beginPath(); ctx.moveTo(s * .2, s); ctx.bezierCurveTo(s * .15, s * .6, s * .35, s * .55, s * .42, s * .38); ctx.bezierCurveTo(s * .5, s * .2, s * .68, s * .25, s * .66, s * .42); ctx.bezierCurveTo(s * .64, s * .55, s * .58, s * .6, s * .7, s * .75); ctx.lineTo(s * .85, s); ctx.closePath(); ctx.fill(); } },
        { id: 'open', name: '산개 성단', kind: '산개 성단',
          facts: ['수십~수만 개의 별이 엉성하게 모여 있어요.', '비교적 젊고 표면 온도가 높은 파란 별이 많아요.', '주로 우리은하의 원반(나선팔)에 있어요. 예: 플레이아데스 성단'],
          draw(ctx, s) { const r = rng(33); stars(ctx, s, r, 80, '#cfd8ff', .9); for (let i = 0; i < 38; i++) { const x = s * .5 + gauss(r) * s * .2, y = s * .5 + gauss(r) * s * .2; bright(ctx, x, y, .8 + r() * 1.8, r() > .2 ? 'rgb(150, 190, 255)' : 'rgb(255, 240, 210)'); } } },
        { id: 'globular', name: '구상 성단', kind: '구상 성단',
          facts: ['수만~수십만 개의 별이 공 모양으로 빽빽하게 모여 있어요.', '나이가 많고 표면 온도가 낮은 붉은 별이 많아요.', '우리은하 중심부와 은하를 둘러싼 헤일로에 있어요. 예: 오메가 센타우리'],
          draw(ctx, s) { const r = rng(44); stars(ctx, s, r, 60, '#cfd8ff', .9); blob(ctx, s / 2, s / 2, s * .28, 'rgba(255, 210, 150, A)', .35); for (let i = 0; i < 2200; i++) { const x = s / 2 + gauss(r) * s * .11, y = s / 2 + gauss(r) * s * .11; ctx.globalAlpha = .55; ctx.fillStyle = r() > .4 ? '#ffd29a' : '#ff9d7a'; ctx.fillRect(x, y, 1.3, 1.3); } ctx.globalAlpha = 1; } }
    ];

    function paint(cv, obj) {
        const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
        const s = r.width || 200;
        cv.width = s * dpr; cv.height = s * dpr;
        const ctx = cv.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = '#070a1d'; ctx.fillRect(0, 0, s, s);
        obj.draw(ctx, s);
    }

    function observe(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">우리은하에는 별뿐 아니라 가스와 티끌이 모인 <b>성운</b>, 별들이 무리 지어 있는 <b>성단</b>이 있어요. 카드를 하나씩 눌러 확대해 관찰하세요. 다섯 개를 모두 관찰하면 탐구 질문이 나타나요.</p>');
        const grid = document.createElement('div'); grid.className = 'obs-grid';
        const detail = document.createElement('div'); detail.className = 'obs-detail';
        detail.innerHTML = '<canvas aria-hidden="true"></canvas><div><h4 style="margin:0;font-size:20px" id="obs-name">카드를 눌러 관찰해 보세요</h4><ul id="obs-facts"></ul></div>';
        body.append(grid, detail);
        const seen = new Set();
        const holder = document.createElement('div'); body.appendChild(holder);
        OBJECTS.forEach(obj => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'obs-card'; b.setAttribute('aria-pressed', 'false');
            b.innerHTML = `<canvas aria-hidden="true"></canvas><span>${obj.name}</span>`;
            grid.appendChild(b);
            requestAnimationFrame(() => paint(b.querySelector('canvas'), obj));
            b.addEventListener('click', () => {
                grid.querySelectorAll('.obs-card').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
                b.classList.add('seen'); seen.add(obj.id);
                detail.querySelector('#obs-name').textContent = `${obj.name} (${obj.kind})`;
                detail.querySelector('#obs-facts').innerHTML = obj.facts.map(f => `<li>${f}</li>`).join('');
                paint(detail.querySelector('canvas'), obj);
                if (seen.size === OBJECTS.length) quizBox.hidden = false;
            });
        });
        const quizBox = api.quiz(holder, {
            q: '많은 별이 공 모양으로 빽빽하게 모여 있고, 나이가 많은 붉은 별이 많은 천체는 무엇일까요?',
            options: ['산개 성단', '구상 성단', '방출 성운'], answer: 1,
            explain: '맞아요. 구상 성단은 늙은 붉은 별이 많고, 산개 성단은 젊은 파란 별이 많아요.',
            hint: '산개 성단과 구상 성단 카드를 다시 비교해 보세요.'
        });
        quizBox.hidden = true;
    }

    function summary(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">설명 카드를 알맞은 상자에 넣고 [확인]을 누르세요.</p>');
        Activities.classify(body, {
            bins: [{ id: 'nebula', name: '성운' }, { id: 'open', name: '산개 성단' }, { id: 'glob', name: '구상 성단' }],
            items: [
                { label: '가스와 티끌이 모여 구름처럼 보인다', bin: 'nebula' },
                { label: '주변 별빛을 반사하거나 스스로 빛을 낸다', bin: 'nebula' },
                { label: '뒤쪽 별빛을 가려 어둡게 보이기도 한다', bin: 'nebula' },
                { label: '별들이 엉성하게 모여 있다', bin: 'open' },
                { label: '젊고 파란 별이 많다', bin: 'open' },
                { label: '주로 우리은하 원반(나선팔)에 있다', bin: 'open' },
                { label: '별들이 공 모양으로 빽빽하게 모여 있다', bin: 'glob' },
                { label: '나이가 많은 붉은 별이 많다', bin: 'glob' },
                { label: '우리은하 중심부와 헤일로에 있다', bin: 'glob' }
            ],
            onSolved: () => api.completeMission()
        });
    }

    SIMS['2_2'] = { steps: [
        { title: '성운과 성단 관찰하기', short: '성운과 성단', build: observe },
        { title: '내용정리', short: '내용정리', build: summary }
    ] };
})();
