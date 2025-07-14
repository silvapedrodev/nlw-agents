import { GoogleGenAI } from '@google/genai'
import { env } from '../env.ts'

const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
})

const model = 'gemini-2.5-flash'

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: "Transcreva o áudio para o português (pt-BR), garantindo precisão e naturalidade na transcrição. Mantenha a pontuação correta e divida o texto em parágrafos sempre que necessário para melhorar a clareza. Além disso, corrija ou adapte termos técnicos conforme o contexto, mantendo sua compreensão intacta (por exemplo, 'props', 'state', etc.)."
      },
      {
        inlineData: {
          mimeType,
          data: audioAsBase64,
        },
      }
    ]
  })

  if (!response.text) {
    throw new Error('Não foi possível converter o audio.')
  }

  return response.text
}

export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: 'text-embedding-004',
    contents: [{ text }],
    config: {
      taskType: 'RETRIEVAL_DOCUMENT',
    },
  })

  if (!response.embeddings?.[0].values) {
    throw new Error('Não foi possível gerar os embeddings.')
  }

  return response.embeddings[0].values
}

export async function generateAnswer(
  question: string,
  transcriptions: string[]
) {
  const context = transcriptions.join('\n\n')

  const prompt = `
    Com base no texto fornecido abaixo como contexto, responda a pergunta de forma clara e precisa em português (pt-BR).
  
    CONTEXTO:
    ${context}

    PERGUNTA:
    ${question}

    REGRAS:
    - Utilize exclusivamente as informações do conteúdo da aula para responder;
    - Caso a resposta não esteja no conteúdo da aula, informe que não há informações suficientes para respondê-la;
    - Seja direto e conciso em sua resposta;
    - Mantenha um tom profissional, educativo e didático;
    - Se necessário, faça referência a trechos específicos do conteúdo da aula para embasar sua resposta;
    - Ao referenciar o conteúdo, use o termo "conteúdo da aula" para indicar de onde a informação foi extraída;
  `.trim()

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt,
      },
    ],
  })

  if (!response.text) {
    throw new Error('Falha ao gerar resposta pelo Gemini')
  }

  return response.text
}