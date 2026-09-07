# cad/ — 파라메트릭 CAD (rev B)

CLAUDE.md 원칙: **프리핸드 CAD 금지.** 기존 STL 재사용 > 코드 파라메트릭 > 기성 브라켓.
rev B = 64 mm/4S 오픈 스탠드오프 프레임 (동체 튜브 없음). 설계도: `docs/design/00-hopper-master-design.md`.

## 파일

| 파일 | 내용 | 상태 |
|---|---|---|
| `params.scad` | **모든 치수의 유일 정의.** 실물 확보 후 `MEASURED` 블록만 갱신 | 형상 확정, 실측 대기 |
| `top_plate.scad` | 상판 (EDF 마운트 + 기둥 4소켓 + 베일 + 흡기 개방) | 스케치 — fit 링 먼저 |
| `vane_ring.scad` | 베인 링 (베인4 + 서보4 + 다리4 + 중앙 구속 소켓), `vane()`, `vane_sweep_check()` | 스케치 — 스윕 검증 |
| `tray.scad` | *(미작성)* 중앙 아비오닉스 트레이 슬리브 (CG 트림 슬롯) | TODO |
| `leg_foot.scad` | *(미작성)* 다리 발 + 범퍼 | TODO |

## 워크플로

1. OpenSCAD(무료) 설치 → `top_plate.scad` 열고 F5.
2. 실물(EDF·서보·로드) 버니어 실측 → `params.scad` `MEASURED` 갱신.
3. `top_plate` / `vane_ring`의 EDF·기둥 접촉부만 **20 mm 높이로 잘라** 시험 출력 → 끼움 확인.
4. 맞으면 F6 → STL → 슬라이서(PETG, 벽 4, 인필 40%).
5. `vane_ring.scad`의 `vane_sweep_check()` 주석 해제 → ±15° 베인이 다리·서보와 안 부딪히는지 확인 (리스크 R1).

## 재사용 검토

- **cjhagemeyer, 3-axis TVC for 64mm EDF** (printables.com/model/803977) — 64 mm EDF용 베인 유닛 STL. 서보 2개·~23° 스로우. **`vane_ring`의 실물 출발점** — 우리 4베인/±15°로 개조하거나, 그대로 쓰고 SingleCopter 대신 2축만 제어하는 것도 검토 가능.
- **Bresc, Ducted fan TVC drone** (printables.com/model/722967) — 90 mm, 4 제트베인 배치 참고.
- **K-9 TVC Hopper** (printables.com/model/164897) — 4다리 배치 기하만.

## 좌표 관례

- Z+ = 위(흡기). 배기 = −Z.
- `top_plate`: 원점 = 상판 아랫면. `vane_ring`: 원점 = 링 아랫면, EDF 배기면은 `vane_gap_below_exit + vane_ring_h` 위.
- 베인 0°(중립) = 시위가 Z축과 평행. 부호는 TC-1에서 `SERVOx_REVERSED`로 실기 정합.
