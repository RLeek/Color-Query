'use client'
export default function Home() {


  //@ts-ignore
  return (
    <main className="flex flex-col justify-center place-items-center">
        <div className = "w-10/12 md:w-144 xl:w-160 mt-4 px-2 border-2 border-black bg-white pb-4 mb-8">
            <h1 className = "text-3xl font-semibold pt-4 py-2">ColorQuery overview</h1>
                ColorQuery provides a simple DSL for querying and manipulating the HSV values of images. The intent is to provide a quick and simplified tool for understanding how the colors of different images work. 
            <h1 className = "text-3xl font-semibold pt-4 py-2">ColorQuery language (CQL) overview</h1>
            CQL queries consist of a series of statements executed one after the other. The first statement in a CQL query is always {' '}
            <code className="bg-slate-100 px-1"> pixels</code>.
            <br/>
            <div className= "bg-slate-100 p-2 mt-2 mb-2">
                <code>pixels</code>
            </div>
            Think of this initial statement as providing the hue, saturation and value for a pixel, to be passed
            on to the remaining statements. As there are no other statements, the original values are returned unmodified, resulting in the same image. 

            <h2 className = "text-xl font-semibold py-2">Statements</h2> 
            Statements are executed sequentially and separated by <code className = "bg-slate-100 px-1">|</code>. Other than <code className="bg-slate-100 px-1"> pixels</code>, the only other statement are assignment statements.
            Assignment statements consist of an assignment expression, optionally followed by a boolean expression that determines whether the assignment expression is executed. If the boolean expression is omitted then the assignment expression is always executed. An example query is:
            <br/>
            <div className= "bg-slate-100 p-2 mt-2 mb-2">
                <code>pixels</code>
                <br/>
                <code> | saturation = 0.5 if saturation {'>'} 0.5</code>
                <br/>
                <code> | value = 0.5 </code>
            </div>
            This query assigns the saturation to 0.5 if the saturation is larger than 0.5. It then sets the value to 0.5. 

            <h2 className = "text-xl font-semibold py-2"> Expressions</h2> 
            Assignment expressions assign a new value to one of <code className="bg-slate-100 px-1"> saturation</code>, <code className="bg-slate-100 px-1"> hue</code> or, <code className="bg-slate-100 px-1"> value</code>. The left-hand side is one of these, followed by an <code className="bg-slate-100 px-1"> =</code> with the right-hand side
            consisting of a numerical expression.
            <br/>
            <br/>
            Numerical expressions support the standard operators <code className="bg-slate-100 px-1"> *</code>,<code className="bg-slate-100 px-1">/</code>,<code className="bg-slate-100 px-1">+</code>,<code className="bg-slate-100 px-1">-</code> and precedence using <code className="bg-slate-100 px-1">()</code>. The values <code className="bg-slate-100 px-1"> saturation</code>, <code className="bg-slate-100 px-1"> hue</code> or, <code className="bg-slate-100 px-1"> value</code> 
            can also be used and their values will be the ones set in previous statements.
            <br/>
            <br/>

            Boolean expressions support the standard comparison operators <code className="bg-slate-100 px-1">={'>'}</code>,<code className="bg-slate-100 px-1">{'>'}</code>,<code className="bg-slate-100 px-1">{'<'}</code>,<code className="bg-slate-100 px-1">{'<='}</code> and <code className="bg-slate-100 px-1">{'=='}</code> between numerical expressions. The standard boolean operators 
            <code className="bg-slate-100 px-1">{'and'}</code>,<code className="bg-slate-100 px-1">{'or'}</code> are also supported to combine these boolean expressions. Precedence using <code className="bg-slate-100 px-1">()</code> is also supported.

            <h2 className = "text-xl font-semibold py-2">Hue, Saturation and Value</h2> 
            Hue, saturation and value each work on a limited scale.
            <br/>
            <br/>
            <code className="bg-slate-100 px-1"> Hue</code> must be in the range [0, 360]
            <br/>
            <code className="bg-slate-100 px-1"> Saturation</code> must be in the range [0, 1]
            <br/>
            <code className="bg-slate-100 px-1"> Value</code> must be in the range [0, 1]
            <br/>
            <br/>
            For the sake of simplicity this range limit is only applied after all the statements have been executed, and rounds the value to the closest valid value in the range. For example:
            <br/>
            <div className= "bg-slate-100 p-2 mt-2 mb-2">
                <code>pixels</code>
                <br/>
                <code> | hue = hue + 180</code>
            </div>
             This query will add 180 to the hue, after which any hue greater than 360 will be rounded down to 360. Compare this to the following query:
            <br/>
            <div className= "bg-slate-100 p-2 mt-2 mb-2">
            <code>pixels</code>
                <br/>
                <code> | hue = hue + 180</code>
                <br/>
                <code> | hue = hue - 360 if hue {'>'} 360</code>
            </div>
            This query will add 180 to the hue, resulting in some hue values being outside the valid range. This is followed by subtracting 360 to any hue value greater than 360. Only at this point will hue values outside the valid range be rounded to the closest valid value. Since we have already done this manually however, no hue values will be changed.

            <br/>
            <h1 className = "text-3xl font-semibold pt-4 py-2">FAQ</h1>
            <h2 className = "text-xl font-semibold py-2"> Why was HSV chosen?</h2>
                HSV was chosen as it is the colorspace primarily used by artists, and considered the most intuitive for most people.
            <h2 className = "text-xl font-semibold py-2"> Colorspaces are more complex than this, aren't they?</h2>
                Yes, making this tool has made me realize that I'm out of my depth when it comes down to how colorspaces work. Regardless, I'm satisfied with this as a quick and simple tool.
            <h2 className = "text-xl font-semibold py-2"> Could you implement {'<x>'} feature?</h2>
                If you have an idea for a feature, don't be afraid to reach out! I can't guarantee that it will be implemented, but understanding how others use this tool will still provide valuable feedback on how to make this tool better.


        </div>
    </main>
  );
}