# sim/ — 시뮬레이션 · 강화학습

아직 비어 있음. Week 2부터 착수.

## 계획 (마스터 설계도 §9)

- `hopper_aviary.py` — `gym-pybullet-drones` 기반 커스텀 환경. 단일 추력 + 4베인 측력.
  물리 모델은 SolidGeek 논문 3장(뉴턴-오일러 운동방정식 + 베인 양력/항력식)을 이식.
- `train_ppo.py` — PPO(stable-baselines3) 학습 스크립트.
- `params.yaml` — 실측값 (질량·CG·관성·추력곡선·베인 제어효과). 제작 중 측정해서 채움.
- 도메인 랜덤화 설정.

## 선행 (RL 학습 전)

- SB3 공식 퀵스타트: CartPole-v1 → Pendulum-v1 로 워크플로 먼저 익힐 것 (CLAUDE.md).
- baseline 제어(PID 또는 LQR)가 실기에서 서기 전엔 RL 학습 시작 안 함.

## 관측 / 행동 인터페이스 (PID ↔ RL 교체 가능하게 고정 — 설계도 §9.2)

```
관측 obs (12): 자세[r,p,y] · 각속도[p,q,r] · (자유모드) [vz,z] · 이전행동[thr,δr,δp,δy]
행동 act (4):  throttle∈[0,1] · δ_roll,δ_pitch,δ_yaw∈[-1,1]  → 공유 믹서 → 4베인+모터
```
