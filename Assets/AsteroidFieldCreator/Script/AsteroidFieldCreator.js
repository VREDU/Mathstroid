// AFC version 1.01

// some minor bugs corrected
// creation mode by order is changed





@script ExecuteInEditMode()


// creation modus enum
var objMode : objMod;
    enum objMod {singleObject, multiObject, fromResources}


var fieldShapes : fisha;
        enum fisha {inRect,inDisc,inSphere,onSphere}


// this is used only if we use single GameObject for asteroid field
var roid : GameObject;					// holds single roid object for instantiation

// this is used for multi GameObject asteroids
var roids : GameObject[];				// holds multi roid objects that are used for instantiation
var roidsCount : int=1;					// how many of roid objects we need to instantiate

// resource folder adress where we keep our asteroid prefabs
var resourceAdress : String="";

var roidCount : int=0;					// how many asteroids we want in field?


var boundsSize : Vector3=Vector3.zero;	// size bounds of asteroid field


var roidPostions : Vector3[];			// Array of vector3's where we can keep positions of asteroids, if we dont want to spawn them immediately

var roidOb : GameObject [];				// Array of spawned asteroids which holds eference to actual spawned game objects


var roidRadius : float=0.15;			// this radius is limit arround which we make shure another roid isn't spawned
var prewLimitSize : boolean=false;		// do we preview roid radius limit?


var useRandomSize : boolean=true;		// do we use random roid size for spawning?
var randMinMax : Vector2=Vector2.zero;	// min max random roid size, if we don't use random, x value of vector2 will be used!

var randRotRoids : boolean=true;		// do we rotate roids when spawning them?

var tries : int;						// just keeps info in how much tries we spawn whole field, good for debugging

var inRoids : int=0;					// how many roids is spawned after spawner is finished .. debug part

var newRandom : boolean=false;			// do we instantiate new random field after every new start of game?
var useDebug : boolean=false;			// use debug?

var keepObjArray : boolean=false;		// do we keep objects in array?
var keepPosArray : boolean=false;		// do we keep positions in array?
var doOnlyPositions : boolean=false;	// should we make only positions instead of spawning actual objects?

var fiCo : Color=Color.red;				// just keeps color value of our gizmo in scene view

var obPossibility : int=0;

var customNaming : boolean;
var customName : String="Roid";

// gizmo coloring enum part
var fieldColor : fico;
        enum fico {red,green,blue,yellow,white,gray,black}

// re number rules enum
var reNumber : rnbr;
	enum rnbr {prefix,sufix,none}


// disc radius options
var innerDisc : float=0.1;
var outerDisc : float=10.0;
var discHeight : float=0.0;



var captureRot : Quaternion;


function Start () {
	if (newRandom) { GoDoNew (); }
}

function GoDoNew () {
	// if we choose to do new asteroid for game start and have old ones, first destroy old ones so we can make new
	ClearField ();
	
	StartSpawning ();
}


// we call this function from inspector editor first, it does the rest 
function StartSpawning () {
	Dbg ("starting to spawn asteroids in field");

	// first create array that will hold our roid positions
	roidPostions=new Vector3 [roidCount];

	// than create array which will hold our game objects
	roidOb=new GameObject [roidCount];

	// to instantiate uder rotation we set, first we capture rotation, than zero it, 
	// after we instantiate all, we rotate back to captured rotation
	captureRot=transform.rotation;
	ZeroRot ();

	// just for any case we zero all needed variables we need to properly instantiate roids
	inRoids=0;
	obPossibility=0;
	tries=0;
/* actually we will call DoIt after wee spawn first asteroid
	// here we actually start calling instantiation, to get proper positions and go on with job
	for ( i = 0; i < roidCount; i ++ ) {
		// yield WaitForSeconds (.13);
		DoIt ();
	}
*/
	DoIt ();
}


// this is mid function, it mostly uses to make shure we dont spawn asteroids on same place
function DoIt () {
	// get random positions inside boundaries
	var roPos : Vector3;
	var is_here : boolean=false;
	var zeroVect : Vector3=Vector3 (0, 0, 0);

	switch (fieldShapes) {
		case fisha.inRect:
			roPos = GetRandomVector3 ();
		break;
		case fisha.inDisc:
			roPos = GetRandDiscVector3 ();
		break;
		case fisha.inSphere:
			roPos=Random.insideUnitSphere * outerDisc;
		break;
		case fisha.onSphere:
			roPos=Random.onUnitSphere * outerDisc;
		break;
	}
	
	// here we make shure that we follow along our object position
	roPos += transform.position;

	// check if something is already on that position
	is_here = Physics.CheckSphere ( roPos, roidRadius );   
	
	// if everything is clear spawn roid here, if not try again m8
	if ( !is_here ) {
		SpawnRoid ( roPos ); 
	} else {
		//Dbg ( "roid nr. " + ingame_roids + " overlaps, gonna try again!");
		TryAgain ();	
	}
}


// this is called from function above and returns again to above function only if 
// spawn place is already taken and we need to search new position again
function TryAgain () {
	DoIt ();
	tries ++;
}

// after few random generators from functions above and we found fee position to spawn asteroid we do spawning job here
function SpawnRoid ( here : Vector3 ) {
	var rot : Quaternion;
	var siz : float=roidRadius;
	// if we are using random rotation factor, get new rotation quaternion random
	if (randRotRoids) { rot=GetRandomQuaternion (); }else{ rot=Quaternion.identity; }
	// set random size from minMax if we use it
	if (useRandomSize) { siz = Random.Range ( randMinMax.x, randMinMax.y ); } else { siz=randMinMax.x; }
	
	var ob : GameObject;		// game object which is used as container for spawned prefab
	var ob_ins : GameObject;	// container which will hold one of multi prefabs used for spawning

	if (objMode==objMod.singleObject) { ob_ins=roid; }else{
		// ob_ins=roids [Random.Range (0, roids.Length)];	// this option will give random prefab to spawn
		ob_ins=roids [obPossibility];						// this option will make shure we spawn every prefab evenly
	}
		// spawn on position, rotate, scale and parent
		ob = Instantiate ( ob_ins, here, rot);				// spawn object
		ob.transform.localScale = Vector3 ( siz, siz, siz);	// set size of object
		ob.transform.parent = transform;					// parent object
	
	NameRoid (ob);

	// keep poitions in array if we use that function
	if (keepPosArray){roidPostions [inRoids]=here;}

	// keep spawned objects in array
	if (keepObjArray){roidOb [inRoids]=ob;}

	// how many roids are finally spawned ingame?
	inRoids += 1;
	
	// to evenly spawn every given prefab we use this
	obPossibility+=1;
	if (obPossibility == roids.Length) { obPossibility=0; }

	// if we spawned all asteroids, call ReportState and do finalising touch here or just report state
	if ( roidCount == inRoids ) { ReportState (); } else {
		DoIt ();
	}

	
}


//roid rename part
function NameRoid (ob:GameObject) {
	// deal with number formating
	var num : String;
	if ( inRoids < 10 ) { num = "00"; } else if ( inRoids < 100 ) { num="0"; } else {num="";}

	// set name of asteroid
	if (customNaming) {
		switch (reNumber) {
			case rnbr.prefix: ob.name=num+inRoids+customName; break;
			case rnbr.sufix:  ob.name=customName+num+inRoids; break;
			case rnbr.none:   ob.name=customName; break;
		}
	}else{ ob.name = "Roid_"+num + inRoids; }	// if no naming rules used use this preset to name spawned objects
}

// returns random vector3 for random position in rectangle
function GetRandomVector3 ()  {
	var res = Vector3 ( Random.Range ( -boundsSize.x, boundsSize.x ), 
						Random.Range ( -boundsSize.y, boundsSize.y ), 
						Random.Range ( -boundsSize.z, boundsSize.z ));
	return res;
}

// returns disc or ring vector3 random position
function GetRandDiscVector3 () : Vector3 {
	var theta : float = Random.Range(0,2*Mathf.PI);
	var radius : float = Random.Range(innerDisc,outerDisc);
	var v2 : Vector2=Vector2(radius*Mathf.Cos(theta),radius*Mathf.Sin(theta));
	var y_h : float=0.0;
    
    if (discHeight>0) { y_h=Random.Range (-discHeight, discHeight); }
    
    return Vector3 (v2.x, y_h, v2.y);
}

// function that makes random euler 360 angles and turn it into quaternion and return 
function GetRandomQuaternion () {
	var range : float = 360;
	var rot : Quaternion = Quaternion.identity;
		rot.eulerAngles = Vector3 ( Random.Range ( - range, range ), 
									Random.Range ( - range, range ), 
									Random.Range ( - range, range ));
	return rot;
}

// clears spawned objects from field as well as arrays 
function ClearField () {

	// for (var child : Transform in transform ) {	// this part should do all the job, but it doesn't 
	// 	DestroyImmediate (child.gameObject);
	// }

	// thats why we do it in this all around way below
	var num : int=0;
	for (var child : Transform in transform ) { num+=1; }	// get number of child object
	
	roidOb=new GameObject[num];								// create new builtin array from number of child objects

	var nnum : int=0;
	for (var child : Transform in transform ) { 			// assign childs to builtin array
		roidOb[nnum]=child.gameObject;
		nnum+=1;
	}

	for (var i:int=0;i<roidOb.Length;i++) {					// then delete it by calling it from array
		DestroyImmediate (roidOb[i]); 
	}

	Dbg (num + " objects erased from field");

	ClearArrays ();
}

// clears only arrays, usually caled from funcion above
function ClearArrays () {
	roidPostions=new Vector3[0];
	roidOb=new GameObject[0];
	inRoids=0;	
}

// clears array of prefabs we want to instantiate if we use multi object or objects loaded from resources
function ClearKeeperArrays () {
	roids=new GameObject[0];	
}

// just sets size of multi object array if we want custom object dragged into it
function SetCustomMultiArray () {
	roids= new GameObject [roidsCount];
}

// loads objects from given resources folder into array
function SetResourceMultiArray () {
	var ro = new Array (GameObject);
		ro = Resources.LoadAll(resourceAdress+"", GameObject);
	roids=ro.ToBuiltin (GameObject);
}

// draws helper gizmos in scene view
function OnDrawGizmosSelected () {
	if (prewLimitSize) {
        Gizmos.color = Color.white;
        Gizmos.DrawWireSphere (transform.position, roidRadius);
    }
}

// this function is called after every asteroid is spawned in field
function ReportState () {
	if (!keepObjArray) { roidOb=null; }
	if (!keepPosArray) { roidPostions=null; }

	transform.rotation=captureRot;
	Dbg ( "Spawned " + roidCount + " roids in just " + tries + " tries!");	
}

// puts container on zero position in world space
function ZeroPos () {
	transform.position=Vector3.zero;
}

// zeroes container field rotations
function ZeroRot () {
	transform.rotation.eulerAngles=Vector3.zero;
}


// debugging function
function Dbg (msg:String) {
	if (useDebug) { Debug.Log (msg); }
}
