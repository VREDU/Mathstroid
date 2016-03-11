

var rot_direct : float = 0.0;

var rotAngl : float;


function Awake () {
	

}




function Update () {
	
	rotAngl = Time.deltaTime * rot_direct;
	
	transform.Rotate ( rotAngl, rotAngl, rotAngl );
}
