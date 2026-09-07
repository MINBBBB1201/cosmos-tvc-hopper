# COSMOS — TVC 착륙 호퍼 + 강화학습

청도대원학교 항공우주공학 동아리 COSMOS의 26–27학년도 1학기 프로젝트.
단일 EDF 추력 + 배기 베인 4개로 자세를 제어하는 소형 VTOL 호퍼를 만들고,
전통 제어(PID/LQR)와 강화학습(RL) 제어를 정량 비교한다. SpaceX식 재사용 로켓의
역학을 안전한 축소 규모로 재현하는 게 목표.

## 시작점

- **[`CLAUDE.md`](CLAUDE.md)** — 현재 진행 상태 · 확정 방향 · 문서 맵 · 다음 액션. 새 세션은 이거 먼저.
- **[`docs/design/00-hopper-master-design.md`](docs/design/00-hopper-master-design.md)** — 마스터 설계도 (rev C)
- **[`docs/execution/week-01-kickoff.md`](docs/execution/week-01-kickoff.md)** — 1–2주차 실행 계획

## 구조

| 폴더 | 내용 |
|---|---|
| `docs/design/` | 설계도 · BOM · 리서치 · 참고 논문 |
| `docs/execution/` | 주차별 계획 · 조달 · 배선도 |
| `docs/presentation/` | 동아리 설명회 발표자료 |
| `firmware/` | 펌웨어 — `reference/SingleRotorUAV/`는 [SolidGeek/SingleRotorUAV](https://github.com/SolidGeek/SingleRotorUAV) (MIT) vendor-copy |
| `cad/` | 자체 파라메트릭 CAD (대안 — 주 경로는 SolidGeek Onshape 포크) |
| `sim/` | 시뮬레이션 · RL (Week 2 착수) |

## 라이선스 / 출처

`firmware/reference/SingleRotorUAV/`는 Emil Jacobsen (Aalborg University)의 MIT 라이선스 프로젝트를
그대로 포함한 것 — 해당 폴더의 `LICENSE`·`ORIGIN.md` 참고. 그 외 이 저장소의 내용은 COSMOS 동아리 작업물.
