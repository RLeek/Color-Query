'use client'

import { useEffect, useRef } from "react";

export default function ImageDraw({ fileName, redRange, greenRange, blueRange }: { fileName: File|null, redRange:number[], greenRange:number[], blueRange:number[] }) {

  const canvasRef = useRef(null)
  var image = new Image(1);

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
            for (let i = 0; i < data.length; i += 4) {
                if (data[i] < redRange[0] || data[i] > redRange[1]) {
                    data[i] = 0
                    data[i+1] = 0
                    data[i+2] = 0
                } else if (data[i+1] < greenRange[0] || data[i+1] > greenRange[1]) {
                    data[i] = 0
                    data[i+1] = 0
                    data[i+2] = 0
                } else if (data[i+2] < blueRange[0] || data[i+2] > blueRange[1]) {
                    data[i] = 0
                    data[i+1] = 0
                    data[i+2] = 0
                }
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
}