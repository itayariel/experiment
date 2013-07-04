var see =null;
var numberOfSteps=1;
var levelStepsTimer=1;
var ID="0";
static var levelNumber=0;
static var successCounter=0;
var showMessage=false;
var timeUp=false;
var levelTimeOut=2000;


var wallSound: AudioSource;
var levelBeepSound: AudioSource;
var beepArray;
var other;

static private var levelsList =new Array("pre_level_squre","pre_level_bowl");
var stringToScene={};
stringToScene["Square"]="pre_level_squre";
stringToScene["Bowl Ball above"]="pre_level_bowl";
stringToScene["Triangle"]="";
stringToScene["Ball"]="";
private var optionsList =new Array("Square","Triangle","Bowl from above","Ball");
private var picked = false;
static var sequence=0;
static var levelName;
  

function Start () {
    showMessage=false;
   // Reset (Time.frameCount);
	if(levelNumber==0)
	{
		levelNumber=levelNumber+1;
		levelName = levelsList[0];
	}
    StartCoroutine(sendToDb("Start "+levelName));
	//audio files..
	beepArray = GetComponents(AudioSource);
	wallSound = beepArray[6];
    levelBeepSound=beepArray[7];
    levelBeepSound.Play();
    print("ehat");
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
   
	numberOfSteps=numberOfSteps+1;
    levelStepsTimer=levelStepsTimer+1;
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
		    if(distance<0.5)
		    {
		    	playThisSilentTheRest(0);
		    }
		    else if(distance<1)
		    {
		    	playThisSilentTheRest(1);
		    }
		    else if(distance<1.5)
		    {
		    	playThisSilentTheRest(2);
		    }
		    else if(distance<2)
		    {
		    	playThisSilentTheRest(3);
		    }
		    else if(distance<2.5)
		    {
		    	playThisSilentTheRest(4);
		    }
		    else if(distance<3.5)
		    {
		    	playThisSilentTheRest(5);
		    }
		    else
		    {
		    	playThisSilentTheRest(7);
		    }
	    } 
	    else
	    {
	    	playThisSilentTheRest(7);
	    }    
    }
    if(numberOfSteps==5)
	{
     	StartCoroutine(sendToDb("mouse"));
        numberOfSteps=1;
	}
    if(levelStepsTimer==levelTimeOut)
    {
        timeUp=true;
        showMessage=false;
        WaitAndMove();
    }
}

var messageGuiStyle : GUIStyle;
messageGuiStyle.fontSize = 20;
messageGuiStyle.fontStyle = FontStyle.Bold;
messageGuiStyle.normal.textColor = Color.white;
//show Buttons
function OnGUI () {
    
    
	GUI.color = Color.white;
	var printableLevleNumber=levelNumber;
	GUI.Label (Rect(10, 15, 120, 35), "Level " +  printableLevleNumber+"/"+levelsList.length);
	GUI.Label (Rect(10, 45, 120, 35), "What do you see? ");
    //message
    if(showMessage){
        userMessage ="Very good! you succeded " + successCounter + " out of " +levelNumber + " levels";
        GUI.Label (Rect (Screen.width/2-100, Screen.height/2-25, 100, 50), userMessage,messageGuiStyle);
    }
    if(timeUp){
        userMessage ="Times up try next level...";
        GUI.Label (Rect (Screen.width/2-100, Screen.height/2-25, 100, 50), userMessage,messageGuiStyle);
    }
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
	var moveOnBtnMessage = "Next Level!";
	if(levelNumber==2)
	{
		moveOnBtnMessage="Finish!";
	}

	if (GUI.Button (Rect (300,15,200,35), moveOnBtnMessage	)) {
		//send answer to server
		playThisSilentTheRest(7);
		if(timeUp)
        {
            //dont try passing level
        }
        else if((see!="Square" && levelName=="pre_level_squre") || (see!="Bowl from above" && levelName=="pre_level_bowl"))
		{
			see="... try again";
			picked=true;
		}
		else if(see!=null && see!="nothing..")
		{
            successCounter+=1;
            showMessage=true;
            WaitAndMove();
		}
		else
		{
			see="nothing..";
			picked=true;
		}
	}
	
	if (GUI.Button (Rect (500,15,200,35), "Full Screen")) {
		Screen.fullScreen = !Screen.fullScreen;
	}
}

//This makes sure data is sent before pass level
function WaitAndMove()
{
    if(timeUp)
    {
        see="Time Up";
    }
    StartCoroutine(sendToDb("ANSWER: "+see));
    yield WaitForSeconds(3);
	if(levelNumber<levelsList.length)
	{
        showMessage=false;
		levelNumber=levelNumber+1;
		levelName = levelsList[levelNumber-1];
        Application.LoadLevel(levelName);     
	}
	else
	{
		// send to browser to close window
	    Application.ExternalCall( "endLevel");
		Application.Quit();
	}
}

//send data to db
function sendToDb(msg)
{
	var form = new WWWForm();
	form.AddField("action",msg);
	form.AddField("x",Input.mousePosition.x);
	form.AddField("y",Input.mousePosition.y);
	form.AddField("z",Input.mousePosition.z);
	form.AddField("frame",levelStepsTimer);
	form.AddField("level",levelNumber+":"+levelName);
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

// Stops all other sounds when one is played (or all of them)
function playThisSilentTheRest(soundNumber)
{
  
	var j;
	for(j=0;j<7;j++)
	{
		if(j!=soundNumber)
		{
			beepArray[j].Stop();
		}
		else if(soundNumber!=null && j==soundNumber && !beepArray[j].isPlaying)
		{
			beepArray[j].Play();
		}
	}
}