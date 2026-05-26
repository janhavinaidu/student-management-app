import {usestate} from "react"

function StateEffect(){
    const [count,setCount] = usestate(0)

    function handleClick(){
        setCount(count+1)
    }   
    return(
        <div className="s">
            <h4 className="Scenary">State Effect</h4>   
            <p>Count: {count}</p>
            <button onClick={handleClick}>Increment</button>
        </div>
    )
}

