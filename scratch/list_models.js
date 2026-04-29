import { GoogleGenerativeAI } from '@google/generative-ai'

async function list() {
  // Hardcode the key temporarily just for testing
  const genAI = new GoogleGenerativeAI('AIzaSyAw7om5yw33LJDFs6HZvraKqyY1GPgLW_I'); 
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + 'AIzaSyAw7om5yw33LJDFs6HZvraKqyY1GPgLW_I');
    const data = await response.json();
    console.log(data.models.map(m => m.name).join('\n'));
  } catch (e) {
    console.error(e);
  }
}

list();
