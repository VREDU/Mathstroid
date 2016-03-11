using UnityEngine;
using System.Collections;

public class astroidFieldMover : MonoBehaviour {

	public int speed;
	// Use this for initialization
	void Start () {

	}

	// Update is called once per frame
	void Update () {
		transform.Translate(Vector3.back * Time.deltaTime * speed);
	}
}
