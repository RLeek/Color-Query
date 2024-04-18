'use client'

import React, { RefObject } from "react";
import { memo, useEffect } from "react";

export default memo(function ImageDraw({ fileName, command }: { fileName: File|null, command: string}) {

  const canvasRef: RefObject<HTMLCanvasElement> = React.createRef();
  const screenWidth = window.screen.width -30
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
        offscreen.width = image.width
        offscreen.height = image.height
        imageWidth = image.width
        imageHeight = image.height
        offscreenCtx?.drawImage(image, 0, 0)
        if (image.width >= screenWidth) {
          const ratio = imageHeight/imageWidth
          imageWidth = screenWidth
          imageHeight = (ratio*imageWidth)
          resample_single(offscreen, imageWidth, imageHeight, true)
        }
        
        if (offscreenCtx) {
          var imageData = offscreenCtx?.getImageData(0,0, imageWidth, imageHeight).data
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

  function resample_single(canvas:OffscreenCanvas , width:number, height:number, resize_canvas:boolean) {
    var width_source = canvas.width;
    var height_source = canvas.height;
    width = Math.round(width);
    height = Math.round(height);

    var ratio_w = width_source / width;
    var ratio_h = height_source / height;
    var ratio_w_half = Math.ceil(ratio_w / 2);
    var ratio_h_half = Math.ceil(ratio_h / 2);
    
    console.log(width_source)
    console.log(height_source)
    var ctx = canvas.getContext("2d");
    //@ts-ignore
    var img = ctx.getImageData(0, 0, width_source, height_source);
    //@ts-ignore
    var img2 = ctx.createImageData(width, height);
    var data = img.data;
    var data2 = img2.data;

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            var x2 = (i + j * width) * 4;
            var weight = 0;
            var weights = 0;
            var weights_alpha = 0;
            var gx_r = 0;
            var gx_g = 0;
            var gx_b = 0;
            var gx_a = 0;
            var center_y = (j + 0.5) * ratio_h;
            var yy_start = Math.floor(j * ratio_h);
            var yy_stop = Math.ceil((j + 1) * ratio_h);
            for (var yy = yy_start; yy < yy_stop; yy++) {
                var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                var center_x = (i + 0.5) * ratio_w;
                var w0 = dy * dy; //pre-calc part of w
                var xx_start = Math.floor(i * ratio_w);
                var xx_stop = Math.ceil((i + 1) * ratio_w);
                for (var xx = xx_start; xx < xx_stop; xx++) {
                    var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                    var w = Math.sqrt(w0 + dx * dx);
                    if (w >= 1) {
                        //pixel too far
                        continue;
                    }
                    //hermite filter
                    weight = 2 * w * w * w - 3 * w * w + 1;
                    var pos_x = 4 * (xx + yy * width_source);
                    //alpha
                    gx_a += weight * data[pos_x + 3];
                    weights_alpha += weight;
                    //colors
                    if (data[pos_x + 3] < 255)
                        weight = weight * data[pos_x + 3] / 250;
                    gx_r += weight * data[pos_x];
                    gx_g += weight * data[pos_x + 1];
                    gx_b += weight * data[pos_x + 2];
                    weights += weight;
                }
            }
            data2[x2] = gx_r / weights;
            data2[x2 + 1] = gx_g / weights;
            data2[x2 + 2] = gx_b / weights;
            data2[x2 + 3] = gx_a / weights_alpha;
        }
    }
    if (ctx) {

      //clear and resize canvas
      if (resize_canvas === true) {
        canvas.width = width;
        canvas.height = height;
      } else {
        ctx.clearRect(0, 0, width_source, height_source);
      }
      
      //draw
      ctx.putImageData(img2, 0, 0);
    }
  }


  return (
    <>
      
        <canvas ref={canvasRef}  className="mt-8 border-2 border-black">

        </canvas>

    </>
  );
})