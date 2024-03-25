'use client'

import * as React from 'react';
import { styled, alpha, Box } from '@mui/system';
import { Slider as BaseSlider, sliderClasses } from '@mui/base/Slider';
import { useEffect, useRef } from 'react';

export default function HueSlider({value, setValue} : {value:number[], setValue: Function}) {

  const canvasRef = useRef(null)

  function hsv2rgb(h:number, s:number, v:number) 
  {                              
    let f= (n:number,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
    return [f(5),f(3),f(1)];       
  }   

  useEffect(()=> {
    const canvas = canvasRef.current
    if (canvas) {
        //@ts-ignore
        const ctx = canvas.getContext('2d')
        ctx.beginPath();
        ctx.rect(0, 0, 360, 50)
        ctx.fill();
        const imageData = ctx.getImageData(0, 0, 360, 50);
        const data = imageData.data;

        for (let column = 0; column < 50; column+=1) {
            for (let row =0; row < 360; row+=1) {
                const pixel = column *(360 *4) + (row*4)
                const values = hsv2rgb(row, 1, 1);
                data[pixel] = values[0]*255;
                data[pixel+1] = values[1]*255;
                data[pixel+2] = values[2]*255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }
  })

  
  const handleChange = (event: Event, newValue: number | number[], activeThumb:number) => {

    var value = newValue as number[];
    if (activeThumb === 0) {
        setValue([Math.min(value[0], value[1]), value[1]]);
    } else {
        setValue([value[0], Math.max(value[1], value[0])]);
    }
  };

  return (
    <>
        <div className="relative">
            <canvas ref={canvasRef} height="50" width="360" className="absolute top-0 left-0">
            </canvas>
    
            <Slider
                value={value}
                onChange={handleChange}
                getAriaLabel={() => 'Temperature range'}
                getAriaValueText={valuetext}
                min={0}
                max={360}
                track={"inverted"}
                disableSwap
                className="absolute top-0 left-0"
                slots={{ valueLabel: SliderValueLabel }}
                />
        </div>
    </>
  );
}

interface SliderValueLabelProps {
    children: React.ReactElement;
  }
  
  function SliderValueLabel({ children }: SliderValueLabelProps) {
    return (
      <span className="label">
        <div className="value">{children}</div>
      </span>
    );
  }

function valuetext(value: number) {
  return `${value}°C`;
}

const blue = {
  100: '#DAECFF',
  200: '#99CCF3',
  400: '#3399FF',
  300: '#66B2FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B3',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Slider = styled(BaseSlider)(
  ({ theme }) => `
  color: ${theme.palette.mode === 'light' ? blue[500] : blue[400]};
  width: 360px;
  display: inline-flex;
  position: absolute;
  cursor: pointer;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;

  &.${sliderClasses.disabled} {
    pointer-events: none;
    cursor: default;
    color: ${theme.palette.mode === 'light' ? grey[300] : grey[600]};
    opacity: 0.4;
  }

  & .${sliderClasses.rail} {
    display: block;
    position: absolute;
    width: 100%;
    height: 50px;
  }

  & .${sliderClasses.track} {
    display: block;
    position: absolute;
    height: 50px;
  }

  & .${sliderClasses.thumb} {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 5px;
    height: 50px;
    box-sizing: border-box;
    outline: 0;
    background-color: ${theme.palette.mode === 'light' ? blue[500] : blue[400]};
    transition-property: box-shadow, transform;
    transition-timing-function: ease;
    transition-duration: 120ms;
    transform-origin: center;

    &:hover {
      box-shadow: 0 0 0 6px ${alpha(
        theme.palette.mode === 'light' ? blue[200] : blue[300],
        0.3,
      )};
    }

    &.${sliderClasses.focusVisible} {
      box-shadow: 0 0 0 8px ${alpha(
        theme.palette.mode === 'light' ? blue[200] : blue[400],
        0.5,
      )};
      outline: none;
    }

    &.${sliderClasses.active} {
      box-shadow: 0 0 0 8px ${alpha(
        theme.palette.mode === 'light' ? blue[200] : blue[400],
        0.5,
      )};
      outline: none;
      transform: scale(1.2);
    }
  }

  & .${sliderClasses.mark} {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 99%;
    background-color: ${theme.palette.mode === 'light' ? blue[200] : blue[900]};
    top: 44%;
    transform: translateX(-50%);
  }

  & .${sliderClasses.markActive} {
    background-color: ${theme.palette.mode === 'light' ? blue[500] : blue[400]};
  }

  & .label {
    font-family: IBM Plex Sans;
    font-weight: 600;
    font-size: 14px;
    background: unset;
    background-color: white;
    width: 32px;
    height: 32px;
    padding: 0px;
    color: black;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    border-width: 2px;
    border-color: black;
    transform: translate(0%, 140%) scale(1);
  }

  :hover .value {
    text-align: center;
  }
`,
);