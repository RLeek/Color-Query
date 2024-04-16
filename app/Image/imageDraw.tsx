'use client'

import React, { RefObject } from "react";
import { memo, useEffect } from "react";

export default memo(function ImageDraw({ fileName, command }: { fileName: File|null, command: string}) {

  const canvasRef: RefObject<HTMLCanvasElement> = React.createRef();
  var data = []

  useEffect(()=> {
    const canvas = canvasRef.current
    if (canvas && fileName && window.Worker) {
      const ctx = canvas.getContext('2d')




      var image = new Image();
      const offscreen = new OffscreenCanvas(image.width,image.height)
      var offscreenCtx = offscreen.getContext('2d')
      image.onload = function () {
        offscreenCtx.canvas.width = image.width
        offscreenCtx.canvas.height = image.height
        offscreenCtx.drawImage(image, 0, 0, image.width, image.height)
        var imageData = offscreenCtx?.getImageData(0,0, image.width, image.height).data
        const length = imageData?.length/window.navigator.hardwareConcurrency
        let currLength = 0
        for (let i = 0; i < window.navigator.hardwareConcurrency; i++) {
          let newWorker = new Worker(new URL("../canvasWorker/worker.ts", import.meta.url))
          newWorker.postMessage({imageData: imageData?.slice(currLength, currLength+length), command:command})
          newWorker.onmessage = function (e) {
            data.push(e.data)
            if (data.length == window.navigator.hardwareConcurrency) {
              data = Uint8ClampedArray.from(data.reduce((a, b) => [...a, ...b], []));
              console.log(data)
              ctx.canvas.width = image.width
              ctx.canvas.height = image.height
              var imageData = ctx?.createImageData(image.width, image.height)
              imageData?.data.set(data)
              ctx.putImageData(imageData, 0, 0)
            }
          }
          currLength += length
        }
      }
      image.src = URL.createObjectURL(fileName)
    }
  })
  return (
    <>
      
        <canvas ref={canvasRef} className="pt-8">

        </canvas>

    </>
  );
})