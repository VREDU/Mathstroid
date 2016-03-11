using UnityEngine;
using System.Collections;

public class fieldSpawnManager : MonoBehaviour {

	public GameObject Astroid_Field;

	void OnTriggerEnter(Collider other){
		Astroid_Field.transform.position = new Vector3 (0, 0, 750);
	}
}
