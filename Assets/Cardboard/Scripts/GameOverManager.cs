using UnityEngine;
using System.Collections;

public class GameOverManager : MonoBehaviour {

	public scoreManager scoreManager;
	public static bool gameOver;
	public GameObject playAgain;
	Animator anim;

	void Start()
	{
		anim = GetComponent<Animator>();
		gameOver = false;
	}
	void Update () {
		if (scoreManager.score == 10)
		{
			anim.SetTrigger("Winner");
			playAgain.SetActive (true);
			gameOver = true;
		}

		if (scoreManager.score > 10)
		{
			anim.SetTrigger("Loser");
			playAgain.SetActive (true);
			gameOver = true;
		}
	}
}
