# 리서치 — 기존 오픈소스 설계·CAD·튜토리얼 (엔지니어링 시간 최소화용)

**목적**: "소프트웨어(RL)에 집중하고 싶다 → 기구·제어 엔지니어링에 걸리는 시간을 최소화하고 싶다"는
요청에 맞춰, 우리와 같은 부류(단일 추력원 + 배기 베인 4개 = TVC 호퍼/모노콥터)의 **CAD·펌웨어·문서가
이미 완성돼 있는 프로젝트**를 깊게 팠다. 결론부터: **rev B가 지금까지 가정한 것보다 훨씬 좋은 기존
레퍼런스가 있다.** 특히 아래 발견 B는 설계를 살짝 바꿔서라도 채택할 가치가 충분하다.

이 문서는 **연구 결과만** 담는다 — rev B 설계도(`00-hopper-master-design.md`)는 아직 안 건드렸다.
채택 여부는 팀이 결정.

---

## 0. TL;DR — 발견 4개, 등급순

| 등급 | 프로젝트 | 뭐가 있나 | 우리와의 거리 |
|---|---|---|---|
| ★★★★★ | **[SolidGeek/SingleRotorUAV](https://github.com/SolidGeek/SingleRotorUAV)** (Emil Jacobsen, Aalborg University 석사논문) | **완전한 CAD(Onshape, 55개 파트) + 완전한 펌웨어(Teensy 4.0, C++) + 89쪽 논문(이론·설계·결과 전부) + 비행 영상.** MIT 라이선스 | 매우 가깝다 — 우리와 **똑같은 목적**("reusable rocket을 안전하게 재현"), 똑같은 구조(단일 추력원 + 베인4), CLAUDE.md가 이미 지정한 Teensy 폴백과 정확히 일치 |
| ★★★★☆ | **[Mathieu Bresciani(PX4 core 개발자)의 단일 EDF TVC 드론](https://www.printables.com/model/722967-ducted-fan-thrust-vectoring-drone)** ([PX4 PR #21489](https://github.com/PX4/PX4-Autopilot/pull/21489)) | 90mm EDF, 베인4, **컴파일된 펌웨어(.px4) + 파라미터 파일 + Fusion360 CAD**를 그대로 배포. 실비행 영상, 제3자(HowardJetson)가 재현 성공 | 추진 방식(단일 EDF)이 우리와 동일 — 가장 가까운 "부품만 사서 그대로" 후보 |
| ★★★☆☆ | **bribro12 SpaceX-inspired EDF rocket** (기존 rev B 근거) | STL + Fusion360 소스(유료), 완성·비행 영상 | 이미 rev B의 기반. 새로 안 찾아도 됨 |
| ★★★☆☆ | **cjhagemeyer — 64mm EDF용 3축 TVC** ([Printables](https://www.printables.com/model/803977)) | STL만, 튜토리얼 없음 | 우리 스케일(64mm)과 가장 가까움 — 베인 유닛 기하 참고용 |

**한 줄 권장**: 지금 rev B의 "처음부터 그리는 파라메트릭 CAD + 일반론적 SingleCopter 문서" 조합보다,
**발견 B(SolidGeek)의 CAD를 포크하고 코드를 베이스로 삼는 쪽이 기구·제어 엔지니어링 시간을 훨씬 크게 줄인다** — 아래 §6~7에서 근거와 트레이드오프를 정리했다.

---

## 1. 발견 B — SolidGeek/SingleRotorUAV (핵심 발견)

- **저자**: Emil Bjerregaard Jacobsen, Aalborg University "Control and Automation" 석사논문 (2021).
- **논문 제목**: *Modelling and Control of Thrust Vectoring Mono-copter* (89쪽, 저장소에 `thesis.pdf`로 포함).
- **문제 정의가 우리 프로젝트와 토씨 하나 안 틀리고 같다**: "reusable rocket 기술은 대부분의 학교·연구기관이 접근 불가 → 안전하고 저렴한 축소 플랫폼으로 그 역학을 재현하자."
- **저장소 구성**:
  - `SingleRotorUAV.ino` + `src/*.cpp,*.h` — Teensy 4.0 펌웨어 전체. 센서 드라이버(BNO080 IMU, PMW3901 광류센서, VL53L1X 라이다), DShot ESC 드라이버, 통신(ESP32 WiFi 텔레메트리 + RC 폴백), 제어(칼만 필터 + LQR).
  - `MATLAB/` — Simulink 시뮬레이션(동역학 모델 검증용).
  - **[Onshape CAD](https://cad.onshape.com/documents/e833cc23e7ea826c94a116f3/w/362fc8aca947f44850932dcd/e/4721094f67251fa796bbdcbc)** — 완전 공개, 로그인 없이 열람 가능, **55개 인스턴스**의 실제 조립 파일. 브라우저에서 바로 포크해서 치수만 우리 부품에 맞게 고치면 됨(OpenSCAD보다 진입장벽 낮음 — 학생들이 코드 없이 파라미터만 바꿔도 됨).
  - `thesis.pdf` — 문제정의 → 선행연구 조사 → 시스템 설계(액추에이터·센서·전자 선정 근거) → **동역학 모델링(뉴턴-오일러 방정식, 베인 양력/항력 방정식 유도)** → **제어(LQR + 적분항 + 칼만필터, 유도 과정 전부)** → 소프트웨어 구조 → **시험 결과(자세/고도/위치 제어 각각 스텝응답·궤적추종 그래프)** → 토의(뭐가 잘 안 됐고 왜) → 결론.
- **라이선스**: MIT — 상업/학술 재사용 제약 없음.
- **실비행 검증**: 이착륙·호버링·착륙 성공(YouTube: [jJKNR2vzTVY](https://youtu.be/jJKNR2vzTVY)), Vicon 모션캡처로 스텝응답·원궤적 추종까지 정량 검증.

### 왜 이게 우리에게 특히 좋은가

1. **CLAUDE.md의 "저예산 대안"을 이미 완성해놨다.** CLAUDE.md는 처음부터 "Arduino/Teensy + 자체 PID"를 대안으로 열어뒀다 — 이 프로젝트는 그 대안을 Teensy 4.0으로 이미 구현·검증까지 끝낸 것. ArduPilot에서 이걸로 갈아타는 건 "설계 변경"이 아니라 "CLAUDE.md가 이미 승인한 대안 경로를 처음부터 짜지 않고 가져다 쓰는 것"에 가깝다.
2. **동역학·제어 유도 과정 전체가 문서화돼 있다.** 우리 `sim/hopper_aviary.py`(gym-pybullet-drones 커스텀 환경)에 필요한 비선형 운동방정식·베인 공력 모델을 처음부터 유도할 필요 없이 논문 3장 수식을 그대로 옮기면 된다 — **이건 소프트웨어 시간을 깎아먹는 게 아니라 정확히 우리가 하고 싶은 소프트웨어(RL 시뮬레이션) 작업의 기반을 앞당겨주는 것.**
3. **LQR 베이스라인은 PID보다 더 좋은 비교 대상일 수 있다.** 우리 로드맵(§8.1)은 "baseline PID 확보 → RL과 비교"인데, 이미 검증된 LQR 컨트롤러가 있으면 "PID vs RL"이 아니라 **"고전 모델기반제어(LQR) vs RL"**로 비교 기준을 한 단계 격상할 수 있다 — 발표에서 더 설득력 있는 결과.
4. **제어 코드 구조가 RL 이식에 유리하다.** `control.cpp`의 `control_hover()`는 `output = K * error` 한 줄로 요약되는 상태궤환 구조 — 나중에 이 한 줄을 "정책망 추론 호출"로 바꿔치기하면 되는 구조라서, ArduPilot/PX4 같은 큰 오토파일럿의 내부 C++ 모듈을 파고드는 것보다 **RL 정책을 꽂아넣기가 오히려 더 쉽다.**
5. **DShot + ESC 텔레메트리(RPM) 를 이미 읽고 있다.** 이건 §2에서 설명할 자이로스코픽 정차(precession) 보정에 그대로 재사용 가능한 인프라다.

### 이 프로젝트를 그대로 안 쓰고 고쳐야 하는 부분

- **추진계가 우리와 다르다**: 이 논문은 "동축 반대회전 브러시리스 모터 2개 + 오픈 프로펠러(F40PRO 2600KV + 5045 프롭)"를 썼다. **EDF가 아니다.** 이유는 "EDF는 자이로스코픽 반작용을 상쇄할 반대회전 짝을 못 만든다"였는데—
- **저자 본인이 논문 8.2절(토의)에서 이걸 실패로 결론 내렸다**: *"동축 반대회전 원리는 좋았으나, 실제로는 토크 상쇄가 안 돼서 결국 요(yaw) 제어를 따로 넣어야 했다. 게다가 듀얼 모터가 난류·진동·소음을 훨씬 많이 만든다. **실전에서는 단일 EDF가 더 나은 선택이었을 것이다**(better choice might be a single motor ducted fan)."*
  → 즉 **CLAUDE.md/rev B가 이미 고른 "단일 EDF" 선택이 이 논문 저자의 사후 결론과 정확히 일치한다.** 우리는 이 프로젝트에서 CAD 골격·베인 형상·전자·제어·문서를 가져오되, 추진계만 우리 원래 계획(단일 EDF)으로 유지하면 된다 — 오히려 저자가 겪은 실패를 자동으로 피해가는 셈.
- **자력계(컴퍼스) 간섭 문제**: "IMU가 모터에 너무 가까워서 자기장이 오염돼 요 추정치가 드리프트한다"고 명시 — 우리 rev B가 이미 "GPS/자력계 없이 자이로 적분만으로 요 추정"(§8.1)을 택한 게 이 실패를 우연히 회피하고 있다. 그대로 유지.
- **착륙 단계 전용 컨트롤러 필요**: "착륙 국면은 호버링 게인 그대로 쓰지 말고 별도 설계가 나아 보인다"는 교훈 — 우리 시험 카드(TC-7)에 반영할 만함.
- **센서 스택 중 광류(PMW3901)·라이다(VL53L1X)는 STAGE 1(구속 자세시험)엔 불필요** — 이건 위치제어(수평 드리프트 억제)용이라 자유 홉 스트레치 골에서만 필요. 처음엔 BNO080(IMU) + Teensy + DShot만 가져와도 충분.

---

## 2. 발견 C — Mathieu Bresciani(PX4 코어 개발자)의 단일 EDF TVC 드론

- **저자**: bresch (Mathieu Bresciani) — PX4 오토파일럿의 실제 코어 컨트리뷰터(레이트 컨트롤러 등을 담당하는 팀원).
- **기체**: 90mm EDF + 베인 4개(짐벌 없음), Pixracer급 보드, PX4 펌웨어.
- **[Printables 페이지](https://www.printables.com/model/722967-ducted-fan-thrust-vectoring-drone)**에 **컴파일된 펌웨어 바이너리(.px4, FMU-v4/Pixracer용) + QGroundControl에 바로 임포트하는 파라미터 파일 + Fusion360 CAD**를 통째로 올려놨다 — **빌드할 필요 없이 플래시만 하면 되는 수준.**
- **핵심 기술 기여 — 자이로스코픽 정차(gyroscopic precession) 보정** ([PX4 PR #21489](https://github.com/PX4/PX4-Autopilot/pull/21489), 병합은 안 됐지만 브랜치는 살아있고 그가 직접 비행 검증함):
  > *"단일(강체) 로터 드론은 빠르게 도는 원판이 만드는 자이로스코픽 토크가 동역학을 지배한다. 이게 롤-피치 축 사이에 강한 커플링을 만들어서 튜닝을 거의 불가능하게 만든다."*
  → 해결책: **레이트 컨트롤러에 로터 RPM(ESC 텔레메트리)과 각속도를 이용해 자이로스코픽 토크를 실시간으로 상쇄하는 피드포워드 루프**(`MC_PRECESS_GAIN` 파라미터)를 추가.
- **제3자 재현 확인**: discuss.px4.io의 "HowardJetson"이 Pixracer R15에 이 펌웨어를 올려 자기 기체를 만들었고([스레드](https://discuss.px4.io/t/thrust-vectoring-edf-copter/47879)), 튜닝 과정에서 겪은 문제(측면 드리프트, 이륙 직후 앞구르기)와 해결책까지 포럼에 남아 있음.
- **독립적으로 우리 rev B를 검증해주는 대목**: 같은 포럼의 "single-copter-pid-tuning" 스레드에서 Bresciani 본인이 준 조언 — *"CG를 더 높이 올렸더니 토크 발생량이 늘고 안정성이 좋아져서, 그제서야 성공적으로 날았다."* → **우리가 rev B §3.3/§5.3에서 이미 채택한 "CG를 최대한 높인다" 설계 원칙과 정확히 일치.**

### 이게 우리에게 왜 중요한가 (설계 변경 여부와 무관하게)

- ArduPilot의 SingleCopter 문서·코드에서는 이런 자이로스코픽 정차 보정 항목을 찾지 못했다(리서치 §5 참고). 우리 64mm EDF도 "빠르게 도는 강체 로터" 그 자체이므로, **같은 문제를 겪을 가능성이 실재한다** — 이건 rev B 리스크 레지스터에 아직 없는 항목이라 반드시 추가해야 한다(§6 참고).
- 이 보정 로직 자체는 PX4를 안 쓰더라도 **수식만 가져와서 Teensy(SolidGeek 코드베이스) 쪽에 이식 가능** — SolidGeek 펌웨어가 이미 DShot 텔레메트리로 모터 RPM을 읽고 있어서 인프라가 갖춰져 있다.

---

## 3. 기타 확인한 것들 (짧게)

| 항목 | 내용 |
|---|---|
| **ArduPilot에 자이로스코픽 정차 보정이 있는가** | 검색 결과 명시적 파라미터/기능을 찾지 못함. SingleCopter 튜닝 스레드들은 "게인을 낮춰서 버텼다"는 식의 경험담뿐 — PX4의 `MC_PRECESS_GAIN` 같은 전용 해법은 ArduPilot 쪽엔 없어 보임(추가 확인 필요, §8) |
| **선행 학술 문헌** | Carholt et al., *"Design, modelling and control of a Single Rotor UAV"* (2016, MED 컨퍼런스) — SolidGeek 논문이 인용한 시뮬레이션 전용 선행연구. 무료 전문: [kth.diva-portal.org](http://kth.diva-portal.org/smash/get/diva2:1672182/FULLTEXT01). "SR-UAV(Single Rotor UAV)"라는 이름으로 작은 학술 하위분야가 실제 존재함 — 우리가 하는 게 "검증된 적 없는 이상한 것"이 아니라는 근거로 발표에 쓸 수 있음 |
| **Honeywell RQ-16 T-Hawk** | 실전 배치된 군용 단일 덕티드팬 VTOL(2007~) — "이 비행 원리가 군사적으로도 실증됐다"는 역사적 근거. SolidGeek 논문 Fig 1.2에 인용됨 |
| **중국 상용 키트** | "TVC 호퍼/矢量推力/悬停套件" 등으로 찾아봤지만 이 정확한 니치(단일 EDF+베인4 호퍼)를 만족하는 **상용 완제품/키트는 존재하지 않음** — 사서 끝낼 수 있는 옵션은 없고, 오픈소스 설계를 가져다 쓰는 게 최선의 시간 절약 경로라는 게 재확인됨 |
| **cjhagemeyer 64mm 3축 TVC** | STL만 있고 튜토리얼 없음(검색 스니펫 기준 서보 2개, ~23° 스로우). 우리 정확한 스케일(64mm)과 제일 가까우니 **베인 하우징 기하 자체는 참고할 가치가 있지만, 문서·코드가 없어서 "튜토리얼 있는 채택 후보"는 못 됨** |

---

## 4. 이번에 새로 드러난 리스크 (rev B 리스크 레지스터에 없던 것)

| 리스크 | 근거 | 대응 아이디어 |
|---|---|---|
| **단일 EDF의 자이로스코픽 정차 커플링** — 빠르게 도는 팬 디스크가 롤-피치를 강하게 커플링해 "튜닝이 거의 불가능"할 수 있음 | Bresciani, PX4 PR #21489 원문 | ① ESC를 DShot 양방향 텔레메트리 지원 제품으로 선정(RPM 필요) ② TC-3에서 롤-피치 커플링을 먼저 정량 관찰 ③ 필요시 Bresciani의 보정식을 Teensy 코드에 이식, 혹은 LQR의 상태궤환 게인이 암묵적으로 흡수하게 설계 |
| **동축/듀얼모터로 회전모멘트를 상쇄하려는 시도는 실전에서 실패한다** | SolidGeek 논문 8.2절 실측 결론 | 우리는 처음부터 단일 EDF라 해당 없음 — 그냥 "우리가 옳았다"는 근거로만 기록 |
| **IMU-모터 간 자기간섭으로 요 추정 드리프트** | SolidGeek 논문 8.1.1절 | 우리는 이미 자력계 미사용(자이로 적분)이라 회피됨 — 유지 |
| **착륙 단계는 호버 게인으로 안 되고 별도 컨트롤러가 나음** | SolidGeek 논문 8.1.2절 | TC-7(저고도 홉) 설계 시 착륙 전용 게인 스케줄 고려 |

---

## 5. 옵션 비교

| | **A. rev B 그대로**(from-scratch 파라메트릭 CAD + ArduPilot SingleCopter 일반문서) | **B. SolidGeek 베이스 채택**(Onshape 포크 + Teensy 코드 포크, EDF만 교체) | **C. Bresciani/PX4 베이스 채택**(90mm EDF급으로, 컴파일된 펌웨어+파라미터) |
|---|---|---|---|
| CAD 시작점 | 없음, 처음부터 스케치 | **있음 — Onshape 55파트, 브라우저에서 바로 포크** | 있음(Fusion360), 단 90mm 스케일 |
| 펌웨어/제어 시작점 | ArduPilot 일반 문서만(우리 기체 전용 자료 없음) | **있음 — Teensy C++ 전체 소스 + 89쪽 이론 문서** | **있음 — 컴파일된 바이너리+파라미터, 빌드 불필요** |
| 자이로 정차 문제 | 미해결·미인지 상태였음(이번에 발견) | 이식 필요(수식은 확보) | **이미 해결됨(PX4 코드에 내장)** |
| 우리 예산(₩260-420k)과의 정합성 | 그대로 | 그대로(64mm EDF 유지) | 90mm급 재도입 시 **비용 rev A 수준으로 재상승 우려** |
| CLAUDE.md와의 정합성 | L3(ArduPilot) 그대로 | **L3의 "저예산 대안"을 그대로 실현 — 이탈 아님** | ArduPilot→PX4 생태계 전환, 보드도 F405→Pixracer급 전환 필요 |
| RL 이식 난이도 | 미지수(SingleCopter 믹서 내부 구조 파악 필요) | **낮음 — `control_hover()` 한 함수만 교체하면 됨, 우리가 코드 전체를 읽고 이해 가능** | PX4 내부 구조(uORB, 모듈 시스템) 학습 필요 — 진입장벽 있으나 offboard/ROS2 연동은 PX4가 더 성숙 |
| 커뮤니티 실증 | bribro12 1건 | **저자 본인 + 최소 1인 재현(암묵적, 논문 자체가 실증)** | 저자 + HowardJetson 등 제3자 재현 확인됨 |

---

## 6. 권장안

1. **1순위 — SolidGeek/SingleRotorUAV를 기구·펌웨어의 새 베이스라인으로 채택 검토.** Onshape CAD를 포크해서 모터마운트만 우리 64mm EDF(또는 실제 구매한 EDF)에 맞게 치수 교체, 베인·다리·전자 마운트는 최대한 그대로. 펌웨어는 `src/`를 포크해서 프로펄전 믹서 부분만 "모터 2개 차동"에서 "EDF 1개 + 베인4"로 수정(사실 우리 쪽이 더 단순해짐 — 모터가 하나 줄어듦). 이렇게 하면:
   - CAD·전자·센서·통신 설계 시간 대부분 절약.
   - 동역학 모델(뉴턴-오일러 + 베인 공력)을 논문에서 그대로 가져와 `sim/hopper_aviary.py`에 이식 — **소프트웨어(RL) 쪽 착수 시간도 같이 당겨진다.**
   - LQR 베이스라인을 PID보다 상위 비교 기준으로 격상 가능(선택).
2. **2순위 — Bresciani의 자이로스코픽 정차 보정식만 별도로 가져와 이식.** PX4 전체를 채택하지 않아도, PR #21489의 보정 로직(로터 RPM × 각속도 기반 피드포워드)은 논문 수준의 수식이라 Teensy 코드에 별도 함수로 넣을 수 있다. ESC는 반드시 **DShot + 양방향 텔레메트리(RPM 리턴) 지원** 제품으로 선정해야 함 — BOM 갱신 필요.
3. **여전히 유효**: bribro12(추진계 부품 소싱 근거), cjhagemeyer(베인 하우징 기하 참고)는 그대로 참고자료로 남겨둔다.
4. **아직 열려있는 질문(팀 결정 필요)**:
   - Teensy(SolidGeek 방식, C++ 직접 제어) vs ArduPilot(F405, 프레임워크형) — 최종 택일은 팀 회의에서. 이 문서는 근거만 제공.
   - 채택 시 rev B 문서(`00-hopper-master-design.md`) 개정은 **팀 합의 후 별도 rev C로 진행** — 지금은 안 건드림.

---

## 7. 채택할 경우 다음 단계 (참고용 체크리스트 — 실행은 아직 안 함)

- [ ] Onshape 문서를 COSMOS 계정으로 "Copy" (자기 계정에 포크해야 편집 가능 — 원본은 view-only)
- [ ] `SingleRotorUAV.ino` + `src/` 클론, Arduino IDE/PlatformIO로 Teensy 4.0 대상 빌드 테스트(우리 하드웨어 없이도 컴파일만 먼저 확인 가능)
- [ ] 논문 3장(모델링) 수식을 Python으로 옮겨 `sim/hopper_aviary.py` 동역학에 반영
- [ ] BOM에 DShot 양방향 텔레메트리 지원 ESC로 교체 검토(현재 60A 4S ESC가 지원하는지 확인)
- [ ] BNO080 IMU 소싱(현재 F405 WING 내장 ICM-42688P 대신, 혹은 병행) — Teensy 경로로 갈 경우 별도 IMU 모듈 필요
- [ ] 논문 부록(Appendix A: 추력 실측, Appendix B: 베인 에어포일)까지 읽어서 베인 형상 최종 확정에 반영

---

## 8. 참고 링크 전체

- SolidGeek, *SingleRotorUAV* — https://github.com/SolidGeek/SingleRotorUAV (MIT) · [Onshape CAD](https://cad.onshape.com/documents/e833cc23e7ea826c94a116f3/w/362fc8aca947f44850932dcd/e/4721094f67251fa796bbdcbc) · [영상](https://youtu.be/jJKNR2vzTVY) · `thesis.pdf`(저장소 내)
- Jacobsen, E.B. *Modelling and Control of Thrust Vectoring Mono-copter*, Aalborg University, 2021 (석사논문, 저장소에 포함)
- Bresciani, M. — [단일 EDF TVC 드론 (Printables)](https://www.printables.com/model/722967-ducted-fan-thrust-vectoring-drone) · [PX4 PR #21489](https://github.com/PX4/PX4-Autopilot/pull/21489) · [영상](https://www.youtube.com/watch?v=u2cETOyuJ20)
- PX4 Discourse — [Thrust vectoring EDF copter](https://discuss.px4.io/t/thrust-vectoring-edf-copter/47879) · [Single-copter PID tuning](https://discuss.px4.io/t/single-copter-pid-tuning/5669)
- Carholt, O.C. et al. *Design, modelling and control of a Single Rotor UAV*, MED 2016 — [전문 PDF](http://kth.diva-portal.org/smash/get/diva2:1672182/FULLTEXT01)
- cjhagemeyer, *3-axis thrust vectoring for 64mm EDF* — https://www.printables.com/model/803977-3-axis-thrust-vectoring-for-64mm-edf
- ArduPilot Discourse — [SingleCopter & CoaxCopter Support](https://discuss.ardupilot.org/t/singlecopter-coaxcopter-support/8543) · [SingleCopter Tuning](https://discuss.ardupilot.org/t/singlecopter-tuning/42431) · [Ducted Fan UAV Ardupilot](https://discuss.ardupilot.org/t/ducted-fan-uav-ardupilot/62408)
- Maloney, D. *Single-Rotor Drone: A Thrust-Vectoring Monocopter*, Hackaday, 2018 — https://hackaday.com/2018/08/31/single-rotor-drone-a-thrust-vectoring-monocopter/
