function Progress({index,numQuestions,points,maxPossiblePoints,answer}) {
    return (
        <header className="progress">
            <progress max={numQuestions} value={ (index) + (answer===null?0:1) } />
            <p>Question <strong>{index+1}</strong>/{numQuestions}</p>

            <p><strong>{points}</strong> /{maxPossiblePoints}</p>   

            
        </header>
    )
}

export default Progress
