var see =null;
var numberOfSteps=1;
var ID="0";



var wallSound: AudioSource;
var beepArray;
var other;

private var optionsList =new Array("Square","Triangle","Round","Ring");
private var picked = false;
  

function Start () {
	//audio files..
	beepArray = GetComponents(AudioSource);
	wallSound = beepArray[6];
	silentTheRest(7);
	//Get user ID from address
	if (Application.isWebPlayer) {
	 	var split : String[] = Application.srcValue.Split("?"[0]);
	 	ID=split[1];
	}
	
}


/*
This function runs every milisecond, we check here if he points to an object
or to the wall
*/
function Update () {
	//print(transform.position);
	if(transform.position.x<-5)
	{
		print("you win");
	}
	numberOfSteps=numberOfSteps+1;
	//direct the stick to mouse position
 //	var target=Camera.main.ScreenPointToRay(Input.mousePosition).GetPoint(100.0);
  //  transform.LookAt(target); 
  //  print(Input.mousePosition+" "+Screen.width+" "+Screen.height);
    //check stick hit
    if((Input.mousePosition.x<10 || Input.mousePosition.x>Screen.width-10 ||
    	Input.mousePosition.y<10 || Input.mousePosition.y>Screen.height-10) && numberOfSteps==10)
   	{ // If mouse is at the end of screen
   		wallSound.Play();
    }
    else
    {
	    var hit : RaycastHit;
	   	if (Physics.Raycast (transform.position, Camera.main.ScreenPointToRay(Input.mousePosition).direction, hit)) {
	   		//Check if mouse point to something, and check distance
	      	distance = hit.distance;
	      	if(numberOfSteps==60)
	      	{
		      	if(distance<0.5)
		      	{
		      		beepArray[0].Play();
		      		silentTheRest(0);
		      	}
		      	else if(distance<1)
		      	{
		      		beepArray[1].Play();
		      		silentTheRest(1);
		      	}
		      	else if(distance<1.5)
		      	{
		      		beepArray[2].Play();
		      		silentTheRest(2);
		      	}
		      	else if(distance<2)
		      	{
		      		beepArray[3].Play();
		      		silentTheRest(3);
		      	}
		      	else if(distance<2.5)
		      	{
		      		beepArray[4].Play();
		      		silentTheRest(4);
		      	}
		      	else if(distance<3.5)
		      	{
		      		beepArray[5].Play();
		      		silentTheRest(5);
		      	}
		      	else
		      	{
		      		silentTheRest(7);
		      	}
	      	}
	    } 
	    else
	    {
	    	silentTheRest(7);
	    }    
    }
    if(numberOfSteps==60)
	{
	//	StartCoroutine(updateCursorPosition());
		numberOfSteps=1;
	}
	
}

//show Buttons
function OnGUI () {

	GUI.color = Color.white;
	GUI.Label (Rect(10, 15, 120, 35), "Level 1");
	GUI.Label (Rect(10, 45, 120, 35), "What do you see? ");
	
/*	if (Popup.List (Rect(10, 15, 120, 35), showList, listEntry, GUIContent("What do you see?"), list, listStyle)) {
		picked = true;
	}*/
	if (picked) {
		GUI.Label (Rect(150, 45, 250, 35), "You picked " + see);
	}
	//GUI.TextField (Rect (15, 17, 200, 31), see, 35);*/
	var verticalPosition=90;
	for(var option in optionsList)
	{
		if (GUI.Button (Rect(10, verticalPosition, 120, 35), option)){
			picked = true;	
			see=option;		
		}
		verticalPosition+=40;
	}
	
	GUI.color = Color.white;
	var moveOnBtnMessage = "Finish!";
	if (GUI.Button (Rect (300,15,200,35), moveOnBtnMessage	)) {
		//send answer to server
		silentTheRest(7);
	//	StartCoroutine(sendLastState()); 
		// send to browser to close window
		Application.ExternalCall( "endLevel");
	//	
	}
	
	if (GUI.Button (Rect (500,15,200,35), "Full Screen")) {
		Screen.fullScreen = !Screen.fullScreen;
	}
}

//Sends to server the cursor position
function updateCursorPosition()
{
	var form = new WWWForm();
	var act="mouse";
	form.AddField("action",act);
	form.AddField("x",Input.mousePosition.x);
	form.AddField("y",Input.mousePosition.y);
	form.AddField("z",Input.mousePosition.z);
	form.AddField("frame",Time.frameCount);
	form.AddField("level",1);
	form.AddField("id",ID);
	var url = "insertSteps.aspx";
	// Post a request to an URL
	var w = new WWW(url, form);
	yield w;
	if (w.error != null) {
	    print(w.error); //if there is an error, tell us
  	} else {
        w.Dispose(); //clear our form in game
   	}
}

//Sends to server the user answer
function sendLastState()
{
	var form = new WWWForm();
	form.AddField("action","first level chose: "+see);
	form.AddField("frame",Time.frameCount);
	form.AddField("level",1);
	form.AddField("id",ID);
	form.AddField("x",0);
	form.AddField("y",0);
	form.AddField("z",0);
	var url = "insertSteps.aspx";
	// Post a request to an URL
	var w = new WWW(url, form);
	yield w;
	if (w.error != null) {
	    print(w.error); //if there is an error, tell us
  	} else {
    	print("Test ok");
        w.Dispose(); //clear our form in game
   	}
   	
}

// Stops all other sounds when one is played (or all of them)
function silentTheRest(other)
{
	var j;
	for(j=0;j<6;j++)
	{
		if(j!=other)
		{
			beepArray[j].Stop();
		}
	}
}