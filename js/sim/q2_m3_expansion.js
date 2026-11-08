// 퀘스트 2 · 미션 3 팽창하는 우주 — 풍선 모형, 내용정리
(function () {
    const { svgEl, layout, text } = SimKit;

    // 풍선 위 은하 위치 (단위: cm, 풍선을 부풀리기 전)
    const GAL = {
        '우리': { x: -1.4, y: 0.5, color: '#f5c451' },
        A: { x: -0.4, y: 0.5, color: '#8fb4ff' },
        B: { x: -1.0, y: -1.46, color: '#4fd1b5' },
        C: { x: 1.4, y: 1.6, color: '#ff9db0' }
    };
    const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);

    function balloon(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">풍선 표면에 은하 스티커를 붙이고 풍선을 부풀리면, 은하 사이의 거리가 어떻게 변할까요? 슬라이더로 풍선을 부풀리며 표의 거리를 비교해 보세요.</p>');
        const { view, ctrl } = layout(body);
        const W = 640, H = 540, CX = 320, CY = 262, U = 40;
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': '은하가 붙은 풍선이 부풀어 오르는 모습' }, view);
        const defs = svgEl('defs', {}, svg);
        const rg = svgEl('radialGradient', { id: 'bal', cx: '35%', cy: '30%' }, defs);
        svgEl('stop', { offset: '0%', 'stop-color': '#3a4aa8' }, rg);
        svgEl('stop', { offset: '100%', 'stop-color': '#151d45' }, rg);
        const ball = svgEl('circle', { cx: CX, cy: CY, fill: 'url(#bal)', stroke: '#5a69c7', 'stroke-width': 2 }, svg);
        const knot = svgEl('path', { fill: '#5a69c7' }, svg);
        const lines = svgEl('g', {}, svg), dots = svgEl('g', {}, svg);

        ctrl.innerHTML = `
            <div class="slider"><label for="inflate">풍선 크기 <output id="inflate-out"></output></label>
                <input id="inflate" type="range" min="1" max="1.8" step="0.01" value="1"></div>
            <div><div class="seg" role="group" aria-label="거리를 재는 기준 은하">
                <button type="button" data-ref="우리" aria-pressed="true">우리은하 기준</button>
                <button type="button" data-ref="C" aria-pressed="false">은하 C 기준</button>
            </div></div>
            <table class="data-table"><thead><tr><th>은하</th><th>처음 거리</th><th>지금 거리</th><th>늘어난 거리</th></tr></thead><tbody id="exp-rows"></tbody></table>
            <p class="note">풍선 표면은 우주 공간, 스티커는 은하를 나타내요. 스티커 자체의 크기는 변하지 않아요.</p>`;
        const slider = ctrl.querySelector('#inflate');
        let ref = '우리';
        function draw() {
            const k = parseFloat(slider.value), R = 3.4 * U * k;
            ball.setAttribute('r', R);
            knot.setAttribute('d', `M${CX - 10} ${CY + R + 14} L${CX + 10} ${CY + R + 14} L${CX} ${CY + R - 2} Z`);
            lines.innerHTML = ''; dots.innerHTML = '';
            const P = n => ({ x: CX + GAL[n].x * U * k, y: CY + GAL[n].y * U * k });
            Object.keys(GAL).forEach(n => {
                if (n === ref) return;
                const a = P(ref), b = P(n);
                svgEl('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: GAL[n].color, 'stroke-width': 1.5, 'stroke-dasharray': '5 5', opacity: .8 }, lines);
            });
            Object.keys(GAL).forEach(n => {
                const p = P(n);
                const g = svgEl('g', { transform: `translate(${p.x} ${p.y})` }, dots);
                svgEl('ellipse', { rx: 12, ry: 6, fill: GAL[n].color, opacity: .9, transform: 'rotate(-25)' }, g);
                svgEl('circle', { r: 3, fill: '#fff' }, g);
                text(g, 0, n === '우리' ? 26 : -14, n === '우리' ? '우리은하' : `은하 ${n}`, { 'text-anchor': 'middle', fill: '#eef1ff', 'font-weight': 700, 'font-size': 14 });
            });
            ctrl.querySelector('#inflate-out').textContent = `${k.toFixed(2)}배`;
            const rows = Object.keys(GAL).filter(n => n !== ref).sort((a, b) => dist(GAL[ref], GAL[a]) - dist(GAL[ref], GAL[b]));
            ctrl.querySelector('#exp-rows').innerHTML = rows.map(n => {
                const d0 = dist(GAL[ref], GAL[n]);
                return `<tr><td>${n === '우리' ? '우리은하' : '은하 ' + n}</td><td class="num">${d0.toFixed(1)} cm</td><td class="num">${(d0 * k).toFixed(1)} cm</td><td class="num">${(d0 * (k - 1)).toFixed(1)} cm</td></tr>`;
            }).join('');
        }
        ctrl.querySelectorAll('[data-ref]').forEach(b => b.addEventListener('click', () => {
            ref = b.dataset.ref;
            ctrl.querySelectorAll('[data-ref]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
            draw();
        }));
        slider.addEventListener('input', draw);
        draw();
        api.quiz(body, {
            q: '우리은하에서 볼 때, 풍선을 부풀리는 동안 가장 많이 멀어진 은하는 어느 것인가요?',
            options: ['은하 A (처음에 가장 가까웠음)', '은하 B', '은하 C (처음에 가장 멀었음)'], answer: 2,
            explain: '맞아요. 같은 시간 동안 멀리 있던 은하일수록 더 많이 멀어져요. 즉, 멀리 있는 은하일수록 더 빠르게 멀어져요. [은하 C 기준]으로 바꿔 봐도 모든 은하가 멀어지므로 팽창의 중심은 없어요.',
            hint: '풍선을 최대로 부풀린 뒤 표의 \'늘어난 거리\'를 비교해 보세요.'
        });
    }

    function summary(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">카드를 빈칸에 놓고 [확인]을 누르세요.</p>');
        Activities.fill(body, {
            lines: [
                '우주가 팽창하면서 은하 사이의 거리는 점점 [[멀어진다]].',
                '멀리 있는 은하일수록 더 [[빠르게]] 멀어진다.',
                '어느 은하에서 보아도 다른 은하들이 [[멀어지므로]] 우주 팽창의 중심은 [[없다]].',
                '우주는 매우 작은 한 점에서 대폭발로 시작해 계속 팽창하고 있다는 이론을 [[대폭발 우주론]]이라고 한다.'
            ],
            extras: ['가까워진다', '느리게', '지구 중심설', '가까워지므로', '일정하므로', '태양이다', '우리은하'],
            onSolved: () => api.completeMission()
        });
    }

    SIMS['2_3'] = { steps: [
        { title: '풍선 모형으로 보는 우주 팽창', short: '풍선 모형', build: balloon },
        { title: '내용정리', short: '내용정리', build: summary }
    ] };
})();
