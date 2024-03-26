import * as ohm from 'ohm-js';



const colorQuerySource = String.raw`
    colorQuery {
    	Query = "pixels" Assignment*
    
        Assignment = "|" Literal "=" Exp "if" BoolExp -- conditional
        		   | "|" Literal "=" Exp  -- nonconditional
        Literal = "hue"
        		| "saturation"
                | "value"
        Exp = AddExp
        AddExp = AddExp "+" MulExp --plus
        	   | AddExp "-" MulExp -- minus
               | MulExp
        MulExp = MulExp "*" ExpExp -- times
        	   | MulExp "/" ExpExp -- divide
               | ExpExp
        ExpExp = "(" AddExp ")" -- paren
               | "(" BoolExp ")" --boolParen
         	   | decimal
               | number
               | Literal
        BoolExp = BoolExp "or" CompExp -- or
       			| BoolExp "and" CompExp -- and
                | CompExp
        CompExp = CompExp ">" ExpExp -- gt
        		| CompExp "<" ExpExp --lt
                | CompExp "==" ExpExp -- eq
                | CompExp ">=" ExpExp -- gte
                | CompExp "<=" ExpExp -- lte
                | ExpExp
        number = digit+
        decimal = number"."number
    }
`;
const colorQueryGrammar = ohm.grammar(colorQuerySource);


const s = colorQueryGrammar.createSemantics();
s.addOperation(
    'eval',
    {
        Query(_, assignments) {
            const assignFuncs:Function[] = []
            for (const assignment of assignments.children) {
                assignFuncs.push(assignment.eval())
            }

            return function(value:number, hue:number, saturation:number) {
                var args = [value, hue,saturation]
                for (const assignFunc of assignFuncs) {
                    args = assignFunc(args[0], args[1], args[2]);
                }
                return args
            }
        },
        Assignment_conditional(_, literal, _1, exp, _2, boolExp) {
            const expFunc = exp.eval();
            const boolExpFunc = boolExp.eval();

            return function(value:number, hue:number, saturation:number) {
                if (boolExpFunc(value, hue, saturation)) {
                    if (literal.sourceString == "hue") {
                        return [value, expFunc(value, hue, saturation), saturation]
                    }
                    if (literal.sourceString == "value") {
                        return [expFunc(value, hue, saturation), hue, saturation]
                    }
                    if (literal.sourceString == "saturation") {
                        return [value, hue, expFunc(value, hue, saturation)]
                    }
                }
                return [value, hue, saturation]
            }
        },
        Assignment_nonconditional(_, literal, _1, exp) {
            const expFunc = exp.eval();
            return function(value:number, hue:number, saturation:number) {
                if (literal.sourceString == "hue") {
                    return [value, expFunc(value, hue, saturation), saturation]
                }
                if (literal.sourceString == "value") {
                    return [expFunc(value, hue, saturation), hue, saturation]
                }
                if (literal.sourceString == "saturation") {
                    return [value, hue, expFunc(value, hue, saturation)]
                }
            }
        },
        Literal(e) {
            return function(value:number, hue:number, saturation:number) {
                if (e.sourceString== "hue") {
                    return hue
                }
                if (e.sourceString== "value") {
                    return value
                }
                if (e.sourceString== "saturation") {
                    return saturation
                }
            }
        },
        Exp(addExp) {
            return addExp.eval()
        },
        AddExp_plus(addExp, _, mulExp) {
            const addExpFunc = addExp.eval();
            const mulExpFunc = mulExp.eval();
            return function(value:number, hue:number, saturation:number) {
                return addExpFunc(value, hue, saturation) + mulExpFunc(value, hue, saturation)
            }
        },
        AddExp_minus(addExp, _, mulExp) {
            const addExpFunc = addExp.eval();
            const mulExpFunc = mulExp.eval();
            return function(value:number, hue:number, saturation:number) {
                return addExpFunc(value, hue, saturation) - mulExpFunc(value, hue, saturation)
            }
        },
        AddExp(mulExp) {
            return mulExp.eval()
        },
        MulExp_times(mulExp, _, expExp) {
            const mulExpFunc = mulExp.eval();
            const expExpFunc = expExp.eval();
            return function(value:number, hue:number, saturation:number) {
                return mulExpFunc(value, hue, saturation) * expExpFunc(value, hue, saturation)
            }
        },
        MulExp_divide(mulExp, _, expExp) {
            const mulExpFunc = mulExp.eval();
            const expExpFunc = expExp.eval();
            return function(value:number, hue:number, saturation:number) {
                return mulExpFunc(value, hue, saturation) / expExpFunc(value, hue, saturation)
            }
        },
        MulExp(expExp) {
            return expExp.eval()
        },
        ExpExp_paren(_, addExp, _1) {
            return addExp.eval()
        },
        ExpExp_boolParen(_, boolExp, _1) {
            return boolExp.eval()
        },
        ExpExp(e) {
            return e.eval();
        },
        BoolExp_or(boolExp, _, compExp) {
            const boolExpFunc = boolExp.eval();
            const compExpFunc = compExp.eval();
            return function(value:number, hue:number, saturation:number) {
                return boolExpFunc(value, hue, saturation) | compExpFunc(value, hue, saturation)
            }
        },
        BoolExp_and(boolExp, _, compExp) {
            const boolExpFunc = boolExp.eval();
            const compExpFunc = compExp.eval();
            return function(value:number, hue:number, saturation:number) {
                return boolExpFunc(value, hue, saturation) & compExpFunc(value, hue, saturation)
            }
        },
        BoolExp(e) {
            return e.eval();
        },
        CompExp_gt(compExp, _, expExp) {
            const compExpFunc = compExp.eval();
            const expExpFunc = expExp.eval();
            return function(value:number, hue:number, saturation:number) {
                return compExpFunc(value, hue, saturation) > expExpFunc(value, hue, saturation)
            }
        },
        CompExp_lt(compExp, _, expExp) {
            const compExpFunc = compExp.eval();
            const expExpFunc = expExp.eval();
            return function(value:number, hue:number, saturation:number) {
                return compExpFunc(value, hue, saturation) < expExpFunc(value, hue, saturation)
            }
        },
        CompExp_eq(compExp, _, expExp) {
            const compExpFunc = compExp.eval();
            const expExpFunc = expExp.eval();
            return function(value:number, hue:number, saturation:number) {
                return compExpFunc(value, hue, saturation) == expExpFunc(value, hue, saturation)
            }
        },
        CompExp_gte(compExp, _, expExp) {
            const compExpFunc = compExp.eval();
            const expExpFunc = expExp.eval();
            return function(value:number, hue:number, saturation:number) {
                return compExpFunc(value, hue, saturation) >= expExpFunc(value, hue, saturation)
            }
        },
        CompExp_lte(compExp, _, expExp) {
            const compExpFunc = compExp.eval();
            const expExpFunc = expExp.eval();
            return function(value:number, hue:number, saturation:number) {
                return compExpFunc(value, hue, saturation) <= expExpFunc(value, hue, saturation)
            }
        },
        CompExp(e) {
            return e.eval()
        },
        number(e) {
            return function(value:number, hue:number, saturation:number) {
                return parseFloat(e.sourceString);
            }
        },
        decimal(number1, _, number2) {
            return function(value:number, hue:number, saturation:number) {
                return parseFloat(number1.sourceString+"."+number2.sourceString)
            }
        }
    }
);



export default function getCompiledFunction(text:string):Function | string {
    var colorQueryTree = colorQueryGrammar.match(text);
    if (colorQueryTree.succeeded()) {
        return (s(colorQueryTree).eval());
    } else if (colorQueryTree.message) {
        return colorQueryTree.message;
    } else {
        return "Unexpected query error"
    }
}