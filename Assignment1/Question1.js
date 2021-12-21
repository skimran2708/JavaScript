function print(value)
{
    return value+" World";
}

function display(str, func)
{
    console.log((func(str)));
} 

display("Hello",print);