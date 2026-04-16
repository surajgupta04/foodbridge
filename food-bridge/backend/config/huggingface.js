import { InferenceClient } from '@huggingface/inference';
import fs from 'fs';

const hf = new InferenceClient(process.env.HF_TOKEN);

export const classifyFood = async (imagePath) => {
  try {
    const imageData = fs.readFileSync(imagePath);
    const blob = new Blob([imageData], { type: 'image/jpeg' });

    const result = await hf.imageClassification({
      data: blob,
      model: 'google/vit-base-patch16-224',
    });

    return result[0]?.label || 'Unknown';
  } catch (error) {
    console.error('AI classification failed:', error.message);
    return 'Unknown';
  }
};