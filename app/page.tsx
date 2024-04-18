'use client'

import { useState } from "react";
import ImageUpload from "./Image/imageUpload";
import ImageDraw from "./Image/imageDraw";
import validateQuery from "./Compiler/parser";

export default function Home() {
  const [Image, setImage] = useState<File|null>(null);
  const [text, setText] = useState<string>("pixels");
  const [query, setQuery] = useState<string>("pixels");
  const [error, setError] = useState<string>("");

  function submit() {
    var result = validateQuery(text);
    console.log(result)
    if (result.success) {
      setQuery(result.message);
      setError("");
    } else {
      setError(result.message);
    }
  }

  function reset() {
    setQuery("pixels");
  }

  function clear() {
    setImage(null);
  }


  //@ts-ignore
  return (
    <main>
      <div className="flex flex-col justify-center place-items-center">
          {Image == null ?         
            <ImageUpload image={Image} setImage={setImage}/> :
            <ImageDraw fileName={Image} command={query}/>
          }
          <div className="w-10/12 md:w-144 xl:w-160">
          <textarea autoCapitalize="none" onChange={e => setText(e.target.value)} className="w-full mt-8 mb-2 px-2 pt-2 h-24 border-2 border-black"></textarea>
          {error != "" ? 
            <div className="pb-2 pl-2 text-red-600 text-sm">{error}</div>:
            <div className = "pb-2"></div>
          }
          <div className="flex flex-row place-content-between">
            <button onClick={submit} className="bg-white p-2 hover:bg-slate-200 rounded-lg active:translate-x-3px active:translate-y-3px active:shadow-none shadow-button border-2 border-black">
              Submit Query
            </button>
            <div>
              <button onClick={reset} className="bg-white p-2 mx-2 hover:bg-slate-200 float-right rounded-lg active:translate-x-3px active:translate-y-3px active:shadow-none shadow-button border-2 border-black">
                Reset Image
              </button>
              <button onClick={clear} className="bg-white p-2 mx-2 hover:bg-slate-200 float-right rounded-lg active:translate-x-3px active:translate-y-3px active:shadow-none shadow-button border-2 border-black">
                Clear Image
              </button>
            </div>
          </div>
        </div>
        <div className = "w-10/12 md:w-144 xl:w-160 pt-1 pb-8">
          <a className="text-sm pl-2  underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href="/docs">Docs</a>
        </div>
      </div>
    </main>
  );
}