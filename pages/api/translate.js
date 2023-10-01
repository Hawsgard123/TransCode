import { OpenAIstream } from "pages/utils"
import axios from "axios"

export default handler = async (req, res) => {
  try {
    const [inputLang, outputLang, inputCode] = req.json
    const response = await axios.request(
      OpenAIstream(inputLang, outputLang, inputCode)
    )
    console.log(response)
  } catch (error) {
    console.log("Something went wrong")
    console.log(error)
  }
}
