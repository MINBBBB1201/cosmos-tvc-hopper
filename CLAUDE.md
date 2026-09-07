# COSMOS — TVC 착륙 호퍼 + 강화학습 프로젝트

국제학교(청도대원학교) 항공우주공학 동아리 COSMOS의 26-27학년도 1학기 프로젝트. 이 파일은 Cowork 세션에서 진행한 리서치·기획 결과를 Claude Code 세션이 이어받기 위한 컨텍스트 문서다. 새 Code 세션을 열 때 이 파일을 먼저 읽을 것.

---

## 현재 진행 상태 (2026-09-07 기준) — 새 세션은 여기부터

Code 세션에서 리서치·설계·조달·1주차 계획까지 진행했다. **핵심 변경: 비행 컴퓨터를 Teensy 4.0 기반
(SolidGeek/SingleRotorUAV 오픈소스 포크)으로 확정** — 리서치 결과 우리와 거의 동일한 목적·구조의
Aalborg University 석사논문 프로젝트(CAD + 펌웨어 + 89쪽 논문, MIT)를 발견해 그걸 기구·펌웨어 베이스로
채택. 추진은 단일 EDF 유지, 자세제어는 베인 4개 유지(=아래 골격 불변).

**아직 git 커밋 안 됨.** 전부 로컬(`C:\Users\mimin\Desktop\cosmos-tvc-hopper`)에만 있음.

### 문서 맵

| 경로 | 내용 |
|---|---|
| `docs/design/00-hopper-master-design.md` | **마스터 설계도 rev C** (현행) — 아키텍처·치수·질량·전자·펌웨어·시험카드·리스크 |
| `docs/design/research-open-source-references.md` | rev C 근거 리서치 (SolidGeek·Bresciani/PX4·기타 비교) |
| `docs/design/BOM-revC-teensy.md` | 구매 리스트 (현행, ₩310–530k) |
| `docs/design/BOM.md` | 구 BOM (rev B) — 추진·구조·안전 항목만 유효, FC 계통은 rev C로 대체 |
| `docs/design/general-arrangement.svg` | 기체 개략 배치도 |
| `docs/design/references/Jacobsen2021_*.pdf` | SolidGeek 논문 전문 (제작·제어 이론의 1차 자료) |
| `docs/execution/week-01-kickoff.md` | **1–2주차 마스터 실행계획** — 타임라인·부장 준비·부품 전체·세션 진행 |
| `docs/execution/procurement-review.md` | 부장 구글시트 행별 검토 (✅/⚠️/❌/➕) |
| `docs/execution/bench-wiring.svg` | 벤치 배선도 (Week 1 브링업 → Week 2 확장) |
| `firmware/reference/SingleRotorUAV/` | SolidGeek 펌웨어 원본 vendor-copy (MIT, `ORIGIN.md`에 수정 계획) |
| `firmware/singlecopter.param.md` | ArduPilot SingleCopter 파라미터 — **대안 경로**(rev C §8.4) |
| `cad/*.scad` | 자체 파라메트릭 CAD — SolidGeek Onshape 포크의 대안 |
| `docs/presentation/` | 동아리 설명회 발표자료(.pptx) + 대본 |

### 다음 액션 (부장)

1. 구글시트 ⚠️ 항목 확인(EDF 4S 전류 등) + B4를 FS-i6X 세트로 → 부품 전량 주문
2. 9/15까지 안전 계획서 → 지도교사 서명
3. 첫 세션 9/18(금 1h) + 9/19(토 2h): 부품 실측 + EDF 추력시험 + IMU/DShot 브링업

---

## 프로젝트 배경

- 이전 학기: 로켓 모터 추력 측정 스탠드, AEROVIEW 풍동(wind tunnel) 실험 완료.
- 이번 학기 목표: 기존 엔지니어링 실험에 AI(강화학습) 요소를 접목, 대학 수준의 제어공학 실험을 자체 설계·검증.
- 동아리부장: 김민찬.

## 확정된 방향 (더 이상 바꾸지 않는 골격)

**PRJ-01: TVC 착륙 호퍼 + 강화학습**을 확정판으로 채택함. 이 밑의 세 가지(정의·설계 방식·BOM)는 계속 재검토하지 않기로 함 — 세부 스펙만 실측 후 미세조정.

### 정의
- **TVC(추력벡터제어)**: 엔진/팬 추력의 방향을 기계적으로 꺾어 자세를 제어. 핀(제어면)은 공기흐름이 있어야 작동하므로 호버링·저속 구간에서는 TVC가 유일한 수단.
- **TVC 모델로켓(상승 전용)** vs **TVC 착륙 호퍼(VTVL)**: 전자는 고체모터로 상승 중에만 TVC를 쓰고 낙하산으로 회수(BPS.Space Signal R2/Alpha, OpenRTVC, K-9 TVC V8 등 대부분이 여기 속함). 후자는 전기 추진(EDF)으로 스로틀을 임의 조절해 이륙→호버링→강하→착륙까지 전 구간을 제어(SpaceX Grasshopper/Starhopper, Masten Xombie, bribro12의 SpaceX-inspired EDF rocket). **우리 프로젝트는 후자.**

### 설계 방식 — 핀 방식 채택
EDF(전기 덕티드팬)를 고정하고 배기 기류에 제어핀 4개(서보 구동)를 움직여 방향 전환. 짐벌 방식(모터 자체가 기울어지는 BPS.Space식)보다 기구 설계가 단순하고, ArduPilot의 "SingleCopter" 프레임을 그대로 활용 가능해 PID baseline 구축이 쉬움.

### 확정 BOM (bribro12의 실제 완성/비행 빌드 기준)
| 분류 | 부품 | 비고 |
|---|---|---|
| 추진 | 70mm EDF + 브러시리스 모터(2300KV) | 6S 기준 약 2.5kg 추력 |
| ESC | 80A급 브러시리스 ESC | BEC 내장, 2–6S |
| 배터리 | 6S 1000mAh 70C LiPo | 순간전류 중요 |
| 제어핀 서보 | 9g 금속기어 서보 ×4 | 백래시 적은 제품 |
| 비행 컨트롤러 | Pixhawk 4 + ArduPilot v4.0.4 (SingleCopter) | 저예산 대안: Arduino/Teensy + 자체 PID |
| 수신기 | Spektrum DSM2/DSM-X 호환 | 수동 안전 개입용 필수 |
| 구조재 | PLA 3D프린팅 프레임 | K-9 TVC Hopper Test Vehicle의 공개 STL 활용 가능 (CAD 설계 불필요) |

**단순화 포인트**: 원 빌드는 착륙다리 전개용 서보 4개+보조 Arduino Nano 보드가 추가되지만, 우리 연구 질문(구속 상태 자세 안정화 비교)엔 불필요 — 고정형 다리로 대체해 생략.

### 장비·기술 부족 시 축소판 (PHASE 0 → 1 → 2)
- PHASE 0: 추력벡터 없이 스로틀만으로 시소 수평 유지. 참고: [ugursoydan/arduino-propellars-pid-balancing-beam](https://github.com/ugursoydan/arduino-propellars-pid-balancing-beam) (완전한 코드·회로도·PID 게인값 공개).
- PHASE 1: 서보 1개로 실제 추력벡터 추가(배기구 베인).
- PHASE 2: PID 자리에 RL 정책을 넣고 비교.
- 장비 대체: 3D프린터 없음→나무/아크릴+기성 팬틸트 브라켓, 납땜 없음→브러시드 모터+L298N/TB6612 드라이버.

### 소프트웨어 스택
1. Baseline: ArduPilot SingleCopter 또는 자체 Arduino+MPU6050 PID 루프.
2. 시뮬레이션: [gym-pybullet-drones](https://github.com/utiasDSL/gym-pybullet-drones) + 도메인 랜덤화(질량·관성·무게중심 매 에피소드 무작위화) + PPO(stable-baselines3).
3. 실기 이식 후 PID baseline과 정량 비교(복원시간·오버슈트·정상상태오차).
4. RL 학습 전 Stable-Baselines3 공식 퀵스타트(CartPole-v1/Pendulum-v1)로 워크플로우 먼저 익힐 것.

### 안전 원칙 (필수)
- LiPo: 방화용기 충전·보관, 1C 이하 충전, 손상 시 즉시 폐기, 물리 킬스위치 상시 확보.
- 회전체: 흡배기구 그릴, 초기 테스트는 반드시 구속 상태(케이지/텐서), 보안경 착용, RC 수신기로 수동 킬스위치 별도 확보.
- 테스트 순서: ①구속+스로틀만 → ②구속+제어핀 작동 확인 → ③구속+PID 안정화 → ④구속+RL 비교 → ⑤(확장) 구속 서서히 해제.

### 학기 로드맵 (8–10주)
- 1–3주차: 기구·전자팀 제작 + baseline PID 확보 (RL은 이 전에 시작하지 않음).
- 2–5주차(병렬): 소프트웨어팀 시뮬레이션 구축 + RL 학습.
- 6–7주차: 실기 이식 + 정량 비교.
- 8–10주차: 발표 준비 + (여유 시) 자유도 확장.

## 검토했지만 채택 안 한 대안 (참고용, 방향 변경 아님)

- **Sparrow TVC Hopper**([GitHub](https://github.com/waaaaaaaaah/sparrow-tvc-hopper)): 고체모터(Estes D12) 2발 순차점화(상승+착륙감속) 방식. CAD(STEP/Onshape)·PCB(KiCad)·코드 전부 공개, 실비행 영상 있음. 단, 고체 에너지물질이라 현재 위치 기준 구매·수입·발사 규제 확인 필요 + 조립 튜토리얼 없음(JOURNAL.md는 설계일지일 뿐). 사용자가 "EDF 확정판 유지"로 명시적으로 결정함.
- **하이브리드/액체로켓 VTVL**: 물리적으로 진짜 스로틀·재점화가 가능한 유일한 화학추진 방식이지만, 가압 산화제·연소·발사장·모터 인증 등 학교 동아리 스코프를 크게 초과. 참고: Half Cat Rocketry Mojave Sphinx(오픈소스 액체로켓, 상승전용), VoidPropulsion JACKALOPE(개발중, 미공개).
- **HAB(고고도 기구) 미션(PRJ-08)**: 현재 위치(중국 산둥성) 기준 발사 허가·저고도 공역 규제로 보류. PRJ-13(자율 로버)/PRJ-14(연 기반 대기 프로파일링)이 허가 불필요 대체안.

## 참고 아티팩트 (Cowork에서 게시, 계정 전체에서 접근 가능)

- 전체 후보 비교 문서: `https://claude.ai/code/artifact/3444852b-6efa-4dd1-ba05-c541be3c20a6`
- PRJ-01 심화 착수 가이드(정의·BOM·안전·로드맵·저예산 오픈소스 레퍼런스 전부 포함): `https://claude.ai/code/artifact/514a57d1-e1b7-4f8f-b024-3048e0416c44`

## 이 Code 세션에서 다룰 것으로 예상되는 작업

- `firmware/`: Arduino/ESP32 PID 컨트롤러 코드 (PHASE 0→1), 이후 ArduPilot 파라미터 설정.
- `sim/`: gym-pybullet-drones 기반 커스텀 환경, PPO 학습 스크립트, 도메인 랜덤화 설정.
- `cad/`: EDF·서보 마운트용 OpenSCAD/CadQuery 파라메트릭 스크립트 (K-9 TVC Hopper 프레임 STL을 우리 부품 치수에 맞게 조정). CAD를 처음부터 프리핸드로 설계하지 않는 것이 원칙 — 기존 STL 재사용 또는 코드 기반 파라메트릭 설계 우선.
- `docs/`: 이 프로젝트의 실험 노트, 안전 점검표, 발표자료 초안.

## 아직 열려 있는 질문

- 회원 명단(학년·학번·연락처·위챗)은 개인정보라 동아리 활동계획서에서 비워둠 — 부장이 직접 채워야 함.
- 최종 자유비행(구속 해제) 도전 여부는 STAGE 3 결과를 본 뒤 결정.
