# Color-Query
This is a tool for manipulating the HSV values of images using a DSL called colorQuery language. This DSL is inpsired by the kusto query language, with docs [here](https://colorquery.arkanlily.dev/docs).

The website can be accessed [here](https://colorquery.arkanlily.dev/). Supports mobile and common browsers

## Usage
Upload an image then run a query using the DSL by writing the query and clicking 'Submit Query'. 

A sample query is:
```
pixels
| hue = hue + 180
| hue = hue - 360 if hue > 360
```
This will invert the colors of the provided image. 

## Getting Started
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
