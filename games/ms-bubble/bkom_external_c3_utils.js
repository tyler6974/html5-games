/*╔═.♥.════════════════════════════════════════════════════╗
 	COMPLEMENTARY EXTERNAL JAVASCRIPT FUNCTIONS
	FOR CONSTRUCT 3 LOCALISATION, ANALYTICS & STORAGE & UTILS
	
	BKOM STUDIOS
	2020-11-05
╚══════════════════════════════════════════════════════.♥.═╝*/


	/************************************************************************************************** 
		Manage console log display
	***************************************************************************************************/
	window.isDebug = false; // toggle this to turn on / off console logs

	if (window.isDebug){
		window.debug = console.log.bind(window.console);
	} else {
		window.debug = function(){};
	}

	//Valid that external js lib is loaded
	window.externalJS = true;
	window.locale = "en";
	window.levelArray = [];
	window.LevelsJSON = "";
	
	//The MSN GDK AD wrapper is not load by default 
	window.MSNADWrapper = false;

	/************************************************************************************************** 
		Get Language Local Parameter
	***************************************************************************************************/
	window.getLanguageLocal = function(language) {

		window.locale = getUrlParameters("locale","",false);

		//Get '?locale=' GET parameter if provided
		if(window.locale == undefined || window.locale == null){
			
			//Fallback to default "en" local if none provided
			if(language == undefined || language == null || language == ""){
				window.locale = "en";
			//Else fallback to browser locale
			} else {
				window.locale = language;
			}
			
		} else {
			window.locale = window.locale.toLowerCase();
		}
		
		//Force locale language
		//window.locale ="fr-fr";
		//window.locale ="fr-ca";
		//window.locale ="en-us";
		//window.locale ="de-de";
		//window.locale ="es-es";
		//window.locale ="es-mx";
		//window.locale ="it-it";

		window.validLanguageExistFallback();

		c2_callFunction("CallBackGetLanguageLocal", [window.locale]);
	};
	
	/************************************************************************************************** 
		Get MSN AD Wrapper parameter
	***************************************************************************************************/
	window.getMSNADWrapperParameter = function() {

		window.MSNADWrapperParameter = getUrlParameters("gdk","",false);
		//window.MSNADWrapperParameter = true; //DEBUG or Force Ad wrapper

		//Get '?gdk=' GET parameter if provided
		if(window.MSNADWrapperParameter == undefined || window.MSNADWrapperParameter == null || window.MSNADWrapperParameter == false){
			window.MSNADWrapper = false;
		} else {
			c2_callFunction("CallBackGetMSNADWrapperParameter", [true]);
		}
	};
	
	/************************************************************************************************** 
		Get Debug
	***************************************************************************************************/
	window.getDebug = function() {

		window.debugUI = false;
		window.debugURL = getUrlParameters("d","",false);
		
		if(window.debugURL != undefined || window.debugURL != null){
			
			if(Math.ceil(parseInt(window.debugURL / 984357 * 0.12 - 453)) == 11973943){
				window.debugUI = true;
				c2_callFunction("CallBackGetDebug", ["true"]);
			} 
			
		} 

	};


	/************************************************************************************************** 
		Valid language exist fallback
	***************************************************************************************************/
	window.validLanguageExistFallback = function() {

		var languages = ["en", "en-us", "fr", "fr-fr", "fr-ca", "es", "es-es", "es-mx", "it", "it-it", "de", "de-de"];
		var found = languages.indexOf(window.locale);
		var existInLangue = "false";

		if(found != -1){
			existInLangue = "true";
		}

		c2_callFunction("CallBackValidLanguageExistFallback", [existInLangue]);
	};


	/************************************************************************************************** 
		Description: Get the value of URL parameters either from 
		current URL or static URL
		Author: Tirumal
		URL: www.code-tricks.com
	***************************************************************************************************/
	window.getUrlParameters = function(parameter, staticURL, decode) {

		var currLocation = (typeof(staticURL)!="undefined"&&staticURL.length)? staticURL : window.location.search;
		var parArr = currLocation.split("?");
		var returnBool = true;

		if (parArr.length > 1)
		{
			parArr = parArr[1].split("&");
		}else{
			return null;
		}

		for(var i = 0; i < parArr.length; i++)
		{
			parr = parArr[i].split("=");
			if(parr[0] == parameter){
				returnBool = true;
				return (decode) ? decodeURIComponent(parr[1]) : parr[1];
			}else{
				returnBool = false;            
			}
		}

		if(!returnBool) return null;
	};


	/************************************************************************************************** 
		Custom Output console
	***************************************************************************************************/
	window.outputConsole = function(text) {
		console.log('%c ░ : '+text+' ░', 'background: #3e8400; color: #ffffff');
	};


	/************************************************************************************************** 
		Extract Color and Special value from array 3 digit number
	***************************************************************************************************/
	window.getBallCodeInfo = function(value) {

		var color = -1;
		var special = -1;
		var isGroupableByColor = 0;

		if(value != "99" && value != null){
			color = parseInt(value.toString()[0]);
			special = value % 100; //Modulo 100
		}
		
		// in 911/945/921, the number 9 represent an empty cell
		if(color == 9){
			color = -1;
		}

		if(special == 0){
			special = -1;
		}

		//Special
		switch(special) {
			case -1: //None
			case 22: //Coins
			case 23: //Add shot
			case 24: //Line clear
			case 31: //Collect1
			case 32: //Collect2
			case 33: //Collect3
				isGroupableByColor = 1; //Groupeable by color
				break;
			default:
				isGroupableByColor = 0; //Not color dependant
				break;
		}
		
		//console.log("extractColor: ",value, "= "+ color, special, isGroupableByColor);

		return [color, special, isGroupableByColor];
	};


	/************************************************************************************************** 
		Extract Color from ball data
	***************************************************************************************************/
	window.extractColor = function(value) {

		var data = getBallCodeInfo(value);

		c2_callFunction("CallBackExtractColor", [data[0], data[1], data[2]]);
	};
	window.extractColor2 = function(value) {

		var data = getBallCodeInfo(value);

		c2_callFunction("CallBackExtractColor2", [data[0], data[1], data[2]]);
	};


	/************************************************************************************************** 
		Extract level data
	***************************************************************************************************/
	window.ExtractLevelData = function(levelID) {

		var JSONData = window.LevelsJSON.levels[levelID-1];
		
		var rows = parseInt(JSONData.parameters.rows);
		var mode = JSONData.parameters.mode;
		var bubbleAmount = parseInt(JSONData.parameters.bubbleAmount);
		var pressureCount = parseInt(JSONData.parameters.pressureCount);
		var rowsAtStart = parseInt(JSONData.parameters.rowsAtStart);
		var bombMaxExplosions = parseInt(JSONData.parameters.bombMaxExplosions);
		var collectAmount = parseInt(JSONData.parameters.collectAmount);
		var collectVisual = parseInt(JSONData.parameters.collectVisual);
		var pointsTreshold1 = parseInt(JSONData.parameters.pointsTreshold.one);
		var pointsTreshold2 = parseInt(JSONData.parameters.pointsTreshold.two);
		var pointsTreshold3 = parseInt(JSONData.parameters.pointsTreshold.three);

		var level = JSON.stringify(JSONData.level);

		window.levelArray = JSONData.level;

		//console.log("|Level row Amount:"+rows, "|Mode:"+mode, "|Bubble Amount:"+bubbleAmount, "|Pressure Count:"+pressureCount, "|Rows at start:"+rowsAtStart, "|BombMax:"+bombMaxExplosions, "|Collect Amount:"+collectAmount, "|Points stars:"+pointsTreshold1, pointsTreshold2, pointsTreshold3, level);

		c2_callFunction("CallBackExtractLevelData", [rows, mode, bubbleAmount, pressureCount, rowsAtStart, bombMaxExplosions, collectAmount, collectVisual, pointsTreshold1, pointsTreshold2, pointsTreshold3, level]);
	};

	/************************************************************************************************** 
		Get ball animation frame
	***************************************************************************************************/
	window.getBallAnimationFrame = function(value) {

		var data = getBallCodeInfo(value);
		var color = data[0];
		var special = data[1];
		var animFrame = -1;
		var animFrameOverlay = -1;
		var hitAmountLeft = -1;
		var infoColor = "";
		var infoSpecial = "";

		//Color
		switch(color) {
			case 1: //Red
				animFrame = 1;
				infoColor = "red";
				break;
			case 2: //Green
				animFrame = 2;
				infoColor = "green";
				break;
			case 3: //Yellow
				animFrame = 3;
				infoColor = "yellow";
				break;
			case 4: //Blue
				animFrame = 4;
				infoColor = "blue";
				break;
			case 5: //Purple
				animFrame = 5;
				infoColor = "purple";
				break;
			case 6: //Teal
				animFrame = 6;
				infoColor = "teal";
				break;
			case 7: //Moon
				animFrame = 7;
				infoColor = "moon";
				break;
		}


		//Collectible
		if(special > 30 && special < 40){

			switch(special) {
				case 31:
					animFrameOverlay = 0;
					infoSpecial = "Collectible1";
					break;
				case 32: 
					animFrameOverlay = 1;
					infoSpecial = "Collectible2";
					break;
				case 33: 
					animFrameOverlay = 2;
					infoSpecial = "Collectible3";
					break;
			}
		}

		//Blockers
		if(special > 10 && special < 20){

			switch(special) {
				case 11: //Gray bubble
					animFrame = 15;
					animFrameOverlay = -1;
					infoColor = "gray Bubble";
					infoSpecial = "None";
					break;
				case 12: //Locked bubble 1
					animFrameOverlay = 3;
					infoSpecial = "Blocker:Locked1";
					hitAmountLeft = 1;
					break;
				case 13: //Locked bubble 2
					animFrameOverlay = 3;
					infoSpecial = "Blocker:Locked2";
					hitAmountLeft = 2;
					break;
				case 14: //Locked bubble 3
					animFrameOverlay = 3;
					infoSpecial = "Blocker:Locked3";
					hitAmountLeft = 3;
					break;
				case 15: //Obstacle bubbles rock 1 
					animFrame = 16;
					infoSpecial = "Blocker:Rock1";
					hitAmountLeft = 1;
					break;
				case 16: //Obstacle bubbles rock 2  
					animFrame = 17;
					infoSpecial = "Blocker:Rock2";
					hitAmountLeft = 2;
					break;
				case 17: //Obstacle bubbles rock 3   
					animFrame = 18;
					infoSpecial = "Blocker:Rock3";
					hitAmountLeft = 3;
					break;
				case 18: //Switch  (new Phase 2)
					animFrame = 19; 
					infoSpecial = "Blocker:Switch";
					break;
				case 19: //Contamination (new Phase 2)
					animFrame = 20;
					infoSpecial = "Blocker:Contamination";
					break;
			}
		}

		//Helpers
		if(special > 20 && special < 30){

			switch(special) {
				case 21: //Bomb bubble
					animFrame = 21;
					infoSpecial = "helper:Bomb";
					break;
				case 22: //Coins bubble
					animFrameOverlay = 4;
					infoSpecial = "helper:coins";
					break;
				case 23: //Additional shot Bubble
					animFrameOverlay = 5;
					infoSpecial = "helper:Add shot";
					break;
				case 24: //Line Clear
					animFrameOverlay = 6;
					infoSpecial = "helper:clear";
					break;
				case 25: //Conversion (new Phase 2)
					animFrame = 22;
					infoSpecial = "helper:Conversion";
					break;
				case 26: //Blocker Remover (new Phase 2)
					animFrame = 23;
					infoSpecial = "helper:BlockerRemover";
					break;
			}
		}
		
		//Mines
		if(special > 40 && special < 50){

			switch(special) {
				case 43: //Mine 3
					animFrame = 24;
					animFrameOverlay = -1;
					infoSpecial = "Mine:3";
					hitAmountLeft = 3;
					break;
				case 44: //Mine 4
					animFrame = 24;
					animFrameOverlay = -1;
					infoSpecial = "Mine:4";
					hitAmountLeft = 4;
					break;
				case 45: //Mine 5
					animFrame = 24;
					animFrameOverlay = -1;
					infoSpecial = "Mine:5";
					hitAmountLeft = 5;
					break;
				case 46: //Mine 6
					animFrame = 24;
					animFrameOverlay = -1;
					infoSpecial = "Mine:6";
					hitAmountLeft = 6;
					break;
				case 47: //Mine 7
					animFrame = 24;
					animFrameOverlay = -1;
					infoSpecial = "Mine:7";
					hitAmountLeft = 7;
					break;
				case 48: //Mine 8
					animFrame = 24;
					animFrameOverlay = -1;
					infoSpecial = "Mine:8";
					hitAmountLeft = 8;
					break;
				
			}
		}

		//console.log("getBallAnimationFrame:",value,color,special,"Result:",animFrame+"/"+animFrameOverlay,infoColor+"/"+infoSpecial +"|"+ hitAmountLeft);

		c2_callFunction("CallBackGetBallAnimationFrame", [animFrame, animFrameOverlay, color, special, hitAmountLeft]);
	};



	/**************************************************************************************************
		Log Events Analytics
	***************************************************************************************************/
	window.logEvents = function (eventData) {

		//window.outputConsole("Temp Log Event output: " + eventData);
	};

	/**************************************************************************************************
		Load Player Local Storage Data
	***************************************************************************************************/
	window.loadPlayerData = function () {

		window.gameLocalStorage = null;
		
		if (localStorage.getItem("microsoft.casualgames.msbubble.version2") === null) {
			window.createEmptyPlayerData();
		} else {
		//Get Storage
			window.gameLocalStorage = JSON.parse(localStorage.getItem("microsoft.casualgames.msbubble.version2"));
		}
		
		//Parse individual value from the storage into variables
		var currency = window.gameLocalStorage.global.currency;
		var PU_Amount_Target = window.gameLocalStorage.global.PU_Amount_Target;
		var PU_Amount_Rainbow = window.gameLocalStorage.global.PU_Amount_Rainbow;
		var PU_Amount_Fireball = window.gameLocalStorage.global.PU_Amount_Fireball;
		var PU_Amount_Bomb = window.gameLocalStorage.global.PU_Amount_Bomb;
		var smallBallPack = window.gameLocalStorage.global.smallBallPack;
		var levels = JSON.stringify(window.gameLocalStorage.global.levels);
		var purpleStars = window.gameLocalStorage.global.purpleStars;
		var infinityBestStrike = window.gameLocalStorage.global.infinityBestStrike;
		var giftRewardStep = window.gameLocalStorage.global.giftRewardStep;
		
		
		//console.log("◕‿◕ Load PLayer Data:", currency, PU_Amount_Target, PU_Amount_Rainbow, PU_Amount_Fireball, PU_Amount_Bomb, smallBallPack, levels, purpleStars, infinityBestStrike, giftRewardStep);
		
		//console.log(localStorage.getItem("microsoft.casualgames.msbubble.version2") );

		//Construct callback
		c2_callFunction("CallBackLoadPlayerData", [currency, PU_Amount_Target, PU_Amount_Rainbow, PU_Amount_Fireball, PU_Amount_Bomb, smallBallPack, levels, purpleStars, infinityBestStrike, giftRewardStep]);
	};
	
	
	/**************************************************************************************************
		Load Util Local Storage Data
	***************************************************************************************************/
	window.loadUtilData = function () {

		window.gameUtilLocalStorage = null;
		
		//Create storage if it does not exist
		if (localStorage.getItem("microsoft.casualgames.msbubble.util.version1") === null) {
			window.createEmptyUtilData();
		} else {
		//Get Storage
			window.gameUtilLocalStorage = JSON.parse(localStorage.getItem("microsoft.casualgames.msbubble.util.version1"));
		}
		
		//Parse individual value from the storage into variables
		var sound = parseInt(window.gameUtilLocalStorage.util.sound);
		var music = parseInt(window.gameUtilLocalStorage.util.music);
		var highContrast = parseInt(window.gameUtilLocalStorage.util.highContrast);
		var ftue = parseInt(window.gameUtilLocalStorage.util.ftue);
		if(window.gameUtilLocalStorage.util.marathonFtue !== undefined){
			var marathonFtue = parseInt(window.gameUtilLocalStorage.util.marathonFtue);
		} else {
			var marathonFtue = 0;
		}
		

		window.outputConsole("◕‿◕ Load Util Data: " + sound + "," + music + "," + highContrast  + "," + ftue + "," + marathonFtue);

		//Construct callback
		c2_callFunction("CallBackLoadUtilData", [sound, music, highContrast, ftue, marathonFtue]);
	};
	
	
	/**************************************************************************************************
		Create Empty Player Data
	***************************************************************************************************/
	window.createEmptyPlayerData = function () {
	
		//Convert Version 1 of player data into version 2
		if (localStorage.getItem("microsoft.casualgames.msbubble.version1") !== null) {
			window.gameLocalStorage = JSON.parse(localStorage.getItem("microsoft.casualgames.msbubble.version1"));
			
			//Add level data for world 1 & 2
			var i;
			var levels = window.gameLocalStorage.global.levels.data;
			for (i = 101; i <= 200; i++) {
				//"id": i, "score": 0, stars: 0
				levels.push([[i],[0],[0]]);
			}

			var levelsObj = {"c2array":true,"size":[200,3,1],"data": levels};
			window.gameLocalStorage.global.levels = levelsObj;
		
			console.log("◕‿◕ Player Data saved to V2!");
		
		} else {
		
			//Generate level data for world 1 & 2
			var i;
			var levels = [];
			for (i = 1; i <= 201; i++) {
				//"id": i, "score": 0, stars: 0
				levels.push([[i],[0],[0]]);
			}

			var levelsObj = {"c2array":true,"size":[200,3,1],"data": levels};

			window.gameLocalStorage = {
				"global": {
					"currency": 0,
					"PU_Amount_Target": 0,
					"PU_Amount_Rainbow": 0,
					"PU_Amount_Fireball": 0,
					"PU_Amount_Bomb": 0,
					"smallBallPack": 0,
					"levels": levelsObj,
					"purpleStars": 0,
					"infinityBestStrike": 0,
					"giftRewardStep": 1
				}
			};
		}
	
		
	
		localStorage.setItem("microsoft.casualgames.msbubble.version2", JSON.stringify(window.gameLocalStorage));
		//console.log("◕‿◕ Create Empty PLayer Data:", window.gameLocalStorage);

	};
	
	/**************************************************************************************************
		Create Empty Util Data
	***************************************************************************************************/
	window.createEmptyUtilData = function () {
	
		window.gameUtilLocalStorage = {
			"util": {
				"sound": 1,
				"music": 1,
				"highContrast": 0,
				"ftue": 0,
				"marathonFtue": 0
			}
		};
		
		localStorage.setItem("microsoft.casualgames.msbubble.util.version1", JSON.stringify(window.gameUtilLocalStorage));
		
		//console.log("◕‿◕ Create Empty Util Data:", window.gameUtilLocalStorage);

	};
	
	
	/**************************************************************************************************
		Save Player Local Storage Data
	***************************************************************************************************/
	window.savePlayerData = function (currency, PU_Amount_Target, PU_Amount_Rainbow, PU_Amount_Fireball, PU_Amount_Bomb, smallBallPack, levelsJSONString, purpleStars, infinityBestStrike, giftRewardStep) {

		var levelsJSON = JSON.parse(levelsJSONString).data;
		//console.log('savePlayerData', levelsJSON);
	
		var levelsC2Array = {"c2array":true,"size":[200,3,1],"data": levelsJSON};

		window.gameLocalStorage = {
			"global": {
				"currency": currency,
				"PU_Amount_Target": PU_Amount_Target,
				"PU_Amount_Rainbow": PU_Amount_Rainbow,
				"PU_Amount_Fireball": PU_Amount_Fireball,
				"PU_Amount_Bomb": PU_Amount_Bomb,
				"smallBallPack": smallBallPack,
				"levels": levelsC2Array,
				"purpleStars": purpleStars,
				"infinityBestStrike": infinityBestStrike,
				"giftRewardStep": giftRewardStep
			}
		};
		
		
		localStorage.setItem("microsoft.casualgames.msbubble.version2", JSON.stringify(window.gameLocalStorage));
		
		
		//console.log("◕‿◕ Save PLayer Data:", currency, PU_Amount_Target, PU_Amount_Rainbow, PU_Amount_Fireball, PU_Amount_Bomb, smallBallPack, levelsC2Array, purpleStars, infinityBestStrike, giftRewardStep);

		//Reload saved data into game
		window.loadPlayerData();
	};
	
	/**************************************************************************************************
		Save Util Local Storage Data
	***************************************************************************************************/
	window.saveUtilData = function (sound, music, highContrast, ftue, marathonFtue) {

		//Force Int
		sound = parseInt(sound);
		music = parseInt(music);
		highContrast = parseInt(highContrast);
		ftue = parseInt(ftue);
		marathonFtue = parseInt(marathonFtue);

		window.gameUtilLocalStorage = {
			"util": {
				"sound": sound,
				"music": music,
				"highContrast": highContrast,
				"ftue": ftue,
				"marathonFtue": marathonFtue
			}
		};
		
		localStorage.setItem("microsoft.casualgames.msbubble.util.version1", JSON.stringify(window.gameUtilLocalStorage));

		window.outputConsole("◕‿◕ Save Util Data: " + sound + "," + music + "," + highContrast + "," + ftue + "," + marathonFtue);
	};
	
	
		
	/**************************************************************************************************
		ToRGBA
	***************************************************************************************************/
	window.ToRGBA = function (val){
	
		var r = 255;
		var g = 255;
		var b = 255; 

		if(val != 0) {
			val = (val*val) * 10000;
			r = (val)&0xFF;
			g = (val>>8)&0xFF;
			b = (val>>16)&0xFF; 
		}
	
	   c2_callFunction("CallBackToRGBA", [r,g,b]);
	}
	
	/**************************************************************************************************
		Windows height/width Ratio
	***************************************************************************************************/
	window.GetWindowDimension = function (previousIsPortrait){
	
		//Ratios
		var ratioTriggerLandscape = 1;
		var ratioTriggerPortrait = 0.99;
		var ratioPortrait = 0.5625;
		var ratioLandscape = 1.777;
		
		//Bool portrait Landscape
		var WinIsPortrait = false;
		
		//Window dimensions
		var WinWidth = document.documentElement.clientWidth;
		var WinHeight = document.documentElement.clientHeight;
		var WinRatio = WinWidth/WinHeight;
		
		//Convert previous numeric value into boolean
		var previousIsPortraitBool = false;
		if(previousIsPortrait == 1){
			previousIsPortraitBool = true;
		}
		
		//Valid portrait or landscape ratio based on trigger point
		if(WinRatio <= ratioTriggerPortrait) {
			WinIsPortrait = true;
		}

		if(WinRatio >= ratioTriggerLandscape) {
			WinIsPortrait = false;
		}
		
		//Construct Call back if change in mode (landscape vs portrait)
		if(previousIsPortraitBool != WinIsPortrait){
	   		c2_callFunction("CallBackGetWindowDimension", [WinIsPortrait, WinWidth, WinHeight, WinRatio]);
		}
		
	}
	
	/**************************************************************************************************
		Detect Safari Browser
	***************************************************************************************************/
	window.IsSafariBrowser = function (){
	
		var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
               navigator.userAgent &&
               navigator.userAgent.indexOf('CriOS') == -1 &&
               navigator.userAgent.indexOf('FxiOS') == -1;
		
		window.outputConsole("◕‿◕ IsSafariBrowser: "+isSafari);
		
	   	c2_callFunction("CallBackIsSafariBrowser", [isSafari]);
	}
	
	/**************************************************************************************************
		Valid https://zone.msn.com/js/zoneadwrapper.js is ready
	***************************************************************************************************/
	window.ValidMSNAdWrapperIsReady = function (){
	
		if(typeof(InitMsnAdWrapper) === typeof(Function)){
			window.outputConsole("◕‿◕ https://zone.msn.com/js/zoneadwrapper.js ready!");
			c2_callFunction("CallBackValidMSNAdWrapperIsReady", ["ready"]);
		} else {
			window.outputConsole("◕_◕ https://zone.msn.com/js/zoneadwrapper.js Not ready!");
		}
	}
	
	
/**************************************************************************************************
		Set Background as transparent
	***************************************************************************************************/
	document.getElementsByTagName("BODY")[0].style.backgroundColor = "transparent";
	document.getElementsByTagName("HTML")[0].style.backgroundColor = "transparent";


	//Confirmation log
	window.outputConsole("◕‿◕ external_c3_utils loaded!");
	
	c2_callFunction("CallBackExternalJSLoaded", [true]);


