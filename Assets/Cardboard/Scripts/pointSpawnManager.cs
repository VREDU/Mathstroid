using UnityEngine;
using System.Collections;

public class pointSpawnManager : MonoBehaviour {
	public GameObject[] points;             
	public float spawnTime = 5f;           
	public Transform[] spawnPoints;      

	// Use this for initialization
	void Start () {
		InvokeRepeating ("Spawn", spawnTime, spawnTime);
	}
	
	// Update is called once per frame
	void Spawn () {
		int spawnPointIndex = Random.Range (0, spawnPoints.Length);
		int pointsIndex = Random.Range (0, points.Length);

		Instantiate (points[pointsIndex], spawnPoints[spawnPointIndex].position, spawnPoints[spawnPointIndex].rotation);
	}
}
