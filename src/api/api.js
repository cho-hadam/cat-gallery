const BASE_URL =
  "https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev";

export const request = async (nodeId) => {
  try {
    const response = await fetch(`${BASE_URL}/${nodeId ? nodeId : ""}`);
    if (!response.ok) {
      throw new Error("서버의 상태가 이상합니다.");
    }
    return await response.json();
  } catch (e) {
    throw new Error(`무언가 잘못 되었습니다! ${e.message}`);
  }
};
