// =========================================================
// 끌어놓기 + 내용정리 활동 (터치·마우스 겸용, 외부 라이브러리 없음)
//  - 카드를 끌어서 칸에 놓거나, 카드를 누른 뒤 칸을 눌러도 됩니다.
//  - 틀린 칸에도 놓을 수 있고, [확인]을 누르면 맞고 틀림을 표시합니다.
// =========================================================
(function () {
    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        return a;
    }

    function makeChip(value, label) {
        const c = document.createElement('div');
        c.className = 'chip';
        c.dataset.value = value;
        c.textContent = label || value;
        c.tabIndex = 0;
        c.setAttribute('role', 'button');
        return c;
    }

    // 하나의 활동 영역(root) 안에서 카드(.chip)를 칸(.slot / .bin / .bank)으로 옮기는 기능
    function mount(root, onChange) {
        let selected = null, drag = null;
        const bank = root.querySelector('.bank');
        const zoneAt = (x, y) => {
            const el = document.elementFromPoint(x, y);
            const z = el && el.closest('.slot, .bin, .bank');
            return z && root.contains(z) ? z : null;
        };
        const clearMarks = () => root.querySelectorAll('.right, .wrong').forEach(e => e.classList.remove('right', 'wrong'));
        const select = c => { if (selected) selected.classList.remove('selected'); selected = c; if (c) c.classList.add('selected'); };

        function place(chip, zone) {
            if (!zone) return;
            if (zone.classList.contains('slot')) {
                const prev = zone.querySelector('.chip');
                if (prev && prev !== chip) {
                    const from = chip.parentElement;
                    (from && from.classList.contains('slot') ? from : bank).appendChild(prev);
                }
            }
            zone.appendChild(chip);
            clearMarks();
            markFilled();
            onChange && onChange();
        }
        // 카드가 들어간 칸은 'filled' 표시 → 문장 속 빈칸은 점선 없이 글자처럼 보임
        function markFilled() {
            root.querySelectorAll('.slot').forEach(s => s.classList.toggle('filled', !!s.querySelector('.chip')));
        }

        root.addEventListener('pointerdown', e => {
            const chip = e.target.closest('.chip');
            if (!chip || !root.contains(chip) || chip.classList.contains('locked')) return;
            e.preventDefault();
            drag = { chip, x: e.clientX, y: e.clientY, moved: false, ghost: null, over: null, id: e.pointerId };
        });
        window.addEventListener('pointermove', e => {
            if (!drag || e.pointerId !== drag.id) return;
            if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 8) return;
            if (!drag.moved) {
                drag.moved = true; select(null);
                const r = drag.chip.getBoundingClientRect();
                drag.dx = drag.x - r.left; drag.dy = drag.y - r.top;
                drag.ghost = drag.chip.cloneNode(true);
                drag.ghost.classList.add('ghost');
                drag.ghost.style.width = r.width + 'px';
                document.body.appendChild(drag.ghost);
                drag.chip.classList.add('placeholder');
            }
            drag.ghost.style.left = (e.clientX - drag.dx) + 'px';
            drag.ghost.style.top = (e.clientY - drag.dy) + 'px';
            const z = zoneAt(e.clientX, e.clientY);
            if (drag.over !== z) { drag.over && drag.over.classList.remove('over'); drag.over = z; z && z.classList.add('over'); }
        });
        const end = e => {
            if (!drag || e.pointerId !== drag.id) return;
            const d = drag; drag = null;
            if (d.moved) {
                d.ghost.remove(); d.chip.classList.remove('placeholder');
                d.over && d.over.classList.remove('over');
                place(d.chip, zoneAt(e.clientX, e.clientY));
            } else {
                // 그냥 누른 경우: 카드 선택 / 선택 해제
                select(selected === d.chip ? null : d.chip);
            }
        };
        window.addEventListener('pointerup', end);
        window.addEventListener('pointercancel', end);

        // 카드를 고른 뒤 칸을 누르면 그 칸으로 이동
        root.addEventListener('click', e => {
            if (!selected) return;
            if (e.target.closest('.chip')) return;
            const z = e.target.closest('.slot, .bin, .bank');
            if (z && root.contains(z)) { place(selected, z); select(null); }
        });
        // 키보드: 카드에서 Enter → 선택
        root.addEventListener('keydown', e => {
            const chip = e.target.closest('.chip');
            if (chip && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(selected === chip ? null : chip); }
        });
    }

    function checkRow(onCheck) {
        const row = document.createElement('div');
        row.className = 'check-row';
        row.innerHTML = '<button type="button" class="btn btn-primary">확인</button><span class="result" aria-live="polite"></span>';
        row.querySelector('button').addEventListener('click', () => {
            const { ok, right, total } = onCheck();
            const r = row.querySelector('.result');
            r.className = 'result ' + (ok ? 'ok' : 'bad');
            r.textContent = ok ? '모두 맞았어요!' : `${total}개 중 ${right}개 맞았어요. 빨간 칸을 다시 생각해 보세요.`;
        });
        return row;
    }

    // 빈칸 채우기: lines 안의 [[정답]] 자리에 칸이 생깁니다.
    function fill(container, { lines, extras = [], onSolved }) {
        const root = document.createElement('div');
        root.style.display = 'grid'; root.style.gap = '14px';
        const text = document.createElement('div');
        text.className = 'fill-text';
        const answers = [];
        lines.forEach(line => {
            const p = document.createElement('p');
            line.split(/(\[\[.+?\]\])/).forEach(part => {
                const m = part.match(/^\[\[(.+)\]\]$/);
                if (m) {
                    const s = document.createElement('span');
                    s.className = 'slot'; s.dataset.answer = m[1];
                    p.appendChild(s); answers.push(m[1]);
                } else if (part) p.appendChild(document.createTextNode(part));
            });
            text.appendChild(p);
        });
        const bank = document.createElement('div');
        bank.className = 'bank';
        shuffle(answers.concat(extras)).forEach(v => bank.appendChild(makeChip(v)));
        root.append(text, bank);
        let solved = false;
        root.appendChild(checkRow(() => {
            const slots = [...text.querySelectorAll('.slot')];
            let right = 0;
            slots.forEach(s => {
                const c = s.querySelector('.chip');
                const ok = c && c.dataset.value === s.dataset.answer;
                s.classList.toggle('right', !!ok); s.classList.toggle('wrong', !ok);
                if (ok) right++;
            });
            const ok = right === slots.length;
            if (ok && !solved) { solved = true; onSolved && onSolved(); }
            return { ok, right, total: slots.length };
        }));
        container.appendChild(root);
        mount(root);
    }

    // 순서 배열: items 순서가 정답 (위 → 아래)
    function order(container, { items, topLabel, bottomLabel, onSolved }) {
        const root = document.createElement('div');
        root.style.display = 'grid'; root.style.gap = '14px';
        const ends = document.createElement('div'); ends.className = 'order-ends';
        const list = document.createElement('div'); list.className = 'order-list';
        items.forEach((it, i) => {
            const row = document.createElement('div'); row.className = 'order-row';
            row.innerHTML = `<span class="rank">${i + 1}</span><span class="slot" data-answer="${it.value}"></span><span class="extra" hidden>${it.extra || ''}</span>`;
            list.appendChild(row);
        });
        if (topLabel) { const t = document.createElement('div'); t.className = 'order-ends'; t.innerHTML = `<span>▲ ${topLabel}</span>`; root.appendChild(t); }
        root.appendChild(list);
        if (bottomLabel) { ends.innerHTML = `<span>▼ ${bottomLabel}</span>`; root.appendChild(ends); }
        const bank = document.createElement('div'); bank.className = 'bank';
        shuffle(items).forEach(it => bank.appendChild(makeChip(it.value, it.label)));
        root.appendChild(bank);
        let solved = false;
        root.appendChild(checkRow(() => {
            const slots = [...list.querySelectorAll('.slot')];
            let right = 0;
            slots.forEach(s => {
                const c = s.querySelector('.chip');
                const ok = c && c.dataset.value === s.dataset.answer;
                s.classList.toggle('right', !!ok); s.classList.toggle('wrong', !ok);
                if (ok) right++;
            });
            const ok = right === slots.length;
            if (ok) list.querySelectorAll('.extra').forEach(e => { e.hidden = false; });
            if (ok && !solved) { solved = true; onSolved && onSolved(); }
            return { ok, right, total: slots.length };
        }));
        container.appendChild(root);
        mount(root);
    }

    // 분류하기: 카드를 알맞은 상자로
    function classify(container, { bins, items, onSolved }) {
        const root = document.createElement('div');
        root.style.display = 'grid'; root.style.gap = '14px';
        const binWrap = document.createElement('div'); binWrap.className = 'bins';
        bins.forEach(b => {
            const el = document.createElement('div');
            el.className = 'bin'; el.dataset.bin = b.id;
            el.innerHTML = `<h4>${b.name}</h4>`;
            binWrap.appendChild(el);
        });
        const bank = document.createElement('div'); bank.className = 'bank';
        shuffle(items).forEach(it => { const c = makeChip(it.bin, it.label); c.dataset.label = it.label; bank.appendChild(c); });
        root.append(binWrap, bank);
        let solved = false;
        root.appendChild(checkRow(() => {
            let right = 0;
            root.querySelectorAll('.chip').forEach(c => {
                const bin = c.parentElement.closest('.bin');
                const ok = bin && bin.dataset.bin === c.dataset.value;
                c.classList.toggle('right', !!ok); c.classList.toggle('wrong', !ok);
                if (ok) right++;
            });
            const ok = right === items.length;
            if (ok && !solved) { solved = true; onSolved && onSolved(); }
            return { ok, right, total: items.length };
        }));
        container.appendChild(root);
        mount(root);
    }

    window.Activities = { fill, order, classify, mount, makeChip, shuffle };
})();
