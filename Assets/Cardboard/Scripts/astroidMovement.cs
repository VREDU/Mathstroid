using UnityEngine;
using System.Collections;

public class astroidMovement : MonoBehaviour {
	public float speed;
	public int value;

	void Start () {
		GazedAt(false);
	}

	void Update () {
		if (transform.position.z < -20) {
			Destroy (gameObject);
		}
		transform.Translate(Vector3.back * Time.deltaTime * speed);
		if (GameOverManager.gameOver == true) {
			Destroy (gameObject);
		}
	}

	public void GazedAt(bool gazedAt) {
		GetComponent<Renderer>().material.color = gazedAt ? Color.green : Color.red;
	}

	public void AstroidSelected() {
		scoreManager.score += value;
		Destroy (gameObject); 
	}
		
}
