import endent from "endent"
require("dotenv").config()

const apiKey = "#"
const host = "#"

const createPrompt = (inputLang, outputLang, inputCode) => {
  if (inputLang === "Natural Language") {
    return endent`
        You are an expert programmer in all programming languages. Translate the natural language to "${outputLang}" code. Do not include \`\`\`.

        Example translating from natural language to JavaScript:

        Natural language:
        Print the numbers 0 to 9.

        JavaScript code:
        for (let i = 0; i < 10; i++) {
        console.log(i);
        }

        Natural language:
        ${inputCode}

        ${outputLang} code (no \`\`\`):`
  } else if (outputLang === "Natural Language") {
    return endent`
        You are an expert programmer in all programming languages. Translate the "${inputLang}" code to natural language in plain English that the average adult could understand. Respond as bullet points starting with -.

        Example translating from JavaScript to natural language:

        JavaScript code:
        for (let i = 0; i < 10; i++) {
            console.log(i);
        }

        Natural language:
        Print the numbers 0 to 9.

        ${inputLang} code:
        ${inputCode}

        Natural language:`
  } else {
    return endent`
        You are an expert programmer in all programming languages. Translate the "${inputLang}" code to "${outputLang}" code. Do not include \`\`\`.

        Example translating from JavaScript to Python:

        JavaScript code:
        for (let i = 0; i < 10; i++) {
            console.log(i);
        }

        Python code:
        for i in range(10):
            print(i)

        ${inputLang} code:
        ${inputCode}

        ${outputLang} code (no \`\`\`):
        `
  }
}

export const OpenAIstream = async (inputLang, outputLang, inputCode) => {
  const prompt = createPrompt(inputLang, outputLang, inputCode)
  const res = {
    method: "POST",
    url: "https://chatgpt-api8.p.rapidapi.com/",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "#",
      "X-RapidAPI-Host": "#",
    },
    data: [
      {
        content: prompt,
        role: "user",
      },
    ],
  }
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  if (res.status !== 200) {
    const statusText = res.statusText
    const result = await res.body?.getReader().read()

    throw new Error(
      `OpenAI API returned an error: ${
        decoder.decode(result?.value) || statusText
      }`
    )
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event) => {
        if (event.type === "event") {
          const data = event.data

          if (data === "[DONE]") {
            controller.close()
            return
          }

          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta.content
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            controller.error(e)
          }
        }
      }

      const parser = createParser(onParse)

      for await (const chunk of res.body) {
        parser.feed(decoder.decode(chunk))
      }
    },
  })

  return stream
}
