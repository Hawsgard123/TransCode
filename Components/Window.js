import Editor from "./Editor"
import LangSelect from "./LangSelect"

const Window = ({ code, setCode, loading, handleLanguageChange, language }) => {
  return (
    <div className="mx-20 my-5 w-2/5">
      <LangSelect
        language={language}
        handleLanguageChange={handleLanguageChange}
        disabled={loading}
      />
      <Editor code={code} setCode={setCode} editable={!loading} />
    </div>
  )
}

export default Window
