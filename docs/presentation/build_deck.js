/* COSMOS 동아리 설명회 덱 — 5분 / 12장 / 한국어 / 우주·항공 다크 테마
   생성: node build_deck.js   (pptxgenjs 필요: npm i pptxgenjs)
   출력: cosmos-info-session.pptx
*/
const pptxgen = require("pptxgenjs");

const C = {
  bg:     "0A0E1A",   // near-black navy (dominant)
  bg2:    "0E1526",
  card:   "16202F",
  cardhi: "1C2A3D",
  ink:    "EAF0F6",
  mute:   "8FA1B6",
  line:   "2A3647",
  accent: "FF6B35",   // ignition orange (sharp accent)
  accdim: "3A2A20",   // dim orange for motif
  cyan:   "5AC8E8",    // RL/AI supporting tone (sparingly)
  cydim:  "1E3038",
};
const F = "Malgun Gothic"; // 사용자 Windows 기본 한글 폰트

const p = new pptxgen();
p.layout = "LAYOUT_WIDE";           // 13.333 x 7.5 in
p.author = "COSMOS";
p.company = "청도대원학교 항공우주공학 동아리";
const W = 13.333, H = 7.5, M = 0.7;

let N = 0;
function slide(dark) {
  N++;
  const s = p.addSlide();
  s.background = { color: dark ? C.bg : C.bg2 };
  // 오비트 모티프 (슬라이드마다 위치·크기 변주)
  const seeds = [
    [10.6, -3.2, 7.5], [-3.4, 4.6, 6.2], [11.2, 5.0, 5.4], [-2.8, -3.0, 6.6],
    [10.9, 4.4, 6.0], [-3.0, 4.2, 5.8], [11.4, -3.4, 7.0], [-3.2, 4.8, 6.4],
    [10.4, 4.6, 5.6], [11.0, -3.0, 6.4], [-3.0, 4.4, 6.0], [10.8, -3.6, 7.6],
  ][(N - 1) % 12];
  s.addShape(p.ShapeType.ellipse, {
    x: seeds[0], y: seeds[1], w: seeds[2], h: seeds[2],
    fill: { type: "none" }, line: { color: C.accdim, width: 1.25 },
  });
  s.addShape(p.ShapeType.ellipse, {
    x: seeds[0] + seeds[2] * 0.5 - 0.05, y: seeds[1] - 0.05, w: 0.12, h: 0.12,
    fill: { color: C.accent }, line: { type: "none" },
  });
  // 페이지 번호
  s.addText(String(N).padStart(2, "0"), {
    isTextBox: true, x: W - 1.0, y: H - 0.5, w: 0.6, h: 0.3, margin: 0,
    align: "right", fontFace: F, fontSize: 9, color: C.mute,
  });
  return s;
}
function kicker(s, txt, color) {
  s.addText(txt.toUpperCase(), {
    isTextBox: true, x: M, y: 0.62, w: 8, h: 0.3, margin: 0,
    fontFace: F, fontSize: 11, bold: true, charSpacing: 3,
    color: color || C.accent,
  });
}
function title(s, txt, opt) {
  s.addText(txt, {
    isTextBox: true, x: M, y: 1.0, w: W - 2 * M, h: 1.1, margin: 0,
    fontFace: F, fontSize: (opt && opt.size) || 34, bold: true, color: C.ink,
    lineSpacing: (opt && opt.size ? opt.size : 34) * 1.15,
  });
}
function card(s, x, y, w, h, fill) {
  const sh = { x, y, w, h, fill: { color: fill || C.card },
    line: { color: C.line, width: 1 }, rectRadius: 0.09 };
  s.addShape(p.ShapeType.roundRect, sh);
}
function shadowCard(s, x, y, w, h, fill) {
  s.addShape(p.ShapeType.roundRect, {
    x, y, w, h, fill: { color: fill || C.card }, line: { color: C.line, width: 1 },
    rectRadius: 0.09,
    shadow: { type: "outer", color: "000000", opacity: 0.45, blur: 10, offset: 4, angle: 90 },
  });
}
function badge(s, x, y, n, color) {
  s.addShape(p.ShapeType.ellipse, { x, y, w: 0.5, h: 0.5,
    fill: { color: color || C.accent }, line: { type: "none" } });
  s.addText(String(n), { isTextBox: true, x, y, w: 0.5, h: 0.5, margin: 0,
    align: "center", valign: "middle", fontFace: F, fontSize: 15, bold: true, color: C.bg });
}
function photoBox(s, x, y, w, h, label) {
  s.addShape(p.ShapeType.roundRect, { x, y, w, h,
    fill: { color: C.bg }, line: { color: C.line, width: 1, dashType: "dash" }, rectRadius: 0.06 });
  s.addText([
    { text: "사진 자리\n", options: { fontSize: 12, bold: true, color: C.mute } },
    { text: label, options: { fontSize: 10, color: C.mute } },
  ], { isTextBox: true, x, y, w, h, margin: 0, align: "center", valign: "middle", fontFace: F });
}
function body(s, items, x, y, w, h, sz) {
  s.addText(items.map((t, i) => ({
    text: t, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: 8 },
  })), { isTextBox: true, x, y, w, h, margin: 0, fontFace: F, fontSize: sz || 15,
    color: C.ink, lineSpacing: (sz || 15) * 1.35 });
}

/* ── 01 · 타이틀 ───────────────────────────────────────── */
{
  const s = slide(true);
  s.addText("COSMOS", { isTextBox: true, x: M, y: 2.35, w: W - 2 * M, h: 1.5, margin: 0,
    fontFace: F, fontSize: 76, bold: true, color: C.ink, charSpacing: 2 });
  s.addText("청도대원학교 항공우주공학 동아리", { isTextBox: true, x: M, y: 3.75, w: W - 2 * M, h: 0.5,
    margin: 0, fontFace: F, fontSize: 19, color: C.mute });
  s.addText("직접 설계하고, 만들고, 날린다.", { isTextBox: true, x: M, y: 4.55, w: W - 2 * M, h: 0.5,
    margin: 0, fontFace: F, fontSize: 16, italic: true, color: C.accent });
  s.addText("2026 프로젝트  ·  TVC 착륙 호퍼 × 강화학습(AI)", { isTextBox: true, x: M, y: 5.55, w: W - 2 * M, h: 0.4,
    margin: 0, fontFace: F, fontSize: 13, color: C.ink });
  s.addText("26–27학년도 1학기 · 동아리 설명회", { isTextBox: true, x: M, y: H - 0.75, w: 8, h: 0.3,
    margin: 0, fontFace: F, fontSize: 10, color: C.mute });
}

/* ── 02 · 우리가 하는 일 ───────────────────────────────── */
{
  const s = slide();
  kicker(s, "About COSMOS");
  title(s, "우리가 하는 일");
  const rows = [
    ["실물을 만든다", "항공우주 하드웨어를 학생이 직접 설계·제작·시험한다. 이론만 배우는 동아리가 아니다."],
    ["이미 해봤다", "지난 학기에 로켓 모터 추력 측정 스탠드와 AEROVIEW 풍동을 완성해 실제 데이터를 얻었다."],
    ["이번엔 더 간다", "이번 학기는 대학 수준의 제어공학 실험에 인공지능(강화학습)을 접목한다."],
  ];
  let y = 2.35;
  rows.forEach((r, i) => {
    shadowCard(s, M, y, 7.7, 1.35);
    badge(s, M + 0.35, y + 0.42, i + 1);
    s.addText(r[0], { isTextBox: true, x: M + 1.15, y: y + 0.18, w: 6.3, h: 0.4, margin: 0,
      fontFace: F, fontSize: 16, bold: true, color: C.accent });
    s.addText(r[1], { isTextBox: true, x: M + 1.15, y: y + 0.6, w: 6.3, h: 0.7, margin: 0,
      fontFace: F, fontSize: 12, color: C.ink, lineSpacing: 16 });
    y += 1.6;
  });
  photoBox(s, 9.0, 2.35, 3.6, 4.35, "지난 학기 활동 / 팀 사진");
}

/* ── 03 · 지난 학기 성과 ───────────────────────────────── */
{
  const s = slide();
  kicker(s, "Track Record");
  title(s, "지난 학기, 우리가 만든 것");
  const items = [
    ["로켓 모터 추력 측정 스탠드", "고체 로켓 모터의 추력 곡선을 로드셀로 직접 측정. 점화부터 연소 종료까지 데이터 기록."],
    ["AEROVIEW 풍동 (Wind Tunnel)", "공기 흐름 속 모형에 걸리는 힘을 실측하는 장치를 자체 제작·운용."],
  ];
  let x = M;
  items.forEach((it) => {
    shadowCard(s, x, 2.35, 5.75, 4.4);
    photoBox(s, x + 0.35, 2.7, 5.05, 2.35, "제작 · 시험 장면");
    s.addText(it[0], { isTextBox: true, x: x + 0.35, y: 5.2, w: 5.05, h: 0.4, margin: 0,
      fontFace: F, fontSize: 15, bold: true, color: C.accent });
    s.addText(it[1], { isTextBox: true, x: x + 0.35, y: 5.62, w: 5.05, h: 1.0, margin: 0,
      fontFace: F, fontSize: 11.5, color: C.ink, lineSpacing: 15 });
    x += 6.05;
  });
  s.addText("설계 → 제작 → 실험 → 데이터. 전 과정을 우리 손으로.", { isTextBox: true,
    x: M, y: H - 0.62, w: W - 2 * M, h: 0.35, margin: 0, fontFace: F, fontSize: 12, italic: true, color: C.mute });
}

/* ── 04 · 이번 학기 도약 (다크 스테이트먼트) ──────────── */
{
  const s = slide(true);
  kicker(s, "This Semester");
  s.addText("이번엔 여기에\nAI를 더한다", { isTextBox: true, x: M, y: 2.1, w: 8.6, h: 2.4, margin: 0,
    fontFace: F, fontSize: 46, bold: true, color: C.ink, lineSpacing: 52 });
  s.addText([
    { text: "우주기업이 로켓을 세운 채로 착륙시키는 그 기술을 ", options: {} },
    { text: "축소판으로 직접 만들고", options: { color: C.accent, bold: true } },
    { text: ",\n강화학습(AI)이 사람이 튜닝한 제어보다 나은지 ", options: {} },
    { text: "실험으로 검증한다", options: { color: C.cyan, bold: true } },
    { text: ".", options: {} },
  ], { isTextBox: true, x: M, y: 4.9, w: 10.5, h: 1.5, margin: 0, fontFace: F, fontSize: 16,
    color: C.ink, lineSpacing: 24 });
}

/* ── 05 · TVC 착륙 호퍼란? ─────────────────────────────── */
{
  const s = slide();
  kicker(s, "The Project");
  title(s, "TVC 착륙 호퍼 (Hopper)");
  body(s, [
    "SpaceX의 Grasshopper·Starhopper처럼 — 떠오르고 → 제자리 비행 → 다시 내려앉는다.",
    "전동 덕티드팬(EDF)으로 추력을 자유롭게 조절.",
    "배기 기류 속 제어핀 4개로 자세를 잡는다 = 추력벡터제어(TVC).",
    "낙하산 회수가 아니라, 엔진으로 감속하며 다리로 직립 착지.",
  ], M, 2.4, 7.4, 3.6, 15);
  // 우측 모식도
  const px = 8.7, pw = 3.9;
  card(s, px, 2.35, pw, 4.4, C.card);
  const cx = px + pw / 2;
  s.addShape(p.ShapeType.roundRect, { x: cx - 0.55, y: 2.9, w: 1.1, h: 0.6,
    fill: { color: C.accent }, line: { type: "none" }, rectRadius: 0.06 });
  s.addText("EDF", { isTextBox: true, x: cx - 0.55, y: 2.9, w: 1.1, h: 0.6, margin: 0,
    align: "center", valign: "middle", fontFace: F, fontSize: 10, bold: true, color: C.bg });
  [-0.25, 0, 0.25].forEach((dx) =>
    s.addShape(p.ShapeType.line, { x: cx + dx, y: 3.6, w: 0, h: 1.5,
      line: { color: C.cyan, width: 2, endArrowType: "triangle" } }));
  s.addText("추력 (하향)", { isTextBox: true, x: cx + 0.4, y: 4.1, w: 1.6, h: 0.3, margin: 0,
    fontFace: F, fontSize: 9, color: C.mute });
  [-0.5, -0.17, 0.17, 0.5].forEach((dx) =>
    s.addShape(p.ShapeType.line, { x: cx + dx, y: 5.15, w: 0, h: 0.4, line: { color: C.accent, width: 3 } }));
  s.addText("제어핀 ×4", { isTextBox: true, x: cx - 1.0, y: 5.6, w: 2.0, h: 0.3, margin: 0,
    align: "center", fontFace: F, fontSize: 9, color: C.accent });
  s.addShape(p.ShapeType.line, { x: cx - 1.8, y: 5.6, w: 0.7, h: 0.9, flipH: true, line: { color: C.ink, width: 2 } });
  s.addShape(p.ShapeType.line, { x: cx + 1.1, y: 5.6, w: 0.7, h: 0.9, line: { color: C.ink, width: 2 } });
  s.addText("고정형 착륙 다리", { isTextBox: true, x: px, y: 6.5, w: pw, h: 0.25, margin: 0,
    align: "center", fontFace: F, fontSize: 9, color: C.mute });
}

/* ── 06 · 핵심 원리 ────────────────────────────────────── */
{
  const s = slide();
  kicker(s, "How It Works");
  title(s, "핵심 원리 — 제트 위에 선 연필");
  // 좌: 개념도
  const px = M, pw = 5.0;
  card(s, px, 2.35, pw, 4.4);
  s.addShape(p.ShapeType.line, { x: px + pw / 2, y: 2.7, w: 0, h: 3.7,
    line: { color: C.line, width: 1, dashType: "dash" } });
  s.addShape(p.ShapeType.roundRect, { x: px + pw / 2 - 0.35, y: 3.0, w: 0.7, h: 2.2,
    fill: { color: C.cardhi }, line: { color: C.accent, width: 1.5 }, rectRadius: 0.1, rotate: 16 });
  s.addShape(p.ShapeType.line, { x: px + pw / 2 + 0.55, y: 5.2, w: 0.7, h: 1.15,
    line: { color: C.cyan, width: 2.5, endArrowType: "triangle" } });
  s.addShape(p.ShapeType.line, { x: px + pw / 2 - 1.1, y: 3.3, w: 1.0, h: 0.5, flipH: true,
    line: { color: C.accent, width: 2, endArrowType: "triangle" } });
  s.addText("기울면 →\n핀이 기류를 꺾어 →\n되돌린다", { isTextBox: true, x: px + 0.3, y: 5.4, w: 2.2, h: 1.2,
    margin: 0, fontFace: F, fontSize: 10, color: C.mute, lineSpacing: 13 });
  // 우: 콜아웃 3개
  const items = [
    ["호버링 중엔 날개가 안 통한다", "속도가 0에 가까워 공기력이 없다. 그래서 추력의 방향 자체를 꺾는다."],
    ["제어핀 4개 = Roll · Pitch · Yaw", "네 방향의 핀을 조합해 세 축의 자세를 만든다."],
    ["원래 불안정한 시스템", "가만두면 넘어진다. 1초에 수백 번 자동 보정해야 서 있다."],
  ];
  let y = 2.35;
  items.forEach((it, i) => {
    shadowCard(s, 6.3, y, 6.3, 1.35);
    badge(s, 6.6, y + 0.42, i + 1, C.cyan);
    s.addText(it[0], { isTextBox: true, x: 7.4, y: y + 0.16, w: 4.9, h: 0.4, margin: 0,
      fontFace: F, fontSize: 14, bold: true, color: C.ink });
    s.addText(it[1], { isTextBox: true, x: 7.4, y: y + 0.58, w: 4.9, h: 0.7, margin: 0,
      fontFace: F, fontSize: 11, color: C.mute, lineSpacing: 14 });
    y += 1.55;
  });
}

/* ── 07 · 진짜 연구 질문 (AI 강조) ────────────────────── */
{
  const s = slide(true);
  kicker(s, "The Research Question", C.cyan);
  s.addText("AI가 사람보다\n잘 제어할까?", { isTextBox: true, x: M, y: 1.7, w: 8.5, h: 2.3, margin: 0,
    fontFace: F, fontSize: 44, bold: true, color: C.ink, lineSpacing: 50 });
  const cols = [
    ["전통 방식 — PID", C.accent, "사람이 손으로 제어 게인을 튜닝한다. 검증된 방법, 하지만 반복 노동."],
    ["강화학습 — RL", C.cyan, "시뮬레이션 안에서 AI가 스스로 제어 정책을 학습한다."],
  ];
  let x = M;
  cols.forEach((c) => {
    shadowCard(s, x, 4.3, 5.7, 1.6, C.card);
    s.addText(c[0], { isTextBox: true, x: x + 0.35, y: 4.5, w: 5.0, h: 0.4, margin: 0,
      fontFace: F, fontSize: 15, bold: true, color: c[1] });
    s.addText(c[2], { isTextBox: true, x: x + 0.35, y: 4.92, w: 5.0, h: 0.85, margin: 0,
      fontFace: F, fontSize: 11.5, color: C.ink, lineSpacing: 15 });
    x += 6.0;
  });
  s.addText([
    { text: "같은 기체 · 같은 외란", options: { bold: true, color: C.ink } },
    { text: "  →  복원 시간, 오버슈트, 정확도를 정량 비교한다. 이것이 우리 보고서의 핵심 결과물.", options: { color: C.mute } },
  ], { isTextBox: true, x: M, y: 6.35, w: W - 2 * M, h: 0.5, margin: 0, fontFace: F, fontSize: 12 });
}

/* ── 08 · 진행 방식 (파이프라인) ──────────────────────── */
{
  const s = slide();
  kicker(s, "Approach");
  title(s, "제작부터 검증까지");
  const steps = [
    ["제작", "EDF·제어핀·구속 스탠드"],
    ["시뮬레이션", "가상 환경 + AI 학습"],
    ["실기 이식", "학습한 정책을 기체에"],
    ["비교 실험", "PID vs RL 정량 평가"],
  ];
  const cw = 2.78, gap = 0.30, x0 = M, y0 = 2.7;
  steps.forEach((st, i) => {
    const x = x0 + i * (cw + gap);
    shadowCard(s, x, y0, cw, 3.0);
    badge(s, x + cw / 2 - 0.25, y0 + 0.35, i + 1);
    s.addText(st[0], { isTextBox: true, x: x + 0.2, y: y0 + 1.05, w: cw - 0.4, h: 0.4, margin: 0,
      align: "center", fontFace: F, fontSize: 15, bold: true, color: C.accent });
    s.addText(st[1], { isTextBox: true, x: x + 0.18, y: y0 + 1.55, w: cw - 0.36, h: 1.3, margin: 0,
      align: "center", fontFace: F, fontSize: 11, color: C.ink, lineSpacing: 15 });
    if (i < steps.length - 1)
      s.addShape(p.ShapeType.line, { x: x + cw + 0.02, y: y0 + 1.5, w: gap - 0.04, h: 0,
        line: { color: C.accent, width: 2, endArrowType: "triangle" } });
  });
  s.addText("전체 8–10주  ·  하드웨어 팀과 소프트웨어 팀이 2·3단계를 병렬로 진행", { isTextBox: true,
    x: M, y: 6.2, w: W - 2 * M, h: 0.4, margin: 0, fontFace: F, fontSize: 12, italic: true, color: C.mute });
}

/* ── 09 · 팀 & 역할 (모집) ────────────────────────────── */
{
  const s = slide();
  kicker(s, "Join the Team");
  title(s, "이런 사람을 찾습니다");
  const roles = [
    ["기구 · 전자", "3D프린팅, 조립, 배선, 납땜. 손으로 만드는 게 좋은 사람."],
    ["소프트웨어", "Python, 시뮬레이션, 강화학습. AI가 궁금한 사람."],
    ["실험 · 운영", "데이터 정리, 안전 관리, 발표 자료. 프로젝트를 굴러가게 하는 사람."],
  ];
  const cw = 3.8, gap = 0.3, x0 = M, y0 = 2.55;
  roles.forEach((r, i) => {
    const x = x0 + i * (cw + gap);
    shadowCard(s, x, y0, cw, 2.9);
    s.addShape(p.ShapeType.ellipse, { x: x + 0.35, y: y0 + 0.4, w: 0.5, h: 0.5,
      fill: { color: C.cydim }, line: { color: C.cyan, width: 1 } });
    s.addText(String(i + 1), { isTextBox: true, x: x + 0.35, y: y0 + 0.4, w: 0.5, h: 0.5, margin: 0,
      align: "center", valign: "middle", fontFace: F, fontSize: 14, bold: true, color: C.cyan });
    s.addText(r[0], { isTextBox: true, x: x + 0.35, y: y0 + 1.1, w: cw - 0.7, h: 0.45, margin: 0,
      fontFace: F, fontSize: 16, bold: true, color: C.accent });
    s.addText(r[1], { isTextBox: true, x: x + 0.35, y: y0 + 1.6, w: cw - 0.7, h: 1.2, margin: 0,
      fontFace: F, fontSize: 11.5, color: C.ink, lineSpacing: 15 });
  });
  s.addText([
    { text: "지금 잘 할 필요 없다. ", options: { bold: true, color: C.ink } },
    { text: "배우면서 한다 — 코딩은 AI 툴을 적극 활용하고, 납땜·CAD는 처음부터 가르친다.", options: { color: C.mute } },
  ], { isTextBox: true, x: M, y: 5.9, w: W - 2 * M, h: 0.6, margin: 0, fontFace: F, fontSize: 12.5 });
}

/* ── 10 · 안전 ─────────────────────────────────────────── */
{
  const s = slide();
  kicker(s, "Safety First");
  title(s, "안전은 타협하지 않는다");
  const items = [
    ["구속 상태 시험", "초기 시험은 전부 기체를 고정한 채로. 자유 비행은 나중에."],
    ["이중 킬스위치", "배터리 물리 스위치 + 송신기 수동 정지. 사람이 항상 우선."],
    ["LiPo 배터리 수칙", "방화 용기 보관·충전, 1C 이하 충전, 손상 시 즉시 폐기."],
    ["회전체 방호", "흡·배기 방호망, 보안경, 지도교사 감독하에만 시험."],
  ];
  const cw = 5.75, gap = 0.35;
  items.forEach((it, i) => {
    const x = M + (i % 2) * (cw + gap);
    const y = 2.45 + Math.floor(i / 2) * 2.15;
    shadowCard(s, x, y, cw, 1.9);
    badge(s, x + 0.35, y + 0.35, i + 1);
    s.addText(it[0], { isTextBox: true, x: x + 1.1, y: y + 0.28, w: cw - 1.4, h: 0.4, margin: 0,
      fontFace: F, fontSize: 14, bold: true, color: C.accent });
    s.addText(it[1], { isTextBox: true, x: x + 1.1, y: y + 0.72, w: cw - 1.4, h: 1.0, margin: 0,
      fontFace: F, fontSize: 11, color: C.ink, lineSpacing: 14 });
  });
  s.addText("지난 학기 로켓 모터 시험에서 쓴 안전 원칙을 그대로 확장한다.", { isTextBox: true,
    x: M, y: H - 0.6, w: W - 2 * M, h: 0.35, margin: 0, fontFace: F, fontSize: 12, italic: true, color: C.mute });
}

/* ── 11 · 왜 COSMOS인가 ───────────────────────────────── */
{
  const s = slide();
  kicker(s, "Why COSMOS");
  title(s, "여기서 얻어가는 것");
  const blocks = [
    ["실물 엔지니어링", "설계 · 제작 · 디버깅의 전 과정을 직접 경험한다."],
    ["제어공학 + AI", "대학에서 배우는 내용을 1학기 먼저, 손으로 만지며."],
    ["긴 프로젝트 완주", "팀으로 8주짜리 프로젝트를 끝까지 끌고 가 본다."],
    ["진짜 포트폴리오", "완성된 기체 · 비교 데이터 · 발표 — 대학 지원서에 쓸 결과물."],
  ];
  const cw = 5.75, gap = 0.35;
  blocks.forEach((b, i) => {
    const x = M + (i % 2) * (cw + gap);
    const y = 2.45 + Math.floor(i / 2) * 2.1;
    shadowCard(s, x, y, cw, 1.85);
    s.addText(b[0], { isTextBox: true, x: x + 0.4, y: y + 0.25, w: cw - 0.8, h: 0.45, margin: 0,
      fontFace: F, fontSize: 16, bold: true, color: C.accent });
    s.addText(b[1], { isTextBox: true, x: x + 0.4, y: y + 0.78, w: cw - 0.8, h: 0.9, margin: 0,
      fontFace: F, fontSize: 11.5, color: C.ink, lineSpacing: 15 });
  });
}

/* ── 12 · 합류하기 (CTA) ──────────────────────────────── */
{
  const s = slide(true);
  kicker(s, "Come Build With Us");
  s.addText("우리와 만들자", { isTextBox: true, x: M, y: 1.9, w: W - 2 * M, h: 1.3, margin: 0,
    fontFace: F, fontSize: 52, bold: true, color: C.ink });
  const info = [
    ["모임", "매주 ___요일 ___시  ·  ___________ (실습실/장소)"],
    ["문의", "위챗 ____________  ·  담당 ____________"],
    ["첫 모임", "그냥 와도 환영 — 사전 지식 필요 없음"],
  ];
  let y = 3.5;
  info.forEach((r) => {
    s.addText(r[0], { isTextBox: true, x: M, y, w: 1.5, h: 0.45, margin: 0,
      fontFace: F, fontSize: 14, bold: true, color: C.accent });
    s.addText(r[1], { isTextBox: true, x: M + 1.7, y, w: 7.4, h: 0.45, margin: 0,
      fontFace: F, fontSize: 13, color: C.ink });
    y += 0.72;
  });
  s.addShape(p.ShapeType.roundRect, { x: W - 3.0, y: 3.5, w: 1.9, h: 1.9,
    fill: { color: C.card }, line: { color: C.line, width: 1, dashType: "dash" }, rectRadius: 0.06 });
  s.addText("QR 코드\n(위챗 단톡)", { isTextBox: true, x: W - 3.0, y: 3.5, w: 1.9, h: 1.9, margin: 0,
    align: "center", valign: "middle", fontFace: F, fontSize: 10, color: C.mute });
  s.addText("COSMOS · 청도대원학교 항공우주공학 동아리 · 2026", { isTextBox: true,
    x: M, y: H - 0.75, w: 10, h: 0.3, margin: 0, fontFace: F, fontSize: 10, color: C.mute });
}

/* ── 스피커 노트 ──────────────────────────────────────── */
const notes = [
  "인사 + 한 줄 소개. \"COSMOS, 항공우주공학 동아리 부장 ___입니다. 저희는 이론만 배우는 게 아니라 실물을 만들고 날립니다.\" (10초)",
  "우리가 하는 일 3가지. 지난 학기에 이미 장비 2개를 완성했다는 점을 강조 — 신뢰. (25초)",
  "지난 학기 결과물 2개를 빠르게. 사진 가리키며 \"이거 저희가 다 만든 겁니다.\" 설계-제작-실험-데이터 사이클 언급. (30초)",
  "전환. \"올해는 여기에 AI를 더합니다.\" 잠깐 멈춰 청중이 화면 읽게. SpaceX 로켓 착륙 비유. (25초)",
  "호퍼가 뭔지. 오른쪽 그림 가리키며: 팬으로 밀고, 아래 핀 4개로 방향 잡고, 다리로 착지. 낙하산 아님. (35초)",
  "왜 어려운가. \"세워놓은 연필 같아서 가만두면 넘어집니다. 컴퓨터가 1초에 수백 번 보정해야 서 있어요.\" (30초)",
  "핵심 질문. \"사람이 튜닝한 제어 vs AI가 배운 제어, 뭐가 나은지 실제로 비교합니다.\" 이게 우리만의 실험. (35초)",
  "진행 방식 4단계 + 8~10주. 하드웨어 팀/소프트 팀 병렬. \"관심 분야만 골라 들어오면 됩니다.\" (25초)",
  "역할 3개. \"코딩 잘해야 하냐? 아니요. 납땜 해봤어야 하냐? 아니요. 가르칩니다.\" 여기서 눈 마주치기. (30초)",
  "안전. 학부모·선생님도 듣는다는 가정. 구속 시험, 킬스위치, LiPo 수칙, 감독. 짧고 단호하게. (20초)",
  "얻어가는 것 4개. 마지막 \"대학 지원서에 쓸 진짜 프로젝트\"에 힘주기. (20초)",
  "합류 정보. 모임 요일/시간/장소, QR, \"그냥 와도 환영\"으로 마무리. \"질문 있으면 끝나고 저한테.\" (15초)",
];
p.slides.forEach((s, i) => s.addNotes(notes[i] || ""));

p.writeFile({ fileName: "cosmos-info-session.pptx" }).then((f) => console.log("wrote", f));
