'use client'

import { useState } from "react";
import ImageUpload from "./Image/imageUpload";
import ImageDraw from "./Image/imageDraw";
import getCompiledFunction from "./Compiler/parser";

export default function Home() {
  const [Image, setImage] = useState<File|null>(null);
  const [text, setText] = useState<string>("pixels");
  const [query, setQuery] = useState<Function>(()=>{return (value:number, hue:number, saturation:number) => {return [value, hue, saturation]}}); //value,hue,saturation
  const [error, setError] = useState<string>();


  function submit() {
    var result = getCompiledFunction(text);
    if (result instanceof Function) {
      setQuery(()=>{return getCompiledFunction(text)});
      setError("");
    } else {
      setError(result);
    }
  }

  function reset() {
    setQuery(()=>{return (value:number, hue:number, saturation:number) => {return [value, hue, saturation]} });
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
          <textarea autoCapitalize="none" onChange={e => setText(e.target.value)} className="w-full mt-12 mb-2 px-2 pt-2 h-10svh"></textarea>
          {error != "" && <div className="pb-4 pl-2 text-red-600">{error}</div>}
          <div className="flex flex-row place-content-between">
            <button onClick={submit} className="bg-white rounded-lg p-2 hover:bg-slate-200 mt-2">
              Submit Query
            </button>
            <div>
              <button onClick={reset} className="bg-white rounded-lg p-2 mx-2 hover:bg-slate-200 float-right mt-2">
                Reset Image
              </button>
              <button onClick={clear} className="bg-white rounded-lg p-2 mx-2 hover:bg-slate-200 float-right mt-2">
                Clear Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}