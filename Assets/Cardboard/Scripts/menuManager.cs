using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class menuManager : MonoBehaviour {
	void Start ()
	{
		GazedAt(false);
	}

	public void StartLevel()
	{
		SceneManager.LoadScene(1);
	}

	public void GazedAt(bool gazedAt)
	{
		GetComponent<Image>().color = gazedAt ? Color.green : Color.red;
	}
}
