sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/m/MessageToast"				//MessageToast für Nachrichten
	], function (Controller, History, MessageToast) {
	"use strict";

	return Controller.extend("sapui5.demo.odata.controller.update", {
	    onInit : function () {
	    	this._sBusinessPartnerID = "";															//privates Attribut für Geschäftspartner-ID
	        this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);								//privates Attribut für Router
			this._oRouter.getRoute("toUpdate").attachPatternMatched(this._onRouteMatched, this);
		},
		
		
		//Routenmuster gefunden
		_onRouteMatched : function (oEvent) {
			//Erstelle Pfad zum aktuellen Datensatz im Model und binde das View per Element-Binding an diesen Datensatz
			this._sBusinessPartnerID = oEvent.getParameter("arguments").BusinessPartnerID;
			var sPath = "/BusinessPartnerSet('" + this._sBusinessPartnerID + "')";
			var oView = this.getView();
			oView.bindElement({ path: sPath,
			                    model: "T19"});
		},
		
		
		//Button Abbrechen
		onCancel: function() {
			this.onNavPress();
		},
		

		//Button speichern
		onSave: function() {
			var oModel = this.getView().getModel("T19");
			
			//Setze den batchmodus auf false (siehe Anmerkung bei den nachfolgenden Callbackmethoden)
			 oModel.setUseBatch(false);
			
			//sende Änderungen an das Backend
			oModel.submitChanges({ 	success: this._onSaveSuccess.bind(this),	//ACHTUNG! Callback Methode wird nur aufgerufen, wenn Batchmodus ausgeschaltet ist!
									error: this._onSaveError.bind(this)			//ACHTUNG! Callback Methode wird nur aufgerufen, wenn Batchmodus ausgeschaltet ist!
			});
			
			//Setze den batchmodus auf true (siehe Anmerkung bei den vorherigen Callbackmethoden)
			 oModel.setUseBatch(true);
		},
		
		
		
		//Eintrag erfolgreich im Backend gespeichert
		_onSaveSuccess: function (oBusinessPartner) {
			//Zeige Erfolgsnachricht
			var sMessage = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("changeObjectSuccess", [this._sBusinessPartnerID]);
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});
			
			//Navigiere zur Detailseite
			this._oRouter.navTo("toReadDetail", { 
				BusinessPartnerID: this._sBusinessPartnerID
		    });
		},
		
		
		
		//Eintrag nicht im Backend gespeichert
		_onSaveError:function(oBusinessPartner){
			//Zeige Fehlernachricht
			var sMessage = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("changeObjectError", [this._sBusinessPartnerID]);
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});	
		},
		
		
		
		
		//History Navigation
	    onNavPress : function(){ 
	    	//Änderungen zurücksetzen
	    	this.getView().getModel("T19").resetChanges();
	    	
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