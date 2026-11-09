// 퀘스트 3 공통 도구 — 사진 카드 타임라인(카드 읽기 → 조작 활동 → 탐구 질문)과 직접 그린 그림
// 미션 1(우주 관측의 역사), 미션 2(우주 탐사선), 미션 3(대한민국의 우주 역량)이 함께 써요.
(function () {
    const { svgEl, text } = SimKit;

    // 이미지는 Wikimedia Commons에서 바로 불러와요. 각 사진 아래 출처를 누르면 저작자와 이용 조건을 볼 수 있어요.
    const IMG = (file, w) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;
    const PAGE = file => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}`;

    const bg = svg => {
        svgEl('rect', { x: 0, y: 0, width: 400, height: 300, fill: '#070a1d' }, svg);
        for (let i = 0; i < 46; i++) svgEl('circle', { cx: (i * 97) % 400, cy: (i * 61) % 300, r: .6 + (i % 3) * .4, fill: '#dfe6ff', opacity: .45 }, svg);
    };
    const title = (svg, s) => text(svg, 200, 34, s, { fill: '#f5c451', 'font-size': 16, 'font-weight': 700, 'text-anchor': 'middle' });

    // 사진 대신 직접 그린 그림 (알맞은 공개 사진이 없을 때)
    const DRAW = {
        parallax(svg) {
            svgEl('rect', { x: 0, y: 0, width: 400, height: 300, fill: '#070a1d' }, svg);
            for (let i = 0; i < 40; i++) svgEl('circle', { cx: (i * 97) % 400, cy: 12 + (i * 53) % 50, r: .8 + (i % 3) * .4, fill: '#dfe6ff', opacity: .6 }, svg);
            svgEl('ellipse', { cx: 200, cy: 250, rx: 120, ry: 26, fill: 'none', stroke: '#2f3b78', 'stroke-dasharray': '4 5' }, svg);
            svgEl('circle', { cx: 200, cy: 250, r: 10, fill: '#f5c451' }, svg);
            [[80, 250], [320, 250]].forEach(([x, y]) => {
                svgEl('line', { x1: x, y1: y, x2: 200, y2: 110, stroke: '#8fb4ff', 'stroke-width': 1.4 }, svg);
                svgEl('circle', { cx: x, cy: y, r: 7, fill: '#4f8dff' }, svg);
            });
            svgEl('circle', { cx: 200, cy: 110, r: 7, fill: '#ffd0a0' }, svg);
            svgEl('path', { d: 'M188 128 A22 22 0 0 0 200 132', fill: 'none', stroke: '#ff4fa3', 'stroke-width': 3 }, svg);
            text(svg, 212, 104, '백조자리 61번 별', { fill: '#eef1ff', 'font-size': 14 });
            text(svg, 150, 160, '연주시차 0.314″', { fill: '#ff4fa3', 'font-size': 14, 'font-weight': 700, 'text-anchor': 'end' });
            text(svg, 200, 286, '태양', { fill: '#a9b1d9', 'font-size': 12, 'text-anchor': 'middle' });
        },
        spectral(svg) {
            svgEl('rect', { x: 0, y: 0, width: 400, height: 300, fill: '#070a1d' }, svg);
            const T = [['O', '#9bb0ff', 18, '30000K 이상'], ['B', '#aabfff', 16, ''], ['A', '#cad7ff', 14, ''], ['F', '#f8f7ff', 13, ''], ['G', '#fff4ea', 12, '태양'], ['K', '#ffd2a1', 11, ''], ['M', '#ffb36b', 10, '3500K 이하']];
            T.forEach(([k, c, r, note], i) => {
                const x = 40 + i * 53;
                svgEl('circle', { cx: x, cy: 130, r: r + 10, fill: c, opacity: .18 }, svg);
                svgEl('circle', { cx: x, cy: 130, r, fill: c }, svg);
                text(svg, x, 190, k, { fill: '#eef1ff', 'font-size': 22, 'font-weight': 700, 'text-anchor': 'middle' });
                if (note) text(svg, x, 216, note, { fill: '#a9b1d9', 'font-size': 11, 'text-anchor': 'middle' });
            });
            svgEl('path', { d: 'M30 250 H370', stroke: '#6f78a8', 'stroke-width': 1.5 }, svg);
            text(svg, 30, 270, '표면 온도 높음', { fill: '#9bb0ff', 'font-size': 13 });
            text(svg, 370, 270, '표면 온도 낮음', { fill: '#ffb36b', 'font-size': 13, 'text-anchor': 'end' });
            text(svg, 200, 50, '캐넌의 분광형 순서', { fill: '#f5c451', 'font-size': 16, 'font-weight': 700, 'text-anchor': 'middle' });
        },
        // 인공위성: 본체 + 태양 전지판, 아래에 지구 가장자리
        satellite(svg, label) {
            bg(svg); if (label) title(svg, label);
            svgEl('path', { d: 'M-20 330 A320 320 0 0 1 420 330 Z', fill: '#1a3f8f' }, svg);
            svgEl('path', { d: 'M-20 330 A320 320 0 0 1 420 330', fill: 'none', stroke: '#7fb2ff', 'stroke-width': 3, opacity: .7 }, svg);
            const g = svgEl('g', { transform: 'translate(200 140) rotate(-12)' }, svg);
            svgEl('rect', { x: -130, y: -16, width: 92, height: 32, fill: '#3b5bd6', stroke: '#8fb4ff' }, g);
            svgEl('rect', { x: 38, y: -16, width: 92, height: 32, fill: '#3b5bd6', stroke: '#8fb4ff' }, g);
            for (let i = 1; i < 4; i++) { svgEl('line', { x1: -130 + i * 23, y1: -16, x2: -130 + i * 23, y2: 16, stroke: '#8fb4ff', opacity: .6 }, g); svgEl('line', { x1: 38 + i * 23, y1: -16, x2: 38 + i * 23, y2: 16, stroke: '#8fb4ff', opacity: .6 }, g); }
            svgEl('rect', { x: -38, y: -30, width: 76, height: 60, rx: 4, fill: '#d9b45a', stroke: '#f5c451' }, g);
            svgEl('circle', { cx: 0, cy: 44, r: 12, fill: 'none', stroke: '#dfe6ff', 'stroke-width': 3 }, g);
            svgEl('line', { x1: 0, y1: 30, x2: 0, y2: 40, stroke: '#dfe6ff', 'stroke-width': 3 }, g);
        },
        // 로켓 발사
        rocket(svg, label) {
            bg(svg); if (label) title(svg, label);
            svgEl('rect', { x: 0, y: 262, width: 400, height: 38, fill: '#1c2448' }, svg);
            svgEl('path', { d: 'M184 238 Q200 300 216 238 Z', fill: '#ff9d4f', opacity: .9 }, svg);
            svgEl('path', { d: 'M190 238 Q200 280 210 238 Z', fill: '#fff1c1' }, svg);
            svgEl('rect', { x: 186, y: 110, width: 28, height: 128, fill: '#eef1ff' }, svg);
            svgEl('path', { d: 'M186 110 Q200 66 214 110 Z', fill: '#eef1ff' }, svg);
            svgEl('rect', { x: 186, y: 168, width: 28, height: 4, fill: '#3b5bd6' }, svg);
            svgEl('rect', { x: 186, y: 206, width: 28, height: 4, fill: '#3b5bd6' }, svg);
            svgEl('path', { d: 'M186 214 L172 240 L186 236 Z M214 214 L228 240 L214 236 Z', fill: '#c9533a' }, svg);
            svgEl('circle', { cx: 200, cy: 134, r: 5, fill: '#3b5bd6' }, svg);
        },
        // 달 궤도를 도는 궤도선
        moonorbit(svg, label) {
            bg(svg); if (label) title(svg, label);
            svgEl('circle', { cx: 200, cy: 170, r: 82, fill: '#9a9aa5' }, svg);
            [[170, 140, 14], [230, 190, 10], [205, 125, 7], [175, 205, 9]].forEach(([x, y, r]) => svgEl('circle', { cx: x, cy: y, r, fill: '#7d7d88' }, svg));
            svgEl('ellipse', { cx: 200, cy: 170, rx: 120, ry: 40, fill: 'none', stroke: '#8fb4ff', 'stroke-dasharray': '5 5', transform: 'rotate(-20 200 170)' }, svg);
            const g = svgEl('g', { transform: 'translate(306 128)' }, svg);
            svgEl('rect', { x: -9, y: -9, width: 18, height: 18, fill: '#d9b45a' }, g);
            svgEl('rect', { x: -32, y: -4, width: 20, height: 8, fill: '#3b5bd6' }, g);
            svgEl('rect', { x: 12, y: -4, width: 20, height: 8, fill: '#3b5bd6' }, g);
        },
        // 달 착륙선
        lander(svg, label) {
            bg(svg); if (label) title(svg, label);
            svgEl('path', { d: 'M0 230 Q100 214 200 226 T400 222 V300 H0 Z', fill: '#8b8b95' }, svg);
            svgEl('circle', { cx: 320, cy: 80, r: 22, fill: '#4f8dff' }, svg);
            svgEl('path', { d: 'M310 70 q10 -6 18 4 q-4 10 -14 6 z', fill: '#4fd1b5' }, svg);
            svgEl('rect', { x: 166, y: 150, width: 68, height: 44, rx: 6, fill: '#d9b45a', stroke: '#f5c451' }, svg);
            svgEl('path', { d: 'M172 194 L150 228 M228 194 L250 228 M190 194 L182 228 M210 194 L218 228', stroke: '#dfe6ff', 'stroke-width': 3 }, svg);
            svgEl('path', { d: 'M142 228 h16 M242 228 h16', stroke: '#dfe6ff', 'stroke-width': 4 }, svg);
            svgEl('rect', { x: 186, y: 136, width: 28, height: 14, fill: '#3b5bd6' }, svg);
        },
        // 위성 여러 대가 지구를 감싸는 망 (항법·통신)
        network(svg, label) {
            bg(svg); if (label) title(svg, label);
            svgEl('circle', { cx: 200, cy: 170, r: 64, fill: '#1a3f8f' }, svg);
            svgEl('path', { d: 'M170 140 q20 -10 34 6 q-6 18 -24 14 z M214 176 q16 -2 20 14 q-12 10 -24 0 z', fill: '#4fd1b5', opacity: .8 }, svg);
            const pts = [];
            for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + .3; pts.push([200 + Math.cos(a) * 112, 170 + Math.sin(a) * 92]); }
            pts.forEach(([x, y], i) => {
                const [x2, y2] = pts[(i + 1) % pts.length];
                svgEl('line', { x1: x, y1: y, x2, y2, stroke: '#8fb4ff', opacity: .35 }, svg);
                svgEl('line', { x1: x, y1: y, x2: 200, y2: 170, stroke: '#f5c451', opacity: .18 }, svg);
            });
            pts.forEach(([x, y]) => { svgEl('rect', { x: x - 5, y: y - 5, width: 10, height: 10, fill: '#dfe6ff' }, svg); svgEl('rect', { x: x - 15, y: y - 2, width: 30, height: 4, fill: '#3b5bd6' }, svg); });
        },
        // 화성
        mars(svg, label) {
            bg(svg); if (label) title(svg, label);
            const g = svgEl('defs', {}, svg);
            const rg = svgEl('radialGradient', { id: 'marsG', cx: '35%', cy: '35%' }, g);
            svgEl('stop', { offset: '0%', 'stop-color': '#f0a070' }, rg); svgEl('stop', { offset: '100%', 'stop-color': '#7a2e12' }, rg);
            svgEl('circle', { cx: 200, cy: 170, r: 92, fill: 'url(#marsG)' }, svg);
            svgEl('path', { d: 'M140 150 q30 10 70 -4 q20 8 40 0', fill: 'none', stroke: '#5a2010', 'stroke-width': 6, opacity: .5 }, svg);
            svgEl('ellipse', { cx: 200, cy: 86, rx: 26, ry: 8, fill: '#f4f0ea', opacity: .9 }, svg);
        },
        // 탐사선 일반
        probe(svg, label) {
            bg(svg); if (label) title(svg, label);
            const g = svgEl('g', { transform: 'translate(200 168)' }, svg);
            svgEl('path', { d: 'M-46 -24 A52 52 0 0 1 46 -24 Z', fill: '#dfe6ff' }, g);
            svgEl('line', { x1: 0, y1: -24, x2: 0, y2: -52, stroke: '#dfe6ff', 'stroke-width': 3 }, g);
            svgEl('rect', { x: -20, y: -24, width: 40, height: 34, fill: '#d9b45a' }, g);
            svgEl('line', { x1: 20, y1: 0, x2: 96, y2: 40, stroke: '#a9b1d9', 'stroke-width': 2 }, g);
            svgEl('line', { x1: -20, y1: 0, x2: -70, y2: 48, stroke: '#a9b1d9', 'stroke-width': 2 }, g);
            svgEl('circle', { cx: 96, cy: 40, r: 5, fill: '#a9b1d9' }, g);
        }
    };

    function picture(it, w) {
        const box = document.createElement('div'); box.className = 'tl-pic';
        if (it.draw) {
            const svg = svgEl('svg', { viewBox: '0 0 400 300', role: 'img', 'aria-label': it.cap }, box);
            DRAW[it.draw](svg, it.drawLabel);
            return box;
        }
        const img = document.createElement('img');
        img.src = IMG(it.img.file, w); img.alt = it.img.cap; img.loading = 'lazy'; img.decoding = 'async';
        img.referrerPolicy = 'no-referrer';
        img.addEventListener('error', () => { box.innerHTML = `<span class="tl-fallback">${it.n}</span>`; });
        box.appendChild(img);
        return box;
    }

    // 카드 타임라인 한 단계
    // era: { years, lead, items, quiz, activity?(container, done) }
    // opts: { isLast: 마지막 단계면 질문을 맞힐 때 미션 완료, extraHtml(item): 카드 설명 아래에 덧붙일 HTML }
    function eraStep(era, opts = {}) {
        return (body, api) => {
            const hasAct = typeof era.activity === 'function';
            body.insertAdjacentHTML('beforeend', `<p class="lead"><b class="era-years">${era.years}</b> ${era.lead} 카드를 모두 눌러 읽으면 ${hasAct ? '활동과 ' : ''}탐구 질문이 나타나요.</p>`);
            const track = document.createElement('div'); track.className = 'tl-track';
            const detail = document.createElement('div'); detail.className = 'tl-detail';
            detail.innerHTML = '<p class="note">위 카드를 눌러 보세요.</p>';
            const status = document.createElement('p'); status.className = 'note';
            body.append(track, detail, status);
            const seen = new Set();
            const showStatus = () => { status.textContent = `읽은 카드: ${seen.size} / ${era.items.length}`; };
            showStatus();
            const after = document.createElement('div'); after.style.display = 'grid'; after.style.gap = '16px'; after.hidden = true;
            body.appendChild(after);
            const state = { act: !hasAct, quiz: false };
            const check = () => {
                if (!state.act || !state.quiz) return;
                if (opts.isLast) api.completeMission(); else api.done();
            };
            era.items.forEach((it, i) => {
                const b = document.createElement('button');
                b.type = 'button'; b.className = 'tl-card'; b.setAttribute('aria-pressed', 'false');
                b.appendChild(picture(it, 320));
                b.insertAdjacentHTML('beforeend', `<span class="yr">${it.y}</span><span class="nm">${it.n}</span>`);
                track.appendChild(b);
                b.addEventListener('click', () => {
                    track.querySelectorAll('.tl-card').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
                    b.classList.add('seen'); seen.add(i); showStatus();
                    detail.innerHTML = '';
                    const fig = document.createElement('figure');
                    fig.appendChild(picture(it, 800));
                    const cap = it.draw ? it.cap : it.img.cap;
                    fig.insertAdjacentHTML('beforeend', `<figcaption>${cap}${it.img ? ` <a href="${PAGE(it.img.file)}" target="_blank" rel="noopener">출처·이용 조건: Wikimedia Commons</a>` : ' (직접 그린 그림)'}</figcaption>`);
                    const txt = document.createElement('div');
                    txt.innerHTML = `<div class="tl-yr">${it.y}</div>
                        <h4>${it.n}${it.lf ? ` <small>(${it.lf})</small>` : ''}</h4>
                        ${it.en ? `<div class="tl-en">${it.en}</div>` : ''}
                        <p class="hl">${it.h}</p><p>${it.t}</p>${opts.extraHtml ? opts.extraHtml(it) : ''}${it.c ? `<p class="ch">${it.c}</p>` : ''}`;
                    detail.append(fig, txt);
                    if (seen.size === era.items.length) after.hidden = false;
                });
            });
            if (hasAct) {
                const box = document.createElement('div'); box.className = 'act-box';
                after.appendChild(box);
                era.activity(box, () => { state.act = true; check(); });
            }
            api.quiz(after, { ...era.quiz, keepStepOpen: true, onRight: () => { state.quiz = true; check(); } });
        };
    }

    // 단계 목록 만들기: 카드 단계 + (있으면) 마지막 내용정리
    function steps(eras, opts = {}) {
        return eras.map((era, i) => era.build
            ? { title: era.title, short: era.short, build: era.build }
            : { title: `${era.title} (${era.years})`, short: era.short, build: eraStep(era, { ...opts, isLast: opts.lastQuizCompletes && i === eras.length - 1 }) });
    }

    window.HistoryKit = { IMG, PAGE, DRAW, picture, eraStep, steps };
})();
