// 한 번에 처리할 수 있는 최대 세그먼트 수를 제한
const MAX_SEGMENTS = 128;

export const translateTexts = async (texts, targetLanguage) => {
  const apiKey = "AIzaSyCJ4IzjZ2dy9KK05LlEYgIfTiHPtYXmRY8";
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  const translatedTexts = [];

  try {
    // 텍스트를 MAX_SEGMENTS씩 나누어 번역 요청을 보냄
    for (let i = 0; i < texts.length; i += MAX_SEGMENTS) {
      const textSegment = texts.slice(i, i + MAX_SEGMENTS); // 텍스트를 자르기
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: textSegment, // 텍스트 배열 조각
          target: targetLanguage,
        }),
      });

      const data = await response.json();

      // 오류 처리
      if (!data.data || !data.data.translations) {
        throw new Error("번역 오류 발생: " + JSON.stringify(data.error));
      }

      // 번역된 텍스트들을 배열에 추가
      translatedTexts.push(
        ...data.data.translations.map(
          (translation) => translation.translatedText
        )
      );
    }

    return translatedTexts; // 번역된 모든 텍스트를 반환
  } catch (error) {
    console.error("번역 중 오류 발생:", error);
    return texts; // 오류 발생 시 원래 텍스트를 반환
  }
};
