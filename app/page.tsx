'use client'

import { useState } from "react";
import ImageUpload from "./Image/imageUpload";
import ImageDraw2 from "./Image/imageDraw2";
import getCompiledFunction from "./Compiler/parser";

export default function Home() {
  const [Image, setImage] = useState<File|null>(null);
  const [text, setText] = useState<string>("pixels");
  const [query, setQuery] = useState<Function>((value:number, hue:number, saturation:number) => {return [value, hue, saturation]}); //value,hue,saturation

  // input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
  function hsv2rgb(h:number, s:number, v:number) 
  {                              
    let f= (n:number,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
    return [f(5),f(3),f(1)];       
  }   

  function submit() {
    console.log(getCompiledFunction(text))
    setQuery(()=>{return getCompiledFunction(text)});
    console.log(query)
    // do stuff in here   
  }

  //@ts-ignore
  return (
    <main>
        <div>
          Hi
          <ImageUpload image={Image} setImage={setImage}/>
          <ImageDraw2 fileName={Image} command={query}/>
          <textarea onChange={e => setText(e.target.value)}></textarea>
          <div onClick={submit}>
            Submit!!!!!!!
          </div>
        </div>
    </main>
  );
}