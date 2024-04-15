'use client'

import React, { RefObject } from "react";
import { memo, useEffect } from "react";

export default memo(function ImageDraw({ fileName, command }: { fileName: File|null, command: string}) {

  const canvasRef: RefObject<HTMLCanvasElement> = React.createRef();

  useEffect(()=> {
    const canvas = canvasRef.current
    if (canvas && fileName && window.Worker) {
      const ctx = canvas.getContext('2d')
      const worker = new Worker(new URL("../canvasWorker/worker.ts", import.meta.url))
      var image = new Image();
      const offscreen = new OffscreenCanvas(image.width,image.height)
      var offscreenCtx = offscreen.getContext('2d')
      image.onload = function () {
        offscreenCtx.canvas.width = image.width
        offscreenCtx.canvas.height = image.height
        offscreenCtx.drawImage(image, 0, 0, image.width, image.height)
        var imageData = offscreenCtx?.getImageData(0,0, image.width, image.height).data
        console.log(imageData)
        worker.postMessage({imageData: imageData, command:command})
      }
      image.src = URL.createObjectURL(fileName)

      worker.onmessage = function(e) {
        ctx.canvas.width = image.width
        ctx.canvas.height = image.height
        var imageData = ctx?.createImageData(image.width, image.height)
        imageData?.data.set(e.data)
        ctx.putImageData(imageData, 0, 0)
      }
    }
  })
  return (
    <>
      
        <canvas ref={canvasRef} className="pt-8">

        </canvas>

    </>
  );
})