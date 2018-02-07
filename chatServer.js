/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//------------------------- GLOBAL VARIABLES --------------------------------//
var met = false;
var responses = []



//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  // socket.emit('answer',"Hey, Hello I am \"IcebreakerBot\" a simple chat bot example."); //We start with the introduction;
  socket.emit('answer', "Hi there, let's start with a joke to break the ice! ")
  setTimeout(timedQuestion, 4000, socket,"What do you call someone that avoids awkward hellos?"); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;
  
/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  responses.push(input + "😎")
  answer= 'Great, nice to meet you "' + input + '"! 🤣 My name is IcebreakerBot, and I can help you write an introduction email to someone new!';// output response
  waitTime =7000;
  question = "What's the name of the person you want to reach out to?";			    	// load next question
  }

  else if (questionNum == 1) {
  responses.push(input)
  answer= 'Ooh, sounds like ' + input + ' is an important person.'// output response
  waitTime =3000;
  question = 'Have you met them before?';			    	// load next question
  }
  
  else if (questionNum == 2) {
    if(input.toLowerCase()==='yes'|| input===1){
      met = true;
      answer = "I'm jealous you had that opportunity!";
      waitTime = 2500;
      question = 'How did you meet?';
    }
    else{
      met = false;
      answer = "I mean, hey, you and I have never met in person!";
      waitTime =2500;
      question = 'How did you find out about them?';
    }
  // load next question
  }
  
  else if (questionNum == 3) {
  responses.push(input)
  answer= ''// output response
  waitTime =0;
  question = 'Ok, ' + responses[0] + ', maybe this is personal, but what about their background excites you the most?';			    	// load next question
  }    
  
  else if (questionNum == 4) {
  responses.push(input)
  answer= 'Wow, I feel like I want to meet ' + responses[1] + ' too!'// output response
  waitTime = 2500;
  question = "What are you working on currently that could be of interest to " + responses[1] + "?";			    	// load next question
  }    

  else if (questionNum == 5) {
  responses.push(input)
  answer= 'Time to pull out your calendar!'// output response
  waitTime = 2500;
  question = "What day of the week are you the most free to meet within the next few days?";			    	// load next question
  } 
  
  else if (questionNum == 6) {
  responses.push(input)
  answer= ''// output response
  waitTime = 0;
  question = "What time of the day do you prefer on " + input + "?";			    	// load next question
  } 
  
  else if (questionNum == 7) {
  responses.push(input)
  answer= "Ok " + responses[0] + ", maybe we dragged this joke along too far. "// output response
  waitTime = 3000;
  question = "What's your real name?";			    	// load next question
  }
  
  else if (questionNum == 8) {
  responses.push(input)
  answer= 'Perfect!'// output response
  waitTime = 1000;
  question = "I'll show you our email draft, but do you promise not to hurt me if you don't like it?";			    	// load next question
  } 
  
  else{
    answer= 'Hi ' + responses[1] + ", ";// output response
    if(met){
      answer += "We met " + responses[2];
    }
    else{
      answer += "I found out about you " + responses[2];
    }
    answer += ". I am currently working on " + responses[4]
    answer += ". This made me think of your background in " + responses[3]
    answer += ", which I found to be incredibly fascinating. I'd love to pick your brain a bit more"
    answer += ". Would you be available for a quick chat this " + responses[5] + " " + responses[6]
    answer += "? I appreciate your time! --" + responses[7]
    
    waitTime =0;
    question = '';
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  console.log(responses)
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
