// 퀘스트 2 · 미션 1 우리은하의 구조 — 위·옆에서 본 모습, 태양계의 위치, 내용정리
(function () {
    const { layout } = SimKit;

    // 우리은하 모형 점 만들기 (지름 100 = 10만 광년)
    function makeGalaxy() {
        let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
        const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
        const pts = [];
        // 팽대부 (중심부)
        for (let i = 0; i < 900; i++) pts.push({ x: gauss() * 5, y: gauss() * 5, z: gauss() * 3.6, c: 'warm', s: 1.4 });
        // 막대
        for (let i = 0; i < 700; i++) pts.push({ x: (rnd() * 2 - 1) * 13, y: gauss() * 2.4, z: gauss() * 1.4, c: 'warm', s: 1.2 });
        // 나선팔 두 개 (막대 끝에서 시작)
        for (let arm = 0; arm < 2; arm++) {
            for (let i = 0; i < 2600; i++) {
                const t = rnd();
                const r = 13 + t * 37, th = arm * Math.PI + t * 4.4;
                pts.push({ x: r * Math.cos(th) + gauss() * 2.2, y: r * Math.sin(th) + gauss() * 2.2, z: gauss() * 0.9, c: rnd() > .7 ? 'blue' : 'pale', s: 1 });
            }
        }
        // 원반에 흩어진 별
        for (let i = 0; i < 1800; i++) {
            const r = Math.sqrt(rnd()) * 50, th = rnd() * Math.PI * 2;
            pts.push({ x: r * Math.cos(th), y: r * Math.sin(th), z: gauss() * 0.9, c: 'pale', s: .9 });
        }
        return pts;
    }
    const COLORS = { warm: 'rgba(255, 214, 150, ', pale: 'rgba(225, 232, 255, ', blue: 'rgba(160, 196, 255, ' };
    // 태양계: 중심에서 약 3만 광년(= 30), 나선팔 사이
    const SUN = { x: 30 * Math.cos(2.3), y: 30 * Math.sin(2.3), z: 0 };

    function structure(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">우리은하는 수천억 개의 별이 모인 은하예요. 우리은하 모형을 위에서도, 옆에서도 보며 모양을 비교하고 태양계의 위치를 확인해 보세요. 그림을 위아래로 끌어도 기울어져요.</p>');
        const { view, ctrl } = layout(body);
        const cv = document.createElement('canvas');
        cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', '기울기를 바꿀 수 있는 우리은하 모형');
        cv.style.aspectRatio = '16 / 11';
        view.appendChild(cv);
        const pts = makeGalaxy();
        ctrl.innerHTML = `
            <div><div class="seg" role="group" aria-label="보는 방향">
                <button type="button" data-tilt="0" aria-pressed="true">위에서 보기</button>
                <button type="button" data-tilt="90" aria-pressed="false">옆에서 보기</button>
            </div></div>
            <div class="slider"><label for="tilt">기울기 <output id="tilt-out"></output></label>
                <input id="tilt" type="range" min="0" max="90" step="1" value="0"></div>
            <div class="readout">
                <div class="row"><span>보이는 모양</span><b id="shape"></b></div>
                <div class="row"><span>지름</span><b>약 10만 광년</b></div>
                <div class="row"><span>태양계 위치</span><b>중심에서 약 3만 광년</b></div>
            </div>
            <label style="display:flex;gap:10px;align-items:center;min-height:44px"><input type="checkbox" id="show-sun" checked style="width:22px;height:22px"> 태양계 위치 표시</label>`;
        const slider = ctrl.querySelector('#tilt'), sunBox = ctrl.querySelector('#show-sun');
        const ctx = cv.getContext('2d');
        function draw() {
            const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
            if (!r.width) return;
            cv.width = r.width * dpr; cv.height = r.height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const w = r.width, h = r.height, k = Math.min(w, h * 1.45) / 112, cx = w / 2, cy = h / 2;
            const t = parseFloat(slider.value) * Math.PI / 180, ct = Math.cos(t), st = Math.sin(t);
            ctx.fillStyle = '#070a1d'; ctx.fillRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';
            for (const p of pts) {
                const x = cx + p.x * k, y = cy + (p.y * ct - p.z * st) * k;
                ctx.fillStyle = COLORS[p.c] + (p.c === 'warm' ? .55 : .42) + ')';
                ctx.fillRect(x, y, p.s * 1.3, p.s * 1.3);
            }
            ctx.globalCompositeOperation = 'source-over';
            ctx.font = '600 13px system-ui, sans-serif';
            if (sunBox.checked) {
                const sx = cx + SUN.x * k, sy = cy + (SUN.y * ct - SUN.z * st) * k;
                ctx.strokeStyle = '#f5c451'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI * 2); ctx.stroke();
                ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(sx, sy); ctx.stroke(); ctx.setLineDash([]);
                ctx.fillStyle = '#f5c451'; ctx.fillText('태양계', sx + 10, sy - 8);
                ctx.fillStyle = '#a9b1d9'; ctx.fillText('약 3만 광년', (cx + sx) / 2 + 8, (cy + sy) / 2 + 16);
            }
            // 지름 눈금
            ctx.strokeStyle = '#6f78a8'; ctx.lineWidth = 1.5;
            const yb = h - 18;
            ctx.beginPath(); ctx.moveTo(cx - 50 * k, yb); ctx.lineTo(cx + 50 * k, yb);
            ctx.moveTo(cx - 50 * k, yb - 5); ctx.lineTo(cx - 50 * k, yb + 5); ctx.moveTo(cx + 50 * k, yb - 5); ctx.lineTo(cx + 50 * k, yb + 5); ctx.stroke();
            ctx.fillStyle = '#a9b1d9'; ctx.textAlign = 'center'; ctx.fillText('약 10만 광년', cx, yb - 8); ctx.textAlign = 'start';
            const deg = parseFloat(slider.value);
            ctrl.querySelector('#tilt-out').textContent = deg < 15 ? '위에서' : deg > 75 ? '옆에서' : `${deg}°`;
            ctrl.querySelector('#shape').textContent = deg < 15 ? '막대 나선 모양' : deg > 75 ? '중심부가 볼록한 원반 모양' : '기울어진 모습';
            ctrl.querySelectorAll('[data-tilt]').forEach(b => b.setAttribute('aria-pressed', String((deg < 15 && b.dataset.tilt === '0') || (deg > 75 && b.dataset.tilt === '90'))));
        }
        ctrl.querySelectorAll('[data-tilt]').forEach(b => b.addEventListener('click', () => { slider.value = b.dataset.tilt; draw(); }));
        slider.addEventListener('input', draw);
        sunBox.addEventListener('change', draw);
        let drag = null;
        cv.addEventListener('pointerdown', e => { drag = { y: e.clientY, v: parseFloat(slider.value) }; cv.setPointerCapture(e.pointerId); });
        cv.addEventListener('pointermove', e => { if (!drag) return; slider.value = Math.max(0, Math.min(90, drag.v + (e.clientY - drag.y) * .5)); draw(); });
        cv.addEventListener('pointerup', () => { drag = null; });
        new ResizeObserver(draw).observe(cv);
        api.quiz(body, {
            q: '우리은하를 옆에서 보면 어떤 모양일까요?',
            options: ['막대 나선 모양', '중심부가 볼록한 원반 모양', '공 모양'], answer: 1,
            explain: '맞아요. 위에서 보면 막대 나선 모양, 옆에서 보면 중심부가 볼록한 원반 모양이에요.',
            hint: '[옆에서 보기]를 눌러 모양을 확인해 보세요.'
        });
    }

    function summary(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">카드를 빈칸에 놓고 [확인]을 누르세요.</p>');
        Activities.fill(body, {
            lines: [
                '우리은하를 위에서 보면 중심부의 막대 구조를 나선팔이 휘감고 있는 [[막대 나선]] 모양이다.',
                '우리은하를 옆에서 보면 중심부가 볼록한 [[원반]] 모양이다.',
                '우리은하의 지름은 약 [[10만 광년]]이다.',
                '태양계는 우리은하 중심에서 약 [[3만 광년]] 떨어진 곳에 있다.'
            ],
            extras: ['타원', '공', '1만 광년', '100만 광년'],
            onSolved: () => api.completeMission()
        });
    }

    SIMS['2_1'] = { steps: [
        { title: '위와 옆에서 본 우리은하', short: '우리은하의 모양', build: structure },
        { title: '내용정리', short: '내용정리', build: summary }
    ] };
})();
