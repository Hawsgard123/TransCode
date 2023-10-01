import Image from "next/image"
import bg from "@/public/background.jpg"
import twitter from "@/public/twitter.png"
import { Inter } from "next/font/google"
import Window from "@/Components/Window"
import { useState } from "react"
const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [inputCode, setInputCode] = useState(``)
  const [outputCode, setOutputCode] = useState("")
  const [inputLang, setInputLang] = useState("C++")
  const [outputLang, setOutputLang] = useState("Python")

  const handleInputLanguageChange = (option) => {
    setInputLang(option.value)
    setInputCode("")
    setOutputCode("")
  }

  const handleOutputLanguageChange = (option) => {
    setOutputLang(option.value)
    setOutputCode("")
  }

  const handleTranslate = async () => {
    const max = 5000
    if (inputLang === outputLang) {
      alert("Please choose different languages")
      return
    }

    if (!inputCode) {
      alert("Give me some code!")
      return
    }

    if (inputCode.length > max) {
      alert(
        `Your code's length is ${inputCode.length}. My capacity is ${max}. Sorry.`
      )
      return
    }

    setLoading(true)
    setOutputCode("")

    const control = new AbortController()

    const re = {
      inputLang,
      outputLang,
      inputCode,
    }

    const response = await fetch("pages/api/translate", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      signal: control.signal,
      body: JSON.stringify(re),
    })

    if (!response.ok) {
      setLoading(false)
      alert("Something went wrong")
      alert(response.ok)
      return
    }

    const data = response.body

    if (!data) {
      setLoading(false)
      alert("Something went wrong")
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, doneReading } = await reader.read()
      done = doneReading
      const partValue = decoder.decode(value)
      setOutputCode((prev) => prev + partValue)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col">
      <Image
        className="fixed left-0 top-0 w-screen h-screen -z-10"
        src={bg}
        alt={"background"}
      />
      <div className="mt-16 flex flex-col items-center justify-center mb-6">
        <h1 className="font-sans text-5xl items-center justify-center font-bold pt-5 text-white">
          Code Translator
        </h1>
        <h2 className="font-sans text-xl mt-5 justify-center text-slate-600 mb-10 text-white">
          Translate your code into other languages with just one click.
        </h2>
      </div>
      <div className="flex flex-row">
        <Window
          code={inputCode}
          setCode={setInputCode}
          loading={loading}
          handleLanguageChange={handleInputLanguageChange}
          language={inputLang}
        />
        <button
          disabled={loading}
          className="bg-[#000000] border-black border-4 mt-40 flex justify-center items-center rounded-lg text-white font-semibold w-[150px] h-[50px]"
          onClick={handleTranslate}
        >
          {loading ? `Translating...` : `Translate`}
        </button>
        <Window
          code={outputCode}
          setCode={setOutputCode}
          loading={loading}
          handleLanguageChange={handleOutputLanguageChange}
          language={outputLang}
        />
      </div>
      <div className="flex items-center justify-center"></div>
    </div>
  )
}
