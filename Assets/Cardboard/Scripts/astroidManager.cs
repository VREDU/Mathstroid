using UnityEngine;

public class astroidManager : MonoBehaviour
{
	public GameObject astroid_field;
	public GameObject spawnPoint;


	void Start ()
	{
		//InvokeRepeating ("Spawn", spawnTime, spawnTime);
		Instantiate (astroid_field, spawnPoint.transform.position, spawnPoint.transform.rotation);
	}


	void Spawn ()
	{
		if (GameOverManager.gameOver == false) {
			Instantiate (astroid_field, spawnPoint.transform.position, spawnPoint.transform.rotation);
		}
	}

	void Update () {

		if ((spawnPoint.transform.position.z - astroid_field.transform.position.z) > 50) {
			DestroyImmediate (astroid_field,true);
		}
		if ((spawnPoint.transform.position.z - transform.position.z) > 60) {
			Spawn ();
		}
	}

}
