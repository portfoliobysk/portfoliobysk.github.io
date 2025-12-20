/*
 * Gemini APIを使ってレシピを生成するコード
 */
import { GoogleGenAI } from "@google/genai";
const gemini = new GoogleGenAI({  });

const button = document.getElementById('executeButton');
const recipeOutput = document.getElementById('recipeOutput');

async function createRecipe() {

    const ingredient = document.getElementById('mainIngredient').value;
    const time = document.getElementById('cookingTime').value;

    const userPrompt = `
    あなたは最高の料理研究家です。
    以下の条件に合う、初心者でも作れるレシピを一つ提案してください。
    1. メイン食材: ${ingredient}
    2. 調理時間: ${time}分以内
    3. 出力形式: 材料、作り方（箇条書き）
    `;

    const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
    });

  recipeOutput.textContent = response.text;

}

button.addEventListener('click', createRecipe);