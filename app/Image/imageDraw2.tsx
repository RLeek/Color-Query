'use client'

import { memo, useEffect, useRef } from "react";

export default memo(function ImageDraw2({ fileName, command }: { fileName: File|null, command:Function }) {

  const canvasRef = useRef(null)
  var image = new Image();


  function rgb2hsv(r:number,g:number,b:number) {
    let v=Math.max(r,g,b), c=v-Math.min(r,g,b);
    let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 
    return [60*(h<0?h+6:h), v&&c/v, v];
  }

  // input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
  function hsv2rgb(h:number, s:number, v:number) 
  {                              
    let f= (n:number,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
    return [f(5),f(3),f(1)];       
  }   

  useEffect(()=> {
    const canvas = canvasRef.current
    if (canvas && fileName) {
        //@ts-ignore
        const ctx = canvas.getContext('2d')
        image.onload = function() {
            ctx.canvas.width = image.width
            ctx.canvas.height = image.height
            ctx.drawImage(image, 0, 0)
            var imageData = ctx.getImageData(0,0, image.width, image.height)
            var data = imageData.data
            console.log(command);
            for (let i = 0; i < data.length; i += 4) {
                var hsvValue = rgb2hsv(data[i]/255, data[i+1]/255, data[i+2]/255);
                var result = command(hsvValue[2], hsvValue[0], hsvValue[1]); //value,hue,saturation
                var rgb = hsv2rgb(result[1], result[2], result[0]);
                data[i] = rgb[0]*255;
                data[i+1] = rgb[1]*255;
                data[i+2] = rgb[2]*255;
            }
            ctx.putImageData(imageData, 0 , 0)

        }
        image.src = URL.createObjectURL(fileName)
    }
  })
  return (
    <>

        <canvas ref={canvasRef} >

        </canvas>

    </>
  );
})