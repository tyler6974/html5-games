/*╔═.♥.════════════════════════════════════════════════════╗
 	Manage MSN appInsightsSDK Events and Callbacks
	
	BKOM STUDIOS
	2020-03-23
╚══════════════════════════════════════════════════════.♥.═╝*/

	//Valid that external js lib is loaded
	window.externalappInsightsSDK = true;
	
	/**************************************************************************************************
		Microsoft appInsightsSDK Config
		Ref: https://github.com/microsoft/ApplicationInsights-JS
	***************************************************************************************************/
	
	var sdkInstance="appInsightsSDK";window[sdkInstance]="appInsights";var aiName=window[sdkInstance],aisdk=window[aiName]||function(n){var o={config:n,initialize:!0},t=document,e=window,i="script";setTimeout(function(){var e=t.createElement(i);e.src=n.url||"//dontrackmepls",t.getElementsByTagName(i)[0].parentNode.appendChild(e)});try{o.cookie=t.cookie}catch(e){}function a(n){o[n]=function(){var e=arguments;o.queue.push(function(){o[n].apply(o,e)})}}o.queue=[],o.version=2;for(var s=["Event","PageView","Exception","Trace","DependencyData","Metric","PageViewPerformance"];s.length;)a("track"+s.pop());var r="Track",c=r+"Page";a("start"+c),a("stop"+c);var u=r+"Event";if(a("start"+u),a("stop"+u),a("addTelemetryInitializer"),a("setAuthenticatedUserContext"),a("clearAuthenticatedUserContext"),a("flush"),o.SeverityLevel={Verbose:0,Information:1,Warning:2,Error:3,Critical:4},!(!0===n.disableExceptionTracking||n.extensionConfig&&n.extensionConfig.ApplicationInsightsAnalytics&&!0===n.extensionConfig.ApplicationInsightsAnalytics.disableExceptionTracking)){a("_"+(s="onerror"));var p=e[s];e[s]=function(e,n,t,i,a){var r=p&&p(e,n,t,i,a);return!0!==r&&o["_"+s]({message:e,url:n,lineNumber:t,columnNumber:i,error:a}),r},n.autoExceptionInstrumented=!0}return o}(
		{
			instrumentationKey: "8312bfdf-4d59-4e42-926e-55dc853d701b"
		}
	);(window[aiName]=aisdk).queue&&0===aisdk.queue.length&&aisdk.trackPageView({});

	
	/**************************************************************************************************
		Telemetry events simple (no param)
	***************************************************************************************************/
	window.telEvt_Simple = function (eName){
	
		if(window.appInsights != undefined && window.appInsights != null){
		
			window.appInsights.trackEvent({"name": eName});
			//console.log('trackEvent',eName);
		}

	};
	
	/**************************************************************************************************
		Telemetry events LevelSelectXX
	***************************************************************************************************/
	window.telEvt_LevelSelect = function (propVal){
	
		if(window.appInsights != undefined && window.appInsights != null){
		
			window.appInsights.trackEvent({"name": "LevelSelect"+propVal});
			//console.log('trackEvent',"LevelSelect"+propVal);
		}

	};
	
	/**************************************************************************************************
		Telemetry events with only one level property
	***************************************************************************************************/
	window.telEvt_OnePropLevel = function (eName, propVal){
	
		if(window.appInsights != undefined && window.appInsights != null){
		
			window.appInsights.trackEvent({"name": eName}, { "Level": propVal});
			//console.log('trackEvent',eName, { "Level": propVal});
		}

	};
	
	/**************************************************************************************************
		Telemetry events with only one step property
	***************************************************************************************************/
	window.telEvt_OnePropStep = function (eName, propVal){
	
		if(window.appInsights != undefined && window.appInsights != null){
		
			window.appInsights.trackEvent({"name": eName}, { "Step": propVal});
			//console.log('trackEvent',eName, { "Step": propVal});
		}

	};
	
	/**************************************************************************************************
		Telemetry events for store
	***************************************************************************************************/
	window.telEvt_Store = function (eName, InGame, StartingBalance, EndingBalance, Targets, BigBombs, Fireballs, Rainbows, TenBubbles){
	
		if(window.appInsights != undefined && window.appInsights != null){
		
			var paylod = { "InGame": InGame, "StartingBalance": StartingBalance, "StartingBalance": StartingBalance, "EndingBalance": EndingBalance, "Targets": Targets, "BigBombs": BigBombs, "Fireballs": Fireballs, "Rainbows": Rainbows, "TenBubbles": TenBubbles};
		
			window.appInsights.trackEvent({"name": eName}, paylod);
			
			//console.log('trackEvent',eName, paylod);
		}

	};
	
	
	/**************************************************************************************************
		Telemetry events Level Complete
	***************************************************************************************************/
	window.telEvt_LevelComplete = function (type, mode, number, gameResult, ScoreHasReachedTreshold1, ScoreHasReachedTreshold2, ScoreHasReachedTreshold3, score, timeSpent, MarathonLevel, CoinsEarned, CoinsSpent, EndingBalance, MaxCombo,  PopTotal, DropTotal, Shots, Ricochets, Orphans, TargetsUsed, BigBombsUsed, FireballsUsed, RainbowsUsed, TenBubblesUsed) {
	
		
		var stars = 0;
		if(ScoreHasReachedTreshold3 == 1){
			stars = 3;
			
		} else if(ScoreHasReachedTreshold2 == 1) {
			stars = 2;
		
		} else if(ScoreHasReachedTreshold1 == 1) {
			stars = 1;
		}
		
		//Round to ceil time value
		timeSpent = Math.ceil(timeSpent);
	
		if(window.appInsights != undefined && window.appInsights != null){
		
			var paylod = { "GameResult": gameResult, "LevelType": mode, "Level": number, "Stars": stars, "Score": score, "TimeSpent": timeSpent, "MarathonLevel": MarathonLevel, "CoinsEarned": CoinsEarned, "CoinsSpent": CoinsSpent, "EndingBalance": EndingBalance, "MaxCombo": MaxCombo, "PopTotal": PopTotal, "DropTotal": DropTotal, "Shots": Shots, "Ricochets": Ricochets, "Orphans": Orphans, "TargetsUsed": TargetsUsed, "BigBombsUsed": BigBombsUsed, "FireballsUsed": FireballsUsed, "RainbowsUsed": RainbowsUsed, "TenBubblesUsed": TenBubblesUsed};
		
			window.appInsights.trackEvent({"name": type}, paylod);
		}
		
		console.log('trackEvent',"LevelComplete",type, paylod);

	};
	
	
	/**************************************************************************************************
		Telemetry events Options Exit
	***************************************************************************************************/
	window.telEvt_OptionsExit = function (sounds, music, contrast, restart) {
	
		if(window.appInsights != undefined && window.appInsights != null){
		
			var paylod = { "Sounds": sounds, "Music": music, "Contrast": contrast, "Restart": restart};
		
			window.appInsights.trackEvent({"name": "OptionsExit"}, paylod);
		}
		
		console.log('trackEvent',"OptionsExit", paylod);

	};

//First telemetry
window.telEvt_Simple("IntroScreen");

c2_callFunction("CallBackMSNappInsightsSDKJSLoaded", [true]);

//Confirmation log
window.outputConsole("◕‿◕ msn_telemetry_appinsights loaded!");
