using UnityEngine;
using System.Collections;

public class roidManager : MonoBehaviour {
	public GameObject Astroid_Field;
	
	void OnTriggerEnter(Collider other){
		Astroid_Field.transform.position = new Vector3 (0, 0, 520);
	}
}