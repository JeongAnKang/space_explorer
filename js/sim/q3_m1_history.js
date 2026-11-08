// 퀘스트 3 · 미션 1 우주 관측의 역사 — 맨눈 → 망원경 → 분광 → 은하 → 보이지 않는 빛
(function () {
    const { svgEl, text } = SimKit;

    // ---------- 우주 관측의 역사 (스텝 2~6) ----------
    // 이미지는 Wikimedia Commons에서 바로 불러와요. 각 사진 아래 출처를 누르면 저작자와 이용 조건을 볼 수 있어요.
    const IMG = (file, w) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;
    const PAGE = file => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}`;

    // 사진 대신 직접 그린 그림 (적당한 공개 이미지가 없을 때)
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
            svgEl('path', { d: 'M30 250 H370', stroke: '#6f78a8', 'stroke-width': 1.5, 'marker-end': '' }, svg);
            text(svg, 30, 270, '표면 온도 높음', { fill: '#9bb0ff', 'font-size': 13 });
            text(svg, 370, 270, '표면 온도 낮음', { fill: '#ffb36b', 'font-size': 13, 'text-anchor': 'end' });
            text(svg, 200, 50, '캐넌의 분광형 순서', { fill: '#f5c451', 'font-size': 16, 'font-weight': 700, 'text-anchor': 'middle' });
        }
    };

    const ERAS = [
        {
            title: '맨눈으로 하늘을 기록하다', years: 'BC 2세기경 – 1609', short: '맨눈 관측',
            lead: '망원경이 없던 시대, 천문학자들은 맨눈과 각도를 재는 도구만으로 별의 밝기와 위치를 기록했어요.',
            items: [
                { y: 'BC 129경', n: '히파르코스', lf: 'BC 190경–BC 120경', en: 'Hipparchus',
                  h: '별을 밝기에 따라 여섯 무리로 나누다',
                  t: '약 850개 별의 위치를 담은 별 목록을 만들었어요. 가장 밝은 별을 1등성, 맨눈으로 겨우 보이는 별을 6등성으로 나눴다고 전해져요. 지구 자전축이 천천히 도는 세차 운동도 발견했어요.',
                  c: '오늘날 쓰는 등급 체계의 출발점이에요.',
                  img: { file: 'Atlas (Farnese Globe).jpg', cap: '고대 그리스의 별자리가 새겨진 천구의를 떠받친 조각상 (파르네세 아틀라스)' } },
                { y: '1572', n: '티코 브라헤', lf: '1546–1601', en: 'Tycho Brahe',
                  h: '맨눈 관측의 정밀도를 끝까지 끌어올리다',
                  t: '커다란 사분의를 만들어 별의 위치를 각도 약 1′(1/60도) 수준까지 쟀어요. 1572년 카시오페이아자리에 나타난 새 별(초신성)이 달보다 멀다는 것을 보여, 하늘은 변하지 않는다는 생각을 깼어요. 연주시차는 찾지 못해 지구가 멈춰 있다고 결론 내렸어요.',
                  c: '그의 관측 기록이 케플러 법칙의 바탕이 돼요.',
                  img: { file: 'Tycho Cas SN1572.jpg', cap: '티코 브라헤가 기록한 1572년 새 별(초신성)의 위치. 카시오페이아자리 그림 위쪽의 I가 새 별이에요.' } },
                { y: '1609', n: '케플러', lf: '1571–1630', en: 'Johannes Kepler',
                  h: '행성은 타원을 그리며 돈다',
                  t: '티코의 화성 관측 자료를 분석해, 행성이 태양을 한 초점으로 하는 타원 궤도를 돈다는 행성 운동 법칙을 발표했어요(1609, 1619).',
                  c: '태양 중심설이 정확한 예측을 하게 되었어요.',
                  img: { file: 'Kepler-solar-system-1.png', cap: '케플러가 『우주의 신비』(1596)에 그린 태양계 모형' } }
            ],
            quiz: { q: '티코 브라헤의 정밀한 관측 기록을 분석해, 행성이 타원 궤도를 돈다는 것을 밝힌 사람은 누구일까요?',
                options: ['히파르코스', '케플러', '티코 브라헤'], answer: 1,
                explain: '맞아요. 케플러는 티코가 남긴 화성 관측 기록을 분석해 행성 운동 법칙을 찾았어요.',
                hint: '케플러 카드를 다시 읽어 보세요.' }
        },
        {
            title: '망원경, 6등성 너머를 보다', years: '1609 – 1800', short: '망원경',
            lead: '망원경이 하늘을 향하자 맨눈으로는 보이지 않던 어두운 별과 뿌연 천체들이 모습을 드러냈어요.',
            items: [
                { y: '1610', n: '갈릴레이', lf: '1564–1642', en: 'Galileo Galilei',
                  h: '망원경을 하늘로 향하다',
                  t: '1609년 직접 만든 약 20배 굴절 망원경으로 하늘을 보고 이듬해 『별의 전령』을 냈어요. 은하수가 수많은 별의 모임이고, 6등성보다 어두운 별이 셀 수 없이 많다는 것을 알았어요. 목성의 위성 4개와 금성의 위상 변화도 발견했어요.',
                  c: '맨눈의 한계인 6등성을 처음 넘어섰어요.',
                  img: { file: "Galileo's sketches of the moon.png", cap: '갈릴레이가 망원경으로 보고 그린 달의 모습 (1609)' } },
                { y: '1668', n: '뉴턴', lf: '1643–1727', en: 'Isaac Newton',
                  h: '렌즈 대신 거울로 빛을 모으다',
                  t: '오목 거울을 쓰는 반사 망원경을 만들었어요. 렌즈가 색마다 빛을 다르게 꺾어 생기는 색 번짐(색수차)이 없어요. 1687년에는 만유인력 법칙을 발표했어요.',
                  c: '이후 대형 망원경은 대부분 반사 망원경이 돼요.',
                  img: { file: 'NewtonsTelescopeReplica.jpg', cap: '뉴턴이 만든 반사 망원경의 복제품' } },
                { y: '1774–1781', n: '메시에', lf: '1730–1817', en: 'Charles Messier',
                  h: '혜성이 아닌 뿌연 천체 목록',
                  t: '혜성을 찾던 메시에는 혜성과 헷갈리는 흐릿한 천체를 따로 기록했어요. 1781년까지 103개를 정리했고 뒤에 추가되어 지금은 M1~M110이에요. 성운·성단 외에 은하가 40개 들어 있지만, 당시에는 모두 성운으로 여겼어요.',
                  c: 'M31(안드로메다)처럼 지금도 메시에 번호로 불러요.',
                  img: { file: 'Crab Nebula.jpg', cap: '메시에 목록의 1번 천체 M1, 게 성운 (허블 우주 망원경)' } },
                { y: '1781', n: '윌리엄 허셜', lf: '1738–1822', en: 'William Herschel',
                  h: '직접 만든 망원경으로 우리은하의 모양을 그리다',
                  t: '음악가였던 허셜은 반사 망원경 거울을 직접 갈아 만들었고 1781년 천왕성을 발견했어요. 하늘 여러 방향의 별 수를 세어 우리은하가 납작한 원반 모양이라고 주장했어요. 1789년 구경 1.2m의 "40피트 망원경"을 완성했어요.',
                  c: '우리은하를 하나의 구조로 본 첫 시도예요.',
                  img: { file: 'Herschel 40 foot.jpg', cap: '허셜의 40피트 망원경 (1789)' } }
            ],
            quiz: { q: '갈릴레이가 망원경으로 하늘을 보고 알아낸 것으로 옳은 것은 무엇일까요?',
                options: ['은하수는 수많은 별의 모임이다', '모든 별은 6등성보다 밝다', '행성은 완전한 원 궤도를 돈다'], answer: 0,
                explain: '맞아요. 갈릴레이는 은하수가 수많은 별의 모임이고, 6등성보다 어두운 별도 아주 많다는 것을 알았어요.',
                hint: '갈릴레이 카드를 다시 읽어 보세요.' }
        },
        {
            title: '빛을 쪼개다', years: '1800 – 1913', short: '빛을 쪼개다',
            lead: '별빛을 프리즘으로 쪼개 스펙트럼을 읽으면서, 직접 갈 수 없는 별의 성분·온도·거리를 알아내기 시작했어요.',
            items: [
                { y: '1814', n: '프라운호퍼', lf: '1787–1826', en: 'Joseph von Fraunhofer',
                  h: '햇빛 무지개 속 검은 선',
                  t: '정밀한 분광기로 태양 스펙트럼에서 570여 개의 검은 선(흡수선)을 찾아 기록했어요.',
                  c: '별빛을 쪼개 읽는 분광학이 시작되었어요.',
                  img: { file: 'Fraunhofer lines.svg', cap: '햇빛 스펙트럼 속 검은 선, 프라운호퍼선' } },
                { y: '1838', n: '프리드리히 베셀', lf: '1784–1846', en: 'Friedrich Bessel',
                  h: '처음으로 별까지의 거리를 재다',
                  t: '백조자리 61번 별의 연주시차를 0.314″로 측정해 거리가 약 10광년이라고 발표했어요(현재 값 0.286″, 약 3.5 pc). 같은 시기 헨더슨과 스트루베도 다른 별의 연주시차를 측정했어요.',
                  c: '코페르니쿠스 이후 약 300년 만에 연주시차가 확인되었어요.',
                  draw: 'parallax', cap: '베셀이 잰 백조자리 61번 별의 연주시차 (그림은 크게 과장했어요)' },
                { y: '1859', n: '키르히호프 · 분젠', lf: '1824–1887 · 1811–1899', en: 'Kirchhoff & Bunsen',
                  h: '스펙트럼 선은 원소의 지문',
                  t: '원소마다 정해진 위치에 선을 만든다는 것을 실험으로 밝혔어요. 태양의 흡수선과 비교해 태양에 나트륨, 철 같은 원소가 있음을 알아냈어요.',
                  c: '직접 가 볼 수 없는 별의 성분을 알 수 있게 되었어요.',
                  img: { file: 'Kirchhoff-Bunsen.Spectroscope.jpg', cap: '키르히호프와 분젠이 쓴 분광기 (1860년 그림)' } },
                { y: '1864', n: '윌리엄 허긴스', lf: '1824–1910', en: 'William Huggins',
                  h: '어떤 성운은 가스, 어떤 성운은 별 무리처럼',
                  t: '고양이눈 성운(NGC 6543)의 스펙트럼에는 밝은 선 몇 개만 보여, 이 성운이 뜨거운 가스임을 밝혔어요. 반면 안드로메다 성운은 별처럼 연속 스펙트럼을 보였어요.',
                  c: '"성운"이 서로 다른 천체를 섞어 부르던 이름이라는 첫 단서예요.',
                  img: { file: 'NGC6543.jpg', cap: '고양이눈 성운 NGC 6543 (허블 우주 망원경)' } },
                { y: '1901', n: '애니 점프 캐넌', lf: '1863–1941', en: 'Annie Jump Cannon',
                  h: 'O · B · A · F · G · K · M',
                  t: '하버드 천문대에서 사진 건판에 찍힌 별의 스펙트럼을 분류해, 표면 온도 순서인 O·B·A·F·G·K·M 분류를 완성했어요. 평생 약 35만 개의 별을 분류했어요.',
                  c: '지금도 쓰는 별의 분광형이에요.',
                  draw: 'spectral', cap: '표면 온도 순서로 늘어놓은 분광형 (색은 별의 색을 나타내요)' },
                { y: '1912', n: '헨리에타 리비트', lf: '1868–1921', en: 'Henrietta Swan Leavitt',
                  h: '밝기가 변하는 주기로 거리를 재다',
                  t: '소마젤란운의 세페이드 변광성을 조사해, 밝기 변화 주기가 길수록 실제로 더 밝다는 주기-광도 관계를 발견했어요. 주기를 재면 실제 밝기를 알 수 있고, 겉보기 밝기와 비교해 거리를 구해요.',
                  c: '연주시차로는 잴 수 없는 먼 거리를 재는 "표준 촛불"이 생겼어요.',
                  img: { file: 'Small Magellanic Cloud (Digitized Sky Survey 2).jpg', cap: '리비트가 세페이드 변광성을 조사한 소마젤란운' } }
            ],
            quiz: { q: '처음으로 별의 연주시차를 측정해 별까지의 거리를 잰 사람은 누구일까요?',
                options: ['프라운호퍼', '프리드리히 베셀', '애니 점프 캐넌'], answer: 1,
                explain: '맞아요. 베셀은 1838년 백조자리 61번 별의 연주시차를 측정했어요.',
                hint: '베셀 카드를 다시 읽어 보세요.' }
        },
        {
            title: '성운이 은하가 되다', years: '1912 – 1930', short: '성운→은하',
            lead: '"나선 성운은 우리은하 안에 있을까, 밖에 있을까?" 이 질문의 답이 우주의 크기를 바꾸어 놓았어요.',
            items: [
                { y: '1918', n: '할로 섀플리', lf: '1885–1972', en: 'Harlow Shapley',
                  h: '태양은 은하의 중심이 아니다',
                  t: '구상 성단들의 거리를 변광성으로 재어 보니 궁수자리 방향 한쪽에 몰려 있었어요. 은하의 중심은 그쪽이고 태양은 중심에서 멀리 떨어져 있다고 결론 내렸어요.',
                  c: '지구에 이어 태양도 우주의 중심 자리에서 밀려났어요.',
                  img: { file: 'Heart of M13 Hercules Globular Cluster.jpg', cap: '섀플리가 거리를 잰 구상 성단의 하나, 헤르쿨레스자리 M13' } },
                { y: '1920', n: '천문학 대논쟁', en: 'The Great Debate', debate: true,
                  h: '나선 성운은 우리은하 안에 있을까, 밖에 있을까?',
                  t: '1920년 4월 미국 국립과학원에서 섀플리와 커티스가 우주의 크기를 두고 토론했어요.',
                  img: { file: 'Whirlpool by lord rosse.jpg', cap: '로스 백작이 1845년에 그린 나선 성운 M51. 대논쟁의 주제였던 "나선 성운"이에요.' } },
                { y: '1923–1929', n: '에드윈 허블', lf: '1889–1953', en: 'Edwin Hubble',
                  h: '안드로메다는 우리은하 밖에 있다',
                  t: '후커 망원경으로 찍은 사진에서 안드로메다 성운 속 세페이드 변광성을 찾았어요. 리비트의 주기-광도 관계로 계산한 거리는 섀플리가 말한 우리은하의 크기보다도 멀었어요. 1929년에는 멀리 있는 은하일수록 더 빨리 멀어진다는 것을 밝혔어요.',
                  c: '"안드로메다 성운"이 "안드로메다 은하"가 되었고, 우주가 팽창한다는 증거가 나왔어요.',
                  img: { file: 'Hubble views the star that changed the Universe (opo1115a).jpg', cap: '허블이 1923년 사진 건판에 "VAR!"라고 적은 안드로메다의 세페이드 변광성 V1' } }
            ],
            quiz: { q: '허블이 "안드로메다 성운"이 우리은하 밖에 있다는 것을 밝힌 방법은 무엇일까요?',
                options: ['연주시차 측정', '세페이드 변광성으로 거리 측정', '성운의 색 비교'], answer: 1,
                explain: '맞아요. 리비트가 찾은 주기-광도 관계로 세페이드 변광성까지의 거리를 계산했어요.',
                hint: '허블 카드와 리비트의 발견을 함께 떠올려 보세요.' }
        },
        {
            title: '우주망원경 시대, 보이지 않는 빛으로 본 우주', years: '1930 – 현재', short: '보이지 않는 빛',
            lead: '전파, 적외선처럼 눈에 보이지 않는 빛으로 하늘을 보고, 대기 밖 우주에 망원경을 띄우면서 우주의 시작까지 들여다보게 되었어요.',
            items: [
                { y: '1937', n: '그로트 리버', lf: '1911–2002', en: 'Grote Reber',
                  h: '뒷마당의 접시 안테나',
                  t: '집 마당에 지름 약 9.5m의 접시형 전파 망원경을 직접 세우고, 하늘의 전파 지도를 처음 만들었어요.',
                  c: '오늘날 전파 망원경의 기본 모양이에요.',
                  img: { file: 'Green Banks - Grote Reber Radio Telescope.jpg', cap: '리버가 만든 전파 망원경 (지금은 미국 그린뱅크 천문대에 보존)' } },
                { y: '1948', n: '헤일 망원경', en: 'Hale Telescope',
                  h: '구경 5m, 팔로마산 천문대',
                  t: '1990년대 켁 망원경이 나오기 전까지 대표적인 대형 광학 망원경이었어요. 퀘이사 같은 아주 먼 천체 연구에 쓰였어요.',
                  img: { file: 'P200 Dome Open.jpg', cap: '팔로마산 천문대의 헤일 망원경 돔' } },
                { y: '1948', n: '가모프 · 앨퍼', lf: '1904–1968 · 1921–2007', en: 'Gamow & Alpher',
                  h: '뜨거운 대폭발과 남은 열',
                  t: '초기 우주가 매우 뜨겁고 빽빽했다면 가벼운 원소가 만들어지고, 그 열의 흔적이 지금 아주 차가운 복사로 남아 있을 것이라고 예측했어요.',
                  c: '대폭발 우주론의 바탕이 되었어요.',
                  img: { file: 'CMB Timeline75.jpg', cap: '대폭발 이후 우주의 역사 (NASA/WMAP)' } },
                { y: '1951', n: '21cm 수소선 검출', en: 'Ewen & Purcell',
                  h: '먼지를 뚫고 은하의 팔을 그리다',
                  t: '차가운 수소 원자가 내는 파장 21cm의 전파를 처음 검출했어요. 이 전파는 빛을 가리는 먼지를 통과하므로, 우리은하의 나선팔 지도를 그릴 수 있었어요.',
                  c: '우리은하가 나선 은하임이 확인되었어요.',
                  img: { file: 'Green Banks - Ewen-Purcell Horn Antenna.jpg', cap: '21cm 수소선을 처음 검출한 이웬-퍼셀 혼 안테나' } },
                { y: '1965', n: '펜지어스 · 윌슨', lf: '1933–2024 · 1936–', en: 'Penzias & Wilson',
                  h: '하늘 모든 방향에서 오는 약 3K의 전파',
                  t: '통신용 안테나에서 없어지지 않는 잡음이 하늘 모든 방향에서 똑같이 들어온다는 것을 발견했어요. 대폭발 이론이 예측한 우주 배경 복사였어요.',
                  c: '대폭발 우주론이 표준 이론이 되었어요.',
                  img: { file: 'Horn Antenna-in Holmdel, New Jersey.jpeg', cap: '우주 배경 복사를 발견한 미국 홈델의 혼 안테나' } },
                { y: '1983', n: 'IRAS', en: 'Infrared Astronomical Satellite',
                  h: '첫 적외선 우주 망원경',
                  t: '대기 속 수증기가 적외선을 흡수하므로 망원경을 우주로 올렸어요. 하늘의 96%를 적외선으로 훑어 먼지 속에서 태어나는 별 등 약 35만 개의 천체를 찾았어요.',
                  img: { file: 'IRAS in orbit.jpg', cap: '지구 궤도를 도는 IRAS (상상도)' } },
                { y: '1990', n: '허블 우주 망원경', en: 'Hubble Space Telescope',
                  h: '대기 밖의 2.4m 거울',
                  t: '대기의 흔들림이 없는 우주에서 선명한 상을 얻어요. 1995년 "허블 딥 필드"는 텅 빈 듯한 하늘 한 조각에 은하 수천 개가 있음을 보여 주었어요.',
                  c: '허블 상수를 정밀하게 재는 데도 쓰였어요.',
                  img: { file: 'HST-SM4.jpeg', cap: '지구 궤도의 허블 우주 망원경 (2009년 수리 임무 때)' } },
                { y: '1993', n: '켁 망원경', en: 'W. M. Keck Observatory',
                  h: '조각 거울 36장으로 만든 10m',
                  t: '육각형 거울 36장을 이어 붙여 하나의 10m 거울처럼 쓰는 방식을 처음 실현했어요. 대기의 흔들림을 실시간으로 보정하는 적응 광학도 써요.',
                  c: '초대형 지상 망원경 시대가 열렸어요.',
                  img: { file: 'KeckObservatory20071020.jpg', cap: '하와이 마우나케아산의 켁 천문대' } },
                { y: '2009–2013', n: '플랑크 위성', en: 'Planck',
                  h: '우주의 나이 138억 년',
                  t: '우주 배경 복사를 아주 정밀하게 측정했고, 2013년 발표한 결과에서 우주의 나이를 약 138억 년으로 계산했어요.',
                  img: { file: 'PIA16874-CobeWmapPlanckComparison-20130321.jpg', cap: 'COBE, WMAP, 플랑크 위성으로 본 우주 배경 복사. 점점 선명해졌어요.' } },
                { y: '2013–2025', n: '가이아', en: 'Gaia',
                  h: '18억 개 별의 3차원 지도',
                  t: '약 18억 개 별의 위치와 거리를 연주시차로 재어 우리은하의 3차원 지도를 만들었어요.',
                  c: '히파르코스가 시작한 별 목록이 우주에서 완성되고 있어요.',
                  img: { file: 'Gaia’s sky in colour ESA393127.png', cap: '가이아가 관측한 별로 그린 하늘 전체 지도' } },
                { y: '2019', n: '사건의 지평선 망원경', en: 'Event Horizon Telescope',
                  h: '지구 크기의 가상 망원경',
                  t: '세계 곳곳의 전파 망원경을 연결해 지구 지름만 한 망원경처럼 썼어요. M87 은하 중심 블랙홀의 그림자를 처음 촬영했어요.',
                  c: '메시에가 87번째로 기록한 "성운"의 중심에 블랙홀이 있었어요.',
                  img: { file: 'Black hole - Messier 87 crop max res.jpg', cap: 'M87 은하 중심 블랙홀의 그림자 (EHT 협력단)' } },
                { y: '2021', n: '제임스 웹 우주 망원경', en: 'James Webb Space Telescope',
                  h: '6.5m 적외선의 눈',
                  t: '지구에서 약 150만 km 떨어진 곳에서 적외선으로 관측해요. 우주 팽창으로 빛이 적외선 쪽으로 늘어난 아주 먼 은하, 대폭발 뒤 수억 년 무렵의 은하를 찾고 있어요.',
                  img: { file: "Webb's First Deep Field.jpg", cap: '제임스 웹 우주 망원경의 첫 딥 필드 사진 (2022)' } }
            ],
            quiz: { q: '대폭발 이론이 예측한 우주 배경 복사를 처음 발견한 사람은 누구일까요?',
                options: ['그로트 리버', '펜지어스와 윌슨', '에드윈 허블'], answer: 1,
                explain: '맞아요. 펜지어스와 윌슨은 1965년 하늘 모든 방향에서 오는 약 3K의 전파를 발견했어요.',
                hint: '펜지어스 · 윌슨 카드를 다시 읽어 보세요.' }
        }
    ];

    const DEBATE = `<div class="debate">
        <div><h5>할로 섀플리</h5><ul><li>나선 성운은 우리은하 안에 있는 천체다.</li><li>우리은하는 매우 크다.</li></ul></div>
        <div><h5>히버 커티스</h5><ul><li>나선 성운은 우리은하 밖의 다른 은하, "섬 우주"다.</li><li>우리은하는 그보다 작다.</li></ul></div>
        <p class="verdict"><b>결과</b> 우리은하의 크기와 태양의 위치는 섀플리가 더 가까웠고, 나선 성운의 정체는 커티스가 맞았어요. 결론은 몇 년 뒤 허블의 관측이 냈어요.</p>
    </div>`;

    function picture(it, w) {
        const box = document.createElement('div'); box.className = 'tl-pic';
        if (it.draw) {
            const svg = svgEl('svg', { viewBox: '0 0 400 300', role: 'img', 'aria-label': it.cap }, box);
            DRAW[it.draw](svg);
            return box;
        }
        const img = document.createElement('img');
        img.src = IMG(it.img.file, w); img.alt = it.img.cap; img.loading = 'lazy'; img.decoding = 'async';
        img.referrerPolicy = 'no-referrer';
        img.addEventListener('error', () => { box.innerHTML = `<span class="tl-fallback">${it.n}</span>`; });
        box.appendChild(img);
        return box;
    }

    function eraStep(era, isLast) {
        return (body, api) => {
            body.insertAdjacentHTML('beforeend', `<p class="lead"><b class="era-years">${era.years}</b> ${era.lead} 카드를 모두 눌러 읽으면 탐구 질문이 나타나요.</p>`);
            const track = document.createElement('div'); track.className = 'tl-track';
            const detail = document.createElement('div'); detail.className = 'tl-detail';
            detail.innerHTML = '<p class="note">위 카드를 눌러 보세요.</p>';
            const status = document.createElement('p'); status.className = 'note';
            body.append(track, detail, status);
            const seen = new Set();
            const showStatus = () => { status.textContent = `읽은 카드: ${seen.size} / ${era.items.length}`; };
            showStatus();
            const holder = document.createElement('div'); body.appendChild(holder);
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
                    fig.insertAdjacentHTML('beforeend', `<figcaption>${cap}${it.img ? ` <a href="${PAGE(it.img.file)}" target="_blank" rel="noopener">출처·이용 조건: Wikimedia Commons</a>` : ''}</figcaption>`);
                    const txt = document.createElement('div');
                    txt.innerHTML = `<div class="tl-yr">${it.y}</div>
                        <h4>${it.n}${it.lf ? ` <small>(${it.lf})</small>` : ''}</h4>
                        <div class="tl-en">${it.en}</div>
                        <p class="hl">${it.h}</p><p>${it.t}</p>${it.debate ? DEBATE : ''}${it.c ? `<p class="ch">${it.c}</p>` : ''}`;
                    detail.append(fig, txt);
                    if (seen.size === era.items.length) quizBox.hidden = false;
                });
            });
            const quizBox = api.quiz(holder, isLast
                ? { ...era.quiz, keepStepOpen: true, onRight: () => api.completeMission() }
                : era.quiz);
            quizBox.hidden = true;
        };
    }

    SIMS['3_1'] = { steps: ERAS.map((era, i) => ({ title: `${era.title} (${era.years})`, short: era.short, build: eraStep(era, i === ERAS.length - 1) })) };
})();
