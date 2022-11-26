import { useEffect, useRef } from 'react'

const PrevState = () => {
    const ref = useRef();
    const prevTerm = ref.current ;

    useEffect(() => {
        ref.current = currentState;
    },[currentState])
  return prevTerm ;
}

export default PrevState