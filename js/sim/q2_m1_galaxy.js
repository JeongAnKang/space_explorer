// 퀘스트 2 · 미션 1 우리은하의 구조 — 3D 모형(돌려 보기), 위·옆에서 본 모습, 태양계의 위치, 내용정리
(function () {
    const { layout } = SimKit;

    // 우리은하 모형 점 만들기 (지름 100 = 약 30,000 pc)
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
        // 헤일로: 은하를 둘러싼 공 모양 공간의 희미한 별
        for (let i = 0; i < 500; i++) {
            const r = 20 + rnd() * 45, u = rnd() * 2 - 1, ph = rnd() * Math.PI * 2, q = Math.sqrt(1 - u * u);
            pts.push({ x: r * q * Math.cos(ph), y: r * q * Math.sin(ph), z: r * u, c: 'halo', s: .8 });
        }
        // 구상 성단: 헤일로와 중심부에 흩어진 별 무리
        for (let k = 0; k < 14; k++) {
            const r = 12 + rnd() * 42, u = rnd() * 2 - 1, ph = rnd() * Math.PI * 2, q = Math.sqrt(1 - u * u);
            const cx = r * q * Math.cos(ph), cy = r * q * Math.sin(ph), cz = r * u;
            for (let i = 0; i < 40; i++) pts.push({ x: cx + gauss() * .7, y: cy + gauss() * .7, z: cz + gauss() * .7, c: 'glob', s: 1 });
        }
        return pts;
    }
    const COLORS = { warm: 'rgba(255, 214, 150, ', pale: 'rgba(225, 232, 255, ', blue: 'rgba(160, 196, 255, ', halo: 'rgba(200, 205, 230, ', glob: 'rgba(255, 196, 140, ' };
    const ALPHA = { warm: .55, pale: .42, blue: .42, halo: .22, glob: .7 };
    // 태양계: 중심에서 약 8,500 pc (지름 30,000 pc 기준으로 100 × 8500/30000 ≈ 28.3)
    const SUN = { x: 28.3 * Math.cos(2.3), y: 28.3 * Math.sin(2.3), z: 0 };

    function structure(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">우리은하는 수천억 개의 별이 모인 은하예요. 3D 우리은하 모형을 <b>손가락으로 끌어</b> 돌려 보세요. 좌우로 끌면 회전하고, 위아래로 끌면 기울어져요. 위에서 본 모습과 옆에서 본 모습을 비교하고 태양계의 위치를 확인해 보세요.</p>');
        const { view, ctrl } = layout(body);
        const cv = document.createElement('canvas');
        cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', '끌어서 돌려 볼 수 있는 3D 우리은하 모형');
        cv.style.aspectRatio = '16 / 11';
        cv.style.cursor = 'grab';
        view.appendChild(cv);
        const pts = makeGalaxy();
        ctrl.innerHTML = `
            <div><div class="seg" role="group" aria-label="보는 방향">
                <button type="button" data-tilt="0" aria-pressed="true">위에서 보기</button>
                <button type="button" data-tilt="90" aria-pressed="false">옆에서 보기</button>
            </div></div>
            <div class="slider"><label for="tilt">기울기 <output id="tilt-out"></output></label>
                <input id="tilt" type="range" min="0" max="90" step="1" value="35"></div>
            <div class="readout">
                <div class="row"><span>보이는 모양</span><b id="shape"></b></div>
                <div class="row"><span>지름</span><b>약 30,000 pc</b></div>
                <div class="row"><span>태양계 위치</span><b>중심에서 약 8,500 pc</b></div>
            </div>
            <label style="display:flex;gap:10px;align-items:center;min-height:44px"><input type="checkbox" id="show-sun" checked style="width:22px;height:22px"> 태양계 위치 표시</label>
            <label style="display:flex;gap:10px;align-items:center;min-height:44px"><input type="checkbox" id="auto-spin" checked style="width:22px;height:22px"> 천천히 저절로 돌기</label>`;
        const slider = ctrl.querySelector('#tilt'), sunBox = ctrl.querySelector('#show-sun'), spinBox = ctrl.querySelector('#auto-spin');
        const ctx = cv.getContext('2d');
        let yaw = 0.6, w = 0, h = 0;
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) spinBox.checked = false;

        function resize() {
            const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
            if (!r.width) return;
            w = r.width; h = r.height;
            cv.width = w * dpr; cv.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        // 3차원 회전(은하 축 둘레로 yaw, 앞으로 기울이기 tilt) + 원근
        function project(p, cy_, sy_, ct, st, k, cx, cy) {
            const x1 = p.x * cy_ - p.y * sy_, y1 = p.x * sy_ + p.y * cy_;
            const Y = y1 * ct - p.z * st, Z = y1 * st + p.z * ct;
            const f = 260 / (260 + Z * 1.4);                       // 가까운 쪽은 크게, 먼 쪽은 작게
            return [cx + x1 * k * f, cy + Y * k * f, f];
        }
        function draw() {
            if (!w) resize();
            if (!w) return;
            const k = Math.min(w, h * 1.45) / 118, cx = w / 2, cy = h / 2;
            const t = parseFloat(slider.value) * Math.PI / 180, ct = Math.cos(t), st = Math.sin(t);
            const cy_ = Math.cos(yaw), sy_ = Math.sin(yaw);
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = '#070a1d'; ctx.fillRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';
            for (const p of pts) {
                const [x, y, f] = project(p, cy_, sy_, ct, st, k, cx, cy);
                const a = ALPHA[p.c] * Math.min(1.2, f);
                ctx.fillStyle = COLORS[p.c] + a + ')';
                const sz = p.s * 1.3 * f;
                ctx.fillRect(x, y, sz, sz);
            }
            ctx.globalCompositeOperation = 'source-over';
            ctx.font = '600 13px system-ui, sans-serif';
            // 지름 눈금: 은하 원반을 가로지르는 선 (모형과 함께 돌아감)
            const e1 = project({ x: -50, y: 0, z: 0 }, cy_, sy_, ct, st, k, cx, cy), e2 = project({ x: 50, y: 0, z: 0 }, cy_, sy_, ct, st, k, cx, cy);
            function pill(t, x, y, color) {
                ctx.font = '700 14px system-ui, sans-serif';
                const tw = ctx.measureText(t).width, px = Math.min(Math.max(x, tw / 2 + 8), w - tw / 2 - 8);
                ctx.fillStyle = 'rgba(8, 11, 30, .82)';
                ctx.beginPath(); ctx.roundRect(px - tw / 2 - 7, y - 11, tw + 14, 22, 11); ctx.fill();
                ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(t, px, y); ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
            }
            ctx.strokeStyle = 'rgba(169, 177, 217, .7)'; ctx.lineWidth = 1.5; ctx.setLineDash([2, 4]);
            ctx.beginPath(); ctx.moveTo(e1[0], e1[1]); ctx.lineTo(e2[0], e2[1]); ctx.stroke(); ctx.setLineDash([]);
            const dy = Math.max(e1[1], e2[1]) + 30;
            pill('지름 약 30,000 pc', (e1[0] + e2[0]) / 2, Math.max(dy, cy + 58) > h - 14 ? Math.min(e1[1], e2[1]) - 18 : Math.max(dy, cy + 58), '#cfd5f5');
            if (sunBox.checked) {
                const [sx, sy] = project(SUN, cy_, sy_, ct, st, k, cx, cy);
                ctx.strokeStyle = '#f5c451'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI * 2); ctx.stroke();
                ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(sx, sy); ctx.stroke(); ctx.setLineDash([]);
                pill('태양계', sx, sy - 22, '#f5c451');
                pill('약 8,500 pc', (cx + sx) / 2, (cy + sy) / 2 + 20, '#f5c451');
            }
            const deg = parseFloat(slider.value);
            ctrl.querySelector('#tilt-out').textContent = deg < 15 ? '위에서' : deg > 75 ? '옆에서' : `${Math.round(deg)}°`;
            ctrl.querySelector('#shape').textContent = deg < 15 ? '막대 나선 모양' : deg > 75 ? '중심부가 볼록한 원반 모양' : '기울어진 모습';
            ctrl.querySelectorAll('[data-tilt]').forEach(b => b.setAttribute('aria-pressed', String((deg < 15 && b.dataset.tilt === '0') || (deg > 75 && b.dataset.tilt === '90'))));
        }
        // 끌어서 돌리기: 좌우 → 회전, 위아래 → 기울기
        let drag = null;
        cv.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, yaw, tilt: parseFloat(slider.value) }; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing'; });
        cv.addEventListener('pointermove', e => {
            if (!drag) return;
            yaw = drag.yaw + (e.clientX - drag.x) * .01;
            slider.value = Math.max(0, Math.min(90, drag.tilt + (e.clientY - drag.y) * .4));
            draw();
        });
        const stop = () => { drag = null; cv.style.cursor = 'grab'; };
        cv.addEventListener('pointerup', stop);
        cv.addEventListener('pointercancel', stop);
        ctrl.querySelectorAll('[data-tilt]').forEach(b => b.addEventListener('click', () => { slider.value = b.dataset.tilt; draw(); }));
        slider.addEventListener('input', draw);
        sunBox.addEventListener('change', draw);
        // 저절로 천천히 돌기 (끌고 있을 때는 멈춤, 단계를 떠나면 끝남)
        let last = 0;
        function tick(now) {
            if (!cv.isConnected) return;
            if (spinBox.checked && !drag && now - last > 33) { yaw += .006; last = now; draw(); }
            requestAnimationFrame(tick);
        }
        new ResizeObserver(() => { resize(); draw(); }).observe(cv);
        requestAnimationFrame(tick);
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
                '우리은하의 지름은 약 [[30,000 pc]]이다.',
                '태양계는 우리은하 중심에서 약 [[8,500 pc]] 떨어진 곳에 있다.'
            ],
            extras: ['타원', '공', '3,000 pc', '85,000 pc'],
            onSolved: () => api.completeMission()
        });
    }

    SIMS['2_1'] = { steps: [
        { title: '위와 옆에서 본 우리은하', short: '우리은하의 모양', build: structure },
        { title: '내용정리', short: '내용정리', build: summary }
    ] };
})();
