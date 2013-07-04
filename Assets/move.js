#pragma strict
var speed : float = 6.0;
var jumpSpeed : float = 8.0;
var gravity : float = 20.0;
var boomSound: AudioSource;
function Start () {
	var stickObject=GameObject.Find("Graphics");
	
	boomSound=stickObject.GetComponent(AudioSource);
	//print(boomSound[1]);
	boomSound.Play();
}

function Update () {
	
	var controller:CharacterController = GetComponent(CharacterController);
	if(Input.GetButtonDown("moveLeft"))
	{
		transform.Rotate(0,-15,0);
	}
	if(Input.GetButtonDown("moveRight"))
	{
		transform.Rotate(0,15,0);
	}
	if(Input.GetButtonDown("Fire1"))
	{

	}
	var moveDirection = transform.TransformDirection(Vector3.forward)*speed*Input.GetAxis("Vertical");
   	controller.Move(moveDirection * Time.deltaTime);

}

function OnCollisionEnter(collision : Collision){
    if(collision.gameObject.name=="Cube")
    {
    	if(!boomSound.isPlaying)
    	{
    		boomSound.Play();
    		print("should play");
    	}
    }
        // Play a sound if the coliding objects had a big impact.        
//	if (collision.relativeVelocity.magnitude > 2)
//          audio.Play();
}