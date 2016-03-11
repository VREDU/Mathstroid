// #pragma downcast
@CustomEditor (AsteroidFieldCreator)
class AFCEditor extends Editor {
    var version : String="v1.00";

    // use these to change minimum or maximum for asteroid random sizes    
    var largestRoid : float=100.0;
    var maxDiscRadius : float=100.0;

///////////////////////////////////////////////////////////////////////////// ENUMS
    var fieldShapes : fisha;
        enum fisha {inRect,inDisc,inSphere,onSphere}

    var objMode : objMod;
        enum objMod {singleObject, multiObject, fromResources}

    // var method : met;
    //     enum met {completeRandom,moreSmallOnes, moreBigOnes, moreMediumOnes}

    var fieldColor : fico;
        enum fico {red,green,blue,yellow,white,gray,black}

    var reNumber : rnbr;
        enum rnbr {prefix,sufix,none}
///////////////////////////////////////////////////////////////////////////// ENUMS    

    var hideArray           : boolean=false;
    var showObjectOptions   : boolean=true;
    var showFieldOptions    : boolean=true;
    var showSizeOptions     : boolean=true;
    var showCreationOptions : boolean=true;
    var showOverrides       : boolean=false;
    var editInScene         : boolean=false;

    // var rectPoints : 
    var GizmoDraws : Function=RectGizmoDraw;

    var minRand : float=1.0;
    var maxRand : float=100.0;

    var inward  : float;
    var outward : float;

    var handleSize : int=10;

    function OnInspectorGUI () {
//  ---------------------------------------------------------------------------------------------------------------- GUI LAYOUT HACK        
        EditorGUILayout.BeginHorizontal();
        GUILayout.FlexibleSpace();
        EditorGUILayout.EndHorizontal();
        var scale : Rect = GUILayoutUtility.GetLastRect();

        EditorGUIUtility.LookLikeInspector();
        EditorGUIUtility.LookLikeControls(scale.width/2);
//  ---------------------------------------------------------------------------------------------------------------- GUI LAYOUT HACK

        GUI.Box(Rect (0,scale.y+5,scale.width,33), "***   Asteroid Field Creator Editor "+version+"  ***\n~DarMar~");
        GUILayout.Label("\n\n");
//  ---------------------------------------------------------------------------------------------------------------- OBJECT OPTIONS
        
        showObjectOptions = EditorGUILayout.Foldout(showObjectOptions, " Object Instance Options");
        if (showObjectOptions) {
            target.objMode = EditorGUILayout.EnumPopup("Object Mode:", target.objMode);
            objMode=target.objMode;

                switch (objMode) {
                    case objMod.singleObject:
                        target.roid = EditorGUILayout.ObjectField("Asteroid Prefab: ", target.roid, GameObject, true);
                    break;
                    case objMod.multiObject:
                        target.roidsCount = EditorGUILayout.IntField("Count:", target.roidsCount);
                        if(GUILayout.Button("Set Array")) target.SetCustomMultiArray ();

                        target.roidsCount=Mathf.Clamp (target.roidsCount,0,100);
                    
                        if (target.roids.Length!=0) {
                            for (var i:int=0; i<target.roids.Length; i++) {
                                target.roids[i] = EditorGUILayout.ObjectField("Asteroid Prefab ["+i+"]", target.roids[i], GameObject, true);        
                            }

                            if(GUILayout.Button("Clear Array")) target.ClearKeeperArrays ();
                        }
                    break;
                    case objMod.fromResources:
                        target.resourceAdress = EditorGUILayout.TextField("Resource Folder: ", target.resourceAdress);
                        
                        if(GUILayout.Button("Load From Resources")) target.SetResourceMultiArray ();
                        
                        hideArray= EditorGUILayout.Toggle("Hide Array List", hideArray);

                        if (!hideArray) {
                            if (target.roids.Length!=0) {
                                for (var a:int=0; a<target.roids.Length; a++) {
                                    target.roids[a] = EditorGUILayout.ObjectField("Asteroid Prefab ["+a+"]", target.roids[a], GameObject, true);        
                                }
                                if(GUILayout.Button("Clear Array")) target.ClearKeeperArrays ();
                            }
                        }
                    break;
                }
        }    
//  ---------------------------------------------------------------------------------------------------------------- OBJECT OPTIONS
        GUILayout.Box(" ");
//  ---------------------------------------------------------------------------------------------------------------- FIELD CONTAINER OPTIONS
        showFieldOptions = EditorGUILayout.Foldout(showFieldOptions, " Field Container Options");
        if (showFieldOptions) {
            target.fieldShapes = EditorGUILayout.EnumPopup("Field Shape:", target.fieldShapes);
            fieldShapes=target.fieldShapes;

            target.roidCount = EditorGUILayout.FloatField("Asteroid Count:", target.roidCount);
        }    
            switch (fieldShapes) {
                case fisha.inRect:
                    SquareSpawnOptions ();
                    GizmoDraws=RectGizmoDraw;
                break;
                case fisha.inDisc:
                    DiscSpawnOptions ();
                    GizmoDraws=DiscGizmoDraw;
                break;
                case fisha.inSphere:
                    GizmoDraws=SphereGizmoDraw;
                    target.outerDisc = EditorGUILayout.FloatField("Sphere Radius", target.outerDisc); 
                break;
                case fisha.onSphere:
                    GizmoDraws=SphereGizmoDraw;
                    target.outerDisc = EditorGUILayout.FloatField("Sphere Radius", target.outerDisc); 
                break;
            }
//  ---------------------------------------------------------------------------------------------------------------- FIELD CONTAINER OPTIONS        
        GUILayout.Box(" ");
//  ---------------------------------------------------------------------------------------------------------------- ASTEROID SIZE OPTIONS
        showSizeOptions = EditorGUILayout.Foldout(showSizeOptions, " Asteroids Size Options");
        if (showSizeOptions) {        
            target.useRandomSize = EditorGUILayout.Toggle("Random Asteroid Sizes", target.useRandomSize);

            if (target.useRandomSize) {
                // GUILayout.Label("Asteroid Random Size:");
                    target.randMinMax.x = EditorGUILayout.FloatField("Minimum Size:", target.randMinMax.x);
                    target.randMinMax.y = EditorGUILayout.FloatField("Maximum Size:", target.randMinMax.y);
                        minRand=target.randMinMax.x; 
                        maxRand=target.randMinMax.y;      
                    EditorGUILayout.MinMaxSlider(minRand, maxRand, 0.1, largestRoid);
                        target.randMinMax.x=minRand;      
                        target.randMinMax.y=maxRand;

                if(GUILayout.Button("Make Radius From Largest Roid"))
                    target.roidRadius=target.randMinMax.y*.1;
            }else{
                target.randMinMax.x = EditorGUILayout.FloatField("Asteroid Size", target.randMinMax.x);

                if(GUILayout.Button("Make Radius From Roid Size"))
                    target.roidRadius=target.randMinMax.x*.1;
            } 
        }  
//  ---------------------------------------------------------------------------------------------------------------- ASTEROID SIZE OPTIONS
        GUILayout.Box(" ");
//  ---------------------------------------------------------------------------------------------------------------- CREATION RULES OPTIONS
        showCreationOptions = EditorGUILayout.Foldout(showCreationOptions, " Creation Rules");
        if (showCreationOptions) { 
            target.roidRadius = EditorGUILayout.FloatField("Spawn Limit Radius (spacing)", target.roidRadius);

            target.prewLimitSize = EditorGUILayout.Toggle("Preview Spacing Radius", target.prewLimitSize);
            target.randRotRoids  = EditorGUILayout.Toggle("Random Rotate Roids", target.randRotRoids);
            target.keepObjArray  = EditorGUILayout.Toggle("Keep Objects in Array", target.keepObjArray);
            target.keepPosArray  = EditorGUILayout.Toggle("Keep Positions in Array", target.keepPosArray);
            
            target.customNaming = EditorGUILayout.Toggle("Custom Naming", target.customNaming);
            if (target.customNaming) {
                target.customName = EditorGUILayout.TextField("Name of Spawned Object: ", target.customName);
                reNumber = EditorGUILayout.EnumPopup("renumbering method", reNumber);
                target.reNumber=reNumber;
            }
        }
//  ---------------------------------------------------------------------------------------------------------------- CREATION RULES OPTIONS        
        GUILayout.Box(" ");
//  ---------------------------------------------------------------------------------------------------------------- OVERRIDE OPTIONS 
        showOverrides = EditorGUILayout.Foldout(showOverrides, " Overrides");
        if (showOverrides) { 
            target.newRandom = EditorGUILayout.Toggle("New Random on Game Start", target.newRandom);
            target.useDebug  = EditorGUILayout.Toggle("Debug in Console?", target.useDebug);
        
            target.fieldColor = EditorGUILayout.EnumPopup("Field Grid Color:", target.fieldColor);
            fieldColor=target.fieldColor;
            switch (fieldColor) {
                case fico.red:    target.fiCo=Color.red;    break;
                case fico.green:  target.fiCo=Color.green;  break;
                case fico.blue:   target.fiCo=Color.blue;   break;
                case fico.yellow: target.fiCo=Color.yellow; break;
                case fico.white:  target.fiCo=Color.white;  break;
                case fico.gray:   target.fiCo=Color.gray;   break;
                case fico.black:  target.fiCo=Color.black;  break;    
            }

            largestRoid = EditorGUILayout.FloatField("Max Random Roid Size", largestRoid); 
            maxDiscRadius = EditorGUILayout.FloatField("Max Disc/Sphere Radius", maxDiscRadius); 
        }
 
        
//  ---------------------------------------------------------------------------------------------------------------- OVERRIDE OPTIONS 
        GUILayout.Box(" ");
//  ---------------------------------------------------------------------------------------------------------------- FINALIZE BUTTONS        
        GUI.color=Color.green;
        if(GUILayout.Button("Create Asteroid Field"))
            target.StartSpawning ();

        GUI.color=Color.red;
        if(GUILayout.Button("Clear Asteroids From Field"))
            target.ClearField ();

        GUI.color=Color.white;
        
        if(GUILayout.Button("Zero Field Position"))
            target.ZeroPos ();

        if(GUILayout.Button("Zero Field Rotation"))
            target.ZeroRot ();
//  ---------------------------------------------------------------------------------------------------------------- FINALIZE BUTTONS

        if (GUI.changed)
            EditorUtility.SetDirty (target);
    }


    function SquareSpawnOptions () {
        target.transform.position = EditorGUILayout.Vector3Field ("Field Position:", target.transform.position);
        target.transform.eulerAngles = EditorGUILayout.Vector3Field ("Field Rotation:", target.transform.eulerAngles);
        target.boundsSize = EditorGUILayout.Vector3Field ("Field Scale:", target.boundsSize);

        target.boundsSize.x=Mathf.Clamp (target.boundsSize.x, 0, 1000);
        target.boundsSize.y=Mathf.Clamp (target.boundsSize.y, 0, 1000);
        target.boundsSize.z=Mathf.Clamp (target.boundsSize.z, 0, 1000);
    }


    function DiscSpawnOptions () {
        target.transform.position = EditorGUILayout.Vector3Field ("Field Position:", target.transform.position);
        target.transform.eulerAngles = EditorGUILayout.Vector3Field ("Field Rotation:", target.transform.eulerAngles);
        target.innerDisc = EditorGUILayout.FloatField("Inner Radius", target.innerDisc);
        target.outerDisc = EditorGUILayout.FloatField("Outer Radius", target.outerDisc);    
            inward=target.innerDisc;
            outward=target.outerDisc;
        EditorGUILayout.MinMaxSlider(inward, outward, 0.1, maxDiscRadius);
            target.innerDisc=inward;
            target.outerDisc=outward;

            target.innerDisc=Mathf.Clamp (target.innerDisc, 0.1, target.outerDisc-1);
            target.outerDisc=Mathf.Clamp (target.outerDisc, target.innerDisc+1, maxDiscRadius);

        target.discHeight = EditorGUILayout.FloatField("Height", target.discHeight);     
    }


    function OnSceneGUI () {
	  	Handles.BeginGUI();

            GUI.BeginGroup (Rect(10, 10, 200, 110), "", "Box");
                if(GUI.Button( Rect(5, 5, 190, 20),"Edit in Scene View"))
				    editInScene=!editInScene;

                handleSize = EditorGUI.IntSlider(Rect(5,35,190, 20), handleSize, 1, 100);
                
                GUI.color=Color.green;
                if(GUI.Button( Rect(5, 60, 190, 20),"Create Asteroid Field"))
                    target.StartSpawning ();

                GUI.color=Color.red;
                if(GUI.Button( Rect(5, 85, 190, 20),"Clear Asteroids From Field"))
                    target.ClearField ();

                GUI.color=Color.white;
            GUI.EndGroup ();
        Handles.EndGUI();

        var rotationMatrix : Matrix4x4 = Matrix4x4.TRS(target.transform.position*.00001, target.transform.rotation, target.transform.lossyScale);
        Handles.matrix = rotationMatrix;

        GizmoDraws ();

        if (GUI.changed)
            EditorUtility.SetDirty (target);
    }

    var rectPoint : Vector3[]= new Vector3[8];
    function RectGizmoDraw () {
        var tp : Vector3=target.transform.position;
        rectPoint[0]= Vector3 (tp.x-target.boundsSize.x, tp.y+target.boundsSize.y, tp.z+target.boundsSize.z );
        rectPoint[1]= Vector3 (tp.x+target.boundsSize.x, tp.y+target.boundsSize.y, tp.z+target.boundsSize.z );
        rectPoint[2]= Vector3 (tp.x-target.boundsSize.x, tp.y-target.boundsSize.y, tp.z+target.boundsSize.z );
        rectPoint[3]= Vector3 (tp.x+target.boundsSize.x, tp.y-target.boundsSize.y, tp.z+target.boundsSize.z );

        rectPoint[4]= Vector3 (tp.x-target.boundsSize.x, tp.y+target.boundsSize.y, tp.z-target.boundsSize.z );
        rectPoint[5]= Vector3 (tp.x+target.boundsSize.x, tp.y+target.boundsSize.y, tp.z-target.boundsSize.z );
        rectPoint[6]= Vector3 (tp.x-target.boundsSize.x, tp.y-target.boundsSize.y, tp.z-target.boundsSize.z );
        rectPoint[7]= Vector3 (tp.x+target.boundsSize.x, tp.y-target.boundsSize.y, tp.z-target.boundsSize.z );

        

        Handles.color = target.fiCo;
        Handles.DrawLine(rectPoint[0], rectPoint[1]); 
        Handles.DrawLine(rectPoint[4], rectPoint[5]); 
        Handles.DrawLine(rectPoint[0], rectPoint[4]); 
        Handles.DrawLine(rectPoint[1], rectPoint[5]);

        Handles.DrawLine(rectPoint[2], rectPoint[3]);
        Handles.DrawLine(rectPoint[6], rectPoint[7]);
        Handles.DrawLine(rectPoint[2], rectPoint[6]); 
        Handles.DrawLine(rectPoint[3], rectPoint[7]);  

        if (editInScene) {
            RectHandles ();
        }
    }


    function RectHandles () {
        
            var repos_x : Vector3=target.transform.position;
                repos_x.x = target.transform.position.x + target.boundsSize.x;

            var repos_y : Vector3=target.transform.position;
                repos_y.y = target.transform.position.y + target.boundsSize.y;
            
            var repos_z : Vector3=target.transform.position;
                repos_z.z = target.transform.position.z + target.boundsSize.z;        

            Handles.color = Color.red;
            target.boundsSize.x = Handles.ScaleSlider(target.boundsSize.x, 
                        repos_x, 
                        Vector3.right, 
                        Quaternion.identity, 
                        handleSize, 
                        HandleUtility.GetHandleSize(target.transform.position));

            Handles.color = Color.green;
            target.boundsSize.y = Handles.ScaleSlider(target.boundsSize.y, 
                        repos_y, 
                        Vector3.up, 
                        Quaternion.identity, 
                        handleSize, 
                        HandleUtility.GetHandleSize(target.transform.position));

            Handles.color = Color.blue;
            target.boundsSize.z = Handles.ScaleSlider(target.boundsSize.z, 
                        repos_z, 
                        Vector3.forward, 
                        Quaternion.identity, 
                        handleSize, 
                        HandleUtility.GetHandleSize(target.transform.position));
    }


    function SphereGizmoDraw () {
        Handles.color = target.fiCo;
        target.outerDisc = Handles.RadiusHandle (Quaternion.identity, 
                            target.transform.position, 
                            target.outerDisc);
    }


    function DiscGizmoDraw () {

        var tg_up : Vector3=Vector3 (target.transform.position.x, target.transform.position.y+target.discHeight, target.transform.position.z);
        var tg_do : Vector3=Vector3 (target.transform.position.x, target.transform.position.y-target.discHeight, target.transform.position.z);

        Handles.color = target.fiCo;
        Handles.DrawWireDisc(tg_up, Vector3.up, target.innerDisc);
        Handles.DrawWireDisc(tg_up, Vector3.up, target.outerDisc);

        Handles.DrawWireDisc(tg_do, Vector3.up, target.innerDisc);
        Handles.DrawWireDisc(tg_do, Vector3.up, target.outerDisc);

        if (editInScene) {
            Handles.color = Color.red;
            target.innerDisc = Handles.RadiusHandle (Quaternion.identity, 
                                target.transform.position, 
                                target.innerDisc);

            target.outerDisc = Handles.RadiusHandle (Quaternion.identity, 
                                target.transform.position, 
                                target.outerDisc);

            Handles.color = Color.green;
            target.discHeight = Handles.ScaleSlider(target.discHeight, 
                        target.transform.position, 
                        Vector3.up, 
                        Quaternion.identity, 
                        handleSize, 
                        HandleUtility.GetHandleSize(target.transform.position));
        }
    }

}