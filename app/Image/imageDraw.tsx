'use client'

import React, { RefObject } from "react";
import { memo, useEffect } from "react";

export default memo(function ImageDraw({ fileName, command }: { fileName: File|null, command: string}) {

  const canvasRef: RefObject<HTMLCanvasElement> = React.createRef();
  const screenWidth = window.screen.width -50
  var imageWidth = 0
  var imageHeight = 0


  useEffect(()=> {
    const canvas = canvasRef.current
    if (canvas && fileName && window.Worker) {
      const ctx = canvas.getContext('2d')
      const worker = new Worker(new URL("../canvasWorker/worker.ts", import.meta.url))
      var image = new Image();
      const offscreen = new OffscreenCanvas(image.width,image.height)
      var offscreenCtx = offscreen.getContext('2d')
      image.onload = function () {
        imageWidth = image.width
        imageHeight = image.height
        if (image.width >= screenWidth) {
          const ratio = imageHeight/imageWidth
          imageWidth = screenWidth
          imageHeight = (ratio*imageWidth)
        }

        console.log(imageWidth)
        console.log(imageHeight)
        
        if (offscreenCtx) {
          offscreenCtx.canvas.width = imageWidth
          offscreenCtx.canvas.height = imageHeight
          offscreenCtx.drawImage(image, 0, 0, imageWidth, imageHeight)
          var imageData = offscreenCtx?.getImageData(0,0, imageWidth, imageHeight).data
          console.log(imageData)
          worker.postMessage({imageData: imageData, command:command})  
        }
      }
      image.src = URL.createObjectURL(fileName)

      worker.onmessage = function(e) {
        if (ctx) {
          ctx.canvas.width = imageWidth
          ctx.canvas.height = imageHeight
          var imageData = ctx?.createImageData(imageWidth, imageHeight)
          imageData?.data.set(e.data)
          ctx.putImageData(imageData, 0, 0)  
        }
      }
    }
  })
  return (
    <>
      
        <canvas ref={canvasRef}  className="pt-8">

        </canvas>

    </>
  );
})