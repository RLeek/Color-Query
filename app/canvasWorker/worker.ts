import { getCompiledFunction } from "../Compiler/parser";

self.onmessage = (event) => {
    var command = getCompiledFunction(event.data.command)
    var image = event.data.imageData
    for (let i = 0; i < image.length; i += 4) {
        var hsvValue = rgb2hsv(image[i]/255, image[i+1]/255, image[i+2]/255);
        var result:number[] = command(hsvValue[2], hsvValue[0], hsvValue[1]);
        var result = roundDown(result)
        var rgb = hsv2rgb(result[1], result[2], result[0]);
        image[i] = rgb[0]*255;
        image[i+1] = rgb[1]*255;
        image[i+2] = rgb[2]*255;
    }
    postMessage(image)
};

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

function roundDown(result: number[]) {
    if (result[1] > 360) {
        result[1] = 360
    } else if (result[1] < 0) {
        result[1] = 0
    }

    if (result[2] > 1) {
        result[2] = 1
    } else if (result[2] < 0) {
        result[2] = 0
    }

    if (result[0] > 1) {
        result[0] = 1
    } else if (result[0] < 0) {
        result[0] = 0
    }
    return result
}