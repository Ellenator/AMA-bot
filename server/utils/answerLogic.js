function countMatches(keywords, normalizedQuestion) {
    const matches = keywords.filter((keyword) => 
        normalizedQuestion.includes(keyword)
    );

    return matches.length
}

export function findAnswer(question, answers) {
  const normalizedQuestion = question.toLowerCase();

  for (const answerGroup of answers) {
    const hasMatch = answerGroup.keywords.some((keyword) =>
        normalizedQuestion.includes(keyword));

    if (hasMatch) {
      return answerGroup.answer;
    }
  }

  return "Det kender jeg desværre ikke svaret på endnu.";
}

export function findBestAnswer(question, answers) {
  const normalizedQuestion = question.toLowerCase();

  let bestScore = 0;
  let bestAnswer = "Det kender jeg desværre ikke svaret på endnu.";
  let bestCategory = "";

  for (const answerGroup of answers) {
    const tempScore = countMatches(answerGroup.keywords, normalizedQuestion);
    if (tempScore > bestScore) {
        bestScore = tempScore;
        bestAnswer = answerGroup.answer;
        bestCategory = answerGroup.category; 
    }
  }
  return {
    answer: bestAnswer,
    category: bestCategory
  };
}