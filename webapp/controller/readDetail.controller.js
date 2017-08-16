sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/m/MessageToast",				//Nachrichtenausgabe mit MessageToast
		"sap/m/Dialog",						//Dialog für Lösch-Sicherheitsabfrage
		"sap/m/Button",						//Button in Lösch-Sicherheitsabfrage
		"sap/m/Text"						//Textfeld in Lösch-Sicherheitsabfrage
	], function (Controller, History, MessageToast, Dialog, Button, Text) {
	"use strict";

	return Controller.extend("sapui5.demo.odata.controller.readDetail", {
	    onInit : function () {
	    	this._oDeleteConfirmation = {};															//privates Attribut für Dialog-Objekt
	    	this._sBusinessPartnerID = "";															//privates Attribut für Geschäftspartner-ID
	    	this._sPath = "";																		//privates Attribut für Pfad zum Geschäftspartner
	    	this._oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();	//privates Attribut für Ressourcenbündel
	        this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);								//privates Attribut für Router
			this._oRouter.getRoute("toReadDetail").attachPatternMatched(this._onRouteMatched, this);
		},
		
		//Routenmuster gefunden
		_onRouteMatched : function (oEvent) {
			//Hole die Geschäftspartner-ID und binde das View per Element-Binding an den Geschäftspartner
			this._sBusinessPartnerID = oEvent.getParameter("arguments").BusinessPartnerID;
			this._sPath = "/BusinessPartnerSet('" + this._sBusinessPartnerID + "')";
			var oView = this.getView();
			oView.bindElement({ path: this._sPath,
			                    model: "T19"});
		},

		
		//Edit Button
		onUpdate : function(oEvent){
			this._oRouter.navTo("toUpdate", { BusinessPartnerID: this._sBusinessPartnerID
					});
		},
		
		
		
		
		//Eventhandler für Lösch-Bestätigungspopup bei Auswahl "Ja"
		_deleteConfirmationYes : function(oEvent){
			//Löschen im OData Backend durchführen
			this._deleteEntry();
			 
			//Schließe das Dialogpopup
			this._oDeleteConfirmation.close();
		},
		
		
		
		//Eventhandler für Lösch-Bestätigungspopup bei Auswahl "Nein"
		_deleteConfirmationNo : function(oEvent){
			//Nachrichtenausgabe für Abbruch der Löschoperation
			var sMessage = this._oResourceBundle.getText("deleteObjectNo", [this._sBusinessPartnerID]);
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});
			this._oDeleteConfirmation.close();
		},
		
		
		
		//Löschen Button in Toolbar
		onDelete : function(oEvent){
			//Sammle Texte
			var sCurrentLocale = sap.ui.getCore().getConfiguration().getLanguage();
			jQuery.sap.require("jquery.sap.resources");
			var oBundle = jQuery.sap.resources({	url : "i18n/i18n.properties",
    												locale : sCurrentLocale });
		    var sTitle = oBundle.getText("deleteConfirmationTitle");
		    var sText  = oBundle.getText("deleteConfirmationText", [this._sBusinessPartnerID]);
			
			//Erzeuge Dialogpopup
			this._oDeleteConfirmation = new Dialog({
				title: sTitle,
				type: 'Message',
				state: 'Warning',
				content: new Text({ text: sText }),
				beginButton: new Button({
					text: 'Ja',
					press: this._deleteConfirmationYes.bind(this)	//Eventhandler für Löschbestätigun
				}),
				endButton: new Button({
					text: 'Nein',
					press: this._deleteConfirmationNo.bind(this)	//Eventhandler für Löschabbruch
				}),
				afterClose: this._destroyPopup.bind(this)			//Eventhandler für Schließen des Dialogpopups
			});
			this._oDeleteConfirmation.open();
		},
		
		//Eventhandler für Schließen des Dialogpopups
		_destroyPopup : function() {
			this._oDeleteConfirmation.destroy();
		},
		
		
		
		//Eintrag aus dem Backend löschen
		_deleteEntry: function(){
			//Hole Model
			var oModel = this.getView().getModel("T19");

			//Setze den batchmodus auf false (siehe Anmerkung bei den nachfolgenden Callbackmethoden)
			 oModel.setUseBatch(false);
			
			//sende Änderungen an das Backend
			oModel.remove( this._sPath, { success: this._onRemoveSuccess.bind(this),//ACHTUNG! Callback Methode wird nur aufgerufen, wenn Batchmodus ausgeschaltet ist!
										  error: this._onRemoveError.bind(this)		//ACHTUNG! Callback Methode wird nur aufgerufen, wenn Batchmodus ausgeschaltet ist!
			});
			
			//Setze den batchmodus auf false (siehe Anmerkung bei den vorherigen Callbackmethoden)
			 oModel.setUseBatch(true);
		},
		
		
		
		
		//Eintrag erfolgreich im Backend gelöscht
		_onRemoveSuccess: function (oEvent) {
			//Zeige Erfolgsnachricht
			var sMessage = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("deleteObjectSuccess");
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});
			
			//Navigiere zur Übersicht
			this._oRouter.navTo("toRead");
		},
		
		
		
		//Eintrag nicht im Backend gelöscht
		_onRemoveError:function(oEvent){
			//Zeige Fehlernachricht
			var sMessage = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("deleteObjectError", [this._sBusinessPartnerID]);
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});
		},

		
		
		//History-Navigation
	    onNavPress : function(){ 
		    var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				window.history.go(-1);
			} else {
				// No Navigation history found, navigate via Route toStart
				this._oRouter.navTo("toRead");
			}
		}
	});
});