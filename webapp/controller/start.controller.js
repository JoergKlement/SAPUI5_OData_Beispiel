sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History"
	], function (Controller, History) {
	"use strict";

	return Controller.extend("sapui5.demo.odata.controller.start", {
		
		//Eventhandler, wenn auf eine Kachel geklickt wurde
		 onShowData : function(oEvent) {
		            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		            var oTile = oEvent.getSource();
		            var sIdRaw = oTile.getIdForLabel(); 	//Hole unbearbeite Kachel ID (Muster "xml_view4711--<id>")
		            var aIdSplitted = sIdRaw.split("--");	//Zerteile unbearbeite Kachel ID bei Trenner "--"
		            var sId = aIdSplitted[1];				//Hole den Teil nach dem Trenner "--", welcher die Kachel ID ist
		            switch (sId) {
    				case "createTile":
        				oRouter.navTo("toCreate");
        				break;
    
    				case "readTile":
        				oRouter.navTo("toRead");
        				break;

    				default:
						break;
					}
		            
		},

		
		onNavPress : function(){ 
		    var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				window.history.go(-1);
			} else {
				// No Navigation history found, navigate via Route toStart
				this._oRouter.navTo("toStart");
			}
		}
	});
});