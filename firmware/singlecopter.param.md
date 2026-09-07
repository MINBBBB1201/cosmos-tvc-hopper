# ArduPilot SingleCopter — 시작 파라미터 메모 (§8.4 대안 경로, rev C 기준)

> **rev C부터 주 경로는 Teensy 4.0 + SolidGeek 포크로 바뀌었다** (마스터 설계도 §8.1,
> `firmware/reference/SingleRotorUAV/`). 이 문서는 **그게 막힐 경우의 대안 경로**로 보존.
> 대상 보드: **SpeedyBee F405 WING** (ArduCopter 4.4+, `SpeedyBeeF405WING` 타겟).
> 대안: Matek H743-SLIM / Pixhawk.
> 실제 `.param` 파일은 Mission Planner에서 셋업 후 내보내 `firmware/singlecopter.param`로 저장.
> 이 메모는 설계도 §8.4의 근거·순서를 코드팀이 바로 쓰도록 정리한 것.

## 프레임 / 장착

| 파라미터 | 값 | 비고 |
|---|---|---|
| 펌웨어 | ArduCopter 4.4+ | SpeedyBeeF405WING 펌웨어 |
| `FRAME_CLASS` | 8 | SingleCopter |
| `FRAME_TYPE` | 0 | (SingleCopter는 무시되나 기본값 유지) |
| `AHRS_ORIENTATION` | 보드 장착에 맞게 (보드 수직이면 25=Pitch270) | 화살표 = Forward flap 방향. 보드를 눕혀 장착하면 0 |
| `BATT_CELL_COUNT` 등 | 4S 기준 | 전압 페일세이프 4S로 |

## 출력 매핑 (셋업 마법사가 자동 배정 → Motor Test로 확인)

- Motor1 = 스로틀(EDF) → `SERVO1`
- Motor2..5 = Forward / Right / Back / Left flap → `SERVO2..5`
- 각 flap: `SERVOx_MIN` / `SERVOx_MAX` 로 ±15° PWM 한계, `SERVOx_TRIM` 중립, `SERVOx_REVERSED` TC-1에서 부호 정합.

## 자세 추정 (GPS/자력계 없음, 구속 시험)

| 파라미터 | 값 | 비고 |
|---|---|---|
| `EK3_ENABLE` | 1 | |
| `AHRS_EKF_TYPE` | 3 | EKF3 |
| `EK3_SRC1_POSXY` | 0 | 위치 소스 없음 |
| `EK3_SRC1_VELXY` | 0 | |
| `EK3_SRC1_POSZ` | 1 (Baro) | 기압계 있으면 |
| `EK3_SRC1_YAW` | 0 | 요는 자이로 적분(상대) |
| `ARMING_CHECK` | 필요한 것만 | GPS/컴퍼스 체크 해제 |

## 진동 대응 (조립 후)

1. TC-0에서 로그 → `Tools > FFT` 로 팬 진동 주파수 확인.
2. `INS_LOG_BAT_MASK` 로 raw IMU 로깅.
3. `INS_HNTCH_ENABLE=1`, `INS_HNTCH_FREQ` = 관측 피크, `INS_HNTCH_BW`, `INS_HNTCH_MODE=1`(throttle 기반).
4. `INS_GYRO_FILTER` 20–40 Hz.

## 튜닝 (구속 M1, 설계도 §8.1 절차)

| 파라미터 | 시작 | 방향 |
|---|---|---|
| `ATC_RAT_RLL_P` / `_PIT_P` | 0.08 (낮게) | 진동 직전까지 ↑ 후 30% 백오프 |
| `ATC_RAT_RLL_D` / `_PIT_D` | 0.002 | 감쇠, 로그로 노이즈 증폭 감시 |
| `ATC_RAT_RLL_I` / `_PIT_I` | 0.05 | 구속 비대칭 정상오차 제거 최소 |
| `ATC_RAT_YAW_P` | 0.10 | 요 권한 약함 — 저게인 or 텐서 구속 |
| `ATC_ANG_RLL_P` / `_PIT_P` | 4.5 | 각 루프 |
| `PILOT_THR_BHV` | 0 | |
| `MOT_SPIN_ARM` / `MOT_SPIN_MIN` | 0.10 / 0.12 | TC-0에서 확인 후 |
| `SCHED_LOOP_RATE` | 400 | rev B는 소형·저관성 → 서보 지연 영향 큼. 400 Hz 유지 |
| `ATC_INPUT_TC` | 0.15 | 입력 부드럽게(과제어 방지) |

## 안전

| 파라미터 | 값 | 비고 |
|---|---|---|
| `RCx_OPTION` (킬 채널) | 31 (Motor Emergency Stop) | 송신기 킬 스위치 → 즉시 정지 |
| `FS_THR_ENABLE` | 1 | 스로틀 페일세이프 |
| `DISARM_DELAY` | 짧게 | |
| `LOG_DISARMED` | 1 | 시험 중 항상 로깅 (RL 비교 baseline 데이터) |

## 로그 → sim/params.yaml 로 넘길 값

- `ATT` (자세 추종), `RATE` (각속도 루프), `RCOU` (서보 출력), `VIBE` (진동), `BAT` (전압 새그).
- TC-3/4 지표: 복원시간 τ, 오버슈트 %, 정상상태오차 → RL(TC-5)과 동일 포맷으로 비교표.
