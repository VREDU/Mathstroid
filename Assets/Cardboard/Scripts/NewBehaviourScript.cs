using UnityEngine;
using System.Collections;

public class NewBehaviourScript : MonoBehaviour {
	public scoreManager scoreManager;

	Animator anim;

	// Use this for initialization
	void Awake () {
		anim = GetComponent<Animator>();
	
	}
	
	// Update is called once per frame
	void Update () {
		if (scoreManager.score > 10) {
			anim.SetTrigger ("GameOver");
		}
	
	}
}
