import Header from "./Header"
import Main from "./Main"
import Loader from "./Loader"
import Error from "./Error"
import {useEffect, useReducer} from "react";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION=30;

function reducer(state,action){
    switch(action.type){
      case 'dataReceived':
        return {...state,questions:action.payload.questions,status:"ready"};
      case 'dataFailed':
        return{...state,status:"error"}
      case 'start':
        return {...state,status:'active',secondsRemaining:state.questions.length*SECS_PER_QUESTION}
      case 'newAnswer':
        const question = state.questions.at(state.index)
        return {...state,
          answer:action.payload,
          points:action.payload=== question.correctOption?state.points+question.points:state.points
        }
      case 'nextQuestion':
        return {...state,answer:null,index:state.index+1}
      case 'finish':
        return {...state,status:'finished',highscore:state.points>state.highscore?state.points:state.highscore};
      case 'restart':
        return {...state,status:"ready",index:0,answer:null,points:0,highscore:0,secondsRemaining:10}
      case 'tick':
        return {...state,secondsRemaining:state.secondsRemaining-1,
        status:state.secondsRemaining===0?'finished':state.status};
      default:
        throw new Error("Action unknown")
    }
}

const initialState={
  questions:[],
  //loading error ready active finished
  status:"loading",
  index:0,
  answer:null,
  points:0,
  highscore:0,
  secondsRemaining:null,
}

export default function App()
{
  const[{questions,status,index,answer,points,highscore,secondsRemaining},dispatch]=useReducer(reducer,initialState);
  
  const numOfQuestions=questions.length;
  const maxPossiblePoints=questions.reduce( (prev,curr) => prev+curr.points ,0)

  useEffect(function(){
    fetch("https://suraj-fusion.github.io/React_Quiz_Questions/questions.json")
    .then(res=>res.json())
    .then(data=>dispatch({type:"dataReceived",payload:data}))
    .catch((err)=>dispatch({type:"dataFailed"}))
  },[])




  return(<div className="app">
  
   <Header/>
   
   <Main>
     {status==='loading' && <Loader/>}
     {status==="error" && <Error/>}
     {status==='ready' && <StartScreen numOfQuestions={numOfQuestions} dispatch={dispatch}/>}
     {status==="active" && <>
     <Progress index={index} numQuestions={numOfQuestions} points={points} maxPossiblePoints={maxPossiblePoints} answer={answer}/>
     <Question question={questions[index]} dispatch={dispatch} answer={answer}/>
     <Footer>
       <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
       <NextButton dispatch={dispatch} answer={answer} index={index} numOfQuestions={numOfQuestions}/>
    </Footer>
     
    </>
     }

     {status==="finished" && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore} dispatch={dispatch}/>}
    
   </Main>
   
  </div>)
}
