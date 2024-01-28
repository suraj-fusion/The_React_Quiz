function NextButton({dispatch,answer,numOfQuestions,index}) {
    if(answer===null) return null;
   if(index < numOfQuestions-1) return (
        <div className="btn btn-ui"  onClick={()=>{
            dispatch({type:'nextQuestion'})
        }}>
            Next
        </div>
    )

    if(index===numOfQuestions-1) return (
        <div className="btn btn-ui"  onClick={()=>{
            dispatch({type:'finish'})
        }}>
            Finish
        </div>
    )
}

export default NextButton
