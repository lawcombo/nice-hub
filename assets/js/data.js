/**
 * NICE 자료허브 설정 및 자료 목록
 *
 * 새 자료를 등록할 때는 아래 materials 배열에 객체를 추가합니다.
 * 파일 경로는 이 페이지(index.html)를 기준으로 작성합니다.
 */
window.NICE_HUB_DATA = {
  categories: [
    {
      id: "lodging",
      label: "무인숙박",
      description: "무인숙박 사업의 홍보·운영자료",
      order: 10,
    },
    {
      id: "school-safety",
      label: "등하교",
      description: "등하교 사업의 홍보·운영자료",
      order: 20,
    },
  ],

  materialTypes: {
    brochure: "브로슈어",
    manual: "매뉴얼",
    video: "동영상",
  },

  // 실제 자료를 전달받은 뒤 이 배열에 등록합니다. 현재 배포 자료는 0건입니다.
  materials: [],
};
