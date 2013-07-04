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
var beepArray;
var other;

static private var levelsList1 =new Array("2d_round","2d_squre","2d_triangle","2d_ring","2d_triangle","2d_ring","2d_squre","2d_round");
static private var levelsList2 =new Array("2d_triangle","2d_ring","2d_round","2d_squre","2d_round","2d_triangle","2d_ring","2d_squre");
static private var levelsList3 =new Array("2d_ring","2d_squre","2d_triangle","2d_round","2d_squre","2d_round","2d_ring","2d_triangle");

var stringToScene={};
stringToScene["Square"]="2d_squre";
stringToScene["Circle"]="2d_round";
stringToScene["Triangle"]="2d_triangle";
stringToScene["Ring"]="2d_ring";

static private var levelsList =new Array(levelsList1,levelsList2,levelsList3);
private var optionsList =new Array("Square","Triangle","Circle","Ring");
private var picked = false;
static var sequence=0;
static var levelName;
  

function Start () {
    showMessage=false;
	if(levelNumber==0)
	{
		sequence = Random.Range(0,levelsList.length-1);
		levelNumber=levelNumber+1;
		levelName = levelsList[sequence][0];
		Application.LoadLevel(levelsList[sequence][levelNumber-1]);
	}
    else{
        StartCoroutine(sendToDb("Start "+levelName));
    }
	//audio files..
	beepArray = GetComponents(AudioSource);
	wallSound = beepArray[6];
	    
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
	GUI.Label (Rect(10, 15, 120, 35), "Level " + printableLevleNumber+"/"+levelsList[sequence].length);
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
	if(levelNumber==levelsList[sequence].length)
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
		else if(see!=null && see!="nothing..")
		{
            if(stringToScene[see]==levelName)
            {
                successCounter+=1;
            }
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
	if(levelNumber<levelsList[sequence].length)
    {
		levelNumber=levelNumber+1;
		levelName = levelsList[sequence][levelNumber-1];
		Application.LoadLevel(levelsList[sequence][levelNumber-1]);
	}
	else
	{
		// send to browser to close window
	    Application.ExternalCall("endLevel");
		Application.Quit();
	}
}

//Sends to server the cursor position
function sendToDb(msg)
{
	var form = new WWWForm();
    print(msg);
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
	for(j=0;j<6;j++)
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