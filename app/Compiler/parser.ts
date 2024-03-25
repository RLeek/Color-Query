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
                return function(value:number, hue:number, saturation:number) {
                    var args = [value, hue,saturation]
                    for (const assignment of assignments.children) {
                        args = (assignment.eval())(args[0], args[1], args[2]);
                    }
                    return args
                }
            },
            Assignment_conditional(_, literal, _1, exp, _2, boolExp) {
                return function(value:number, hue:number, saturation:number) {
                    if (boolExp.eval()(value, hue, saturation)) {
                        if (literal.sourceString == "hue") {
                            return [value, exp.eval()(value, hue, saturation), saturation]
                        }
                        if (literal.sourceString == "value") {
                            return [exp.eval()(value, hue, saturation), hue, saturation]
                        }
                        if (literal.sourceString == "saturation") {
                            return [value, hue, exp.eval()(value, hue, saturation)]
                        }
                    }
                    return [value, hue, saturation]
                }
            },
            Assignment_nonconditional(_, literal, _1, exp) {
                return function(value:number, hue:number, saturation:number) {
                    if (literal.sourceString == "hue") {
                        return [value, exp.eval()(value, hue, saturation), saturation]
                    }
                    if (literal.sourceString == "value") {
                        return [exp.eval()(value, hue, saturation), hue, saturation]
                    }
                    if (literal.sourceString == "saturation") {
                        return [value, hue,exp.eval()(value, hue, saturation)]
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
                return function(value:number, hue:number, saturation:number) {
                    return addExp.eval()(value, hue, saturation) + mulExp.eval()(value, hue, saturation)
                }
            },
            AddExp_minus(addExp, _, mulExp) {
                return function(value:number, hue:number, saturation:number) {
                    return addExp.eval()(value, hue, saturation) - mulExp.eval()(value, hue, saturation)
                }
            },
            AddExp(mulExp) {
                return mulExp.eval()
            },
            MulExp_times(mulExp, _, expExp) {
                return function(value:number, hue:number, saturation:number) {
                    return mulExp.eval()(value, hue, saturation) * expExp.eval()(value, hue, saturation)
                }
            },
            MulExp_divide(mulExp, _, expExp) {
                return function(value:number, hue:number, saturation:number) {
                    return mulExp.eval()(value, hue, saturation) / expExp.eval()(value, hue, saturation)
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
                return function(value:number, hue:number, saturation:number) {
                    return boolExp.eval()(value, hue, saturation) | compExp.eval()(value, hue, saturation)
                }
            },
            BoolExp_and(boolExp, _, compExp) {
                return function(value:number, hue:number, saturation:number) {
                    return boolExp.eval()(value, hue, saturation) & compExp.eval()(value, hue, saturation)
                }
            },
            BoolExp(e) {
                return e.eval();
            },
            CompExp_gt(compExp, _, expExp) {
                return function(value:number, hue:number, saturation:number) {
                    return compExp.eval()(value, hue, saturation) > expExp.eval()(value, hue, saturation)
                }
            },
            CompExp_lt(compExp, _, expExp) {
                return function(value:number, hue:number, saturation:number) {
                    return compExp.eval()(value, hue, saturation) < expExp.eval()(value, hue, saturation)
                }
            },
            CompExp_eq(compExp, _, expExp) {
                return function(value:number, hue:number, saturation:number) {
                    return compExp.eval()(value, hue, saturation) == expExp.eval()(value, hue, saturation)
                }
            },
            CompExp_gte(compExp, _, expExp) {
                return function(value:number, hue:number, saturation:number) {
                    return compExp.eval()(value, hue, saturation) >= expExp.eval()(value, hue, saturation)
                }
            },
            CompExp_lte(compExp, _, expExp) {
                return function(value:number, hue:number, saturation:number) {
                    return compExp.eval()(value, hue, saturation) <= expExp.eval()(value, hue, saturation)
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

    console.log((s(colorQueryGrammar.match("pixels| saturation = 1 if saturation > 0.5 | saturation = 0 if saturation <= 0.5 | value = 1 if value > 0.5 | value =0 if value <= 0.5 ")).eval())(0.8,100,0.7) );



export default function getCompiledFunction(text:string) {
    var colorQueryTree = colorQueryGrammar.match(text);
    if (colorQueryTree.succeeded()) {
        return (s(colorQueryTree).eval());
    } else {
        console.log("ERROR");
    }
}