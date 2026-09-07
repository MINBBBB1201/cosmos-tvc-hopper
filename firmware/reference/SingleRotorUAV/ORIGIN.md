# 출처

이 폴더는 [SolidGeek/SingleRotorUAV](https://github.com/SolidGeek/SingleRotorUAV)에서
**손대지 않고 그대로 가져온(vendor) 원본**이다. 2026-09-05 `main` 브랜치 기준.

- 저자: Emil Bjerregaard Jacobsen (Aalborg University, Control and Automation 석사논문, 2021)
- 라이선스: **MIT** (`LICENSE` 파일 그대로 포함 — 재배포 시 저작권 고지 유지 조건)
- 원본 CAD: [Onshape](https://cad.onshape.com/documents/e833cc23e7ea826c94a116f3/w/362fc8aca947f44850932dcd/e/4721094f67251fa796bbdcbc) (이 폴더엔 없음 — 링크로만 참조, 필요 시 COSMOS 계정으로 Copy)
- 논문 전문: `../../../docs/design/references/Jacobsen2021_*.pdf`
- 관련 리서치 정리: `../../../docs/design/research-open-source-references.md`

## 여기서 뭘 가져왔고 뭘 안 가져왔나

가져온 것: `SingleRotorUAV.ino`, `src/*.cpp`, `src/*.h` (센서 드라이버·통신·제어·DShot 전체), `README.md`, `LICENSE`.

안 가져온 것(원본엔 있지만 생략):
- `MATLAB/` (Simulink 검증용 — 필요하면 원본 저장소에서 별도로)
- `docs/`의 범용 데이터시트(IMXRT1060 레퍼런스 매뉴얼 등, 프로젝트 고유 자료 아님 — 필요 시 제조사 사이트에서)

## 우리가 손댈 계획 (아직 시작 안 함)

원본은 **동축 반대회전 모터 2개 + 짐벌 없는 베인4**를 쓴다. 우리는 §추진계만 **단일 EDF**로 바꿀 것 — 저자 본인이
논문 8.2절에서 "실전엔 단일 EDF가 더 나은 선택이었을 것"이라 결론 내린 부분을 반영하는 것.
구체적으로 `src/control.cpp`의 프로펄전 믹서(현재 `write_motor()` 2회 호출 구조)를 EDF 1개로 단순화하고,
Bresciani의 자이로스코픽 정차 보정 항을 추가할 예정. 수정은 **이 폴더가 아니라 실제 빌드용 브랜치/포크에서**
진행하고, 이 폴더는 "원본 그대로"를 유지해 나중에 diff를 비교할 수 있게 한다.
