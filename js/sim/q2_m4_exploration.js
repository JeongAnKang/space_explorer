// 퀘스트 2 · 미션 4 우주탐사 — 탐사 장비와 목적, 내용정리(우주 탐사 역사)
(function () {
    const { svgEl, layout, text } = SimKit;

    const GEAR = [
        { id: 'sat', name: '인공위성', x: 250, y: 300, info: '지구 주위를 돌며 통신, 방송, 기상 관측, 위치 정보(GPS) 등에 쓰여요.' },
        { id: 'tel', name: '우주 망원경', x: 330, y: 170, info: '대기의 방해 없이 먼 천체를 선명하게 관측해요. 예: 허블, 제임스 웹 우주 망원경' },
        { id: 'iss', name: '우주 정거장', x: 120, y: 190, info: '사람이 우주에 머물며 무중력 상태에서 여러 가지 실험을 해요.' },
        { id: 'probe', name: '탐사선', x: 500, y: 110, info: '달이나 다른 행성에 가까이 가거나 착륙해서 직접 조사해요. 예: 보이저호, 다누리' }
    ];

    function gear(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">우주 탐사에는 목적에 따라 여러 장비가 쓰여요. 그림 속 장비를 눌러 하는 일을 알아본 뒤, 아래에서 장비를 알맞은 목적에 놓아 보세요.</p>');
        const { view, ctrl } = layout(body);
        const W = 640, H = 400;
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': '지구 주위의 우주 탐사 장비' }, view);
        const defs = svgEl('defs', {}, svg);
        const eg = svgEl('radialGradient', { id: 'earthG', cx: '35%', cy: '30%' }, defs);
        svgEl('stop', { offset: '0%', 'stop-color': '#7fb2ff' }, eg); svgEl('stop', { offset: '100%', 'stop-color': '#1a3f8f' }, eg);
        svgEl('circle', { cx: 210, cy: 420, r: 150, fill: 'url(#earthG)' }, svg);
        text(svg, 210, 360, '지구', { 'text-anchor': 'middle', fill: '#eef1ff', 'font-weight': 700 });
        svgEl('ellipse', { cx: 210, cy: 420, rx: 210, ry: 190, fill: 'none', stroke: '#2f3b78', 'stroke-dasharray': '4 6' }, svg);
        svgEl('circle', { cx: 590, cy: 60, r: 26, fill: '#c9533a' }, svg);
        text(svg, 590, 104, '다른 행성', { 'text-anchor': 'middle' });
        svgEl('path', { d: 'M330 300 Q 450 220 560 80', fill: 'none', stroke: '#6f78a8', 'stroke-dasharray': '3 6' }, svg);
        const icon = (g, id) => {
            if (id === 'sat') { svgEl('rect', { x: -6, y: -6, width: 12, height: 12, fill: '#dfe6ff' }, g); svgEl('rect', { x: -26, y: -4, width: 18, height: 8, fill: '#8fb4ff' }, g); svgEl('rect', { x: 8, y: -4, width: 18, height: 8, fill: '#8fb4ff' }, g); }
            if (id === 'tel') { svgEl('rect', { x: -18, y: -8, width: 36, height: 16, rx: 3, fill: '#dfe6ff', transform: 'rotate(-30)' }, g); svgEl('rect', { x: -6, y: 8, width: 30, height: 6, fill: '#8fb4ff', transform: 'rotate(-30)' }, g); }
            if (id === 'iss') { svgEl('rect', { x: -30, y: -2, width: 60, height: 4, fill: '#dfe6ff' }, g); [-24, -12, 12, 24].forEach(x => svgEl('rect', { x: x - 4, y: -14, width: 8, height: 28, fill: '#f5c451', opacity: .85 }, g)); svgEl('rect', { x: -6, y: -6, width: 12, height: 12, fill: '#dfe6ff' }, g); }
            if (id === 'probe') { svgEl('circle', { r: 8, fill: '#dfe6ff' }, g); svgEl('path', { d: 'M-14 -10 A14 14 0 0 1 14 -10', fill: 'none', stroke: '#dfe6ff', 'stroke-width': 3 }, g); svgEl('line', { x1: 0, y1: 8, x2: 0, y2: 22, stroke: '#8fb4ff', 'stroke-width': 2 }, g); }
        };
        ctrl.innerHTML = '<div class="readout"><div class="row"><span>장비</span><b id="gear-name">그림 속 장비를 눌러 보세요</b></div><p id="gear-info" style="color:var(--ink-dim);font-size:15px"></p></div>';
        GEAR.forEach(gd => {
            const g = svgEl('g', { transform: `translate(${gd.x} ${gd.y})`, style: 'cursor:pointer', tabindex: 0, role: 'button', 'aria-label': gd.name }, svg);
            svgEl('circle', { r: 34, fill: 'transparent', stroke: 'transparent', 'stroke-width': 2, class: 'ring' }, g);
            icon(g, gd.id);
            text(g, 0, 46, gd.name, { 'text-anchor': 'middle', fill: '#eef1ff', 'font-weight': 700 });
            const show = () => {
                svg.querySelectorAll('.ring').forEach(r => r.setAttribute('stroke', 'transparent'));
                g.querySelector('.ring').setAttribute('stroke', '#f5c451');
                ctrl.querySelector('#gear-name').textContent = gd.name;
                ctrl.querySelector('#gear-info').textContent = gd.info;
            };
            g.addEventListener('click', show);
            g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } });
        });
        const h = document.createElement('h3'); h.textContent = '장비를 알맞은 목적에 놓기'; h.style.fontSize = '18px';
        body.appendChild(h);
        Activities.fill(body, {
            lines: [
                '지구 주위를 돌며 통신, 기상 관측, 위치 정보를 제공한다. → [[인공위성]]',
                '대기의 방해 없이 먼 천체를 선명하게 관측한다. → [[우주 망원경]]',
                '달이나 다른 행성에 가까이 가서 직접 조사한다. → [[탐사선]]',
                '사람이 우주에 머물며 무중력 상태에서 실험한다. → [[우주 정거장]]'
            ],
            onSolved: () => { api.done(); toast('맞았어요! 다음 단계로 넘어갈 수 있어요.'); }
        });
    }

    function summary(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">우주 탐사의 주요 사건을 일어난 순서대로 놓으세요. 모두 맞히면 연도가 나타나요.</p>');
        Activities.order(body, {
            topLabel: '먼저 일어난 일', bottomLabel: '나중에 일어난 일',
            items: [
                { value: 'sputnik', label: '최초의 인공위성 스푸트니크 1호 발사', extra: '1957년' },
                { value: 'apollo', label: '아폴로 11호, 사람이 처음 달에 착륙', extra: '1969년' },
                { value: 'voyager', label: '보이저 1호 발사, 태양계 바깥쪽 탐사', extra: '1977년' },
                { value: 'hubble', label: '허블 우주 망원경 발사', extra: '1990년' },
                { value: 'jwst', label: '제임스 웹 우주 망원경 발사', extra: '2021년' },
                { value: 'danuri', label: '우리나라 첫 달 궤도선 다누리 발사', extra: '2022년' }
            ],
            onSolved: () => api.completeMission()
        });
    }

    SIMS['2_4'] = { steps: [
        { title: '우주 탐사 장비와 목적', short: '탐사 장비', build: gear },
        { title: '내용정리 — 우주 탐사의 역사', short: '내용정리', build: summary }
    ] };
})();
